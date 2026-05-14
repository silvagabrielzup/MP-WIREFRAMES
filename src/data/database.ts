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
    },
    {
      id: 'step-02-permission-cloud',
      title: 'Permissionar acesso ao Itaú Cloud',
      description: 'Solicitar role e aguardar aprovação automatizada.',
      required: true,
      dependsOn: ['step-01-install-cli'],
    },
    {
      id: 'step-03-select-repos',
      title: 'Selecionar repos pra migração',
      description: 'Escolher quais repositórios entram na primeira leva.',
      required: true,
      dependsOn: ['step-02-permission-cloud'],
    },
    {
      id: 'step-04-configure-workflow',
      title: 'Configurar workflow de onboarding',
      description: 'Parametrizar verbos da Operação Vanilla pro repo selecionado.',
      required: true,
      dependsOn: ['step-03-select-repos'],
    },
    {
      id: 'step-05-trigger-first-run',
      title: 'Disparar primeira execução',
      description: 'Rodar onboarding-vanilla-brownfield em dev pela primeira vez.',
      required: true,
      dependsOn: ['step-04-configure-workflow'],
    },
    {
      id: 'step-06-validate-dev',
      title: 'Validar resultado em dev',
      description: 'Conferir saúde do workflow, logs e checks de Komply.',
      required: true,
      dependsOn: ['step-05-trigger-first-run'],
    },
    {
      id: 'step-07-promote-hml',
      title: 'Promover pra homologação',
      description: 'Disparar rollout canário com gate humano em 50%.',
      required: true,
      dependsOn: ['step-06-validate-dev'],
    },
    {
      id: 'step-08-setup-observability',
      title: 'Configurar observabilidade',
      description: 'Linkar dashboards Datadog e monitores p99 / erro %.',
      required: true,
      dependsOn: ['step-07-promote-hml'],
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
