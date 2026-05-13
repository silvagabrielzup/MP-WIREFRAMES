import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  ChevronRight,
  Rocket,
  ShieldCheck,
  Hammer,
  Boxes,
  Network,
  GitBranch,
  Database,
  Settings2,
  ScrollText,
  History,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  ArrowRight,
  ExternalLink,
  Filter,
  Download,
  ShieldAlert,
  GitMerge,
  Cpu,
  HardDrive,
  Cloud,
  Box,
  Bot,
  Users,
} from 'lucide-react'

const engineMeta: Record<string, {
  name: string
  desc: string
  ownerTeam: string
  scope: string
  icon: typeof Rocket
}> = {
  kaptain: { name: 'Kaptain', desc: 'Orquestração central de CD · AWS', ownerTeam: 'Time Kaptain', scope: 'CD · AWS', icon: Rocket },
  komply: { name: 'Komply', desc: 'Avaliação de policies', ownerTeam: 'Time Komply', scope: 'Policies', icon: ShieldCheck },
  konstructor: { name: 'Konstructor', desc: 'Build & sensores', ownerTeam: 'Time Konstructor', scope: 'Build', icon: Hammer },
  orkestra: { name: 'Orkestra', desc: 'Orquestração K8s', ownerTeam: 'Time Orkestra', scope: 'Kubernetes', icon: Boxes },
  traffik: { name: 'Traffik', desc: 'Routing e DNS', ownerTeam: 'Time Traffik', scope: 'Routing · DNS', icon: Network },
  pantheon: { name: 'Pantheon', desc: 'Plataforma Kafka', ownerTeam: 'Time Pantheon', scope: 'Kafka', icon: GitBranch },
  migration: { name: 'Migration', desc: 'Data migration', ownerTeam: 'Time Migration', scope: 'Data', icon: Database },
}

type Tab = 'overview' | 'deploys' | 'infra' | 'events' | 'by-sa'

const tabs: { id: Tab; label: string; count?: number }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'deploys', label: 'Deploys ativos', count: 9 },
  { id: 'infra', label: 'Infra provisionada' },
  { id: 'events', label: 'Eventos', count: 32 },
  { id: 'by-sa', label: 'Por SA' },
]

type KPI = {
  label: string
  value: string
  unit: string
  delta: string
  trend: 'up' | 'down' | 'flat'
  good: 'up' | 'down'
  sub: string
}

const kpis: KPI[] = [
  { label: 'Throughput', value: '142', unit: 'ops/min', delta: '+18%', trend: 'up', good: 'up', sub: 'baseline 1h 120 ops/min' },
  { label: 'Taxa de sucesso', value: '99.4', unit: '% · 1h', delta: '+0.3pp', trend: 'up', good: 'up', sub: '7d médio 99.1%' },
  { label: 'Latência p99', value: '820', unit: 'ms', delta: '−4%', trend: 'down', good: 'down', sub: 'p50 142ms · p95 612ms' },
  { label: 'Custo agregado', value: 'US$ 1.2k', unit: 'dia', delta: '+11%', trend: 'up', good: 'down', sub: 'projeção mês US$ 36.4k' },
]

type HourPoint = { hour: string; throughput: number; failures: number }

const hours24: HourPoint[] = [
  { hour: '14:40', throughput: 142, failures: 1 },
  { hour: '13:40', throughput: 138, failures: 0 },
  { hour: '12:40', throughput: 124, failures: 2 },
  { hour: '11:40', throughput: 116, failures: 0 },
  { hour: '10:40', throughput: 108, failures: 0 },
  { hour: '09:40', throughput: 132, failures: 1 },
  { hour: '08:40', throughput: 145, failures: 0 },
  { hour: '07:40', throughput: 121, failures: 0 },
  { hour: '06:40', throughput: 88, failures: 0 },
  { hour: '05:40', throughput: 42, failures: 0 },
  { hour: '04:40', throughput: 28, failures: 0 },
  { hour: '03:40', throughput: 19, failures: 0 },
  { hour: '02:40', throughput: 14, failures: 0 },
  { hour: '01:40', throughput: 22, failures: 0 },
  { hour: '00:40', throughput: 36, failures: 0 },
  { hour: '23:40', throughput: 58, failures: 1 },
  { hour: '22:40', throughput: 72, failures: 0 },
  { hour: '21:40', throughput: 96, failures: 2 },
  { hour: '20:40', throughput: 118, failures: 0 },
  { hour: '19:40', throughput: 134, failures: 1 },
  { hour: '18:40', throughput: 148, failures: 0 },
  { hour: '17:40', throughput: 152, failures: 0 },
  { hour: '16:40', throughput: 140, failures: 1 },
  { hour: '15:40', throughput: 128, failures: 0 },
].reverse()

type CriticalMark = { hourIdx: number; label: string; severity: 'critical' | 'high' | 'medium' }
const criticalMarks: CriticalMark[] = [
  { hourIdx: 5, label: 'rollout.paused · ssa-pix-core', severity: 'medium' },
  { hourIdx: 13, label: 'stack.drift · prod-vpc', severity: 'medium' },
  { hourIdx: 17, label: 'cf.exception · ssa-cartoes', severity: 'high' },
]

type DeployStatus = 'success' | 'running' | 'awaiting' | 'failure' | 'paused'

type Deploy = {
  id: string
  sa: string
  env: 'dev' | 'hom' | 'prod'
  strategy: string
  status: DeployStatus
  duration: string
  when: string
  trigger: string
  triggerKind: 'user' | 'agent' | 'cron'
}

const recentDeploys: Deploy[] = [
  { id: 'kpt-9821', sa: 'ssa-pix-core', env: 'prod', strategy: 'canary 25%', status: 'running', duration: '2m 13s', when: 'agora', trigger: 'workflow:rollout-canary', triggerKind: 'agent' },
  { id: 'kpt-9820', sa: 'ssa-conta-corrente', env: 'prod', strategy: 'canary 5%', status: 'paused', duration: '37m', when: '37m', trigger: 'sensor perf', triggerKind: 'agent' },
  { id: 'kpt-9818', sa: 'ssa-cartoes-credito', env: 'prod', strategy: 'blue-green', status: 'awaiting', duration: '14m', when: '14m', trigger: 'tech-lead@squad-cards', triggerKind: 'user' },
  { id: 'kpt-9815', sa: 'ssa-12345', env: 'hom', strategy: 'rolling', status: 'success', duration: '4m 12s', when: '23m', trigger: 'agent@konstructor', triggerKind: 'agent' },
  { id: 'kpt-9814', sa: 'ssa-credito-prefixado', env: 'prod', strategy: 'canary 50%', status: 'success', duration: '6m 41s', when: '41m', trigger: 'tech-lead@squad-credito', triggerKind: 'user' },
  { id: 'kpt-9813', sa: 'ssa-investimentos', env: 'prod', strategy: 'rolling', status: 'failure', duration: '1m 08s', when: '52m', trigger: 'cron:nightly-rollout', triggerKind: 'cron' },
  { id: 'kpt-9811', sa: 'ssa-emprestimos', env: 'hom', strategy: 'rolling', status: 'success', duration: '3m 22s', when: '1h 04m', trigger: 'agent@konstructor', triggerKind: 'agent' },
  { id: 'kpt-9808', sa: 'ssa-seguros-auto', env: 'prod', strategy: 'canary 25%', status: 'success', duration: '8m 19s', when: '1h 22m', trigger: 'sre-oncall@plataforma', triggerKind: 'user' },
  { id: 'kpt-9806', sa: 'ssa-cambio', env: 'prod', strategy: 'rolling', status: 'success', duration: '5m 02s', when: '1h 47m', trigger: 'agent@konstructor', triggerKind: 'agent' },
  { id: 'kpt-9804', sa: 'ssa-poupanca', env: 'prod', strategy: 'blue-green', status: 'success', duration: '11m 38s', when: '2h 18m', trigger: 'tech-lead@squad-poupanca', triggerKind: 'user' },
]

type EngineEventSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info'
type EngineEvent = {
  time: string
  ago: string
  type: string
  sa: string
  detail: string
  severity: EngineEventSeverity
}

const engineEvents: EngineEvent[] = [
  { time: '14:38:02', ago: '12s', type: 'deploy.start', sa: 'ssa-pix-core', detail: 'canary 25% iniciado em prod', severity: 'info' },
  { time: '14:32:11', ago: '6m', type: 'cf.stack.update', sa: 'ssa-pix-core', detail: 'pix-core-prod-stack CHANGE_SET aplicado', severity: 'info' },
  { time: '14:18:44', ago: '20m', type: 'rollout.paused', sa: 'ssa-pix-core', detail: 'sensor performance abaixo do limiar p99', severity: 'medium' },
  { time: '14:02:08', ago: '38m', type: 'deploy.success', sa: 'ssa-12345', detail: 'rolling deploy concluído em hom (4m 12s)', severity: 'info' },
  { time: '13:51:09', ago: '47m', type: 'autoscaling.scale-out', sa: 'ssa-pix-core', detail: 'ASG pix-api: 12 → 18 instâncias', severity: 'info' },
  { time: '13:42:33', ago: '56m', type: 'deploy.failure', sa: 'ssa-investimentos', detail: 'lambda code-signing rejeitou bundle', severity: 'high' },
  { time: '13:31:55', ago: '1h07m', type: 'change-set.created', sa: 'ssa-cartoes-credito', detail: 'aprovação manual solicitada', severity: 'low' },
  { time: '13:14:11', ago: '1h25m', type: 'deploy.success', sa: 'ssa-credito-prefixado', detail: 'canary 50% promovido a 100%', severity: 'info' },
  { time: '12:58:21', ago: '1h40m', type: 'iam.role.attached', sa: 'ssa-cartoes-credito', detail: 'role kpt-deploy-cartoes recriada com least-privilege', severity: 'low' },
  { time: '12:41:07', ago: '1h57m', type: 'deploy.success', sa: 'ssa-emprestimos', detail: 'rolling deploy concluído em hom (3m 22s)', severity: 'info' },
  { time: '12:14:55', ago: '2h23m', type: 'stack.drift', sa: 'ssa-seguros-auto', detail: 'CloudFormation drift detectado em prod-vpc', severity: 'medium' },
  { time: '11:38:02', ago: '3h00m', type: 'deploy.rollback', sa: 'ssa-investimentos', detail: 'rollback automático após health-check falhar 3x', severity: 'high' },
  { time: '10:42:19', ago: '3h56m', type: 'deploy.success', sa: 'ssa-seguros-auto', detail: 'canary 25% promovido a 100%', severity: 'info' },
  { time: '09:55:48', ago: '4h42m', type: 'snapshot.attached', sa: 'ssa-poupanca', detail: 'pre-deploy snapshot RDS criado', severity: 'low' },
  { time: '09:12:30', ago: '5h26m', type: 'deploy.success', sa: 'ssa-cambio', detail: 'rolling deploy 5m 02s', severity: 'info' },
]

type Approval = {
  sa: string
  workflow: string
  policy: string
  approver: string
  approverRole: string
  waiting: string
  waitingMin: number
}

const approvals: Approval[] = [
  { sa: 'ssa-cartoes-credito', workflow: 'blue-green-promote', policy: 'change-window:business-hours', approver: 'tech-lead@squad-cards', approverRole: 'Tech Lead', waiting: '14m', waitingMin: 14 },
  { sa: 'ssa-conta-corrente', workflow: 'rollout-canary', policy: 'network:egress-allowlist', approver: 'sre-oncall@plataforma', approverRole: 'SRE on-call', waiting: '37m', waitingMin: 37 },
]

type InfraResource = {
  type: string
  icon: typeof Cloud
  name: string
  sa: string
  region: string
  state: 'healthy' | 'drift' | 'degraded'
  detail: string
  age: string
}

const infraResources: InfraResource[] = [
  { type: 'CloudFormation', icon: Cloud, name: 'pix-core-prod-stack', sa: 'ssa-pix-core', region: 'us-east-1', state: 'healthy', detail: '42 recursos · last CHANGE_SET 6m', age: '8 meses' },
  { type: 'ECS Service', icon: Box, name: 'pix-core-api-svc', sa: 'ssa-pix-core', region: 'us-east-1', state: 'healthy', detail: '18/18 tasks running · 3 AZs', age: '6 meses' },
  { type: 'ASG', icon: Cpu, name: 'pix-core-asg', sa: 'ssa-pix-core', region: 'us-east-1', state: 'healthy', detail: '18 instâncias · max 30', age: '6 meses' },
  { type: 'CloudFormation', icon: Cloud, name: 'conta-corrente-prod-stack', sa: 'ssa-conta-corrente', region: 'us-east-1', state: 'degraded', detail: 'rollout pausado em 5%', age: '11 meses' },
  { type: 'Lambda', icon: Box, name: 'cc-tx-router', sa: 'ssa-conta-corrente', region: 'us-east-1', state: 'healthy', detail: 'v42 ativo · 1.4k inv/min', age: '11 meses' },
  { type: 'CloudFormation', icon: Cloud, name: 'cartoes-prod-stack', sa: 'ssa-cartoes-credito', region: 'us-east-1', state: 'healthy', detail: 'CHANGE_SET aguarda aprovação', age: '14 meses' },
  { type: 'CloudFormation', icon: Cloud, name: 'seguros-auto-prod-stack', sa: 'ssa-seguros-auto', region: 'us-east-1', state: 'drift', detail: 'drift detectado em prod-vpc (2 recursos)', age: '9 meses' },
  { type: 'RDS', icon: HardDrive, name: 'pix-core-rds-aurora', sa: 'ssa-pix-core', region: 'us-east-1', state: 'healthy', detail: 'multi-az · backup 24h ok', age: '6 meses' },
  { type: 'CloudFormation', icon: Cloud, name: 'investimentos-prod-stack', sa: 'ssa-investimentos', region: 'us-east-1', state: 'degraded', detail: 'último deploy fez rollback', age: '7 meses' },
  { type: 'ECS Service', icon: Box, name: 'cambio-api-svc', sa: 'ssa-cambio', region: 'us-east-1', state: 'healthy', detail: '6/6 tasks · 3 AZs', age: '4 meses' },
  { type: 'CloudFormation', icon: Cloud, name: 'poupanca-prod-stack', sa: 'ssa-poupanca', region: 'us-east-1', state: 'healthy', detail: 'snapshot RDS attached', age: '12 meses' },
  { type: 'Lambda', icon: Box, name: 'emprestimos-score-fn', sa: 'ssa-emprestimos', region: 'us-east-1', state: 'healthy', detail: 'v19 ativo · 380 inv/min', age: '5 meses' },
]

type SARow = {
  sa: string
  owner: string
  envs: string
  deploys24h: number
  lastDeploy: string
  successRate: string
  status: 'healthy' | 'attention' | 'degraded'
}

const saRows: SARow[] = [
  { sa: 'ssa-pix-core', owner: 'squad-pix', envs: 'dev · hom · prod', deploys24h: 14, lastDeploy: 'agora', successRate: '99.6%', status: 'healthy' },
  { sa: 'ssa-conta-corrente', owner: 'squad-cc', envs: 'dev · hom · prod', deploys24h: 8, lastDeploy: '37m', successRate: '96.2%', status: 'attention' },
  { sa: 'ssa-cartoes-credito', owner: 'squad-cards', envs: 'dev · hom · prod', deploys24h: 5, lastDeploy: '14m', successRate: '98.4%', status: 'attention' },
  { sa: 'ssa-credito-prefixado', owner: 'squad-credito', envs: 'dev · hom · prod', deploys24h: 6, lastDeploy: '41m', successRate: '99.1%', status: 'healthy' },
  { sa: 'ssa-investimentos', owner: 'squad-invest', envs: 'dev · hom · prod', deploys24h: 3, lastDeploy: '52m', successRate: '88.6%', status: 'degraded' },
  { sa: 'ssa-emprestimos', owner: 'squad-emprestimos', envs: 'dev · hom', deploys24h: 4, lastDeploy: '1h 04m', successRate: '99.4%', status: 'healthy' },
  { sa: 'ssa-seguros-auto', owner: 'squad-seguros', envs: 'dev · hom · prod', deploys24h: 2, lastDeploy: '1h 22m', successRate: '98.8%', status: 'attention' },
  { sa: 'ssa-cambio', owner: 'squad-cambio', envs: 'dev · hom · prod', deploys24h: 3, lastDeploy: '1h 47m', successRate: '99.9%', status: 'healthy' },
  { sa: 'ssa-poupanca', owner: 'squad-poupanca', envs: 'dev · hom · prod', deploys24h: 1, lastDeploy: '2h 18m', successRate: '100%', status: 'healthy' },
  { sa: 'ssa-12345', owner: 'squad-platform', envs: 'dev · hom', deploys24h: 7, lastDeploy: '23m', successRate: '97.7%', status: 'healthy' },
]

const deployStatusStyle: Record<DeployStatus, { label: string; cls: string; dot: string; icon: typeof CheckCircle2; pulse?: boolean }> = {
  success: { label: 'success', cls: 'text-success', dot: 'bg-success', icon: CheckCircle2 },
  running: { label: 'running', cls: 'text-live', dot: 'bg-live', icon: Loader2, pulse: true },
  awaiting: { label: 'awaiting', cls: 'text-warning', dot: 'bg-warning', icon: Clock3, pulse: true },
  failure: { label: 'failure', cls: 'text-failure', dot: 'bg-failure', icon: XCircle },
  paused: { label: 'paused', cls: 'text-warning', dot: 'bg-warning', icon: AlertTriangle, pulse: true },
}

const envStyle: Record<'dev' | 'hom' | 'prod', string> = {
  dev: 'text-info border-info/30 bg-info/10',
  hom: 'text-warning border-warning/30 bg-warning/10',
  prod: 'text-success border-success/30 bg-success/10',
}

const severityStyle: Record<EngineEventSeverity, string> = {
  critical: 'border-failure/40 bg-failure/15 text-failure',
  high: 'border-warning/40 bg-warning/15 text-warning',
  medium: 'border-info/40 bg-info/15 text-info',
  low: 'border-border bg-surface-2 text-text-secondary',
  info: 'border-border bg-surface-2 text-text-secondary',
}

const infraStateStyle: Record<InfraResource['state'], { label: string; cls: string }> = {
  healthy: { label: 'healthy', cls: 'text-success border-success/30 bg-success/10' },
  drift: { label: 'drift', cls: 'text-warning border-warning/30 bg-warning/10' },
  degraded: { label: 'degraded', cls: 'text-failure border-failure/30 bg-failure/10' },
}

const saStatusStyle: Record<SARow['status'], { label: string; dot: string; cls: string }> = {
  healthy: { label: 'saudável', dot: 'bg-success', cls: 'text-success' },
  attention: { label: 'atenção', dot: 'bg-warning', cls: 'text-warning' },
  degraded: { label: 'degradado', dot: 'bg-failure', cls: 'text-failure' },
}

function TriggerIcon({ kind }: { kind: Deploy['triggerKind'] }) {
  if (kind === 'agent') return <Bot className="h-3 w-3 text-accent" />
  if (kind === 'cron') return <Clock3 className="h-3 w-3 text-info" />
  return <Users className="h-3 w-3 text-text-muted" />
}

function ThroughputChart({ data, marks }: { data: HourPoint[]; marks: CriticalMark[] }) {
  const w = 880
  const h = 220
  const padL = 36
  const padR = 16
  const padT = 16
  const padB = 28
  const innerW = w - padL - padR
  const innerH = h - padT - padB

  const maxT = Math.max(...data.map((d) => d.throughput))
  const yMax = Math.ceil(maxT / 50) * 50
  const xStep = innerW / (data.length - 1)

  const linePts = data
    .map((d, i) => `${padL + i * xStep},${padT + innerH - (d.throughput / yMax) * innerH}`)
    .join(' ')
  const areaPts = `${padL},${padT + innerH} ${linePts} ${padL + innerW},${padT + innerH}`

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((p) => Math.round(yMax * p))

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      {/* grid */}
      {yTicks.map((t, i) => {
        const y = padT + innerH - (t / yMax) * innerH
        return (
          <g key={t}>
            <line x1={padL} y1={y} x2={padL + innerW} y2={y} stroke="#2A2B30" strokeDasharray={i === 0 ? '0' : '2 4'} strokeWidth="1" />
            <text x={padL - 6} y={y + 3} textAnchor="end" className="fill-[#6B6C73] font-mono" fontSize="9">
              {t}
            </text>
          </g>
        )
      })}

      {/* critical event markers */}
      {marks.map((m) => {
        const x = padL + m.hourIdx * xStep
        const color = m.severity === 'high' ? '#EAB308' : m.severity === 'critical' ? '#EF4444' : '#3B82F6'
        return (
          <g key={m.hourIdx}>
            <line x1={x} y1={padT} x2={x} y2={padT + innerH} stroke={color} strokeOpacity="0.35" strokeDasharray="3 3" strokeWidth="1" />
            <circle cx={x} cy={padT + 6} r="3.5" fill={color} />
          </g>
        )
      })}

      {/* area + line */}
      <polyline points={areaPts} fill="#FF6B2C" fillOpacity="0.08" stroke="none" />
      <polyline points={linePts} fill="none" stroke="#FF6B2C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* failure bars */}
      {data.map((d, i) => {
        if (d.failures === 0) return null
        const x = padL + i * xStep
        const y = padT + innerH - (d.throughput / yMax) * innerH
        return (
          <g key={`f-${i}`}>
            <line x1={x} y1={padT + innerH} x2={x} y2={y - 4} stroke="#EF4444" strokeOpacity="0.65" strokeWidth="1.5" />
            <circle cx={x} cy={y - 4} r="3" fill="#EF4444" />
            <text x={x} y={y - 8} textAnchor="middle" className="fill-failure font-mono" fontSize="8.5">
              {d.failures}
            </text>
          </g>
        )
      })}

      {/* x labels — every 4 hours */}
      {data.map((d, i) => {
        if (i % 4 !== 0 && i !== data.length - 1) return null
        const x = padL + i * xStep
        return (
          <text key={`x-${i}`} x={x} y={h - 8} textAnchor="middle" className="fill-[#6B6C73] font-mono" fontSize="9">
            {d.hour}
          </text>
        )
      })}
    </svg>
  )
}

export default function ControlPlaneDetail() {
  const { id } = useParams<{ id: string }>()
  const slug = (id ?? 'kaptain').toLowerCase()
  const meta = engineMeta[slug] ?? engineMeta.kaptain
  const Icon = meta.icon

  const [tab, setTab] = useState<Tab>('overview')
  const [env, setEnv] = useState<'dev' | 'hom' | 'prod'>('prod')
  const [eventSeverity, setEventSeverity] = useState<'all' | EngineEventSeverity>('all')
  const [infraQuery, setInfraQuery] = useState('')

  const filteredEvents = useMemo(
    () => (eventSeverity === 'all' ? engineEvents : engineEvents.filter((e) => e.severity === eventSeverity)),
    [eventSeverity],
  )
  const filteredInfra = useMemo(
    () => infraResources.filter((r) => `${r.name} ${r.sa} ${r.type}`.toLowerCase().includes(infraQuery.toLowerCase())),
    [infraQuery],
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <section>
        <div className="mb-2 flex items-center gap-1.5 text-[12px] text-text-secondary">
          <span className="text-text-muted">Management Plane</span>
          <ChevronRight className="h-3 w-3 text-text-muted" />
          <span className="text-text-secondary hover:text-text-primary">Control Planes</span>
          <ChevronRight className="h-3 w-3 text-text-muted" />
          <span className="font-mono text-text-primary">{meta.name.toLowerCase()}</span>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10 ring-1 ring-success/20">
              <Icon className="h-6 w-6 text-success" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-[26px] font-semibold tracking-tight">{meta.name}</h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  OK · healthy
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-live/30 bg-live/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-live">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-live opacity-80" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
                  </span>
                  live · 2s
                </span>
              </div>
              <p className="mt-1.5 text-[13px] text-text-secondary">
                {meta.desc} · Owner: <span className="text-text-primary">{meta.ownerTeam}</span> · Versão runtime{' '}
                <span className="font-mono text-text-primary">v3.18.2</span> · SLO uptime{' '}
                <span className="font-mono text-text-primary">99.95%</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-9 items-center rounded-md border border-border bg-surface p-0.5 text-[12px]">
              {(['dev', 'hom', 'prod'] as const).map((e) => (
                <button
                  key={e}
                  onClick={() => setEnv(e)}
                  className={`flex h-full items-center gap-1.5 rounded px-2.5 capitalize transition ${
                    env === e ? 'bg-surface-2 text-text-primary' : 'text-text-secondary hover:text-text-primary'
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
            <button className="flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-[12px] text-text-secondary hover:text-text-primary">
              <Settings2 className="h-3.5 w-3.5" /> Configurações
              <span className="rounded bg-surface-2 px-1 py-0.5 font-mono text-[9.5px] text-text-muted">read-only</span>
            </button>
            <button className="flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-[12px] text-text-secondary hover:text-text-primary">
              <ScrollText className="h-3.5 w-3.5" /> Logs
            </button>
            <button className="flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-[12px] text-text-secondary hover:text-text-primary">
              <History className="h-3.5 w-3.5" /> Histórico
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative -mb-px flex items-center gap-2 border-b-2 px-3.5 py-2.5 text-[13px] transition ${
              tab === t.id
                ? 'border-accent text-text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {t.label}
            {t.count !== undefined && (
              <span className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${tab === t.id ? 'bg-accent/15 text-accent' : 'bg-surface text-text-muted'}`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-6">
          {/* KPIs */}
          <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {kpis.map((k) => {
              const isGood = (k.trend === 'up' && k.good === 'up') || (k.trend === 'down' && k.good === 'down')
              const TrendIcon = k.trend === 'up' ? TrendingUp : k.trend === 'down' ? TrendingDown : Activity
              const deltaCls = k.trend === 'flat' ? 'text-text-muted' : isGood ? 'text-success' : 'text-failure'
              return (
                <div key={k.label} className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] uppercase tracking-wide text-text-muted">{k.label}</div>
                    <span className={`inline-flex items-center gap-1 rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10.5px] ${deltaCls}`}>
                      <TrendIcon className="h-3 w-3" />
                      {k.delta}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono text-[26px] font-medium tracking-tight">{k.value}</span>
                    <span className="text-[11px] text-text-muted">{k.unit}</span>
                  </div>
                  <div className="text-[10.5px] text-text-muted">{k.sub}</div>
                </div>
              )
            })}
          </section>

          {/* Chart */}
          <section className="rounded-lg border border-border bg-surface">
            <div className="flex flex-col gap-2 border-b border-border px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2.5">
                <Activity className="h-4 w-4 text-accent" />
                <h2 className="text-[14px] font-semibold tracking-tight">Throughput · últimas 24h</h2>
                <span className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[10.5px] text-text-muted">prod</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-text-secondary">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-3 rounded-sm bg-accent/70" /> ops/min
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-failure" /> falhas
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-0.5 bg-warning" /> evento crítico
                </span>
              </div>
            </div>
            <div className="px-3 py-3">
              <ThroughputChart data={hours24} marks={criticalMarks} />
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 border-t border-border px-5 py-2.5 text-[11px] text-text-secondary sm:grid-cols-4">
              <div>
                <span className="text-text-muted">total 24h: </span>
                <span className="font-mono text-text-primary">2.184 ops</span>
              </div>
              <div>
                <span className="text-text-muted">falhas 24h: </span>
                <span className="font-mono text-failure">9</span>
              </div>
              <div>
                <span className="text-text-muted">eventos críticos: </span>
                <span className="font-mono text-warning">3</span>
              </div>
              <div>
                <span className="text-text-muted">pico: </span>
                <span className="font-mono text-text-primary">152 ops/min · 17:40</span>
              </div>
            </div>
          </section>

          {/* Two columns: Deploys + Events */}
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
            {/* Deploys recentes */}
            <div className="rounded-lg border border-border bg-surface">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <Rocket className="h-3.5 w-3.5 text-text-secondary" />
                  <h3 className="text-[13px] font-semibold tracking-tight">Deploys recentes</h3>
                  <span className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-text-muted">10</span>
                </div>
                <button className="flex items-center gap-1 text-[11.5px] text-text-secondary hover:text-text-primary">
                  ver todos <ArrowRight className="h-3 w-3" />
                </button>
              </div>
              <div className="overflow-hidden">
                <div className="grid grid-cols-[1.4fr_50px_1fr_84px_1fr_60px] border-b border-border bg-[#101115] px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-text-muted">
                  <div>SA · deploy</div>
                  <div>Env</div>
                  <div>Estratégia</div>
                  <div className="text-right">Duração</div>
                  <div>Disparado por</div>
                  <div className="text-right">Quando</div>
                </div>
                {recentDeploys.map((d) => {
                  const st = deployStatusStyle[d.status]
                  const StIcon = st.icon
                  return (
                    <div
                      key={d.id}
                      className="group grid cursor-pointer grid-cols-[1.4fr_50px_1fr_84px_1fr_60px] items-center border-b border-border px-4 py-2 text-[12px] last:border-b-0 hover:bg-[#181A1F]"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <StIcon className={`h-3 w-3 ${st.cls} ${st.pulse ? 'animate-spin' : ''}`} />
                          <span className="font-mono text-[12px] text-text-primary">{d.sa}</span>
                        </div>
                        <div className="font-mono text-[10.5px] text-text-muted">{d.id}</div>
                      </div>
                      <div>
                        <span className={`inline-flex rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase ${envStyle[d.env]}`}>{d.env}</span>
                      </div>
                      <div className="text-[11.5px] text-text-secondary">{d.strategy}</div>
                      <div className="text-right font-mono text-[11.5px] text-text-secondary">{d.duration}</div>
                      <div className="flex min-w-0 items-center gap-1.5">
                        <TriggerIcon kind={d.triggerKind} />
                        <span className="truncate text-[11.5px] text-text-secondary">{d.trigger}</span>
                      </div>
                      <div className="text-right font-mono text-[11px] text-text-muted">{d.when}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Events 24h */}
            <div className="rounded-lg border border-border bg-surface">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-text-secondary" />
                  <h3 className="text-[13px] font-semibold tracking-tight">Eventos do motor · 24h</h3>
                  <span className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-text-muted">{engineEvents.length}</span>
                </div>
                <button onClick={() => setTab('events')} className="flex items-center gap-1 text-[11.5px] text-text-secondary hover:text-text-primary">
                  ver todos <ArrowRight className="h-3 w-3" />
                </button>
              </div>
              <ul className="divide-y divide-border">
                {engineEvents.slice(0, 10).map((ev, i) => (
                  <li key={i} className="group flex cursor-pointer items-start gap-3 px-4 py-2.5 hover:bg-[#181A1F]">
                    <div className="font-mono text-[10.5px] leading-tight text-text-muted">
                      <div>{ev.time.slice(0, 5)}</div>
                      <div className="text-[10px] text-text-muted">há {ev.ago}</div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11.5px] text-info">{ev.type}</span>
                        <span className={`inline-flex rounded border px-1 py-0 text-[9.5px] font-medium uppercase ${severityStyle[ev.severity]}`}>
                          {ev.severity}
                        </span>
                      </div>
                      <div className="truncate text-[11.5px] text-text-secondary">{ev.detail}</div>
                      <div className="mt-0.5 flex items-center gap-1 font-mono text-[10px] text-text-muted">
                        <Boxes className="h-2.5 w-2.5" />
                        {ev.sa}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Approvals banner */}
          {approvals.length > 0 && (
            <section className="rounded-lg border border-warning/30 bg-warning/[0.05]">
              <div className="flex items-center justify-between border-b border-warning/20 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-warning" />
                  <h3 className="text-[13px] font-semibold tracking-tight text-warning">
                    Aprovações pendentes que dependem do {meta.name}
                  </h3>
                  <span className="rounded-full bg-warning/15 px-1.5 py-0.5 font-mono text-[10px] text-warning">{approvals.length}</span>
                </div>
                <button className="text-[11.5px] text-warning hover:underline">ver fila completa</button>
              </div>
              <div>
                {approvals.map((a) => {
                  const overdue = a.waitingMin > 30
                  return (
                    <div key={a.sa + a.policy} className="grid grid-cols-1 items-center gap-3 border-b border-warning/15 px-4 py-2.5 last:border-b-0 md:grid-cols-[1.4fr_1.8fr_1fr_auto]">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-md ${overdue ? 'bg-failure/15 text-failure' : 'bg-warning/15 text-warning'}`}>
                          <Clock3 className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <div className="font-mono text-[12.5px] text-text-primary">{a.sa}</div>
                          <div className="text-[11px] text-text-muted">{a.workflow}</div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-[12px]">
                          <ShieldCheck className="h-3 w-3 text-info" />
                          <span className="font-mono text-text-primary">{a.policy}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10.5px] uppercase tracking-wide text-text-muted">{a.approverRole}</div>
                        <div className="font-mono text-[11.5px] text-text-secondary">{a.approver}</div>
                        <div className={`font-mono text-[10.5px] ${overdue ? 'text-failure' : 'text-warning'}`}>aguarda {a.waiting}</div>
                      </div>
                      <button className="flex h-8 items-center gap-1.5 self-start rounded-md bg-accent px-3 text-[11.5px] font-medium text-black hover:bg-accent-hover md:self-auto">
                        Revisar <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      )}

      {tab === 'deploys' && (
        <section className="rounded-lg border border-border bg-surface">
          <div className="flex flex-col gap-2 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Rocket className="h-3.5 w-3.5 text-text-secondary" />
              <h3 className="text-[14px] font-semibold tracking-tight">Deploys ativos</h3>
              <span className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[10.5px] text-text-muted">
                {recentDeploys.filter((d) => d.status === 'running' || d.status === 'awaiting' || d.status === 'paused').length} em curso
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2.5 text-[11.5px] text-text-secondary hover:text-text-primary">
                <Filter className="h-3 w-3" /> Filtros
              </button>
              <button className="flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2.5 text-[11.5px] text-text-secondary hover:text-text-primary">
                <Download className="h-3 w-3" /> Exportar
              </button>
            </div>
          </div>
          <div className="grid grid-cols-[110px_1.3fr_60px_1.1fr_90px_120px_1fr_70px] border-b border-border bg-[#101115] px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-text-muted">
            <div>Deploy</div>
            <div>SA</div>
            <div>Env</div>
            <div>Estratégia</div>
            <div className="text-right">Duração</div>
            <div>Status</div>
            <div>Disparado por</div>
            <div className="text-right">Quando</div>
          </div>
          {recentDeploys.map((d) => {
            const st = deployStatusStyle[d.status]
            const StIcon = st.icon
            return (
              <div
                key={d.id}
                className="grid cursor-pointer grid-cols-[110px_1.3fr_60px_1.1fr_90px_120px_1fr_70px] items-center border-b border-border px-4 py-2.5 text-[12px] last:border-b-0 hover:bg-[#181A1F]"
              >
                <div className="font-mono text-[11.5px] text-text-primary">{d.id}</div>
                <div className="flex items-center gap-1.5 font-mono text-[12px] text-text-secondary">
                  <Boxes className="h-3 w-3 text-text-muted" />
                  {d.sa}
                </div>
                <div>
                  <span className={`inline-flex rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase ${envStyle[d.env]}`}>{d.env}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11.5px] text-text-secondary">
                  <GitMerge className="h-3 w-3 text-text-muted" />
                  {d.strategy}
                </div>
                <div className="text-right font-mono text-[11.5px] text-text-secondary">{d.duration}</div>
                <div className="flex items-center gap-1.5">
                  <StIcon className={`h-3.5 w-3.5 ${st.cls} ${st.pulse ? 'animate-spin' : ''}`} />
                  <span className={`text-[11.5px] ${st.cls}`}>{st.label}</span>
                </div>
                <div className="flex min-w-0 items-center gap-1.5">
                  <TriggerIcon kind={d.triggerKind} />
                  <span className="truncate text-[11.5px] text-text-secondary">{d.trigger}</span>
                </div>
                <div className="text-right font-mono text-[11px] text-text-muted">{d.when}</div>
              </div>
            )
          })}
        </section>
      )}

      {tab === 'infra' && (
        <section className="rounded-lg border border-border bg-surface">
          <div className="flex flex-col gap-2 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="h-3.5 w-3.5 text-text-secondary" />
              <h3 className="text-[14px] font-semibold tracking-tight">Infra provisionada</h3>
              <span className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[10.5px] text-text-muted">{infraResources.length} recursos · {new Set(infraResources.map((r) => r.sa)).size} SAs</span>
            </div>
            <input
              value={infraQuery}
              onChange={(e) => setInfraQuery(e.target.value)}
              placeholder="Buscar recurso, SA…"
              className="h-8 w-[260px] rounded-md border border-border bg-bg px-3 text-[12px] placeholder:text-text-muted focus:border-border-strong focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-[140px_1.4fr_1.2fr_100px_90px_1.4fr_80px] border-b border-border bg-[#101115] px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-text-muted">
            <div>Tipo</div>
            <div>Nome</div>
            <div>SA</div>
            <div>Região</div>
            <div>Estado</div>
            <div>Detalhe</div>
            <div className="text-right">Idade</div>
          </div>
          {filteredInfra.map((r, i) => {
            const RIcon = r.icon
            const st = infraStateStyle[r.state]
            return (
              <div
                key={i}
                className="grid cursor-pointer grid-cols-[140px_1.4fr_1.2fr_100px_90px_1.4fr_80px] items-center border-b border-border px-4 py-2.5 text-[12px] last:border-b-0 hover:bg-[#181A1F]"
              >
                <div className="flex items-center gap-1.5 text-[11.5px] text-text-secondary">
                  <RIcon className="h-3.5 w-3.5 text-text-muted" />
                  {r.type}
                </div>
                <div className="font-mono text-[12px] text-text-primary">{r.name}</div>
                <div className="font-mono text-[11.5px] text-text-secondary">{r.sa}</div>
                <div className="font-mono text-[11px] text-text-muted">{r.region}</div>
                <div>
                  <span className={`inline-flex rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase ${st.cls}`}>{st.label}</span>
                </div>
                <div className="truncate text-[11.5px] text-text-secondary">{r.detail}</div>
                <div className="text-right font-mono text-[11px] text-text-muted">{r.age}</div>
              </div>
            )
          })}
          {filteredInfra.length === 0 && (
            <div className="px-4 py-8 text-center text-[12px] text-text-muted">nenhum recurso casa com o filtro</div>
          )}
        </section>
      )}

      {tab === 'events' && (
        <section className="rounded-lg border border-border bg-surface">
          <div className="flex flex-col gap-2 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-text-secondary" />
              <h3 className="text-[14px] font-semibold tracking-tight">Eventos · cronológico</h3>
              <span className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[10.5px] text-text-muted">{filteredEvents.length} eventos</span>
            </div>
            <div className="flex h-8 items-center rounded-md border border-border bg-surface-2 p-0.5 text-[11px]">
              {(['all', 'critical', 'high', 'medium', 'low', 'info'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setEventSeverity(s)}
                  className={`flex h-full items-center rounded px-2 capitalize ${
                    eventSeverity === s ? 'bg-bg text-text-primary' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {s === 'all' ? 'todas' : s}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-[100px_1fr_1.2fr_1.8fr_80px] border-b border-border bg-[#101115] px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-text-muted">
            <div>Horário</div>
            <div>Tipo</div>
            <div>SA</div>
            <div>Detalhe</div>
            <div className="text-center">Sev</div>
          </div>
          {filteredEvents.map((ev, i) => (
            <div
              key={i}
              className="group grid cursor-pointer grid-cols-[100px_1fr_1.2fr_1.8fr_80px] items-center border-b border-border px-4 py-2.5 text-[12px] last:border-b-0 hover:bg-[#181A1F]"
            >
              <div className="font-mono text-[11.5px] text-text-secondary">
                <div>{ev.time}</div>
                <div className="text-[10px] text-text-muted">há {ev.ago}</div>
              </div>
              <div className="font-mono text-[11.5px] text-info">{ev.type}</div>
              <div className="flex items-center gap-1.5 font-mono text-[11.5px] text-text-secondary">
                <Boxes className="h-3 w-3 text-text-muted" />
                {ev.sa}
              </div>
              <div className="truncate text-[12px] text-text-secondary">{ev.detail}</div>
              <div className="flex justify-center">
                <span className={`inline-flex rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase ${severityStyle[ev.severity]}`}>{ev.severity}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {tab === 'by-sa' && (
        <section className="rounded-lg border border-border bg-surface">
          <div className="flex flex-col gap-2 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Boxes className="h-3.5 w-3.5 text-text-secondary" />
              <h3 className="text-[14px] font-semibold tracking-tight">Visão por SA</h3>
              <span className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[10.5px] text-text-muted">{saRows.length} SAs servidas</span>
            </div>
            <button className="flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2.5 text-[11.5px] text-text-secondary hover:text-text-primary">
              <Filter className="h-3 w-3" /> Filtros
            </button>
          </div>
          <div className="grid grid-cols-[1.2fr_1fr_1.4fr_90px_90px_90px_110px_60px] border-b border-border bg-[#101115] px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-text-muted">
            <div>SA</div>
            <div>Owner</div>
            <div>Ambientes</div>
            <div className="text-right">Deploys 24h</div>
            <div className="text-right">Sucesso</div>
            <div className="text-right">Último</div>
            <div>Status</div>
            <div className="text-right">—</div>
          </div>
          {saRows.map((r) => {
            const st = saStatusStyle[r.status]
            return (
              <div
                key={r.sa}
                className="group grid cursor-pointer grid-cols-[1.2fr_1fr_1.4fr_90px_90px_90px_110px_60px] items-center border-b border-border px-4 py-2.5 text-[12px] last:border-b-0 hover:bg-[#181A1F]"
              >
                <div className="flex items-center gap-1.5">
                  <Boxes className="h-3 w-3 text-text-muted" />
                  <span className="font-mono text-[12px] text-text-primary">{r.sa}</span>
                </div>
                <div className="text-[11.5px] text-text-secondary">{r.owner}</div>
                <div className="font-mono text-[11px] text-text-muted">{r.envs}</div>
                <div className="text-right font-mono text-[11.5px] text-text-primary">{r.deploys24h}</div>
                <div className={`text-right font-mono text-[11.5px] ${parseFloat(r.successRate) < 95 ? 'text-failure' : parseFloat(r.successRate) < 99 ? 'text-warning' : 'text-success'}`}>
                  {r.successRate}
                </div>
                <div className="text-right font-mono text-[11px] text-text-muted">{r.lastDeploy}</div>
                <div className={`flex items-center gap-1.5 text-[11.5px] ${st.cls}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                  {st.label}
                </div>
                <div className="flex justify-end">
                  <ExternalLink className="h-3.5 w-3.5 text-text-muted opacity-0 transition group-hover:opacity-100" />
                </div>
              </div>
            )
          })}
        </section>
      )}
    </div>
  )
}
