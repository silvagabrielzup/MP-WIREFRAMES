import { useState } from 'react'
import {
  ChevronRight,
  Search,
  X,
  ShieldCheck,
  Hammer,
  Rocket,
  Network,
  GitBranch,
  Database,
  Boxes,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  ArrowRight,
  RefreshCw,
  PanelRightOpen,
  PanelRightClose,
  TrendingUp,
  TrendingDown,
  Activity,
  ExternalLink,
  Filter,
  Layers,
  Bot,
  Zap,
} from 'lucide-react'

type EngineStatus = 'ok' | 'warn' | 'fail'

type Engine = {
  slug: string
  name: string
  desc: string
  icon: typeof Rocket
  status: EngineStatus
  statusLabel: string
  throughput: string
  throughputUnit: string
  queue: number
  successRate: string
  latencyP99: string
  spark: number[]
  trend: 'up' | 'down' | 'flat'
  trendDelta: string
  note?: string
}

const engines: Engine[] = [
  {
    slug: 'kaptain',
    name: 'Kaptain',
    desc: 'CD · AWS',
    icon: Rocket,
    status: 'ok',
    statusLabel: 'OK',
    throughput: '142',
    throughputUnit: 'ops/min',
    queue: 3,
    successRate: '99.4%',
    latencyP99: '820ms',
    spark: [42, 51, 48, 60, 58, 62, 70, 72, 66, 80, 84, 91, 88, 90, 95, 102, 110, 115, 128, 142],
    trend: 'up',
    trendDelta: '+18%',
  },
  {
    slug: 'komply',
    name: 'Komply',
    desc: 'Policies',
    icon: ShieldCheck,
    status: 'warn',
    statusLabel: 'DEGRADED',
    throughput: '38',
    throughputUnit: 'ops/min',
    queue: 12,
    successRate: '94.1%',
    latencyP99: '2.4s',
    spark: [55, 50, 48, 52, 50, 44, 40, 38, 36, 40, 42, 38, 35, 36, 38, 34, 32, 38, 36, 38],
    trend: 'down',
    trendDelta: '−32%',
    note: 'fila acima do SLO',
  },
  {
    slug: 'konstructor',
    name: 'Konstructor',
    desc: 'Build',
    icon: Hammer,
    status: 'ok',
    statusLabel: 'OK',
    throughput: '76',
    throughputUnit: 'ops/min',
    queue: 1,
    successRate: '98.7%',
    latencyP99: '1.1s',
    spark: [60, 64, 70, 68, 72, 74, 70, 73, 78, 80, 77, 82, 78, 75, 73, 76, 74, 78, 76, 76],
    trend: 'flat',
    trendDelta: '±0%',
  },
  {
    slug: 'orkestra',
    name: 'Orkestra',
    desc: 'K8s',
    icon: Boxes,
    status: 'ok',
    statusLabel: 'OK',
    throughput: '210',
    throughputUnit: 'ops/min',
    queue: 0,
    successRate: '99.9%',
    latencyP99: '340ms',
    spark: [180, 185, 190, 188, 195, 200, 198, 202, 205, 198, 200, 204, 206, 208, 205, 207, 210, 212, 209, 210],
    trend: 'up',
    trendDelta: '+4%',
  },
  {
    slug: 'traffik',
    name: 'Traffik',
    desc: 'Routing · DNS',
    icon: Network,
    status: 'ok',
    statusLabel: 'OK',
    throughput: '89',
    throughputUnit: 'ops/min',
    queue: 2,
    successRate: '99.1%',
    latencyP99: '52ms',
    spark: [70, 72, 75, 78, 80, 82, 81, 85, 87, 88, 86, 90, 92, 91, 89, 88, 90, 89, 91, 89],
    trend: 'flat',
    trendDelta: '+1%',
  },
  {
    slug: 'pantheon',
    name: 'Pantheon',
    desc: 'Kafka',
    icon: GitBranch,
    status: 'ok',
    statusLabel: 'OK',
    throughput: '1.2k',
    throughputUnit: 'msg/s',
    queue: 4,
    successRate: '99.8%',
    latencyP99: '180ms',
    spark: [950, 980, 1020, 1050, 1100, 1080, 1120, 1150, 1180, 1140, 1160, 1190, 1200, 1210, 1180, 1170, 1190, 1200, 1210, 1200],
    trend: 'up',
    trendDelta: '+11%',
  },
  {
    slug: 'migration',
    name: 'Migration',
    desc: 'Data migration',
    icon: Database,
    status: 'ok',
    statusLabel: 'OK',
    throughput: '12',
    throughputUnit: 'jobs/min',
    queue: 4,
    successRate: '97.2%',
    latencyP99: '14m',
    spark: [8, 9, 10, 11, 10, 12, 13, 12, 14, 13, 11, 12, 13, 14, 12, 13, 12, 11, 13, 12],
    trend: 'flat',
    trendDelta: '+2%',
  },
]

type Severity = 'critical' | 'high' | 'medium' | 'low'
type EventStatus = 'open' | 'ack' | 'investigating' | 'resolved'

type CriticalEvent = {
  time: string
  ago: string
  engine: string
  engineIcon: typeof Rocket
  sa: string
  type: string
  detail: string
  severity: Severity
  status: EventStatus
}

const events: CriticalEvent[] = [
  { time: '14:38:02', ago: '12s', engine: 'Komply', engineIcon: ShieldCheck, sa: 'ssa-credito-prefixado', type: 'policy.violation', detail: 'network egress fora da allowlist', severity: 'high', status: 'open' },
  { time: '14:32:11', ago: '6m', engine: 'Komply', engineIcon: ShieldCheck, sa: 'ssa-12345', type: 'queue.saturation', detail: 'fila > 10 há 4m', severity: 'high', status: 'investigating' },
  { time: '14:18:44', ago: '20m', engine: 'Kaptain', engineIcon: Rocket, sa: 'ssa-pix-core', type: 'rollout.paused', detail: 'sensor performance abaixo do limiar p99', severity: 'medium', status: 'ack' },
  { time: '13:51:09', ago: '47m', engine: 'Pantheon', engineIcon: GitBranch, sa: 'ssa-investimentos', type: 'consumer.lag', detail: 'lag de 12k msgs no topic pricing.v2', severity: 'high', status: 'resolved' },
  { time: '13:42:33', ago: '56m', engine: 'Migration', engineIcon: Database, sa: 'ssa-conta-corrente', type: 'dual-write.divergence', detail: 'divergência 0.3% checksum tabela accounts', severity: 'critical', status: 'investigating' },
  { time: '12:58:21', ago: '1h40m', engine: 'Komply', engineIcon: ShieldCheck, sa: 'ssa-cartoes-credito', type: 'policy.exception', detail: 'aprovação manual concedida por sre-lead@itau', severity: 'low', status: 'resolved' },
  { time: '12:41:07', ago: '1h57m', engine: 'Konstructor', engineIcon: Hammer, sa: 'ssa-emprestimos', type: 'build.timeout', detail: 'docker build excedeu 8min em sensor CVE', severity: 'medium', status: 'resolved' },
  { time: '12:14:55', ago: '2h23m', engine: 'Traffik', engineIcon: Network, sa: 'ssa-pix-core', type: 'dns.propagation', detail: 'TTL elevado em api-pix.internal.itau', severity: 'low', status: 'resolved' },
  { time: '11:38:02', ago: '3h00m', engine: 'Orkestra', engineIcon: Boxes, sa: 'ssa-12345', type: 'pod.crashloop', detail: 'deployment ssa-12345-api restart x6 em 5m', severity: 'high', status: 'resolved' },
  { time: '10:42:19', ago: '3h56m', engine: 'Kaptain', engineIcon: Rocket, sa: 'ssa-seguros-auto', type: 'stack.drift', detail: 'CloudFormation drift detectado em prod-vpc', severity: 'medium', status: 'ack' },
  { time: '09:55:48', ago: '4h42m', engine: 'Migration', engineIcon: Database, sa: 'ssa-poupanca', type: 'snapshot.failed', detail: 'snapshot RDS expirou antes do checkpoint', severity: 'critical', status: 'resolved' },
  { time: '09:12:30', ago: '5h26m', engine: 'Pantheon', engineIcon: GitBranch, sa: 'ssa-conta-corrente', type: 'broker.rebalance', detail: 'rebalance forçado, 38s sem produção', severity: 'medium', status: 'resolved' },
  { time: '08:34:11', ago: '6h04m', engine: 'Komply', engineIcon: ShieldCheck, sa: 'ssa-investimentos', type: 'policy.violation', detail: 'dependência com CVE-2025-3148', severity: 'high', status: 'resolved' },
  { time: '07:52:09', ago: '6h46m', engine: 'Konstructor', engineIcon: Hammer, sa: 'ssa-cambio', type: 'sensor.fail', detail: 'sensor quality coverage abaixo de 70%', severity: 'medium', status: 'resolved' },
  { time: '06:18:00', ago: '8h20m', engine: 'Orkestra', engineIcon: Boxes, sa: 'ssa-12345', type: 'hpa.maxed', detail: 'HPA atingiu maxReplicas=30 por 14min', severity: 'high', status: 'resolved' },
]

type Approval = {
  sa: string
  workflow: string
  policy: string
  policyDetail: string
  approver: string
  approverRole: string
  waiting: string
  waitingMin: number
  blocking: string
}

const approvals: Approval[] = [
  {
    sa: 'ssa-pix-core',
    workflow: 'migration-pix-to-pix2',
    policy: 'data-classification:critical',
    policyDetail: 'migração de tabela com dado pessoal exige aprovação 2-em-1',
    approver: 'tech-lead@squad-pix',
    approverRole: 'Tech Lead',
    waiting: '14m',
    waitingMin: 14,
    blocking: 'agente parado em await-approval',
  },
  {
    sa: 'ssa-conta-corrente',
    workflow: 'rollout-canary',
    policy: 'network:egress-allowlist',
    policyDetail: 'rota nova p/ api-fraud.itau não está na allowlist do segmento prod-cc',
    approver: 'sre-oncall@plataforma',
    approverRole: 'SRE on-call',
    waiting: '37m',
    waitingMin: 37,
    blocking: 'rollout em 5%, sem progresso',
  },
  {
    sa: 'ssa-credito-prefixado',
    workflow: 'build-and-test',
    policy: 'dependency:cve-severity-high',
    policyDetail: 'CVE-2025-3148 (jackson-databind) sem patch disponível, exige risk-acceptance',
    approver: 'security-lead@plataforma',
    approverRole: 'Security Lead',
    waiting: '2h 11m',
    waitingMin: 131,
    blocking: 'PR bloqueado por sensor security',
  },
]

const allSAs = [
  'ssa-pix-core',
  'ssa-conta-corrente',
  'ssa-12345',
  'ssa-credito-prefixado',
  'ssa-investimentos',
  'ssa-cartoes-credito',
  'ssa-emprestimos',
  'ssa-seguros-auto',
  'ssa-poupanca',
  'ssa-cambio',
]

type SAEngineActivity = {
  engine: string
  icon: typeof Rocket
  action: string
  status: 'running' | 'ok' | 'warn' | 'idle'
  meta: string
}

const saActivities: Record<string, SAEngineActivity[]> = {
  'ssa-pix-core': [
    { engine: 'Kaptain', icon: Rocket, action: 'aplicando rollout canary 25%', status: 'running', meta: '2m 13s' },
    { engine: 'Komply', icon: ShieldCheck, action: 'aprovação 2-em-1 pendente', status: 'warn', meta: 'aguarda 14m' },
    { engine: 'Konstructor', icon: Hammer, action: 'último build OK', status: 'ok', meta: 'há 38m' },
    { engine: 'Orkestra', icon: Boxes, action: '6/6 pods Ready · 3 zones', status: 'ok', meta: 'estável' },
    { engine: 'Traffik', icon: Network, action: 'shadow traffic 5% ativo', status: 'running', meta: 'live' },
    { engine: 'Pantheon', icon: GitBranch, action: 'consumer pix-events estável', status: 'ok', meta: 'lag 0' },
    { engine: 'Migration', icon: Database, action: 'dual-write 100%, leitura 30%', status: 'running', meta: 'phase 3/5' },
  ],
  'ssa-conta-corrente': [
    { engine: 'Kaptain', icon: Rocket, action: 'rollout pausado em 5%', status: 'warn', meta: 'sensor perf' },
    { engine: 'Komply', icon: ShieldCheck, action: 'allowlist egress pendente', status: 'warn', meta: 'aguarda 37m' },
    { engine: 'Konstructor', icon: Hammer, action: 'sem builds nas últimas 2h', status: 'idle', meta: '—' },
    { engine: 'Orkestra', icon: Boxes, action: '12/12 pods · HPA 60%', status: 'ok', meta: 'estável' },
    { engine: 'Traffik', icon: Network, action: 'canary 5% routing ok', status: 'running', meta: 'live' },
    { engine: 'Pantheon', icon: GitBranch, action: 'producer cc-tx estável', status: 'ok', meta: 'lag 0' },
    { engine: 'Migration', icon: Database, action: 'sem job ativo', status: 'idle', meta: '—' },
  ],
  'ssa-12345': [
    { engine: 'Kaptain', icon: Rocket, action: 'sem deploy nas últimas 24h', status: 'idle', meta: '—' },
    { engine: 'Komply', icon: ShieldCheck, action: 'queue saturation (fila > 10)', status: 'warn', meta: '4m em alerta' },
    { engine: 'Konstructor', icon: Hammer, action: 'build em sensores', status: 'running', meta: '0m 47s' },
    { engine: 'Orkestra', icon: Boxes, action: 'HPA atingiu max há 8h', status: 'warn', meta: 'resolvido' },
    { engine: 'Traffik', icon: Network, action: 'rota interna estável', status: 'ok', meta: 'p99 18ms' },
    { engine: 'Pantheon', icon: GitBranch, action: 'sem topics próprios', status: 'idle', meta: '—' },
    { engine: 'Migration', icon: Database, action: 'postgres migration agendada', status: 'idle', meta: 'em 2h' },
  ],
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 92
  const h = 26
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = Math.max(1, max - min)
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w
      const y = h - ((v - min) / range) * (h - 2) - 1
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  const areaPts = `0,${h} ${pts} ${w},${h}`
  return (
    <svg width={w} height={h} className={`block ${color}`}>
      <polyline points={areaPts} fill="currentColor" fillOpacity="0.08" stroke="none" />
      <polyline
        points={pts}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const engineStyle: Record<EngineStatus, {
  iconBg: string
  iconColor: string
  ring: string
  badge: string
  dot: string
  spark: string
}> = {
  ok: {
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
    ring: 'ring-success/15',
    badge: 'border-success/30 bg-success/10 text-success',
    dot: 'bg-success',
    spark: 'text-success',
  },
  warn: {
    iconBg: 'bg-warning/10',
    iconColor: 'text-warning',
    ring: 'ring-warning/25',
    badge: 'border-warning/30 bg-warning/10 text-warning',
    dot: 'bg-warning',
    spark: 'text-warning',
  },
  fail: {
    iconBg: 'bg-failure/10',
    iconColor: 'text-failure',
    ring: 'ring-failure/30',
    badge: 'border-failure/30 bg-failure/10 text-failure',
    dot: 'bg-failure',
    spark: 'text-failure',
  },
}

const severityStyle: Record<Severity, string> = {
  critical: 'border-failure/40 bg-failure/15 text-failure',
  high: 'border-warning/40 bg-warning/15 text-warning',
  medium: 'border-info/40 bg-info/15 text-info',
  low: 'border-border bg-surface-2 text-text-secondary',
}

const eventStatusStyle: Record<EventStatus, { label: string; cls: string; icon: typeof Clock3 }> = {
  open: { label: 'open', cls: 'text-failure', icon: AlertTriangle },
  investigating: { label: 'investigating', cls: 'text-warning', icon: Activity },
  ack: { label: 'ack', cls: 'text-info', icon: CheckCircle2 },
  resolved: { label: 'resolved', cls: 'text-text-muted', icon: CheckCircle2 },
}

const saActivityStatus: Record<SAEngineActivity['status'], { dot: string; label: string; cls: string }> = {
  running: { dot: 'bg-live animate-pulse-live', label: 'running', cls: 'text-live' },
  ok: { dot: 'bg-success', label: 'ok', cls: 'text-success' },
  warn: { dot: 'bg-warning', label: 'atenção', cls: 'text-warning' },
  idle: { dot: 'bg-text-muted', label: 'idle', cls: 'text-text-muted' },
}

export default function ControlPlanesDashboard() {
  const [env, setEnv] = useState<'dev' | 'hom' | 'prod'>('prod')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedSA, setSelectedSA] = useState('ssa-pix-core')
  const [saQuery, setSaQuery] = useState('')
  const [severityFilter, setSeverityFilter] = useState<Severity | 'all'>('all')

  const filteredSAs = allSAs.filter((s) => s.toLowerCase().includes(saQuery.toLowerCase()))
  const filteredEvents = severityFilter === 'all' ? events : events.filter((e) => e.severity === severityFilter)
  const selectedActivities = saActivities[selectedSA] ?? []

  return (
    <div className={`grid gap-6 ${sidebarOpen ? 'lg:grid-cols-[minmax(0,1fr)_320px]' : 'grid-cols-1'}`}>
      <div className="min-w-0 space-y-6">
        {/* Header */}
        <section>
          <div className="mb-2 flex items-center gap-1.5 text-[12px] text-text-secondary">
            <span className="text-text-muted">Management Plane</span>
            <ChevronRight className="h-3 w-3 text-text-muted" />
            <span className="text-text-primary">Control Planes</span>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-[26px] font-semibold tracking-tight">Saúde da plataforma</h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-live/30 bg-live/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-live">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-live opacity-80" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
                  </span>
                  live · 2s
                </span>
              </div>
              <p className="mt-1.5 text-[13px] text-text-secondary">
                7 motores deterministas operando sobre <span className="text-text-primary">142 SAs ON-PLAT</span>. Última coleta de métricas há 2s.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 items-center rounded-md border border-border bg-surface p-0.5 text-[12px]">
                {(['dev', 'hom', 'prod'] as const).map((e) => (
                  <button
                    key={e}
                    onClick={() => setEnv(e)}
                    className={`flex h-full items-center gap-1.5 rounded px-2.5 capitalize transition ${
                      env === e
                        ? 'bg-surface-2 text-text-primary'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {env === e && (
                      <span className={`h-1.5 w-1.5 rounded-full ${e === 'prod' ? 'bg-success' : e === 'hom' ? 'bg-warning' : 'bg-info'}`} />
                    )}
                    {e}
                  </button>
                ))}
              </div>
              <button className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-text-secondary hover:text-text-primary">
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-[12px] text-text-secondary hover:text-text-primary"
              >
                {sidebarOpen ? <PanelRightClose className="h-3.5 w-3.5" /> : <PanelRightOpen className="h-3.5 w-3.5" />}
                Vista por SA
              </button>
            </div>
          </div>
        </section>

        {/* Aggregate banner */}
        <section className="flex flex-col gap-3 rounded-lg border border-warning/30 bg-warning/[0.06] px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-warning opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-warning" />
              </span>
              <span className="font-medium text-warning">Plataforma operacional com degradação</span>
            </div>
            <div className="hidden h-3 w-px bg-warning/30 sm:block" />
            <span className="text-text-secondary">
              <span className="font-mono font-medium text-text-primary">6/7</span> motores saudáveis
            </span>
            <span className="text-text-secondary">
              <span className="font-mono font-medium text-warning">1</span> degradado{' '}
              <span className="text-text-muted">(Komply)</span>
            </span>
            <span className="text-text-secondary">
              <span className="font-mono font-medium text-warning">3</span> aprovações pendentes
            </span>
            <span className="text-text-secondary">
              <span className="font-mono font-medium text-failure">12</span> incidentes 24h
            </span>
            <span className="text-text-secondary">
              <span className="font-mono font-medium text-text-primary">38</span> workflows ativos
            </span>
          </div>
          <button className="flex items-center gap-1.5 self-start rounded-md border border-warning/30 bg-warning/10 px-3 py-1.5 text-[12px] font-medium text-warning hover:bg-warning/15 sm:self-auto">
            Ver Komply <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </section>

        {/* Engine grid 4x2 */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold tracking-tight">Motores</h2>
            <div className="flex items-center gap-3 text-[11.5px] text-text-secondary">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> OK
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-warning" /> Degraded
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-failure" /> Down
              </span>
            </div>
          </div>

          <div className={`grid gap-3 ${sidebarOpen ? 'grid-cols-2 xl:grid-cols-4' : 'grid-cols-2 lg:grid-cols-4'}`}>
            {engines.map((e) => {
              const s = engineStyle[e.status]
              const Icon = e.icon
              const TrendIcon = e.trend === 'up' ? TrendingUp : e.trend === 'down' ? TrendingDown : Activity
              const trendColor =
                e.trend === 'up' ? 'text-success' : e.trend === 'down' ? 'text-warning' : 'text-text-muted'
              return (
                <div
                  key={e.slug}
                  className={`group flex cursor-pointer flex-col gap-3 rounded-lg border border-border bg-surface p-4 ring-1 ${s.ring} transition hover:border-border-strong hover:bg-surface-2`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-md ${s.iconBg}`}>
                        <Icon className={`h-4 w-4 ${s.iconColor}`} />
                      </div>
                      <div>
                        <div className="text-[13.5px] font-semibold tracking-tight">{e.name}</div>
                        <div className="text-[10.5px] uppercase tracking-wide text-text-muted">{e.desc}</div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${s.badge}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${s.dot} ${e.status !== 'ok' ? 'animate-pulse-live' : ''}`} />
                      {e.statusLabel}
                    </span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-mono text-[22px] font-medium tracking-tight">{e.throughput}</span>
                        <span className="text-[10.5px] text-text-muted">{e.throughputUnit}</span>
                      </div>
                      <div className={`mt-0.5 flex items-center gap-1 text-[10.5px] ${trendColor}`}>
                        <TrendIcon className="h-3 w-3" />
                        <span className="font-mono">{e.trendDelta}</span>
                        <span className="text-text-muted">vs 1h</span>
                      </div>
                    </div>
                    <Sparkline data={e.spark} color={s.spark} />
                  </div>

                  <div className="grid grid-cols-3 gap-2 border-t border-border pt-2.5">
                    <div>
                      <div className={`font-mono text-[12.5px] ${e.queue > 10 ? 'text-warning' : 'text-text-primary'}`}>{e.queue}</div>
                      <div className="text-[9.5px] uppercase tracking-wide text-text-muted">fila</div>
                    </div>
                    <div>
                      <div className="font-mono text-[12.5px] text-text-primary">{e.successRate}</div>
                      <div className="text-[9.5px] uppercase tracking-wide text-text-muted">succ 1h</div>
                    </div>
                    <div>
                      <div className="font-mono text-[12.5px] text-text-primary">{e.latencyP99}</div>
                      <div className="text-[9.5px] uppercase tracking-wide text-text-muted">p99</div>
                    </div>
                  </div>

                  {e.note && (
                    <div className="-mt-1 flex items-center gap-1.5 rounded border border-warning/20 bg-warning/[0.06] px-2 py-1 text-[10.5px] text-warning">
                      <AlertTriangle className="h-3 w-3" />
                      {e.note}
                    </div>
                  )}
                </div>
              )
            })}

            {/* 8th slot: aggregate / view all */}
            <div className="flex cursor-pointer flex-col justify-between rounded-lg border border-dashed border-border bg-surface/40 p-4 transition hover:border-border-strong hover:bg-surface-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/10">
                  <Layers className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <div className="text-[13.5px] font-semibold tracking-tight">Visão consolidada</div>
                  <div className="text-[10.5px] uppercase tracking-wide text-text-muted">todos os motores</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[12px]">
                <div>
                  <div className="font-mono text-text-primary">607</div>
                  <div className="text-[9.5px] uppercase tracking-wide text-text-muted">ops/min total</div>
                </div>
                <div>
                  <div className="font-mono text-text-primary">26</div>
                  <div className="text-[9.5px] uppercase tracking-wide text-text-muted">fila total</div>
                </div>
                <div>
                  <div className="font-mono text-success">98.4%</div>
                  <div className="text-[9.5px] uppercase tracking-wide text-text-muted">succ média</div>
                </div>
                <div>
                  <div className="font-mono text-text-primary">142</div>
                  <div className="text-[9.5px] uppercase tracking-wide text-text-muted">SAs servidas</div>
                </div>
              </div>
              <a className="flex items-center gap-1 text-[11.5px] text-accent hover:text-accent-hover" href="#">
                ver todos os motores <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </section>

        {/* Aprovações pendentes */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="text-[15px] font-semibold tracking-tight">Aprovações pendentes</h2>
              <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-warning">
                {approvals.length} bloqueando workflows
              </span>
            </div>
            <a className="flex items-center gap-1 text-[12px] text-text-secondary hover:text-text-primary" href="#">
              fila completa <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="space-y-2">
            {approvals.map((a) => {
              const overdue = a.waitingMin > 60
              return (
                <div
                  key={a.sa + a.policy}
                  className="grid grid-cols-1 gap-3 rounded-lg border border-border bg-surface p-4 transition hover:border-border-strong hover:bg-surface-2 md:grid-cols-[1.6fr_2fr_1fr_auto]"
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-8 w-8 flex-none items-center justify-center rounded-md ${overdue ? 'bg-failure/15 text-failure' : 'bg-warning/15 text-warning'}`}>
                      <Clock3 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 font-mono text-[13px] text-text-primary">
                        {a.sa}
                      </div>
                      <div className="truncate text-[11.5px] text-text-secondary">{a.workflow}</div>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-[12.5px]">
                      <ShieldCheck className="h-3.5 w-3.5 text-info" />
                      <span className="font-mono text-text-primary">{a.policy}</span>
                    </div>
                    <div className="mt-0.5 text-[11.5px] text-text-muted">{a.policyDetail}</div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-wide text-text-muted">{a.approverRole}</div>
                    <div className="truncate font-mono text-[12px] text-text-secondary">{a.approver}</div>
                    <div className={`mt-0.5 flex items-center gap-1 text-[11px] ${overdue ? 'text-failure' : 'text-warning'}`}>
                      <Clock3 className="h-3 w-3" />
                      aguarda {a.waiting}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:justify-end">
                    <button className="flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface-2 px-3 text-[12px] text-text-secondary hover:text-text-primary">
                      <ExternalLink className="h-3 w-3" /> Workflow
                    </button>
                    <button className="flex h-8 items-center gap-1.5 rounded-md bg-accent px-3 text-[12px] font-medium text-black hover:bg-accent-hover">
                      Revisar <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Eventos críticos 24h */}
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <h2 className="text-[15px] font-semibold tracking-tight">Eventos críticos · últimas 24h</h2>
              <span className="rounded-full bg-failure/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-failure">
                {events.length} eventos
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 items-center rounded-md border border-border bg-surface p-0.5 text-[11.5px]">
                {(['all', 'critical', 'high', 'medium', 'low'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSeverityFilter(s)}
                    className={`flex h-full items-center rounded px-2 capitalize transition ${
                      severityFilter === s
                        ? 'bg-surface-2 text-text-primary'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {s === 'all' ? 'todas' : s}
                  </button>
                ))}
              </div>
              <button className="flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 text-[11.5px] text-text-secondary hover:text-text-primary">
                <Filter className="h-3 w-3" /> Filtros
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-border bg-surface">
            <div className="grid grid-cols-[88px_1fr_1.2fr_1.4fr_1.6fr_88px_120px] border-b border-border bg-[#101115] px-4 py-2.5 text-[10.5px] font-medium uppercase tracking-wider text-text-muted">
              <div>Horário</div>
              <div>Motor</div>
              <div>SA afetada</div>
              <div>Tipo</div>
              <div>Detalhe</div>
              <div className="text-center">Sev</div>
              <div>Status</div>
            </div>
            {filteredEvents.map((ev, i) => {
              const EIcon = ev.engineIcon
              const st = eventStatusStyle[ev.status]
              const StIcon = st.icon
              return (
                <div
                  key={i}
                  className="group grid cursor-pointer grid-cols-[88px_1fr_1.2fr_1.4fr_1.6fr_88px_120px] items-center border-b border-border px-4 py-2.5 text-[12.5px] last:border-b-0 hover:bg-[#181A1F]"
                >
                  <div className="font-mono text-[11.5px] text-text-secondary">
                    <div>{ev.time}</div>
                    <div className="text-[10.5px] text-text-muted">há {ev.ago}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <EIcon className="h-3.5 w-3.5 text-text-muted" />
                    <span className="text-text-primary">{ev.engine}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[12px] text-text-secondary">
                    <Boxes className="h-3 w-3 text-text-muted" />
                    {ev.sa}
                  </div>
                  <div className="font-mono text-[11.5px] text-info">{ev.type}</div>
                  <div className="truncate text-[12px] text-text-secondary">{ev.detail}</div>
                  <div className="flex justify-center">
                    <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase ${severityStyle[ev.severity]}`}>
                      {ev.severity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-1.5 text-[11.5px] ${st.cls}`}>
                      <StIcon className="h-3 w-3" />
                      {st.label}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-text-muted opacity-0 transition group-hover:opacity-100" />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      {/* Right sidebar — Vista por SA */}
      {sidebarOpen && (
        <aside className="hidden h-fit lg:sticky lg:top-[72px] lg:block">
          <div className="rounded-lg border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-3.5 py-2.5">
              <div className="flex items-center gap-1.5">
                <Boxes className="h-3.5 w-3.5 text-accent" />
                <h3 className="text-[12.5px] font-semibold tracking-tight">Vista por SA</h3>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-text-muted hover:text-text-primary"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="border-b border-border p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={saQuery}
                  onChange={(e) => setSaQuery(e.target.value)}
                  placeholder="Buscar SA…"
                  className="h-8 w-full rounded-md border border-border bg-bg pl-8 pr-2 text-[12px] placeholder:text-text-muted focus:border-border-strong focus:outline-none"
                />
              </div>
              <div className="mt-2 max-h-[140px] space-y-0.5 overflow-y-auto pr-1">
                {filteredSAs.map((sa) => (
                  <button
                    key={sa}
                    onClick={() => setSelectedSA(sa)}
                    className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left font-mono text-[11.5px] transition ${
                      selectedSA === sa
                        ? 'bg-accent/10 text-accent'
                        : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
                    }`}
                  >
                    <span className="truncate">{sa}</span>
                    {selectedSA === sa && <ChevronRight className="h-3 w-3" />}
                  </button>
                ))}
                {filteredSAs.length === 0 && (
                  <div className="px-2 py-3 text-[11.5px] text-text-muted">nenhuma SA encontrada</div>
                )}
              </div>
            </div>

            <div className="px-3.5 pt-3 pb-2">
              <div className="flex items-center justify-between">
                <div className="font-mono text-[12px] text-text-primary">{selectedSA}</div>
                <a href="#" className="flex items-center gap-1 text-[10.5px] text-text-secondary hover:text-text-primary">
                  detalhe <ArrowRight className="h-3 w-3" />
                </a>
              </div>
              <div className="mt-0.5 text-[10.5px] uppercase tracking-wide text-text-muted">
                7 motores · estado atual
              </div>
            </div>

            <ul className="px-2 pb-3">
              {selectedActivities.length === 0 && (
                <li className="px-2 py-3 text-[11px] text-text-muted">
                  Sem atividade dos motores nas últimas 24h para esta SA.
                </li>
              )}
              {selectedActivities.map((a) => {
                const AIcon = a.icon
                const st = saActivityStatus[a.status]
                return (
                  <li
                    key={a.engine}
                    className="flex items-center gap-2 rounded px-1.5 py-2 hover:bg-surface-2"
                  >
                    <div className="flex h-6 w-6 flex-none items-center justify-center rounded bg-surface-2">
                      <AIcon className="h-3 w-3 text-text-secondary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11.5px] font-medium text-text-primary">{a.engine}</span>
                        <span className={`flex items-center gap-1 text-[10px] ${st.cls}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                          {st.label}
                        </span>
                      </div>
                      <div className="truncate text-[10.5px] text-text-secondary">{a.action}</div>
                      <div className="font-mono text-[10px] text-text-muted">{a.meta}</div>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="border-t border-border px-3.5 py-2.5">
              <div className="mb-1.5 text-[10px] uppercase tracking-wide text-text-muted">Resumo da SA</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <div className="font-mono text-text-primary">3</div>
                  <div className="text-[9.5px] uppercase tracking-wide text-text-muted">workflows ativos</div>
                </div>
                <div>
                  <div className="font-mono text-warning">1</div>
                  <div className="text-[9.5px] uppercase tracking-wide text-text-muted">aprovação pendente</div>
                </div>
                <div>
                  <div className="font-mono text-text-primary">94</div>
                  <div className="text-[9.5px] uppercase tracking-wide text-text-muted">IUConfia</div>
                </div>
                <div>
                  <div className="font-mono text-success">99.2%</div>
                  <div className="text-[9.5px] uppercase tracking-wide text-text-muted">disponibilidade 7d</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-border px-3 py-2.5 text-[11px] text-text-secondary">
              <Bot className="h-3.5 w-3.5 text-accent" />
              <span>
                consultar agente sobre <span className="font-mono text-text-primary">{selectedSA}</span>
              </span>
              <Zap className="ml-auto h-3 w-3 text-accent" />
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}
