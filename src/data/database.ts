/**
 * Catálogo de assets agênticos do Management Plane.
 *
 * Por enquanto contém apenas o workflow "Migração Vanilla" — o schema é o contrato
 * definitivo, mesmo com um único item populado. Conforme novos workflows aparecerem,
 * basta adicioná-los ao array `workflows` mantendo a tipagem.
 */

export type AssetStatus = 'draft' | 'beta' | 'stable' | 'deprecated'
export type AssetMaturity = 'experimental' | 'production-ready'

export type WorkflowType =
  | 'onboarding'
  | 'build'
  | 'deploy'
  | 'rollout'
  | 'migration'
  | 'custom'

export type OnboardingStep = {
  id: string
  title: string
  description: string
  required: boolean
  dependsOn: string[]
  /**
   * Quando true, o passo é considerado concluído assim que o usuário clica
   * nele no card "Próximos passos" da Home — sem precisar de sinal externo.
   * Usado para tarefas manuais cuja conclusão a plataforma não consegue
   * detectar (ex.: instalar a CLI, solicitar permissão).
   */
  completedOnClick: boolean
  /** Texto do botão de CTA exibido no card "Próximos passos" da Home. */
  ctaLabel: string
  /**
   * Workflow disparado automaticamente quando este passo é concluído. A
   * instância resultante aparece no Workflow Tracker como execução ligada.
   */
  triggers?: WorkflowAsset
  /**
   * Passo agêntico — agente propõe uma alteração que precisa de aprovação
   * humana explícita (Accept/Decline) antes de continuar o fluxo.
   */
  agentic?: AgenticPropositionMetadata
}

export type AgenticPropositionMetadata = {
  kind: 'pr'
  prTitle: string
  prAuthor: string
  prSummary: string
  /** Conjunto de arquivos modificados; cada um expõe um diff unified-like. */
  files: AgenticPropositionFile[]
}

export type AgenticPropositionFile = {
  path: string
  language: string
  /** Bloco de diff renderizado linha-a-linha. */
  hunks: AgenticPropositionHunk[]
}

export type AgenticPropositionHunk = {
  header: string
  lines: { kind: 'context' | 'add' | 'del'; text: string }[]
}

export type WorkflowInput = {
  name: string
  type: string
  required: boolean
  description: string
  default?: string
}

export type WorkflowDependencies = {
  skills: string[]
  mcps: string[]
  apis: string[]
}

export type WorkflowUsage = {
  consumers: number
  runs7d: number
}

export type WorkflowAsset = {
  kind: 'workflow'
  id: string
  name: string
  version: string
  owner: string
  description: string
  type: WorkflowType
  status: AssetStatus
  maturity: AssetMaturity
  onboardingSteps: OnboardingStep[]
  dependencies: WorkflowDependencies
  inputs: WorkflowInput[]
  usage: WorkflowUsage
}

/**
 * Promoção HML — disparada quando o step-07 (Promover pra homologação) é
 * concluído. Rollout canário gradual com gate humano em 50%.
 */
export const hmlPromotionWorkflow: WorkflowAsset = {
  kind: 'workflow',
  id: 'wf-promote-hml',
  name: 'Promoção HML — ssa-pix-core',
  version: '0.4.2',
  owner: 'squad-vanilla-platform',
  description:
    'Rollout canário pra homologação com gate humano em 50% e auto-rollback por SLO. Disparado após validação em dev.',
  type: 'rollout',
  status: 'beta',
  maturity: 'experimental',
  onboardingSteps: [
    {
      id: 'hml-canary-5',
      title: 'Canário 5% (Traffik)',
      description: 'Direciona 5% do tráfego HML para a nova versão; observa p99 e erro %.',
      required: true,
      dependsOn: [],
      completedOnClick: true,
      ctaLabel: 'Subir pra 5%',
    },
    {
      id: 'hml-canary-50',
      title: 'Canário 50% (gate humano)',
      description: 'Sobe pra 50% após approval; Komply valida policies de rede e dados.',
      required: true,
      dependsOn: ['hml-canary-5'],
      completedOnClick: true,
      ctaLabel: 'Aprovar 50%',
    },
    {
      id: 'hml-canary-100',
      title: 'Canário 100%',
      description: 'Promove totalmente em HML; reset da janela de observação Datadog (1h).',
      required: true,
      dependsOn: ['hml-canary-50'],
      completedOnClick: true,
      ctaLabel: 'Promover pra 100%',
    },
    {
      id: 'hml-smoke',
      title: 'Smoke test pós-rollout',
      description: 'Suíte de integração contra HML; valida checks de Komply / Pantheon.',
      required: true,
      dependsOn: ['hml-canary-100'],
      completedOnClick: true,
      ctaLabel: 'Rodar smoke',
    },
  ],
  dependencies: {
    skills: [],
    mcps: ['traffik.canary', 'komply.evaluate', 'kaptain.deploy'],
    apis: ['itau-datadog'],
  },
  inputs: [
    {
      name: 'sa_id',
      type: 'string',
      required: true,
      description: 'SA alvo da promoção.',
      default: 'ssa-pix-core',
    },
    {
      name: 'approval_required',
      type: 'boolean',
      required: false,
      description: 'Gate humano obrigatório em 50%.',
      default: 'true',
    },
  ],
  usage: { consumers: 1, runs7d: 1 },
}

/**
 * Pipeline disparado automaticamente quando o step-04 (Lançar workflow de
 * onboarding) é concluído. Roda os 4 verbos da Operação Vanilla (build,
 * deploy, migration, rollout) na SA configurada.
 */
export const migrationExecutionWorkflow: WorkflowAsset = {
  kind: 'workflow',
  id: 'wf-onboarding-vanilla-exec',
  name: 'Execução Vanilla — ssa-pix-core',
  version: '0.4.2',
  owner: 'squad-vanilla-platform',
  description:
    'Pipeline orquestrado disparado após o onboarding. Executa os 4 verbos da Operação Vanilla na SA configurada (build via Konstructor, deploy via Kaptain, migração de dados em dual-write e rollout canário pelo Traffik).',
  type: 'migration',
  status: 'beta',
  maturity: 'experimental',
  onboardingSteps: [
    {
      id: 'verb-build',
      title: 'build · Konstructor',
      description: 'Empacota imagem OCI a partir do pom.xml e publica em artifactory-itau.',
      required: true,
      dependsOn: [],
      completedOnClick: true,
      ctaLabel: 'Marcar build',
    },
    {
      id: 'agentic-java-21-upgrade',
      title: 'Atualizar runtime Java 8 → 21 (agêntico)',
      description:
        'Agente analisou o pom.xml e o Dockerfile, propôs PR migrando o runtime pra Java 21 LTS. Aprovação humana é obrigatória antes do deploy.',
      required: true,
      dependsOn: ['verb-build'],
      completedOnClick: false,
      ctaLabel: 'Revisar PR',
      agentic: {
        kind: 'pr',
        prTitle: 'chore(runtime): upgrade Java 8 → 21 LTS',
        prAuthor: 'agent · konstructor-java-bot',
        prSummary:
          'Substitui o runtime Java 8 (EOL) pelo OpenJDK 21 LTS via imagem base `itau-jdk-21:lts`. Atualiza pom.xml, Dockerfile e ajusta APIs deprecadas — adota records, switch expressions e var onde idiomático. Mantém compatibilidade binária com clients Spring 5.x via shim de bytecode.',
        files: [
          {
            path: 'pom.xml',
            language: 'xml',
            hunks: [
              {
                header: '@@ -17,7 +17,7 @@ <properties>',
                lines: [
                  { kind: 'context', text: '  <properties>' },
                  { kind: 'del', text: '    <java.version>1.8</java.version>' },
                  { kind: 'add', text: '    <java.version>21</java.version>' },
                  { kind: 'context', text: '    <spring-boot.version>3.2.5</spring-boot.version>' },
                  { kind: 'context', text: '  </properties>' },
                ],
              },
              {
                header: '@@ -42,9 +42,12 @@ <build>',
                lines: [
                  { kind: 'context', text: '      <plugin>' },
                  { kind: 'context', text: '        <artifactId>maven-compiler-plugin</artifactId>' },
                  { kind: 'del', text: '        <configuration>' },
                  { kind: 'del', text: '          <source>1.8</source>' },
                  { kind: 'del', text: '          <target>1.8</target>' },
                  { kind: 'del', text: '        </configuration>' },
                  { kind: 'add', text: '        <configuration>' },
                  { kind: 'add', text: '          <release>21</release>' },
                  { kind: 'add', text: '          <compilerArgs><arg>--enable-preview</arg></compilerArgs>' },
                  { kind: 'add', text: '        </configuration>' },
                  { kind: 'context', text: '      </plugin>' },
                ],
              },
            ],
          },
          {
            path: 'Dockerfile',
            language: 'dockerfile',
            hunks: [
              {
                header: '@@ -1,6 +1,6 @@',
                lines: [
                  { kind: 'del', text: 'FROM openjdk:8-jre-slim' },
                  { kind: 'add', text: 'FROM artifactory-itau.local/itau-jdk-21:lts' },
                  { kind: 'context', text: '' },
                  { kind: 'context', text: 'WORKDIR /app' },
                  { kind: 'context', text: 'COPY target/pix-core-*.jar app.jar' },
                  { kind: 'del', text: 'CMD ["java","-jar","app.jar"]' },
                  { kind: 'add', text: 'CMD ["java","--enable-preview","-jar","app.jar"]' },
                ],
              },
            ],
          },
          {
            path: 'src/main/java/com/itau/pix/PaymentService.java',
            language: 'java',
            hunks: [
              {
                header: '@@ -23,12 +23,9 @@ public class PaymentService {',
                lines: [
                  { kind: 'context', text: '  public TransactionResult process(Transaction tx) {' },
                  { kind: 'del', text: '    String status;' },
                  { kind: 'del', text: '    switch (tx.getType()) {' },
                  { kind: 'del', text: '      case PIX: status = "ok"; break;' },
                  { kind: 'del', text: '      case TED: status = "ok"; break;' },
                  { kind: 'del', text: '      default:  status = "unsupported";' },
                  { kind: 'del', text: '    }' },
                  { kind: 'add', text: '    var status = switch (tx.getType()) {' },
                  { kind: 'add', text: '      case PIX, TED -> "ok";' },
                  { kind: 'add', text: '      default -> "unsupported";' },
                  { kind: 'add', text: '    };' },
                  { kind: 'context', text: '    return new TransactionResult(tx.getId(), status);' },
                  { kind: 'context', text: '  }' },
                ],
              },
            ],
          },
          {
            path: 'src/main/java/com/itau/pix/dto/PaymentDto.java',
            language: 'java',
            hunks: [
              {
                header: '@@ -1,15 +1,3 @@',
                lines: [
                  { kind: 'del', text: 'public class PaymentDto {' },
                  { kind: 'del', text: '  private final String id;' },
                  { kind: 'del', text: '  private final BigDecimal amount;' },
                  { kind: 'del', text: '  public PaymentDto(String id, BigDecimal amount) {' },
                  { kind: 'del', text: '    this.id = id;' },
                  { kind: 'del', text: '    this.amount = amount;' },
                  { kind: 'del', text: '  }' },
                  { kind: 'del', text: '  public String getId() { return id; }' },
                  { kind: 'del', text: '  public BigDecimal getAmount() { return amount; }' },
                  { kind: 'del', text: '}' },
                  { kind: 'add', text: 'public record PaymentDto(String id, BigDecimal amount) {}' },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      id: 'verb-deploy',
      title: 'deploy · Kaptain',
      description: 'Provisiona infra em dev via CloudFormation e sobe o app em ECS Fargate.',
      required: true,
      dependsOn: ['agentic-java-21-upgrade'],
      completedOnClick: true,
      ctaLabel: 'Marcar deploy',
    },
    {
      id: 'verb-migration',
      title: 'migration · dual-write',
      description: 'Ativa dual-write entre Oracle legado e Aurora alvo; valida lag p99 < 200ms.',
      required: true,
      dependsOn: ['verb-deploy'],
      completedOnClick: true,
      ctaLabel: 'Marcar migration',
    },
    {
      id: 'verb-rollout',
      title: 'rollout · Traffik',
      description: 'Rollout canário 5% → 50% → 100% com gate humano em 50% e auto-rollback por SLO.',
      required: true,
      dependsOn: ['verb-migration'],
      completedOnClick: true,
      ctaLabel: 'Marcar rollout',
    },
  ],
  dependencies: {
    skills: ['scaffold-vanilla-app'],
    mcps: ['konstructor.build', 'kaptain.deploy', 'traffik.canary', 'pantheon.topic_create'],
    apis: ['itau-cmdb', 'itau-datadog'],
  },
  inputs: [
    {
      name: 'sa_id',
      type: 'string',
      required: true,
      description: 'SA alvo da execução.',
      default: 'ssa-pix-core',
    },
    {
      name: 'canary_percent',
      type: 'number',
      required: false,
      description: 'Percentual inicial do rollout canário.',
      default: '5',
    },
  ],
  usage: { consumers: 1, runs7d: 1 },
}

export const migrationWorkflow: WorkflowAsset = {
  kind: 'workflow',
  id: 'wf-migration-vanilla',
  name: 'Migração Vanilla',
  version: '0.4.2',
  owner: 'squad-vanilla-platform',
  description:
    'Migra uma SA brownfield para o padrão Operação Vanilla on-platform. Cobre build, deploy, migração de dados e rollout canário com aprovação humana entre fases.',
  type: 'migration',
  status: 'beta',
  maturity: 'experimental',
  onboardingSteps: [
    {
      id: 'step-01-install-cli',
      title: 'Instalar CLI do StackSpot',
      description: 'Binário oficial + autenticação inicial com SSO Itaú.',
      required: true,
      dependsOn: [],
      completedOnClick: true,
      ctaLabel: 'Baixar CLI',
    },
    {
      id: 'step-02-permission-cloud',
      title: 'Permissionar acesso ao Itaú Cloud',
      description: 'Solicitar role e aguardar aprovação automatizada.',
      required: true,
      dependsOn: ['step-01-install-cli'],
      completedOnClick: true,
      ctaLabel: 'Solicitar acesso',
    },
    {
      id: 'step-03-select-repos',
      title: 'Selecionar repos pra migração',
      description: 'Escolher quais repositórios entram na primeira leva.',
      required: true,
      dependsOn: ['step-02-permission-cloud'],
      completedOnClick: false,
      ctaLabel: 'Selecionar repos',
    },
    {
      id: 'step-04-configure-workflow',
      title: 'Lançar workflow de onboarding',
      description: 'Parametrizar verbos da Operação Vanilla pro repo selecionado.',
      required: true,
      dependsOn: ['step-03-select-repos'],
      completedOnClick: true,
      ctaLabel: 'Lançar workflow',
      triggers: migrationExecutionWorkflow,
    },
    {
      id: 'step-06-validate-dev',
      title: 'Validar resultado em dev',
      description: 'Conferir saúde do workflow, logs e checks de Komply.',
      required: true,
      dependsOn: ['step-04-configure-workflow'],
      completedOnClick: true,
      ctaLabel: 'Ver checks',
    },
    {
      id: 'step-07-promote-hml',
      title: 'Promover pra homologação',
      description: 'Disparar rollout canário com gate humano em 50%.',
      required: true,
      dependsOn: ['step-06-validate-dev'],
      completedOnClick: true,
      ctaLabel: 'Promover pra HML',
      triggers: hmlPromotionWorkflow,
    },
  ],
  dependencies: {
    skills: ['scaffold-vanilla-app', 'review-pr-comments', 'plan-data-migration'],
    mcps: ['kaptain.deploy', 'komply.evaluate', 'pantheon.topic_create'],
    apis: ['itau-iam', 'itau-cmdb', 'itau-datadog'],
  },
  inputs: [
    {
      name: 'sa_id',
      type: 'string',
      required: true,
      description: 'Identificador SA alvo (ex: ssa-pix-core).',
    },
    {
      name: 'target_env',
      type: 'enum(dev|hml|prod)',
      required: true,
      description: 'Ambiente de destino para o rollout canário.',
      default: 'hml',
    },
    {
      name: 'data_strategy',
      type: 'enum(dual-write|cutover)',
      required: false,
      description: 'Estratégia de migração de dados.',
      default: 'dual-write',
    },
    {
      name: 'auto_decommission',
      type: 'boolean',
      required: false,
      description: 'Desligar pilha legada automaticamente após observação.',
      default: 'false',
    },
  ],
  usage: { consumers: 4, runs7d: 11 },
}

export const workflows: WorkflowAsset[] = [migrationWorkflow]

/**
 * Conjunto de IDs de workflows que são execuções "ligadas" — disparados via
 * `step.triggers` por outro template. Usado pra separar instâncias primárias
 * (Home / onboarding) de instâncias de execução (Workflow Tracker).
 */
export const executionTemplateIds: Set<string> = new Set(
  workflows.flatMap((t) =>
    t.onboardingSteps
      .map((s) => s.triggers?.id)
      .filter((id): id is string => Boolean(id)),
  ),
)

// -----------------------------------------------------------------------------
// Application Hub
// -----------------------------------------------------------------------------

export type ApplicationHubHealth = 'healthy' | 'warn' | 'fail'

export type ApplicationHub = {
  /** Identificador interno do hub (chave estrangeira em notificações). */
  id: string
  /** SA Itaú (Sigla App) — também usado como slug de URL. */
  sa: string
  /** Nome amigável da aplicação (ex.: "Pix Core"). */
  name: string
  /** Projeto/programa ao qual a SA pertence. */
  projectId: string
  squad: string
  /** App migrado pra plataforma StackSpot. */
  onPlat: boolean
  health: ApplicationHubHealth
  liveIncident: boolean
  /** Uptime últimas 24h (%). */
  uptime: number
  /** Latência p95 em ms. */
  p95Ms: number
  /** Taxa de erro últimas 24h (%). */
  errorRate: number
  /** Deploys nos últimos 7 dias. */
  deploys7d: number
}

export const applicationHubs: ApplicationHub[] = []

// -----------------------------------------------------------------------------
// Application Hub Notifications
// -----------------------------------------------------------------------------

/**
 * Nome do ícone lucide-react renderizado pela UI da notificação. Mantido como
 * string para evitar acoplar database.ts à camada de renderização.
 */
export type ApplicationHubNotificationIcon =
  | 'CheckCircle2'
  | 'AlertTriangle'
  | 'ShieldCheck'
  | 'Activity'
  | 'Rocket'

export type ApplicationHubNotification = {
  id: string
  icon: ApplicationHubNotificationIcon
  title: string
  description: string
  cta: string
  /** Rota interna para onde o CTA leva — listagem/detalhe do Application Hub. */
  link: string
  /** FK para `ApplicationHub.id`. */
  applicationHubId: string
  /** FK para o projeto agregador (também presente no hub). */
  projectId: string
}

export const applicationHubNotifications: ApplicationHubNotification[] = [
  {
    id: 'notif-hml-provisioned-ssa-pix-core',
    icon: 'CheckCircle2',
    title: 'Application Hub HML provisionado',
    description:
      'A pilha de homologação de ssa-pix-core foi provisionada e está saudável (p95 184ms, erro 0.42%). Acompanhe a saúde da aplicação direto no Application Hub.',
    cta: 'Ver saúde em HML',
    link: '/application-hub/ssa-pix-core?env=hml',
    applicationHubId: 'ahub-ssa-pix-core',
    projectId: 'proj-pix-platform',
  },
]
