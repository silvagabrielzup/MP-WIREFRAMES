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
  ListChecks,
  Activity,
  Download,
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
  Lock,
} from 'lucide-react'
import { useWorkflows, type Workflow } from '../contexts/WorkflowsProvider'
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
}

const CHECKLIST_STEPS: ChecklistStep[] = [
  {
    id: 'install-cli',
    stepId: 'step-01-install-cli',
    icon: Download,
    title: 'Instalação de CLI',
    description: 'Baixar e instalar a CLI do StackSpot no terminal local.',
  },
  {
    id: 'login',
    stepId: 'step-02-permission-cloud',
    icon: KeyRound,
    title: 'Login',
    description: 'Autenticar na CLI do StackSpot com SSO Itaú.',
  },
  {
    id: 'select-sa',
    stepId: 'step-03-select-repos',
    icon: Search,
    title: 'Seleção de SA',
    description: 'Escolher SA + repos da família que viram mono-repo Vanilla.',
  },
  {
    id: 'check-viability',
    stepId: 'step-04-configure-workflow',
    icon: ListChecks,
    title: 'Checar viabilidade',
    description: 'Rodar o pre-flight check antes de iniciar.',
  },
  {
    id: 'track-status',
    stepId: 'step-06-validate-dev',
    icon: Activity,
    title: 'Acompanhar Status da Migration',
    description: 'Disparar e monitorar o workflow Vanilla em tempo real.',
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

type ServiceRepo = {
  name: string
  kind: RepoKind
  stack: string
  size: string
}

const MOCK_SA_REPOS: ServiceRepo[] = [
  { name: 'pix-core', kind: 'code', stack: 'Java 17 · Spring Boot 3.2', size: '184 MB · 2.418 arquivos' },
  { name: 'pix-core-pipeline', kind: 'ci-cd', stack: 'Groovy · Jenkins shared lib', size: '4.2 MB · 38 arquivos' },
  { name: 'pix-core-infra', kind: 'infra', stack: 'Terraform 1.5 · AWS modules', size: '18 MB · 142 arquivos' },
  { name: 'pix-core-db', kind: 'db', stack: 'Liquibase · SQL Aurora', size: '2.8 MB · 96 arquivos' },
  { name: 'pix-core-config', kind: 'config', stack: 'YAML · K8s manifests', size: '780 KB · 24 arquivos' },
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

type TechDebtItem = {
  icon: typeof GitBranch
  title: string
  impact: string
  resolution: string
}

const TECH_DEBT: TechDebtItem[] = [
  {
    icon: GitBranch,
    title: 'Pipeline Jenkins free-form',
    impact: 'DSL Groovy livre, sem audit trail; difícil de versionar e replicar entre SAs.',
    resolution: 'Kaptain declarativo em YAML, snapshot por execução e SLO observado.',
  },
  {
    icon: Lock,
    title: 'Secrets versionados em repo de config',
    impact: 'Credenciais HML/PROD em base64 nos k8s/*.yaml — viola data-classification.',
    resolution: 'Vault-backed via SecretProviderClass; Komply bloqueia `kind: Secret` literal.',
  },
  {
    icon: AlertTriangle,
    title: 'Auto-rollback ausente em deploy',
    impact: 'Rollback de prod só manual via approval Jenkins. MTTR médio 23min nos últimos 90d.',
    resolution: 'Traffik observa p99/erro contra SLO; rollback automático se viola threshold por 5min.',
  },
  {
    icon: Server,
    title: 'Imagens base sem scan de CVE',
    impact: 'Dockerfile usa `openjdk:8` plano; última build trouxe 14 CVEs HIGH não tratadas.',
    resolution: 'Komply força base aprovada (`itau-jdk-21:lts`) + scan obrigatório no Konstructor.',
  },
  {
    icon: Activity,
    title: 'Sem dashboards padronizados',
    impact: 'Cada SA monta seu Datadog dashboard; comparar saúde entre apps é impossível.',
    resolution: 'Orkestra injeta dashboards padrão (p99, erro %, sat CPU/mem) na primeira subida.',
  },
  {
    icon: ShieldCheck,
    title: 'Versionamento de schema manual',
    impact: 'Equipe roda `psql` em prod via bastion; auditoria precária e drift HML/PROD.',
    resolution: 'Liquibase no motor de Migration; cada PR de DB vira changeset versionado.',
  },
]

const CLI_ADVANTAGES: { icon: typeof Zap; title: string; detail: string }[] = [
  { icon: Zap, title: 'Automação', detail: 'Roda em scripts, CI/CD e githooks; não depende de cliques.' },
  { icon: Repeat, title: 'Reprodutibilidade', detail: 'Mesmo comando, mesmo resultado. Idempotente por design.' },
  { icon: GitBranch, title: 'Versionável', detail: 'Fluxos viram código: commit, code review, rollback no git.' },
  { icon: Activity, title: 'Velocidade', detail: 'Execução direta, sem context-switch pra browser nem load de tela.' },
  { icon: Layers, title: 'Composável', detail: 'Pipe com jq, grep, xargs; integra com qualquer toolchain existente.' },
  { icon: CloudOff, title: 'Offline-friendly', detail: 'Auth cacheada localmente; trabalha sem rede em comandos read-only.' },
  { icon: PlugZap, title: 'Power-user', detail: 'Flags como --watch, --json, --dry-run reduzem fricção pra avançados.' },
]

const VIABILITY_CHECKS = [
  { id: 'komply', label: 'Komply · policies', status: 'ok' as const, detail: '0 violações críticas' },
  { id: 'kaptain', label: 'Kaptain · CD/AWS', status: 'ok' as const, detail: 'role itau-deploy permitida' },
  { id: 'pantheon', label: 'Pantheon · Kafka', status: 'warn' as const, detail: 'topic já existe em outro cluster' },
  { id: 'orkestra', label: 'Orkestra · K8s', status: 'ok' as const, detail: 'namespace ssa-pix-core disponível' },
  { id: 'traffik', label: 'Traffik · routing', status: 'ok' as const, detail: 'DNS livre' },
  { id: 'migration', label: 'Migration · dados', status: 'ok' as const, detail: 'Aurora reachable' },
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

function CliInstallDetails() {
  return (
    <div className="space-y-3">
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
      <CommandBlock command="curl -fsSL https://stackspot.itau/install.sh | sh" />
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
    <div className="space-y-2.5">
      <div className="text-[11.5px] text-text-secondary">
        Abre o fluxo OAuth no navegador e grava o token local em{' '}
        <code className="rounded bg-bg px-1 font-mono text-[10.5px] text-accent">~/.stackspot/token</code>.
      </div>
      <CommandBlock command="stackspot auth login --realm itau" />
      <div className="flex items-center gap-2 text-[11px]">
        <span className="rounded-full border border-border bg-bg px-2 py-0.5 font-mono text-text-muted">
          Sessão atual: não autenticado
        </span>
        <a
          href="https://sso.itau.com.br/oauth/authorize"
          rel="noreferrer noopener"
          target="_blank"
          className="inline-flex items-center gap-1 text-[11.5px] font-medium text-accent hover:underline"
        >
          Abrir SSO
          <ArrowRight className="h-3 w-3" />
        </a>
      </div>
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

  const dynamicCommand = (() => {
    const base = `stackspot context use --sa ${selectedSa}`
    const flags = MOCK_SA_REPOS.filter((r) => selectedRepos.has(r.name))
      .map((r) => `--repo ${r.name}`)
      .join(' ')
    return flags ? `${base} ${flags}` : base
  })()

  const toggleRepo = (name: string) => {
    setSelectedRepos((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  return (
    <div className="space-y-3">
      {/* a) Busca + preview da SA */}
      <div>
        <div className="text-[11.5px] text-text-secondary">
          A SA traz uma família de repos hoje espalhados (código, ci/cd, infra, db, config).
          A Migração Vanilla consolida tudo em um único mono-repo.
        </div>
        <div className="mt-2 flex items-center gap-2 rounded-md border border-border bg-bg px-2.5 py-1.5 focus-within:border-accent">
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

      {/* b) Lista de repos da família */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Repositórios da família ({MOCK_SA_REPOS.length})
          </h4>
          <span className="font-mono text-[10.5px] text-text-muted">
            {selectedRepos.size} de {MOCK_SA_REPOS.length} selecionados
          </span>
        </div>
        <ul className="space-y-1">
          {MOCK_SA_REPOS.map((r) => {
            const KindIcon = REPO_KIND_ICONS[r.kind]
            const kind = REPO_KIND_META[r.kind]
            const checked = selectedRepos.has(r.name)
            return (
              <li
                key={r.name}
                className={`flex items-center gap-2 rounded border px-2.5 py-1.5 ${
                  checked ? 'border-border bg-bg' : 'border-border bg-bg/40 opacity-60'
                }`}
              >
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={checked}
                  aria-label={`${checked ? 'Desmarcar' : 'Marcar'} repo ${r.name}`}
                  onClick={() => toggleRepo(r.name)}
                  className={`flex h-4 w-4 flex-none items-center justify-center rounded border transition ${
                    checked
                      ? 'border-accent/40 bg-accent/10 text-accent'
                      : 'border-border bg-bg text-transparent hover:border-border-strong'
                  }`}
                >
                  {checked && <Check className="h-3 w-3" />}
                </button>
                <span className="flex h-6 w-6 flex-none items-center justify-center rounded border border-border bg-surface">
                  <KindIcon className="h-3 w-3 text-text-secondary" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate font-mono text-[11.5px] text-text-primary">{r.name}</span>
                    <span
                      className={`flex-none rounded-full border px-1.5 py-0 text-[9px] font-medium uppercase tracking-wider ${kind.tone}`}
                    >
                      {kind.label}
                    </span>
                  </div>
                  <div className="truncate text-[10.5px] text-text-muted">
                    {r.stack} · {r.size}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {/* c) Comando CLI dinâmico */}
      <div>
        <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          Comando equivalente
        </h4>
        <CommandBlock command={dynamicCommand} />
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

function ViabilityCheckDetails() {
  const okCount = VIABILITY_CHECKS.filter((c) => c.status === 'ok').length
  const warnCount = VIABILITY_CHECKS.filter((c) => c.status === 'warn').length
  return (
    <div className="space-y-2.5">
      <div className="text-[11.5px] text-text-secondary">
        Pre-flight check valida os 7 motores antes de disparar o workflow.{' '}
        <span className="font-mono text-text-primary">{okCount}</span> OK,{' '}
        <span className="font-mono text-warning">{warnCount}</span> com avisos.
      </div>
      <ul className="space-y-1">
        {VIABILITY_CHECKS.map((c) => {
          const Icon = c.status === 'ok' ? CheckCircle2 : AlertTriangle
          const tone =
            c.status === 'ok'
              ? 'text-success'
              : c.status === 'warn'
              ? 'text-warning'
              : 'text-failure'
          return (
            <li
              key={c.id}
              className="flex items-center justify-between rounded border border-border bg-bg px-3 py-1.5"
            >
              <div className="flex min-w-0 items-center gap-2">
                <Icon className={`h-3.5 w-3.5 flex-none ${tone}`} />
                <span className="truncate text-[11.5px] text-text-primary">{c.label}</span>
              </div>
              <span className="ml-2 flex-none truncate text-[10.5px] text-text-muted">
                {c.detail}
              </span>
            </li>
          )
        })}
      </ul>
      <CommandBlock command="stackspot migrate check --sa ssa-pix-core" />
      <Link
        to="/workflows"
        className="inline-flex items-center gap-1 text-[11.5px] font-medium text-accent hover:underline"
      >
        Ver relatório completo
        <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  )
}

function TrackStatusDetails() {
  return (
    <div className="space-y-3">
      <div className="text-[11.5px] text-text-secondary">
        Dispara o workflow Vanilla server-side; abra o stream pra acompanhar
        o progresso em tempo real.
      </div>
      <CommandBlock command="stackspot migrate start" />
      <CommandBlock command="stackspot migrate status --watch" />

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Débitos técnicos resolvidos ao ir ON-PLAT
          </h4>
          <span className="font-mono text-[10.5px] text-text-muted">
            {TECH_DEBT.length} itens
          </span>
        </div>
        <ul className="space-y-1.5">
          {TECH_DEBT.map((d) => {
            const Icon = d.icon
            return (
              <li
                key={d.title}
                className="rounded border border-border bg-bg p-2.5"
              >
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-md bg-warning/15 text-warning">
                    <Icon className="h-3 w-3" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="text-[11.5px] font-semibold text-text-primary">{d.title}</h5>
                      <span className="flex-none rounded-full border border-failure/30 bg-failure/10 px-1.5 py-0 text-[9px] font-medium uppercase tracking-wider text-failure">
                        débito
                      </span>
                    </div>
                    <div className="mt-1 text-[10.5px] text-text-secondary">
                      <span className="text-text-muted">Hoje:</span> {d.impact}
                    </div>
                    <div className="mt-0.5 text-[10.5px] text-success">
                      <span className="text-text-muted">Pós-migração:</span> {d.resolution}
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
        <div className="mt-1.5 rounded border border-success/30 bg-success/[0.06] px-2.5 py-1.5 text-[10.5px] text-success">
          {TECH_DEBT.length} débitos resolvidos automaticamente ao concluir esse step.
        </div>
      </div>

      <Link
        to="/workflows"
        className="inline-flex items-center gap-1 text-[11.5px] font-medium text-accent hover:underline"
      >
        Abrir Workflow Tracker
        <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  )
}

function renderStepDetails(stepId: string): ReactNode {
  switch (stepId) {
    case 'install-cli':
      return <CliInstallDetails />
    case 'login':
      return <LoginDetails />
    case 'select-sa':
      return <SelectSaDetails />
    case 'check-viability':
      return <ViabilityCheckDetails />
    case 'track-status':
      return <TrackStatusDetails />
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
  return (
    <li
      className={`border-b border-border last:border-b-0 ${
        isCompleted ? 'bg-success/[0.025]' : ''
      } ${isCurrent && !isCompleted ? 'border-l-2 border-l-accent' : ''}`}
    >
      <div className="flex flex-wrap items-center gap-3 px-4 py-3">
        <span
          className={`flex h-6 w-6 flex-none items-center justify-center rounded-full border font-mono text-[11px] ${
            isCompleted
              ? 'border-success/40 bg-success/10 text-success'
              : 'border-border bg-bg text-text-secondary'
          }`}
        >
          {isCompleted ? <Check className="h-3.5 w-3.5" /> : index}
        </span>
        <span
          className={`flex h-7 w-7 flex-none items-center justify-center rounded-md border ${
            isCompleted
              ? 'border-border bg-bg text-text-muted'
              : 'border-accent/30 bg-accent/10 text-accent'
          }`}
        >
          <StepIcon className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <div
            className={`truncate text-[12.5px] font-medium ${
              isCompleted ? 'text-text-secondary' : 'text-text-primary'
            }`}
          >
            {step.title}
          </div>
          {!isCompleted && (
            <div className="truncate text-[11.5px] text-text-muted">{step.description}</div>
          )}
        </div>
        {!isCompleted && (
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
      <div
        id={`step-details-${step.id}`}
        className="border-t border-border bg-bg/40 px-4 py-3 pl-[68px]"
      >
        {renderStepDetails(step.id)}
      </div>
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

  // Modo "focus": mostra apenas o step atual. Fallback ao primeiro
  // não-concluído quando `currentStepId` aponta pra fora do checklist.
  const focusedStepIdx = (() => {
    const byCurrent = CHECKLIST_STEPS.findIndex((s) => s.stepId === currentStepId)
    if (byCurrent >= 0) return byCurrent
    const firstPending = CHECKLIST_STEPS.findIndex((s) => !completedStepIds.has(s.stepId))
    return firstPending
  })()

  const allDone = focusedStepIdx < 0
  const totalSteps = CHECKLIST_STEPS.length
  const doneCount = CHECKLIST_STEPS.filter((s) => completedStepIds.has(s.stepId)).length
  const focusedStep = allDone ? null : CHECKLIST_STEPS[focusedStepIdx]

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
      ) : focusedStep ? (
        <ul>
          <ChecklistRow
            key={focusedStep.id}
            index={focusedStepIdx + 1}
            step={focusedStep}
            isCompleted={completedStepIds.has(focusedStep.stepId)}
            isCurrent={currentStepId === focusedStep.stepId}
            onComplete={() => onToggleStep(focusedStep.stepId, true)}
          />
        </ul>
      ) : null}
    </div>
  )
}

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
      // Ao concluir "Acompanhar Status da Migration", dispara a execução
      // server-side. O tracker aparece em /workflows imediatamente.
      const trackStatusStep = CHECKLIST_STEPS.find((c) => c.id === 'track-status')
      if (trackStatusStep && stepId === trackStatusStep.stepId) {
        const alreadyTriggered = instances.some(
          (inst) => inst.templateId === migrationExecutionWorkflow.id,
        )
        if (!alreadyTriggered) addWorkflow(migrationExecutionWorkflow)
      }
    } else {
      uncompleteStep(lastWorkflow.id, stepId)
    }
  }

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
