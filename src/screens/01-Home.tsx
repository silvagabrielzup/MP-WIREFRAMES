import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  Check,
  Copy,
  Sparkles,
  Boxes,
  FileText,
  PartyPopper,
  LayoutGrid,
  Trophy,
  Info,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronRight,
  Search,
  KeyRound,
  Activity,
  Zap,
  Repeat,
  GitBranch,
  Layers,
  PlugZap,
  CloudOff,
  Terminal,
  Folder,
  FolderOpen,
  FileCode2,
  Plus,
  Minus,
  ArrowRightLeft,
  Code2,
  Wrench,
  Server,
  Database,
  Settings as SettingsIcon,
  Rocket,
  Workflow as WorkflowIcon,
  Gauge,
  ExternalLink,
} from 'lucide-react'
import { useWorkflows, type Workflow } from '../contexts/WorkflowsProvider'
import { ExecutionTrackerView } from '../components/ExecutionTrackerView'
import {
  executionTemplateIds,
  migrationExecutionWorkflow,
  workflows as workflowTemplates,
} from '../data/database'

function EmptyState({
  icon: Icon,
  title,
  hint,
}: {
  icon: typeof CheckCircle2
  title: string
  hint: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-[#181A1F]">
        <Icon className="h-4 w-4 text-text-muted" />
      </span>
      <div className="text-[13px] font-medium text-text-secondary">{title}</div>
      <div className="max-w-[280px] text-[11.5px] text-text-muted">{hint}</div>
    </div>
  )
}

type ChecklistStep = {
  id: string
  /** stepId no template `wf-migration-vanilla` — marca esse step quando o
   *  usuário clica no checkbox. */
  stepId: string
  icon: typeof KeyRound
  title: string
  description: string
  /** Comando CLI exibido no card "Clipboard rápido" do step. */
  clipboardCommand: string
}

const CHECKLIST_STEPS: ChecklistStep[] = [
  {
    id: 'setup-cli',
    stepId: 'step-01-setup-cli',
    icon: Terminal,
    title: 'Setup Inicial e Instalação de CLI',
    description: 'Pré-requisito Claude Code + instalação da CLI do StackSpot.',
    clipboardCommand: 'curl -fsSL https://stackspot.itau/install.sh | sh',
  },
  {
    id: 'login',
    stepId: 'step-02-login',
    icon: KeyRound,
    title: 'Login',
    description: 'Autenticação SSO Itaú; token persiste em ~/.stackspot/token.',
    clipboardCommand: 'stackspot auth login --realm itau',
  },
  {
    id: 'select-sa',
    stepId: 'step-03-select-sa',
    icon: Search,
    title: 'Seleção de SA',
    description: 'Escolher SA + repos da família pra consolidar num monorepo Vanilla.',
    clipboardCommand: 'stackspot context use --sa ssa-pix-core',
  },
  {
    id: 'migration-overview',
    stepId: 'step-04-migration-overview',
    icon: Info,
    title: 'Explicação sobre a Migração e Sobre os processos',
    description: 'As 4 fases — Descoberta, Consolidação, Compliance e Deploy em Produção.',
    clipboardCommand: 'stackspot migrate plan --sa ssa-pix-core',
  },
  {
    id: 'watch-tracker',
    stepId: 'step-05-watch-tracker',
    icon: Activity,
    title: 'Acompanhamento do WorkflowTracker para o Processo de Deploy',
    description: 'Disparar o workflow Vanilla e abrir o tracker pra acompanhar o deploy em tempo real.',
    clipboardCommand: 'stackspot migrate start --watch',
  },
  {
    id: 'watch-apphub',
    stepId: 'step-06-watch-apphub',
    icon: LayoutGrid,
    title: 'Acompanhamento do Application Hub',
    description: 'Pós-deploy: monitorar a aplicação ON-PLAT no Application Hub.',
    clipboardCommand: 'stackspot apphub watch --sa ssa-pix-core',
  },
]

const MIGRATION_TEMPLATE_ID = 'wf-migration-vanilla'

const MOCK_SAS = [
  { id: 'ssa-pix-core', name: 'Pix Core', squad: 'squad-pix' },
  { id: 'ssa-conta-corrente', name: 'Conta Corrente', squad: 'squad-cc' },
  { id: 'ssa-investimentos', name: 'Investimentos', squad: 'squad-invest' },
  { id: 'ssa-cartoes', name: 'Cartões', squad: 'squad-cartoes' },
]

type RepoKind = 'code' | 'ci-cd' | 'infra' | 'db' | 'config'

const REPO_KIND_META: Record<RepoKind, { label: string; tone: string }> = {
  'code': { label: 'código', tone: 'border-info/30 bg-info/10 text-info' },
  'ci-cd': { label: 'ci/cd', tone: 'border-accent/30 bg-accent/10 text-accent' },
  'infra': { label: 'infra', tone: 'border-warning/30 bg-warning/10 text-warning' },
  'db': { label: 'banco', tone: 'border-success/30 bg-success/10 text-success' },
  'config': { label: 'config', tone: 'border-border bg-bg text-text-secondary' },
}

const REPO_KIND_ICONS: Record<RepoKind, typeof Code2> = {
  'code': Code2,
  'ci-cd': Wrench,
  'infra': Server,
  'db': Database,
  'config': SettingsIcon,
}

type PlatStatus = 'OFF-PLAT' | 'ON-PLAT'

type ServiceRepo = {
  name: string
  kind: RepoKind
  stack: string
  size: string
  platStatus: PlatStatus
  techDebtCount: number
  techDebtSummary: string
}

const MOCK_SA_REPOS: ServiceRepo[] = [
  {
    name: 'pix-core',
    kind: 'code',
    stack: 'Java 17 · Spring Boot 3.2',
    size: '184 MB · 2.418 arquivos',
    platStatus: 'OFF-PLAT',
    techDebtCount: 4,
    techDebtSummary: 'imagem base sem CVE scan, rollback manual, sem dashboards padronizados, schema versionado à mão',
  },
  {
    name: 'pix-core-pipeline',
    kind: 'ci-cd',
    stack: 'Groovy · Jenkins shared lib',
    size: '4.2 MB · 38 arquivos',
    platStatus: 'OFF-PLAT',
    techDebtCount: 3,
    techDebtSummary: 'pipeline free-form sem audit trail, deploy sem auto-rollback, builds locais inconsistentes',
  },
  {
    name: 'pix-core-infra',
    kind: 'infra',
    stack: 'Terraform 1.5 · AWS modules',
    size: '18 MB · 142 arquivos',
    platStatus: 'OFF-PLAT',
    techDebtCount: 2,
    techDebtSummary: 'state local, sem drift detection contínuo',
  },
  {
    name: 'pix-core-db',
    kind: 'db',
    stack: 'Liquibase · SQL Aurora',
    size: '2.8 MB · 96 arquivos',
    platStatus: 'OFF-PLAT',
    techDebtCount: 1,
    techDebtSummary: 'changesets aplicados via psql em prod (sem motor de migration)',
  },
  {
    name: 'pix-core-config',
    kind: 'config',
    stack: 'YAML · K8s manifests',
    size: '780 KB · 24 arquivos',
    platStatus: 'OFF-PLAT',
    techDebtCount: 2,
    techDebtSummary: 'secrets versionados em base64, sem Vault-backed SecretProviderClass',
  },
]

type TreeAction = 'moved' | 'added' | 'removed'
type TreeNode = {
  name: string
  type: 'dir' | 'file'
  action?: TreeAction
  defaultOpen?: boolean
  children?: TreeNode[]
}

const BEFORE_TREES: TreeNode[] = [
  {
    name: 'pix-core',
    type: 'dir',
    defaultOpen: true,
    children: [
      { name: 'src/', type: 'dir', children: [{ name: 'main', type: 'dir' }, { name: 'test', type: 'dir' }] },
      { name: 'pom.xml', type: 'file' },
      { name: 'Dockerfile', type: 'file' },
    ],
  },
  {
    name: 'pix-core-pipeline',
    type: 'dir',
    children: [
      { name: 'Jenkinsfile', type: 'file' },
      { name: 'shared/', type: 'dir' },
    ],
  },
  {
    name: 'pix-core-infra',
    type: 'dir',
    children: [
      { name: 'modules/', type: 'dir' },
      { name: 'envs/', type: 'dir' },
    ],
  },
  {
    name: 'pix-core-db',
    type: 'dir',
    children: [
      { name: 'changelog/', type: 'dir' },
      { name: 'migrations/', type: 'dir' },
    ],
  },
  {
    name: 'pix-core-config',
    type: 'dir',
    children: [{ name: 'k8s/', type: 'dir' }],
  },
]

const AFTER_TREE: TreeNode = {
  name: 'vanilla-monorepo',
  type: 'dir',
  defaultOpen: true,
  children: [
    {
      name: 'apps',
      type: 'dir',
      defaultOpen: true,
      children: [
        {
          name: 'ssa-pix-core',
          type: 'dir',
          defaultOpen: true,
          action: 'added',
          children: [
            { name: 'src/', type: 'dir', action: 'moved' },
            { name: 'pom.xml', type: 'file', action: 'moved' },
            { name: 'Dockerfile', type: 'file', action: 'moved' },
            { name: 'ci/', type: 'dir', action: 'moved' },
            { name: 'infra/', type: 'dir', action: 'moved' },
            { name: 'db/', type: 'dir', action: 'moved' },
            { name: 'config/', type: 'dir', action: 'moved' },
            { name: 'kaptain.yaml', type: 'file', action: 'added' },
            { name: 'komply.yaml', type: 'file', action: 'added' },
          ],
        },
      ],
    },
    { name: 'tooling/', type: 'dir', action: 'added' },
  ],
}

const ACTION_LABEL: Record<TreeAction, string> = {
  moved: 'mov',
  added: 'novo',
  removed: 'remov',
}

const CLI_ADVANTAGES: { icon: typeof Zap; title: string; detail: string }[] = [
  { icon: Zap, title: 'Automação', detail: 'Roda em scripts, CI/CD e githooks; não depende de cliques.' },
  { icon: Repeat, title: 'Reprodutibilidade', detail: 'Mesmo comando, mesmo resultado. Idempotente por design.' },
  { icon: GitBranch, title: 'Versionável', detail: 'Fluxos viram código: commit, code review, rollback no git.' },
  { icon: Activity, title: 'Velocidade', detail: 'Execução direta, sem context-switch pra browser nem load de tela.' },
  { icon: Layers, title: 'Composável', detail: 'Pipe com jq, grep, xargs; integra com qualquer toolchain existente.' },
  { icon: CloudOff, title: 'Offline-friendly', detail: 'Auth cacheada localmente; trabalha sem rede em comandos read-only.' },
  { icon: PlugZap, title: 'Power-user', detail: 'Flags como --watch, --json, --dry-run reduzem fricção pra avançados.' },
]

type MigrationPhase = {
  num: number
  title: string
  duration: string
  icon: typeof Search
  bullets: string[]
}

const MIGRATION_PHASES: MigrationPhase[] = [
  {
    num: 1,
    title: 'Descoberta & Análise',
    duration: '~12 min',
    icon: Search,
    bullets: [
      'Identificar repositórios da SA',
      'Rodar sensors de pré-análise (security, quality, performance)',
      'Gerar relatório baseline do IUConfia',
    ],
  },
  {
    num: 2,
    title: 'Consolidação & Correções',
    duration: '~22 min',
    icon: Layers,
    bullets: [
      'Consolidar repos em um único monorepo',
      'Rodar validação shift-left de policies',
      'Auto-corrigir violações + aplicar blueprints',
      'Build segmentado + testes locais',
    ],
  },
  {
    num: 3,
    title: 'Compliance & Aprovação',
    duration: '~4 min',
    icon: ShieldCheck,
    bullets: [
      'SAST / DAST / license audit',
      'Abrir PR + gate de aprovação humana',
    ],
  },
  {
    num: 4,
    title: 'Deploy em Produção',
    duration: '~4 min',
    icon: Rocket,
    bullets: [
      'Provisionar infra + deploy em staging',
      'Smoke tests + validação do blueprint',
      'Cutover via DNS canário 1% → 10% → 50% → 100%',
    ],
  },
]


function CommandCopyButton({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)
  const handleClick = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(command).catch(() => {})
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={copied ? 'Comando copiado' : 'Copiar comando'}
      title={copied ? 'Copiado!' : 'Copiar comando'}
      className={`flex h-8 flex-none items-center gap-1.5 rounded-md border px-2.5 text-[11px] font-medium transition ${
        copied
          ? 'border-success/40 bg-success/10 text-success'
          : 'border-border bg-bg text-text-secondary hover:border-border-strong hover:text-text-primary'
      }`}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      <span className="hidden sm:inline">{copied ? 'Copiado!' : 'Copiar'}</span>
    </button>
  )
}

function CommandBlock({ command }: { command: string }) {
  return (
    <div className="flex items-stretch gap-2">
      <code
        tabIndex={0}
        className="flex-1 overflow-x-auto whitespace-nowrap rounded-md border border-border bg-surface-2 px-3 py-1.5 font-mono text-[11.5px] text-text-primary focus:outline-none focus:ring-1 focus:ring-accent/40"
      >
        {command}
      </code>
      <CommandCopyButton command={command} />
    </div>
  )
}

function TreeNodeView({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [open, setOpen] = useState(node.defaultOpen ?? false)
  const isDir = node.type === 'dir'
  const indent = depth * 12 + 4

  const rowTone =
    node.action === 'added'
      ? 'border-success/25 bg-success/[0.04]'
      : node.action === 'removed'
      ? 'border-failure/25 bg-failure/[0.04]'
      : node.action === 'moved'
      ? 'border-info/25 bg-info/[0.04]'
      : 'border-transparent hover:bg-bg/60'

  const nameTone =
    node.action === 'removed'
      ? 'text-failure line-through'
      : node.action === 'added'
      ? 'text-success'
      : node.action === 'moved'
      ? 'text-info'
      : 'text-text-secondary'

  const badgeTone =
    node.action === 'added'
      ? 'bg-success/15 text-success'
      : node.action === 'removed'
      ? 'bg-failure/15 text-failure'
      : 'bg-info/15 text-info'

  return (
    <>
      <div
        role={isDir ? 'button' : undefined}
        aria-expanded={isDir ? open : undefined}
        onClick={isDir ? () => setOpen((v) => !v) : undefined}
        style={{ paddingLeft: `${indent}px` }}
        className={`flex items-center gap-1 rounded border py-0.5 pr-1 font-mono text-[10.5px] ${
          isDir ? 'cursor-pointer' : 'cursor-default'
        } ${rowTone}`}
      >
        {isDir ? (
          open ? (
            <ChevronDown className="h-3 w-3 flex-none text-text-muted" />
          ) : (
            <ChevronRight className="h-3 w-3 flex-none text-text-muted" />
          )
        ) : (
          <span className="h-3 w-3 flex-none" />
        )}
        {isDir ? (
          open ? (
            <FolderOpen className="h-3 w-3 flex-none text-accent" />
          ) : (
            <Folder className="h-3 w-3 flex-none text-text-secondary" />
          )
        ) : (
          <FileCode2 className="h-3 w-3 flex-none text-text-muted" />
        )}
        <span className={`flex-1 truncate ${nameTone}`}>{node.name}</span>
        {node.action && (
          <span
            className={`flex-none rounded px-1 text-[9px] font-medium uppercase tracking-wider ${badgeTone}`}
          >
            {ACTION_LABEL[node.action]}
          </span>
        )}
      </div>
      {isDir && open && node.children?.map((c) => (
        <TreeNodeView key={c.name} node={c} depth={depth + 1} />
      ))}
    </>
  )
}

function SetupCliDetails() {
  return (
    <div className="space-y-3">
      <div className="rounded-md border border-warning/30 bg-warning/[0.06] p-3">
        <div className="mb-1.5 flex items-center gap-2">
          <AlertTriangle className="h-3.5 w-3.5 text-warning" />
          <h4 className="text-[12px] font-semibold tracking-tight text-text-primary">
            Pré-requisito: Claude Code instalado
          </h4>
        </div>
        <div className="text-[11.5px] text-text-secondary">
          A CLI da StackSpot delega a orquestração agêntica para o{' '}
          <span className="font-mono text-text-primary">claude-code</span>. Sem ele
          instalado e logado, os comandos <span className="font-mono">stackspot migrate *</span> abortam
          com erro de runtime ausente.
        </div>
        <div className="mt-2">
          <CommandBlock command="curl -fsSL https://claude.ai/install.sh | sh" />
        </div>
      </div>
      <div className="rounded-md border border-accent/30 bg-accent/[0.04] p-3">
        <div className="mb-2 flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-accent" />
          <h4 className="text-[12px] font-semibold tracking-tight text-text-primary">
            Por que CLI?
          </h4>
        </div>
        <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {CLI_ADVANTAGES.map((adv) => {
            const Icon = adv.icon
            return (
              <li
                key={adv.title}
                className="flex items-start gap-2 rounded border border-border bg-bg p-2"
              >
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded bg-accent/15 text-accent">
                  <Icon className="h-3 w-3" />
                </span>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-medium text-text-primary">{adv.title}</div>
                  <div className="text-[10.5px] text-text-muted">{adv.detail}</div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="flex items-center gap-2 text-[11px]">
        <span className="rounded-full border border-border bg-bg px-2 py-0.5 font-mono text-text-muted">
          Versão recomendada: v1.4.2
        </span>
        <a
          href="https://stackspot.itau/releases"
          rel="noreferrer noopener"
          target="_blank"
          className="inline-flex items-center gap-1 text-[11.5px] font-medium text-accent hover:underline"
        >
          Ver release notes
          <ArrowRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}

function LoginDetails() {
  return (
    <div className="space-y-3">
      <div className="rounded-md border border-border bg-bg p-3">
        <div className="mb-1.5 flex items-center gap-2">
          <KeyRound className="h-3.5 w-3.5 text-accent" />
          <h4 className="text-[12px] font-semibold tracking-tight text-text-primary">
            Como funciona
          </h4>
        </div>
        <div className="text-[11.5px] text-text-secondary">
          O comando abre o fluxo OAuth no realm Itaú, valida via SSO corporativo
          (incluindo MFA quando aplicável) e grava o token em{' '}
          <code className="rounded bg-surface px-1 font-mono text-[10.5px] text-accent">
            ~/.stackspot/token
          </code>
          . O token é encriptado em repouso e tem validade de 12h; depois disso
          a CLI auto-renova silenciosamente enquanto a sessão Itaú estiver viva.
        </div>
      </div>
      <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
        <li className="rounded border border-border bg-bg p-2">
          <div className="text-[10.5px] uppercase tracking-wider text-text-muted">Realm</div>
          <div className="font-mono text-[11.5px] text-text-primary">itau</div>
        </li>
        <li className="rounded border border-border bg-bg p-2">
          <div className="text-[10.5px] uppercase tracking-wider text-text-muted">Validade</div>
          <div className="font-mono text-[11.5px] text-text-primary">12h (auto-renew)</div>
        </li>
        <li className="rounded border border-border bg-bg p-2">
          <div className="text-[10.5px] uppercase tracking-wider text-text-muted">Sessão atual</div>
          <div className="font-mono text-[11.5px] text-warning">não autenticado</div>
        </li>
      </ul>
      <a
        href="https://sso.itau.com.br/oauth/authorize"
        rel="noreferrer noopener"
        target="_blank"
        className="inline-flex items-center gap-1 text-[11.5px] font-medium text-accent hover:underline"
      >
        Abrir SSO no navegador
        <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  )
}

function SelectSaDetails() {
  const [query, setQuery] = useState('')
  const [selectedSa, setSelectedSa] = useState<string>('ssa-pix-core')
  const [selectedRepos, setSelectedRepos] = useState<Set<string>>(
    () => new Set(MOCK_SA_REPOS.map((r) => r.name)),
  )

  const filtered = MOCK_SAS.filter(
    (s) =>
      s.id.toLowerCase().includes(query.toLowerCase()) ||
      s.name.toLowerCase().includes(query.toLowerCase()),
  )

  const toggleRepo = (name: string) => {
    setSelectedRepos((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const totalDebt = MOCK_SA_REPOS.filter((r) => selectedRepos.has(r.name)).reduce(
    (sum, r) => sum + r.techDebtCount,
    0,
  )

  return (
    <div className="space-y-3">
      {/* a) Por que monorepo */}
      <div className="rounded-md border border-accent/30 bg-accent/[0.04] p-3">
        <div className="mb-1.5 flex items-center gap-2">
          <Layers className="h-3.5 w-3.5 text-accent" />
          <h4 className="text-[12px] font-semibold tracking-tight text-text-primary">
            Por que monorepo (e não multi-repo)?
          </h4>
        </div>
        <div className="text-[11.5px] text-text-secondary">
          Multi-repo distribui contexto da SA por 4–6 repositórios separados —
          código, pipeline, infra, banco, config. Pra um agente entender o
          impacto de uma mudança ele precisa cruzar todos eles, o que multiplica
          calls, latência e custo de tokens. <span className="text-text-primary">Monorepo</span>{' '}
          consolida tudo num único contexto navegável, habilita refactors atômicos,
          gera um diff legível pelo agente e elimina drift entre repos. Multi-repo
          também não é compatível com{' '}
          <span className="text-text-primary">desenvolvimento agêntico</span>{' '}
          porque cada PR precisa ser coordenado manualmente entre repositórios —
          quebra a propriedade de "uma proposta, uma revisão, um merge".
        </div>
        <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-3">
          <div className="rounded border border-border bg-bg p-2">
            <div className="text-[10.5px] uppercase tracking-wider text-text-muted">
              Contexto agêntico
            </div>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="font-mono text-[11.5px] text-failure">5 repos</span>
              <ArrowRight className="h-3 w-3 text-text-muted" />
              <span className="font-mono text-[11.5px] text-success">1 monorepo</span>
            </div>
          </div>
          <div className="rounded border border-border bg-bg p-2">
            <div className="text-[10.5px] uppercase tracking-wider text-text-muted">
              PRs por mudança
            </div>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="font-mono text-[11.5px] text-failure">3–4 PRs</span>
              <ArrowRight className="h-3 w-3 text-text-muted" />
              <span className="font-mono text-[11.5px] text-success">1 PR atômico</span>
            </div>
          </div>
          <div className="rounded border border-border bg-bg p-2">
            <div className="text-[10.5px] uppercase tracking-wider text-text-muted">
              Drift entre repos
            </div>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="font-mono text-[11.5px] text-failure">comum</span>
              <ArrowRight className="h-3 w-3 text-text-muted" />
              <span className="font-mono text-[11.5px] text-success">impossível</span>
            </div>
          </div>
        </div>
      </div>

      {/* b) Busca + preview da SA */}
      <div>
        <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          Buscar SA
        </h4>
        <div className="flex items-center gap-2 rounded-md border border-border bg-bg px-2.5 py-1.5 focus-within:border-accent">
          <Search className="h-3.5 w-3.5 flex-none text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ssa-<servico>"
            className="flex-1 bg-transparent font-mono text-[11.5px] text-text-primary placeholder:text-text-muted focus:outline-none"
          />
        </div>
        {query.length > 0 && (
          <ul className="mt-1.5 space-y-1">
            {filtered.length === 0 && (
              <li className="rounded border border-border bg-bg px-3 py-2 text-[11px] text-text-muted">
                Nenhum SA encontrado pra "{query}".
              </li>
            )}
            {filtered.map((sa) => {
              const active = sa.id === selectedSa
              return (
                <li key={sa.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedSa(sa.id)}
                    className={`flex w-full items-center justify-between rounded border px-3 py-1.5 text-left transition ${
                      active
                        ? 'border-accent/40 bg-accent/10'
                        : 'border-border bg-bg hover:border-border-strong'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="truncate font-mono text-[11.5px] text-text-primary">{sa.id}</div>
                      <div className="truncate text-[10.5px] text-text-muted">
                        {sa.name} · {sa.squad}
                      </div>
                    </div>
                    {active && <Check className="h-3.5 w-3.5 flex-none text-accent" />}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* c) Lista de repos da família com platStatus + techDebt */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Repositórios da família ({MOCK_SA_REPOS.length})
          </h4>
          <span className="font-mono text-[10.5px] text-text-muted">
            {selectedRepos.size} de {MOCK_SA_REPOS.length} · {totalDebt} débitos
            técnicos
          </span>
        </div>
        <ul className="space-y-1">
          {MOCK_SA_REPOS.map((r) => {
            const KindIcon = REPO_KIND_ICONS[r.kind]
            const kind = REPO_KIND_META[r.kind]
            const checked = selectedRepos.has(r.name)
            const platTone =
              r.platStatus === 'ON-PLAT'
                ? 'border-success/40 bg-success/10 text-success'
                : 'border-warning/40 bg-warning/10 text-warning'
            return (
              <li
                key={r.name}
                className={`flex items-start gap-2 rounded border px-2.5 py-1.5 ${
                  checked ? 'border-border bg-bg' : 'border-border bg-bg/40 opacity-60'
                }`}
              >
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={checked}
                  aria-label={`${checked ? 'Desmarcar' : 'Marcar'} repo ${r.name}`}
                  onClick={() => toggleRepo(r.name)}
                  className={`mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded border transition ${
                    checked
                      ? 'border-accent/40 bg-accent/10 text-accent'
                      : 'border-border bg-bg text-transparent hover:border-border-strong'
                  }`}
                >
                  {checked && <Check className="h-3 w-3" />}
                </button>
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded border border-border bg-surface">
                  <KindIcon className="h-3 w-3 text-text-secondary" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="truncate font-mono text-[11.5px] text-text-primary">
                      {r.name}
                    </span>
                    <span
                      className={`flex-none rounded-full border px-1.5 py-0 text-[9px] font-medium uppercase tracking-wider ${kind.tone}`}
                    >
                      {kind.label}
                    </span>
                    <span
                      className={`flex-none rounded-full border px-1.5 py-0 font-mono text-[9px] font-medium uppercase tracking-wider ${platTone}`}
                    >
                      {r.platStatus}
                    </span>
                    {r.techDebtCount > 0 && (
                      <span className="inline-flex flex-none items-center gap-1 rounded-full border border-failure/30 bg-failure/10 px-1.5 py-0 text-[9px] font-medium uppercase tracking-wider text-failure">
                        <AlertTriangle className="h-2.5 w-2.5" />
                        {r.techDebtCount} débito{r.techDebtCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 truncate text-[10.5px] text-text-muted">
                    {r.stack} · {r.size}
                  </div>
                  {r.techDebtCount > 0 && (
                    <div className="mt-0.5 line-clamp-2 text-[10.5px] text-failure/90">
                      <span className="text-text-muted">Resolvido pela migração:</span>{' '}
                      {r.techDebtSummary}
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {/* d) Diff Antes/Depois */}
      <div>
        <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          Antes → Depois
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded border border-border bg-bg p-2">
            <div className="mb-1 flex items-center justify-between">
              <h5 className="text-[10.5px] font-semibold tracking-tight text-text-primary">
                Antes · multi-repo
              </h5>
              <span className="font-mono text-[9.5px] text-text-muted">
                {BEFORE_TREES.length} repos
              </span>
            </div>
            <div className="max-h-[180px] space-y-1.5 overflow-y-auto pr-1">
              {BEFORE_TREES.map((tree) => (
                <div key={tree.name} className="rounded border border-border/60 bg-surface/40 p-1">
                  <TreeNodeView node={tree} />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded border border-accent/30 bg-accent/[0.04] p-2">
            <div className="mb-1 flex items-center justify-between">
              <h5 className="text-[10.5px] font-semibold tracking-tight text-text-primary">
                Depois · mono-repo
              </h5>
              <span className="font-mono text-[9.5px] text-text-muted">unificado</span>
            </div>
            <div className="max-h-[180px] space-y-0.5 overflow-y-auto pr-1">
              <TreeNodeView node={AFTER_TREE} />
            </div>
          </div>
        </div>
        <div className="mt-1.5 flex items-center gap-3 text-[9.5px] text-text-muted">
          <span className="flex items-center gap-1">
            <ArrowRightLeft className="h-2.5 w-2.5 text-info" /> movido
          </span>
          <span className="flex items-center gap-1">
            <Plus className="h-2.5 w-2.5 text-success" /> adicionado
          </span>
          <span className="flex items-center gap-1">
            <Minus className="h-2.5 w-2.5 text-failure" /> removido
          </span>
        </div>
      </div>
    </div>
  )
}

function MigrationOverviewDetails() {
  const totalMin = MIGRATION_PHASES.reduce((sum, p) => {
    const match = p.duration.match(/(\d+)/)
    return sum + (match ? Number(match[1]) : 0)
  }, 0)
  return (
    <div className="space-y-3">
      <div className="rounded-md border border-accent/30 bg-accent/[0.04] p-3">
        <div className="mb-1.5 flex items-center gap-2">
          <Info className="h-3.5 w-3.5 text-accent" />
          <h4 className="text-[12px] font-semibold tracking-tight text-text-primary">
            Visão geral
          </h4>
          <span className="ml-auto font-mono text-[10.5px] text-text-muted">
            ~{totalMin} min total
          </span>
        </div>
        <div className="text-[11.5px] text-text-secondary">
          A Operação Vanilla executa 4 fases sequenciais. As 3 primeiras rodam
          determinísticas via motores (Konstructor, Komply, Kaptain, Traffik); a
          última faz cutover gradual em produção com auto-rollback por SLO.
        </div>
      </div>

      <ol className="space-y-2">
        {MIGRATION_PHASES.map((phase, idx) => {
          const Icon = phase.icon
          const isLast = idx === MIGRATION_PHASES.length - 1
          return (
            <li
              key={phase.num}
              className={`relative rounded-md border bg-bg p-3 ${
                isLast ? 'border-accent/30 bg-accent/[0.03]' : 'border-border'
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-8 w-8 flex-none items-center justify-center rounded-full border font-mono text-[11px] ${
                    isLast
                      ? 'border-accent/40 bg-accent/15 text-accent'
                      : 'border-border bg-surface text-text-secondary'
                  }`}
                >
                  {phase.num}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Icon
                      className={`h-3.5 w-3.5 flex-none ${
                        isLast ? 'text-accent' : 'text-text-secondary'
                      }`}
                    />
                    <h5 className="text-[12.5px] font-semibold text-text-primary">
                      Fase {phase.num} — {phase.title}
                    </h5>
                    <span className="rounded-full border border-border bg-surface px-1.5 py-0 font-mono text-[9.5px] text-text-muted">
                      {phase.duration}
                    </span>
                  </div>
                  <ul className="mt-1.5 space-y-1">
                    {phase.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-1.5 text-[11.5px] text-text-secondary"
                      >
                        <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-text-muted" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function WatchTrackerDetails() {
  return (
    <div className="space-y-3">
      <div className="rounded-md border border-accent/30 bg-accent/[0.04] p-3">
        <div className="mb-1.5 flex items-center gap-2">
          <WorkflowIcon className="h-3.5 w-3.5 text-accent" />
          <h4 className="text-[12px] font-semibold tracking-tight text-text-primary">
            O que é o WorkflowTracker
          </h4>
        </div>
        <div className="text-[11.5px] text-text-secondary">
          É a tela onde o deploy server-side roda em tempo real. Cada step do
          pipeline aparece como nó num grafo: motores determinísticos
          (Konstructor → Kaptain → Traffik) e steps agênticos que pedem
          aprovação humana. Você consegue ver logs streamados, durações,
          re-rodadas e o canário avançando de 1% pra 100%.
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        <li className="rounded border border-border bg-bg p-2">
          <div className="flex items-center gap-1.5">
            <Activity className="h-3 w-3 text-live" />
            <div className="text-[11.5px] font-medium text-text-primary">
              Stream ao vivo
            </div>
          </div>
          <div className="mt-0.5 text-[10.5px] text-text-muted">
            Logs por step, atualizando a cada ~2s sem refresh.
          </div>
        </li>
        <li className="rounded border border-border bg-bg p-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-accent" />
            <div className="text-[11.5px] font-medium text-text-primary">
              Approvals agênticas
            </div>
          </div>
          <div className="mt-0.5 text-[10.5px] text-text-muted">
            PRs propostos por agentes ficam pendentes até Accept/Decline.
          </div>
        </li>
        <li className="rounded border border-border bg-bg p-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3 text-success" />
            <div className="text-[11.5px] font-medium text-text-primary">
              Auto-rollback
            </div>
          </div>
          <div className="mt-0.5 text-[10.5px] text-text-muted">
            Traffik dispara revert se SLO (p99/erro) violar threshold por 5min.
          </div>
        </li>
        <li className="rounded border border-border bg-bg p-2">
          <div className="flex items-center gap-1.5">
            <GitBranch className="h-3 w-3 text-info" />
            <div className="text-[11.5px] font-medium text-text-primary">
              Re-execução granular
            </div>
          </div>
          <div className="mt-0.5 text-[10.5px] text-text-muted">
            Falhou um step? Re-roda só ele, sem refazer o pipeline inteiro.
          </div>
        </li>
      </ul>

      <Link
        to="/workflows"
        className="inline-flex h-9 items-center gap-2 rounded-md bg-accent px-4 text-[12.5px] font-medium text-black transition hover:bg-accent-hover"
      >
        <Activity className="h-3.5 w-3.5" />
        Abrir Workflow Tracker
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}

function WatchAppHubDetails() {
  return (
    <div className="space-y-3">
      <div className="rounded-md border border-accent/30 bg-accent/[0.04] p-3">
        <div className="mb-1.5 flex items-center gap-2">
          <LayoutGrid className="h-3.5 w-3.5 text-accent" />
          <h4 className="text-[12px] font-semibold tracking-tight text-text-primary">
            Application Hub — sua aplicação ON-PLAT
          </h4>
        </div>
        <div className="text-[11.5px] text-text-secondary">
          Concluído o deploy, sua SA aparece no Application Hub com status{' '}
          <span className="rounded-full border border-success/40 bg-success/10 px-1.5 py-0 font-mono text-[9.5px] text-success">
            ON-PLAT
          </span>
          . É o lugar único pra acompanhar saúde em runtime: SLO live, deploys
          recentes, eventos de Komply, IUConfia e janela de incidentes. Tudo
          alimentado pelos motores que rodaram durante a migração.
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        <li className="rounded border border-border bg-bg p-2">
          <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider text-text-muted">
            <Gauge className="h-3 w-3" /> p95
          </div>
          <div className="mt-0.5 font-mono text-[14px] text-success">184ms</div>
        </li>
        <li className="rounded border border-border bg-bg p-2">
          <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider text-text-muted">
            <AlertTriangle className="h-3 w-3" /> Erro %
          </div>
          <div className="mt-0.5 font-mono text-[14px] text-success">0.42%</div>
        </li>
        <li className="rounded border border-border bg-bg p-2">
          <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider text-text-muted">
            <Activity className="h-3 w-3" /> Uptime 24h
          </div>
          <div className="mt-0.5 font-mono text-[14px] text-success">99.95%</div>
        </li>
        <li className="rounded border border-border bg-bg p-2">
          <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider text-text-muted">
            <Rocket className="h-3 w-3" /> Deploys 7d
          </div>
          <div className="mt-0.5 font-mono text-[14px] text-text-primary">1</div>
        </li>
      </ul>

      <div className="rounded-md border border-border bg-bg p-3">
        <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          O que ver no Application Hub
        </h4>
        <ul className="space-y-1 text-[11.5px] text-text-secondary">
          <li className="flex items-start gap-1.5">
            <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-text-muted" />
            <span>Saúde em runtime (p95, erro %, uptime, throughput)</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-text-muted" />
            <span>IUConfia atual + delta vs. mês anterior</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-text-muted" />
            <span>Eventos Komply, violações de policy e checks pendentes</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-text-muted" />
            <span>Histórico de deploys + linhagem com workflows do Tracker</span>
          </li>
        </ul>
      </div>

      <Link
        to="/application-hub/ssa-pix-core"
        className="inline-flex h-9 items-center gap-2 rounded-md bg-accent px-4 text-[12.5px] font-medium text-black transition hover:bg-accent-hover"
      >
        <LayoutGrid className="h-3.5 w-3.5" />
        Abrir Application Hub
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}

function renderStepDetails(stepId: string): ReactNode {
  switch (stepId) {
    case 'setup-cli':
      return <SetupCliDetails />
    case 'login':
      return <LoginDetails />
    case 'select-sa':
      return <SelectSaDetails />
    case 'migration-overview':
      return <MigrationOverviewDetails />
    case 'watch-tracker':
      return <WatchTrackerDetails />
    case 'watch-apphub':
      return <WatchAppHubDetails />
    default:
      return null
  }
}

function ChecklistRow({
  index,
  step,
  isCompleted,
  isCurrent,
  onComplete,
}: {
  index: number
  step: ChecklistStep
  isCompleted: boolean
  isCurrent: boolean
  onComplete: () => void
}) {
  const StepIcon = step.icon
  // Locked = not the current step (completed OR future). Cannot be expanded.
  const isLocked = !isCurrent
  return (
    <li
      aria-disabled={isLocked || undefined}
      className={`border-b border-border last:border-b-0 ${
        isCompleted ? 'bg-success/[0.025]' : ''
      } ${isCurrent ? 'border-l-2 border-l-accent' : ''} ${
        isLocked ? 'pointer-events-none select-none opacity-50' : ''
      }`}
    >
      <div className="flex flex-wrap items-center gap-3 px-4 py-3">
        <span
          className={`flex h-6 w-6 flex-none items-center justify-center rounded-full border font-mono text-[11px] ${
            isCompleted
              ? 'border-success/40 bg-success/10 text-success'
              : isCurrent
              ? 'border-accent/40 bg-accent/10 text-accent'
              : 'border-border bg-bg text-text-secondary'
          }`}
        >
          {isCompleted ? <Check className="h-3.5 w-3.5" /> : index}
        </span>
        <span
          className={`flex h-7 w-7 flex-none items-center justify-center rounded-md border ${
            isCompleted
              ? 'border-border bg-bg text-text-muted'
              : isCurrent
              ? 'border-accent/30 bg-accent/10 text-accent'
              : 'border-border bg-bg text-text-muted'
          }`}
        >
          <StepIcon className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <div
            className={`truncate text-[12.5px] font-medium ${
              isCompleted || !isCurrent ? 'text-text-secondary' : 'text-text-primary'
            }`}
          >
            {step.title}
          </div>
          {!isCompleted && (
            <div className="truncate text-[11.5px] text-text-muted">{step.description}</div>
          )}
        </div>
        {isCurrent && !isCompleted && (
          <button
            type="button"
            onClick={onComplete}
            className="inline-flex h-8 flex-none items-center gap-1.5 rounded-md bg-accent px-3 text-[11.5px] font-medium text-black transition hover:bg-accent-hover"
          >
            <Check className="h-3.5 w-3.5" />
            Concluir etapa
          </button>
        )}
      </div>
      {isCurrent && !isCompleted && (
        <div
          id={`step-details-${step.id}`}
          className="space-y-3 border-t border-border bg-bg/40 px-4 py-3 pl-[68px]"
        >
          <div>
            <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              Clipboard rápido
            </h4>
            <CommandBlock command={step.clipboardCommand} />
          </div>
          {renderStepDetails(step.id)}
        </div>
      )}
    </li>
  )
}

function MigrationStatusAlert({ workflow }: { workflow: Workflow | null }) {
  const statusVariant = (() => {
    if (!workflow || workflow.status === 'draft') {
      return {
        tone: 'border-info/30 bg-info/[0.08]',
        iconTone: 'text-info',
        Icon: Info,
        title: 'Nenhuma migração em andamento',
        detail: 'Execute os comandos abaixo para iniciar a migração da sua SA.',
        meta: '',
      }
    }
    const currentStep =
      workflow.steps.find((s) => s.status === 'in-progress') ?? workflow.steps[0]
    const stepN = workflow.steps.findIndex((s) => s.id === currentStep?.id) + 1
    const total = workflow.steps.length

    if (workflow.status === 'running') {
      return {
        tone: 'border-border-strong bg-surface',
        iconTone: 'text-live',
        Icon: Loader2,
        iconClass: 'animate-spin',
        title: `Migração em curso · step ${stepN} de ${total}`,
        detail: currentStep?.title ?? '',
        meta: workflow.templateName,
        live: true,
      }
    }
    if (workflow.status === 'awaiting') {
      return {
        tone: 'border-warning/40 bg-warning/[0.08]',
        iconTone: 'text-warning',
        Icon: AlertTriangle,
        title: `Aguardando intervenção em "${currentStep?.title ?? 'step atual'}"`,
        detail: 'Um step agêntico precisa da sua revisão pra continuar.',
        meta: workflow.templateName,
      }
    }
    if (workflow.status === 'failed') {
      return {
        tone: 'border-failure/40 bg-failure/[0.08]',
        iconTone: 'text-failure',
        Icon: XCircle,
        title: `Migração falhou em "${currentStep?.title ?? 'step atual'}"`,
        detail: 'Consulte os logs do workflow para investigar.',
        meta: workflow.templateName,
      }
    }
    // completed handled outside (CongratsAlert substitui card+alert)
    return {
      tone: 'border-success/30 bg-success/[0.08]',
      iconTone: 'text-success',
      Icon: CheckCircle2,
      title: 'Migração concluída',
      detail: workflow.templateName,
      meta: '',
    }
  })()

  const { tone, iconTone, Icon, title, detail, meta } = statusVariant
  const live = 'live' in statusVariant && statusVariant.live === true
  const iconClass = 'iconClass' in statusVariant ? statusVariant.iconClass : ''

  return (
    <div className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 ${tone}`}>
      <span className="relative flex h-4 w-4 flex-none items-center justify-center">
        <Icon className={`h-4 w-4 ${iconTone} ${iconClass ?? ''}`} />
        {live && (
          <span className="absolute -right-1 -top-1 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-live opacity-80" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
          </span>
        )}
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[12.5px] font-medium text-text-primary">{title}</div>
        {detail && (
          <div className="truncate text-[11px] text-text-muted">{detail}</div>
        )}
      </div>
      {meta && (
        <span className="hidden flex-none rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[10.5px] text-text-secondary sm:inline">
          {meta}
        </span>
      )}
    </div>
  )
}

function OnboardingPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-[#181A1F]">
        <Boxes className="h-5 w-5 text-text-muted" />
      </span>
      <h3 className="text-[15px] font-semibold tracking-tight text-text-primary">
        Nada para fazer agora
      </h3>
      <p className="max-w-[420px] text-[12.5px] text-text-secondary">
        Você ainda não tem uma jornada de onboarding ativa. Escolha um workflow no Assets Catalog
        para que os próximos passos apareçam aqui.
      </p>
      <Link
        to="/catalog"
        className="mt-2 inline-flex h-9 items-center gap-2 rounded-md bg-accent px-4 text-[12.5px] font-medium text-black transition hover:bg-accent-hover"
      >
        <Boxes className="h-4 w-4" />
        Ir para o Assets Catalog
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}

function CongratsAlert({
  workflowName,
  saName,
  totalSteps,
}: {
  workflowName: string
  saName: string
  totalSteps: number
}) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-success/40 bg-gradient-to-br from-success/15 via-accent/10 to-bg">
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 28 }).map((_, i) => {
          const cx = (i * 53) % 400
          const cy = (i * 37) % 200
          const r = (i % 3) + 1.5
          const palette = ['#22c55e', '#FF6B2C', '#22D3EE', '#facc15']
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill={palette[i % palette.length]}
              opacity={0.45}
            />
          )
        })}
      </svg>

      <div className="relative px-6 py-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-success/40 bg-success/15 shadow-[0_0_0_6px_rgba(34,197,94,0.06)]">
          <PartyPopper className="h-7 w-7 text-success" />
        </div>
        <h2 className="mt-4 text-[22px] font-semibold tracking-tight text-text-primary">
          Parabéns, Luigi! <span aria-hidden>🎉</span>
        </h2>
        <p className="mx-auto mt-2 max-w-[520px] text-[13px] text-text-secondary">
          O fluxo <span className="font-mono text-text-primary">{workflowName}</span> para a SA{' '}
          <span className="font-mono text-text-primary">{saName}</span> foi concluído com sucesso.
          Sua aplicação está <span className="text-success">on-platform</span> e saudável em HML.
        </p>

        <div className="mx-auto mt-4 flex max-w-[520px] items-center justify-center gap-2 text-[11px] text-text-muted">
          <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-success">
            <Check className="h-3 w-3" />
            {totalSteps} passos
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-success">
            <Check className="h-3 w-3" />
            pipeline executado
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-success">
            <Check className="h-3 w-3" />
            canário 100%
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <Link
            to={`/application-hub/${saName}`}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-accent px-4 text-[12.5px] font-medium text-black transition hover:bg-accent-hover"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Ver Application Hub
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            to="/workflows"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-bg px-4 text-[12.5px] text-text-secondary transition hover:border-border-strong hover:text-text-primary"
          >
            <Trophy className="h-3.5 w-3.5" />
            Workflow Tracker
          </Link>
        </div>
      </div>
    </div>
  )
}

function OnboardingChecklistCard({
  completedStepIds,
  currentStepId,
  onToggleStep,
}: {
  completedStepIds: Set<string>
  currentStepId: string | null
  onToggleStep: (stepId: string, nextCompleted: boolean) => void
}) {
  if (CHECKLIST_STEPS.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface">
        <OnboardingPlaceholder />
      </div>
    )
  }

  // Step atual = primeiro não-concluído que case com `currentStepId`, ou
  // fallback ao primeiro pendente. Os demais ficam visíveis mas locked.
  const focusedStepIdx = (() => {
    const byCurrent = CHECKLIST_STEPS.findIndex((s) => s.stepId === currentStepId)
    if (byCurrent >= 0) return byCurrent
    const firstPending = CHECKLIST_STEPS.findIndex((s) => !completedStepIds.has(s.stepId))
    return firstPending
  })()

  const allDone = focusedStepIdx < 0
  const totalSteps = CHECKLIST_STEPS.length
  const doneCount = CHECKLIST_STEPS.filter((s) => completedStepIds.has(s.stepId)).length

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
        <span className="text-[11px] uppercase tracking-wider text-text-muted">
          {allDone ? 'Checklist completo' : `Passo atual · ${focusedStepIdx + 1} de ${totalSteps}`}
        </span>
        <span className="font-mono text-[10.5px] text-text-muted">
          {doneCount}/{totalSteps}
        </span>
      </div>
      {allDone ? (
        <div className="flex items-center gap-2 px-4 py-3">
          <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-success/40 bg-success/10">
            <Check className="h-3.5 w-3.5 text-success" />
          </span>
          <span className="text-[12.5px] text-text-secondary">
            Todos os passos do onboarding foram concluídos.
          </span>
        </div>
      ) : (
        <ul>
          {CHECKLIST_STEPS.map((step, idx) => (
            <ChecklistRow
              key={step.id}
              index={idx + 1}
              step={step}
              isCompleted={completedStepIds.has(step.stepId)}
              isCurrent={idx === focusedStepIdx}
              onComplete={() => onToggleStep(step.stepId, true)}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

// =============================================================================
// Execução server-side (`wfk-onboarding-vanilla-exec`) — stepper + gates
// =============================================================================
// Componentes ExecutionStepper / ExecPrApprovalCard / ExecDeployApprovalCard /
// ExecutionTrackerView vivem em `src/components/ExecutionTrackerView.tsx` —
// reutilizados pelo Home e pelo WorkflowTrackerDetail. O auto-advance roda no
// WorkflowsProvider.

export default function Home() {
  const {
    workflows: instances,
    appHubAlerts,
    completeStep,
    uncompleteStep,
    addWorkflow,
  } = useWorkflows()
  const primaryInstance = [...instances]
    .reverse()
    .find((inst) => !executionTemplateIds.has(inst.templateId))
  const lastWorkflow =
    primaryInstance ?? (instances.length > 0 ? instances[instances.length - 1] : null)

  const isMigrationWorkflow = lastWorkflow?.templateId === MIGRATION_TEMPLATE_ID

  // O Alert mostra o status da migração server-side (template
  // `wf-onboarding-vanilla-exec`), que só é criado quando o usuário conclui
  // o step 5 ("Acompanhar Status da Migration") no checklist.
  const executionWorkflow =
    instances.find((inst) => inst.templateId === migrationExecutionWorkflow.id) ?? null

  const completedStepIds = (() => {
    if (isMigrationWorkflow && lastWorkflow) {
      return new Set(lastWorkflow.steps.filter((s) => s.isCompleted).map((s) => s.id))
    }
    return new Set<string>()
  })()

  const currentStepId = (() => {
    if (!isMigrationWorkflow || !lastWorkflow) return null
    const inProgress = lastWorkflow.steps.find((s) => s.status === 'in-progress')
    if (inProgress) return inProgress.id
    const firstPending = lastWorkflow.steps.find((s) => !s.isCompleted)
    return firstPending?.id ?? null
  })()

  const handleToggleStep = (stepId: string, nextCompleted: boolean) => {
    if (!isMigrationWorkflow || !lastWorkflow) return
    if (nextCompleted) {
      completeStep(lastWorkflow.id, stepId)
      // Ao concluir "Explicação sobre a Migração" o pipeline server-side é
      // disparado — `wfk-onboarding-vanilla-exec` aparece com o 1º step
      // (Varredura de Vulnerabilidades) em `in-progress`. O auto-advance abaixo
      // (useEffect) cuida de tocar pra frente até bater em uma etapa de
      // aprovação humana.
      const triggerStep = CHECKLIST_STEPS.find((c) => c.id === 'migration-overview')
      if (triggerStep && stepId === triggerStep.stepId) {
        const alreadyTriggered = instances.some(
          (inst) => inst.templateId === migrationExecutionWorkflow.id,
        )
        if (!alreadyTriggered) addWorkflow(migrationExecutionWorkflow)
      }
    } else {
      uncompleteStep(lastWorkflow.id, stepId)
    }
  }

  // Auto-advance + cards de aprovação (PR + Deploy) ficam no
  // `ExecutionTrackerView` compartilhado. O auto-advance roda no
  // WorkflowsProvider, então o pipeline progride mesmo se o user sair
  // dessa tela.

  const pendingAgenticItems = instances.flatMap((wf) =>
    wf.pendingAgenticFlow.map((item) => ({
      ...item,
      workflowInstanceId: wf.id,
      workflowName: wf.templateName,
    })),
  )

  const formatRelativeAgo = (iso: string): string => {
    const elapsedMs = Date.now() - new Date(iso).getTime()
    if (Number.isNaN(elapsedMs) || elapsedMs < 5000) return 'agora'
    const sec = Math.floor(elapsedMs / 1000)
    if (sec < 60) return `há ${sec}s`
    const min = Math.floor(sec / 60)
    if (min < 60) return `há ${min}min`
    const hr = Math.floor(min / 60)
    return `há ${hr}h`
  }

  return (
    <div className="space-y-10">
      {/* Section 1 — Hero compacto */}
      <section>
        <h1 className="text-[26px] font-semibold tracking-tight">Bom dia, Luigi</h1>
        <p className="mt-1.5 text-[13.5px] text-text-secondary">
          Sem workflows ativos no momento — comece onboardando uma SA ou escolhendo um workflow no catálogo.
        </p>
      </section>

      {/* Section 2 — Onboarding (Alert + Checklist OU Congrats OU Placeholder) full-width */}
      <section>
        {isMigrationWorkflow && lastWorkflow?.status === 'completed' ? (
          <CongratsAlert
            workflowName={lastWorkflow.templateName}
            saName={(() => {
              const tmpl = workflowTemplates.find((t) => t.id === lastWorkflow.templateId)
              return (
                tmpl?.inputs.find((i) => i.name === 'sa_id')?.default ?? 'ssa-pix-core'
              )
            })()}
            totalSteps={lastWorkflow.steps.length}
          />
        ) : isMigrationWorkflow ? (
          <div className="flex flex-col gap-3">
            {executionWorkflow && <MigrationStatusAlert workflow={executionWorkflow} />}
            {executionWorkflow && <ExecutionTrackerView workflow={executionWorkflow} />}
            <OnboardingChecklistCard
              completedStepIds={completedStepIds}
              currentStepId={currentStepId}
              onToggleStep={handleToggleStep}
            />
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-surface">
            <OnboardingPlaceholder />
          </div>
        )}
      </section>

      {/* Section 3 — Pontos de atenção: Fluxos agênticos + Alertas Application Hub (50/50) */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[15px] font-semibold tracking-tight">Pontos de atenção</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <h3 className="text-[13.5px] font-semibold tracking-tight">
                  Fluxos agênticos pendentes aprovação
                </h3>
              </div>
              {pendingAgenticItems.length > 0 && (
                <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-warning">
                  {pendingAgenticItems.length} aguardando
                </span>
              )}
            </div>
            {pendingAgenticItems.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="Nenhuma aprovação pendente"
                hint="Quando um workflow agêntico precisar de input humano, ele aparece aqui."
              />
            ) : (
              <ul>
                {pendingAgenticItems.map((p) => {
                  const ago = formatRelativeAgo(p.createdAt)
                  const isFresh = Date.now() - new Date(p.createdAt).getTime() < 60000
                  return (
                    <Link
                      key={`${p.workflowInstanceId}-${p.stepId}`}
                      to={`/workflows/${p.workflowInstanceId}`}
                      className="group flex cursor-pointer items-start gap-3 border-b border-border px-4 py-3 last:border-b-0 hover:bg-[#181A1F]"
                    >
                      <span className="relative mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-md bg-accent/15 text-accent">
                        <Sparkles className="h-3.5 w-3.5" />
                        {isFresh && (
                          <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-live opacity-80" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
                          </span>
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-[12.5px] font-medium text-text-primary">
                            {p.stepTitle}
                          </span>
                          <span className="flex-none rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-accent">
                            agêntico
                          </span>
                          <span className="flex-none text-[10.5px] text-text-muted">{ago}</span>
                        </div>
                        <div className="mt-0.5 truncate font-mono text-[11.5px] text-text-secondary">
                          {p.prTitle}
                        </div>
                        <div className="mt-0.5 line-clamp-2 text-[11px] text-text-muted">
                          {p.prSummary}
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] text-text-muted">
                          <span className="font-mono">{p.prAuthor}</span>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1">
                            <FileText className="h-2.5 w-2.5" />
                            <span className="font-mono">{p.filesChanged}</span> arquivos
                          </span>
                          <span>·</span>
                          <span className="font-mono text-success">+{p.linesAdded}</span>
                          <span className="font-mono text-failure">−{p.linesRemoved}</span>
                          <span>·</span>
                          <span className="font-mono">{p.workflowName}</span>
                        </div>
                      </div>
                      <ArrowRight className="mt-1 h-3.5 w-3.5 flex-none text-text-muted opacity-0 transition group-hover:opacity-100" />
                    </Link>
                  )
                })}
              </ul>
            )}
          </div>

          <div className="rounded-lg border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-text-muted" />
                <h3 className="text-[13.5px] font-semibold tracking-tight">Alertas da Application Hub</h3>
              </div>
              {appHubAlerts.length > 0 && (
                <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-warning">
                  {appHubAlerts.length} itens
                </span>
              )}
            </div>
            {appHubAlerts.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="Tudo sob controle"
                hint="Nenhuma aprovação pendente, falha recente ou violação de policy."
              />
            ) : (
              <ul>
                {appHubAlerts.map((a) => {
                  const Icon =
                    a.kind === 'approval' ? Clock3 : a.kind === 'failure' ? AlertTriangle : ShieldCheck
                  const color =
                    a.kind === 'approval'
                      ? 'text-warning bg-warning/15'
                      : a.kind === 'failure'
                      ? 'text-failure bg-failure/15'
                      : 'text-info bg-info/15'
                  return (
                    <li
                      key={a.id}
                      className="group flex cursor-pointer items-center gap-3 border-b border-border px-4 py-2.5 last:border-b-0 hover:bg-[#181A1F]"
                    >
                      <span className={`flex h-7 w-7 flex-none items-center justify-center rounded-md ${color}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[12.5px] text-text-primary">{a.title}</div>
                        <div className="truncate text-[11.5px] text-text-muted">{a.detail}</div>
                      </div>
                      <span className="font-mono text-[11px] text-text-muted">{a.ago}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-text-muted opacity-0 transition group-hover:opacity-100" />
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
