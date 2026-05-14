import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  ChevronDown,
  Workflow as WorkflowIcon,
  Sparkles,
  Plug,
  Radar,
  Cable,
  ArrowRight,
  CheckCircle2,
  GitBranch,
  Tag,
  Database,
  User,
} from 'lucide-react'
import { workflows, type AssetStatus, type WorkflowAsset } from '../data/database'
import { useWorkflows } from '../contexts/WorkflowsProvider'

/**
 * Asset metadata schema (per spec 06-assets-catalog.md).
 *
 * Workflows são lidos do `../data/database` (single source of truth).
 * Skills/MCPs/Sensors/APIs ainda vivem aqui como mocks lightweight enquanto
 * o schema deles está se solidificando.
 */

type SkillAsset = {
  kind: 'skill'
  id: string
  name: string
  version: string
  owner: string
  description: string
  status: AssetStatus
  category: 'codegen' | 'review' | 'security' | 'observability' | 'infra' | 'data' | 'docs'
  inputs: string[]
  outputs: string[]
  referencedTools: string[]
  usage: { consumers: number; runs7d: number }
}

type McpAsset = {
  kind: 'mcp'
  id: string
  name: string
  version: string
  owner: string
  description: string
  status: AssetStatus
  server: string
  tools: string[]
  permissionScope: 'sa' | 'repo' | 'org'
  opType: 'read-only' | 'mutating' | 'mixed'
  usage: { consumers: number; runs7d: number }
}

type SensorAsset = {
  kind: 'sensor'
  id: string
  name: string
  version: string
  owner: string
  description: string
  status: AssetStatus
  category: 'security' | 'quality' | 'performance' | 'compliance'
  severityDefault: 'critical' | 'high' | 'medium' | 'low' | 'info'
  engine: string
  usage: { consumers: number; runs7d: number }
}

type ApiAsset = {
  kind: 'api'
  id: string
  name: string
  version: string
  owner: string
  description: string
  status: AssetStatus
  baseUrl: string
  authType: 'oauth2' | 'mtls' | 'bearer'
  endpoints: { method: string; path: string }[]
  usage: { consumers: number; runs7d: number }
}

type AnyAsset = WorkflowAsset | SkillAsset | McpAsset | SensorAsset | ApiAsset

const skills: SkillAsset[] = [
  {
    kind: 'skill',
    id: 'sk-scaffold-vanilla-app',
    name: 'scaffold-vanilla-app',
    version: '1.2.0',
    owner: 'squad-vanilla-platform',
    description: 'Gera esqueleto de mono-repo no padrão Vanilla, com pipeline e configs base.',
    status: 'stable',
    category: 'codegen',
    inputs: ['sa_id', 'language', 'runtime'],
    outputs: ['repo_url', 'pipeline_id'],
    referencedTools: ['github.create_repo', 'kaptain.bootstrap', 'konstructor.lint'],
    usage: { consumers: 7, runs7d: 22 },
  },
  {
    kind: 'skill',
    id: 'sk-review-pr-comments',
    name: 'review-pr-comments',
    version: '0.9.1',
    owner: 'squad-devex',
    description: 'Faz code review automatizado e posta comentários no PR.',
    status: 'beta',
    category: 'review',
    inputs: ['pr_url'],
    outputs: ['review_summary', 'comment_count'],
    referencedTools: ['github.create_comment', 'github.read_diff'],
    usage: { consumers: 12, runs7d: 87 },
  },
  {
    kind: 'skill',
    id: 'sk-plan-data-migration',
    name: 'plan-data-migration',
    version: '0.3.0',
    owner: 'squad-data-platform',
    description: 'Planeja janelas, estratégia (dual-write/cutover) e batches para backfill.',
    status: 'draft',
    category: 'data',
    inputs: ['source_db', 'target_db', 'row_estimate'],
    outputs: ['migration_plan'],
    referencedTools: ['migration.dryrun', 'migration.estimate'],
    usage: { consumers: 2, runs7d: 4 },
  },
]

const mcps: McpAsset[] = [
  {
    kind: 'mcp',
    id: 'mcp-kaptain',
    name: 'kaptain.deploy',
    version: '2.1.0',
    owner: 'squad-platform-deploy',
    description: 'Dispara deploys no Kaptain e retorna o tracking id.',
    status: 'stable',
    server: 'mcp-kaptain.itau.internal',
    tools: ['deploy', 'rollback', 'describe_release'],
    permissionScope: 'sa',
    opType: 'mutating',
    usage: { consumers: 8, runs7d: 134 },
  },
  {
    kind: 'mcp',
    id: 'mcp-komply',
    name: 'komply.evaluate',
    version: '1.4.0',
    owner: 'squad-security-platform',
    description: 'Avalia uma SA contra o conjunto vigente de policies.',
    status: 'stable',
    server: 'mcp-komply.itau.internal',
    tools: ['evaluate', 'list_violations'],
    permissionScope: 'org',
    opType: 'read-only',
    usage: { consumers: 14, runs7d: 312 },
  },
  {
    kind: 'mcp',
    id: 'mcp-pantheon',
    name: 'pantheon.topic_create',
    version: '0.7.3',
    owner: 'squad-streaming',
    description: 'Cria tópicos Kafka governados e aplica ACLs.',
    status: 'beta',
    server: 'mcp-pantheon.itau.internal',
    tools: ['topic_create', 'topic_describe', 'acl_apply'],
    permissionScope: 'sa',
    opType: 'mutating',
    usage: { consumers: 5, runs7d: 18 },
  },
]

const sensors: SensorAsset[] = [
  {
    kind: 'sensor',
    id: 'sn-cve-scan',
    name: 'cve-scan-deps',
    version: '3.2.1',
    owner: 'squad-security-platform',
    description: 'Varre dependências em busca de CVEs ativos e abre violations.',
    status: 'stable',
    category: 'security',
    severityDefault: 'high',
    engine: 'Komply',
    usage: { consumers: 47, runs7d: 940 },
  },
  {
    kind: 'sensor',
    id: 'sn-p99-latency',
    name: 'p99-latency-api',
    version: '1.1.0',
    owner: 'squad-observability',
    description: 'Dispara violação quando p99 sobe além do baseline em janela de 5min.',
    status: 'stable',
    category: 'performance',
    severityDefault: 'medium',
    engine: 'custom',
    usage: { consumers: 22, runs7d: 1280 },
  },
]

const apis: ApiAsset[] = [
  {
    kind: 'api',
    id: 'api-iam',
    name: 'itau-iam',
    version: 'v3',
    owner: 'squad-iam',
    description: 'API central de identidade e permissões.',
    status: 'stable',
    baseUrl: 'https://iam.itau.internal/v3',
    authType: 'mtls',
    endpoints: [
      { method: 'GET', path: '/users/:id' },
      { method: 'POST', path: '/grants' },
    ],
    usage: { consumers: 63, runs7d: 5400 },
  },
  {
    kind: 'api',
    id: 'api-cmdb',
    name: 'itau-cmdb',
    version: 'v2',
    owner: 'squad-cmdb',
    description: 'Configuration management DB — SAs, recursos, owners.',
    status: 'stable',
    baseUrl: 'https://cmdb.itau.internal/v2',
    authType: 'oauth2',
    endpoints: [
      { method: 'GET', path: '/sa/:id' },
      { method: 'GET', path: '/sa/:id/resources' },
    ],
    usage: { consumers: 41, runs7d: 2100 },
  },
  {
    kind: 'api',
    id: 'api-datadog',
    name: 'itau-datadog',
    version: 'v1',
    owner: 'squad-observability',
    description: 'Proxy interno do Datadog (dashboards, monitors, logs).',
    status: 'stable',
    baseUrl: 'https://dd.itau.internal/v1',
    authType: 'bearer',
    endpoints: [
      { method: 'GET', path: '/monitors' },
      { method: 'GET', path: '/dashboards/:id' },
    ],
    usage: { consumers: 35, runs7d: 1750 },
  },
]

type TabKey = 'workflows' | 'skills' | 'mcps' | 'sensors' | 'apis'

const tabs: { id: TabKey; label: string; icon: typeof WorkflowIcon; count: number }[] = [
  { id: 'workflows', label: 'Workflows', icon: WorkflowIcon, count: workflows.length },
  { id: 'skills', label: 'Skills', icon: Sparkles, count: skills.length },
  { id: 'mcps', label: 'MCPs', icon: Plug, count: mcps.length },
  { id: 'sensors', label: 'Sensors', icon: Radar, count: sensors.length },
  { id: 'apis', label: 'APIs', icon: Cable, count: apis.length },
]

const statusChip: Record<AssetStatus, string> = {
  draft: 'border-border bg-bg text-text-muted',
  beta: 'border-warning/30 bg-warning/10 text-warning',
  stable: 'border-success/30 bg-success/10 text-success',
  deprecated: 'border-failure/30 bg-failure/10 text-failure',
}

function StatusBadge({ status }: { status: AssetStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${statusChip[status]}`}
    >
      {status}
    </span>
  )
}

function AssetMeta({ asset }: { asset: AnyAsset }) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-text-muted">
      <span className="inline-flex items-center gap-1">
        <User className="h-3 w-3" />
        {asset.owner}
      </span>
      <span className="inline-flex items-center gap-1 font-mono">v{asset.version}</span>
      <span>·</span>
      <span>{asset.usage.consumers} consumidores</span>
      <span>·</span>
      <span>{asset.usage.runs7d} execuções 7d</span>
    </div>
  )
}

function AssetCard({
  asset,
  selected,
  onClick,
  icon: Icon,
  badge,
}: {
  asset: AnyAsset
  selected: boolean
  onClick: () => void
  icon: typeof WorkflowIcon
  badge?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg border bg-surface px-4 py-3 text-left transition hover:border-border-strong ${
        selected ? 'border-accent ring-1 ring-accent/40' : 'border-border'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-md bg-[#181A1F] text-text-secondary">
            <Icon className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <div className="truncate font-mono text-[13px] text-text-primary">{asset.name}</div>
            <div className="mt-0.5 line-clamp-2 text-[11.5px] text-text-secondary">{asset.description}</div>
          </div>
        </div>
        <div className="flex flex-none items-center gap-1.5">
          {badge && (
            <span className="rounded border border-border bg-bg px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-text-muted">
              {badge}
            </span>
          )}
          <StatusBadge status={asset.status} />
        </div>
      </div>
      <AssetMeta asset={asset} />
    </button>
  )
}

function EmptyAssetList({ kind }: { kind: TabKey }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface/40 px-6 py-12 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-[#181A1F]">
        <Sparkles className="h-4 w-4 text-text-muted" />
      </span>
      <div className="text-[13px] font-medium text-text-secondary">Catálogo de {kind} em construção</div>
      <div className="max-w-[360px] text-[11.5px] text-text-muted">
        O schema desses assets já está definido. À medida que squads contribuírem, eles aparecem aqui.
      </div>
    </div>
  )
}

function DependencyRow({
  icon: Icon,
  label,
  items,
}: {
  icon: typeof Sparkles
  label: string
  items: string[]
}) {
  return (
    <div className="rounded-md border border-border bg-bg px-3 py-2">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-text-muted">
        <Icon className="h-3 w-3" />
        {label}
        <span className="font-mono normal-case tracking-normal">({items.length})</span>
      </div>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {items.map((it) => (
          <span
            key={it}
            className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[11px] text-text-secondary"
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  )
}

function WorkflowItem({
  wf,
  expanded,
  onToggle,
}: {
  wf: WorkflowAsset
  expanded: boolean
  onToggle: () => void
}) {
  const navigate = useNavigate()
  const { addWorkflow } = useWorkflows()

  const handleUse = (e: React.MouseEvent) => {
    e.stopPropagation()
    const instance = addWorkflow(wf.id)
    if (instance) navigate('/')
  }

  return (
    <div
      className={`rounded-lg border bg-surface transition ${
        expanded ? 'border-accent ring-1 ring-accent/40' : 'border-border'
      }`}
    >
      <button
        onClick={onToggle}
        aria-expanded={expanded}
        className="w-full border-b border-border px-5 py-4 text-left hover:bg-[#181A1F]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <ChevronDown
                className={`h-3.5 w-3.5 flex-none text-text-muted transition-transform ${
                  expanded ? 'rotate-0' : '-rotate-90'
                }`}
              />
              <WorkflowIcon className="h-4 w-4 flex-none text-accent" />
              <h3 className="truncate font-mono text-[14px] text-text-primary">{wf.name}</h3>
              <StatusBadge status={wf.status} />
              <span className="rounded border border-border bg-bg px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-text-muted">
                {wf.type}
              </span>
            </div>
            <p className="mt-1.5 max-w-[640px] text-[12.5px] text-text-secondary">{wf.description}</p>
          </div>
          {expanded && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleUse}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleUse(e as unknown as React.MouseEvent)
                }
              }}
              className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md bg-accent px-3 text-[12px] font-medium text-black transition hover:bg-accent-hover"
            >
              Usar workflow
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
        <AssetMeta asset={wf} />
      </button>

      {!expanded ? null : (
      <div className="grid grid-cols-1 gap-5 px-5 py-5 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-text-muted" />
            <h4 className="text-[12.5px] font-semibold tracking-tight">Onboarding steps</h4>
            <span className="text-[11px] text-text-muted">consumidos pelo to-do contextual do Home</span>
          </div>
          <ol className="space-y-2">
            {wf.onboardingSteps.map((s, i) => (
              <li
                key={s.id}
                className="flex items-start gap-3 rounded-md border border-border bg-bg px-3 py-2.5"
              >
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border border-border bg-surface font-mono text-[10.5px] text-text-secondary">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11.5px] text-text-muted">{s.id}</span>
                    {s.required ? (
                      <span className="rounded border border-failure/30 bg-failure/10 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-failure">
                        required
                      </span>
                    ) : (
                      <span className="rounded border border-border bg-bg px-1.5 py-0.5 text-[9.5px] uppercase tracking-wider text-text-muted">
                        optional
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-[12.5px] text-text-primary">{s.title}</div>
                  <div className="mt-0.5 text-[11.5px] text-text-muted">{s.description}</div>
                  {s.dependsOn.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10.5px] text-text-muted">
                      <span className="uppercase tracking-wider">depende de</span>
                      {s.dependsOn.map((d) => (
                        <span key={d} className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono">
                          {d}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-5">
          <section>
            <div className="mb-2 flex items-center gap-2">
              <GitBranch className="h-3.5 w-3.5 text-text-muted" />
              <h4 className="text-[12.5px] font-semibold tracking-tight">Dependências</h4>
            </div>
            <div className="space-y-2">
              <DependencyRow icon={Sparkles} label="Skills" items={wf.dependencies.skills} />
              <DependencyRow icon={Plug} label="MCPs" items={wf.dependencies.mcps} />
              <DependencyRow icon={Cable} label="APIs" items={wf.dependencies.apis} />
            </div>
          </section>

          <section>
            <div className="mb-2 flex items-center gap-2">
              <Database className="h-3.5 w-3.5 text-text-muted" />
              <h4 className="text-[12.5px] font-semibold tracking-tight">Inputs esperados</h4>
            </div>
            <ul className="divide-y divide-border rounded-md border border-border bg-bg">
              {wf.inputs.map((inp) => (
                <li key={inp.name} className="px-3 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[12px] text-text-primary">{inp.name}</span>
                      {inp.required && (
                        <span className="rounded border border-failure/30 bg-failure/10 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-failure">
                          required
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[10.5px] text-text-muted">{inp.type}</span>
                  </div>
                  <div className="mt-0.5 text-[11.5px] text-text-muted">{inp.description}</div>
                  {inp.default && (
                    <div className="mt-0.5 font-mono text-[10.5px] text-text-muted">
                      default: <span className="text-text-secondary">{inp.default}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-md border border-border bg-bg px-3 py-2.5">
            <div className="flex items-center gap-2 text-[11px] text-text-muted">
              <Tag className="h-3 w-3" />
              <span className="uppercase tracking-wider">Maturidade</span>
              <span className="font-mono text-text-secondary">{wf.maturity}</span>
            </div>
          </section>
        </div>
      </div>
      )}
    </div>
  )
}

export default function AssetsCatalog() {
  const [tab, setTab] = useState<TabKey>('workflows')
  const [expandedWorkflows, setExpandedWorkflows] = useState<Set<string>>(
    new Set(workflows[0] ? [workflows[0].id] : []),
  )

  const toggleWorkflow = (id: string) => {
    setExpandedWorkflows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-1.5 text-[11.5px] text-text-muted">
          <span>Catálogo</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-text-secondary">Agentic Assets</span>
        </div>
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight">Agentic Assets</h1>
          <p className="mt-1 max-w-[680px] text-[13px] text-text-secondary">
            Vitrine dos building blocks do harness — workflows, skills, MCPs, sensors e APIs.
            Hoje é vitrine pequena; no futuro vira marketplace interno conforme a criação de
            flows abre pra usuários.
          </p>
        </div>
      </header>

      <nav className="flex flex-wrap items-center gap-1.5 border-b border-border">
        {tabs.map((t) => {
          const Icon = t.icon
          const active = t.id === tab
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`-mb-px flex items-center gap-2 border-b-2 px-3 py-2.5 text-[12.5px] transition ${
                active
                  ? 'border-accent text-text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
              <span
                className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${
                  active ? 'bg-accent/15 text-accent' : 'bg-bg text-text-muted'
                }`}
              >
                {t.count}
              </span>
            </button>
          )
        })}
      </nav>

      {tab === 'workflows' && (
        <section className="space-y-3">
          {workflows.map((wf) => (
            <WorkflowItem
              key={wf.id}
              wf={wf}
              expanded={expandedWorkflows.has(wf.id)}
              onToggle={() => toggleWorkflow(wf.id)}
            />
          ))}
        </section>
      )}

      {tab === 'skills' && (
        <section className="space-y-3">
          {skills.length === 0 ? (
            <EmptyAssetList kind="skills" />
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {skills.map((s) => (
                <AssetCard
                  key={s.id}
                  asset={s}
                  selected={false}
                  onClick={() => {}}
                  icon={Sparkles}
                  badge={s.category}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {tab === 'mcps' && (
        <section className="space-y-3">
          {mcps.length === 0 ? (
            <EmptyAssetList kind="mcps" />
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {mcps.map((m) => (
                <AssetCard
                  key={m.id}
                  asset={m}
                  selected={false}
                  onClick={() => {}}
                  icon={Plug}
                  badge={m.opType}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {tab === 'sensors' && (
        <section className="space-y-3">
          {sensors.length === 0 ? (
            <EmptyAssetList kind="sensors" />
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {sensors.map((s) => (
                <AssetCard
                  key={s.id}
                  asset={s}
                  selected={false}
                  onClick={() => {}}
                  icon={Radar}
                  badge={s.category}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {tab === 'apis' && (
        <section className="space-y-3">
          {apis.length === 0 ? (
            <EmptyAssetList kind="apis" />
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {apis.map((a) => (
                <AssetCard
                  key={a.id}
                  asset={a}
                  selected={false}
                  onClick={() => {}}
                  icon={Cable}
                  badge={a.authType}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
