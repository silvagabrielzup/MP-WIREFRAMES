import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  MoreHorizontal,
  Play,
  Pencil,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Boxes,
  Container,
  Database,
  ListOrdered,
  Cable,
  GitBranch,
  ShieldCheck,
  Activity,
  Wrench,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock3,
  Rocket,
  Hammer,
  Sparkles,
  ArrowRight,
  ArrowLeftRight,
  Workflow,
  Tag,
  Users,
  Network,
  Bot,
} from 'lucide-react'

type TabKey = 'overview' | 'workflows' | 'infra' | 'apis' | 'deps' | 'history'

const tabs: { id: TabKey; label: string; count?: number }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'workflows', label: 'Workflows recentes', count: 31 },
  { id: 'infra', label: 'Infra', count: 10 },
  { id: 'apis', label: 'APIs expostas', count: 4 },
  { id: 'deps', label: 'Dependências', count: 13 },
  { id: 'history', label: 'Histórico' },
]

type ScoreColor = 'success' | 'warning' | 'failure' | 'info' | 'accent'

const colorRing: Record<ScoreColor, string> = {
  success: 'stroke-success',
  warning: 'stroke-warning',
  failure: 'stroke-failure',
  info: 'stroke-info',
  accent: 'stroke-accent',
}

const colorText: Record<ScoreColor, string> = {
  success: 'text-success',
  warning: 'text-warning',
  failure: 'text-failure',
  info: 'text-info',
  accent: 'text-accent',
}

function Donut({
  value,
  size = 92,
  stroke = 8,
  color = 'success',
  label,
}: {
  value: number
  size?: number
  stroke?: number
  color?: ScoreColor
  label?: string
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (value / 100) * c
  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          className="stroke-[#22232A]"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          className={colorRing[color]}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          fill="none"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-semibold tracking-tight ${size > 80 ? 'text-[22px]' : 'text-[14px]'} ${colorText[color]}`}>
          {value}
        </span>
        {label && size > 80 && (
          <span className="-mt-0.5 text-[9.5px] uppercase tracking-wider text-text-muted">{label}</span>
        )}
      </div>
    </div>
  )
}

function Delta({ value, suffix }: { value: number; suffix?: string }) {
  const positive = value >= 0
  const Icon = positive ? TrendingUp : TrendingDown
  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10.5px] font-medium ${
        positive ? 'bg-success/10 text-success' : 'bg-failure/10 text-failure'
      }`}
    >
      <Icon className="h-3 w-3" />
      {positive ? '+' : ''}
      {value}
      {suffix || ''}
    </span>
  )
}

const activity7d = [
  { day: 'qua', deploys: 2, workflows: 4, incidents: 0 },
  { day: 'qui', deploys: 3, workflows: 5, incidents: 1 },
  { day: 'sex', deploys: 1, workflows: 3, incidents: 0 },
  { day: 'sáb', deploys: 0, workflows: 1, incidents: 0 },
  { day: 'dom', deploys: 0, workflows: 0, incidents: 0 },
  { day: 'seg', deploys: 4, workflows: 9, incidents: 2 },
  { day: 'ter', deploys: 4, workflows: 9, incidents: 0 },
]

const containers = [
  { name: 'pix-core-api', cluster: 'eks-prod-sp1', replicas: '6/6', status: 'ok' as const, version: 'v4.18.2' },
  { name: 'pix-core-worker', cluster: 'eks-prod-sp1', replicas: '3/3', status: 'ok' as const, version: 'v4.18.2' },
  { name: 'pix-core-scheduler', cluster: 'eks-prod-sp2', replicas: '2/2', status: 'degraded' as const, version: 'v4.18.1' },
]

const dynamodbs = [
  { name: 'pix-transactions', rows: '4.2B', rcu: '12k', wcu: '8k' },
  { name: 'pix-keys-registry', rows: '187M', rcu: '4k', wcu: '1.2k' },
]

const sqs = [{ name: 'pix-callback-queue', pending: 38, dlq: 0 }]

const apisOverview = [
  { path: '/v3/pix/payments', method: 'POST', version: 'v3', sla: '99.95%', p99: '142ms' },
  { path: '/v3/pix/keys', method: 'GET', version: 'v3', sla: '99.99%', p99: '38ms' },
  { path: '/v2/pix/refunds', method: 'POST', version: 'v2 deprecated', sla: '99.9%', p99: '210ms' },
  { path: '/v3/pix/callback', method: 'POST', version: 'v3', sla: '99.95%', p99: '92ms' },
]

const recentWorkflows = [
  {
    id: 'wf-01HQ4',
    name: 'onboarding-vanilla-brownfield',
    status: 'running' as const,
    step: 'deploy (3/5)',
    elapsed: '2m 13s',
    user: 'LL',
    started: 'há 2m',
  },
  {
    id: 'wf-01HQ3',
    name: 'rollout-canary',
    status: 'awaiting' as const,
    step: 'await-approval',
    elapsed: '14m 02s',
    user: 'MR',
    started: 'há 14m',
  },
  {
    id: 'wf-01HQ1',
    name: 'build-and-test',
    status: 'success' as const,
    step: 'complete (3/3)',
    elapsed: '1m 47s',
    user: 'AC',
    started: 'há 38m',
  },
  {
    id: 'wf-01HPZ',
    name: 'migration-pix-to-pix2',
    status: 'success' as const,
    step: 'complete (7/7)',
    elapsed: '24m 11s',
    user: 'TS',
    started: 'há 2h',
  },
  {
    id: 'wf-01HPY',
    name: 'security-patch-cve-3148',
    status: 'success' as const,
    step: 'complete (5/5)',
    elapsed: '4m 33s',
    user: 'CB',
    started: 'há 5h',
  },
  {
    id: 'wf-01HPX',
    name: 'rollback-deploy-v4-18-0',
    status: 'failure' as const,
    step: 'falhou em traffic-shift',
    elapsed: '1m 12s',
    user: 'LL',
    started: 'ontem 18:42',
  },
  {
    id: 'wf-01HPW',
    name: 'build-and-test',
    status: 'success' as const,
    step: 'complete (3/3)',
    elapsed: '2m 04s',
    user: 'LL',
    started: 'ontem 16:18',
  },
  {
    id: 'wf-01HPV',
    name: 'shadow-traffic-validation',
    status: 'success' as const,
    step: 'complete (4/4)',
    elapsed: '8m 21s',
    user: 'MR',
    started: 'há 2d',
  },
]

const statusBadge: Record<'running' | 'awaiting' | 'success' | 'failure', string> = {
  running: 'border-live/30 bg-live/10 text-live',
  awaiting: 'border-warning/30 bg-warning/10 text-warning',
  success: 'border-success/30 bg-success/10 text-success',
  failure: 'border-failure/30 bg-failure/10 text-failure',
}

const statusDot: Record<'running' | 'awaiting' | 'success' | 'failure', string> = {
  running: 'bg-live',
  awaiting: 'bg-warning',
  success: 'bg-success',
  failure: 'bg-failure',
}

const infraDetails = [
  { type: 'EKS', icon: Container, name: 'pix-core-api', meta: 'eks-prod-sp1 · 6/6 replicas · v4.18.2', status: 'ok' as const },
  { type: 'EKS', icon: Container, name: 'pix-core-worker', meta: 'eks-prod-sp1 · 3/3 replicas · v4.18.2', status: 'ok' as const },
  { type: 'EKS', icon: Container, name: 'pix-core-scheduler', meta: 'eks-prod-sp2 · 2/2 replicas · v4.18.1 (pinned)', status: 'degraded' as const },
  { type: 'DynamoDB', icon: Database, name: 'pix-transactions', meta: '4.2B rows · RCU 12k · WCU 8k · GSI×3', status: 'ok' as const },
  { type: 'DynamoDB', icon: Database, name: 'pix-keys-registry', meta: '187M rows · RCU 4k · WCU 1.2k · stream on', status: 'ok' as const },
  { type: 'SQS', icon: ListOrdered, name: 'pix-callback-queue', meta: '38 in-flight · 0 DLQ · visibility 30s', status: 'ok' as const },
  { type: 'Kafka', icon: GitBranch, name: 'topic: pix.events.v3', meta: '12 partitions · lag 142 msgs · rf=3', status: 'ok' as const },
  { type: 'Kafka', icon: GitBranch, name: 'topic: pix.dlq', meta: '4 partitions · lag 0 · rf=3', status: 'ok' as const },
  { type: 'S3', icon: Boxes, name: 's3://itau-pix-archive', meta: '14TB · IA tier · lifecycle 90d → glacier', status: 'ok' as const },
  { type: 'Secret', icon: ShieldCheck, name: 'pix/jwt-signing-key', meta: 'rotated há 7d · expira em 83d', status: 'warning' as const },
]

const deps = [
  { sa: 'ssa-auth-core', dir: 'upstream' as const, kind: 'API', critical: true },
  { sa: 'ssa-ledger', dir: 'upstream' as const, kind: 'API', critical: true },
  { sa: 'ssa-spb-gateway', dir: 'upstream' as const, kind: 'Kafka', critical: true },
  { sa: 'ssa-fraud-engine', dir: 'upstream' as const, kind: 'API', critical: false },
  { sa: 'ssa-conta-corrente', dir: 'downstream' as const, kind: 'API', critical: true },
  { sa: 'ssa-pix-mobile', dir: 'downstream' as const, kind: 'API', critical: true },
  { sa: 'ssa-pix-batch', dir: 'downstream' as const, kind: 'Kafka', critical: true },
  { sa: 'ssa-investimentos', dir: 'downstream' as const, kind: 'API', critical: false },
  { sa: 'ssa-credito-prefixado', dir: 'downstream' as const, kind: 'API', critical: false },
  { sa: 'ssa-bi-pix', dir: 'downstream' as const, kind: 'Kafka', critical: false },
]

const tags = ['critical', 'pix', 'tier-0', 'pci-dss', 'real-time', 'spb']

export default function SaDetail() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview')

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="space-y-4">
        <div className="flex items-center gap-1.5 text-[12px] text-text-muted">
          <Link to="/assets" className="hover:text-text-secondary">
            Catalog
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/assets" className="hover:text-text-secondary">
            SAs
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-mono text-text-secondary">ssa-pix-core</span>
        </div>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/15 ring-1 ring-info/30">
                <Boxes className="h-5 w-5 text-info" />
              </div>
              <h1 className="font-mono text-[26px] font-semibold tracking-tight">ssa-pix-core</h1>
              <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider text-accent">
                <Sparkles className="h-3 w-3" />
                ON-PLAT
              </span>
              <span className="inline-flex items-center gap-1.5 rounded border border-success/30 bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-live" />
                healthy
              </span>
            </div>
            <p className="mt-2 max-w-3xl text-[13.5px] text-text-secondary">
              Engine de pagamentos PIX em tempo real. Responsável por iniciação, callback e roteamento ao SPB.
              Operação 24×7 com SLA tier-0 e 18.4M ops/dia.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-text-muted">
              <span className="flex items-center gap-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-info/20 text-[10px] font-medium text-info">
                  MR
                </span>
                <span className="text-text-secondary">Maria Ribeiro</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                <span className="text-text-secondary">squad-pix</span>
                <span>/</span>
                <span className="text-text-secondary">Pagamentos Instantâneos</span>
              </span>
              <span className="flex items-center gap-1.5">
                <GitBranch className="h-3.5 w-3.5" />
                <span className="font-mono text-text-secondary">monorepo-pagamentos</span>
                <span className="text-text-muted">/</span>
                <span className="font-mono text-text-secondary">main</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" />
                {tags.map((t) => (
                  <span key={t} className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10.5px] text-text-secondary">
                    {t}
                  </span>
                ))}
              </span>
            </div>
          </div>

          <div className="flex flex-none items-center gap-2">
            <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-accent/40 bg-accent/10 px-3 text-[12.5px] font-medium text-accent hover:bg-accent/20">
              <Play className="h-3.5 w-3.5" />
              Disparar workflow
            </button>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-[12.5px] text-text-secondary hover:text-text-primary">
              <Pencil className="h-3.5 w-3.5" />
              Edit ownership
            </button>
            <button className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-text-secondary hover:text-text-primary">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Sticky scorecards */}
      <section className="sticky top-14 z-[5] -mx-8 border-y border-border bg-bg/95 px-8 py-4 backdrop-blur">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {/* IUConfia geral */}
          <div className="flex items-center gap-4 rounded-lg border border-border bg-surface px-4 py-3 ring-1 ring-success/15">
            <Donut value={92} color="success" label="IUConfia" />
            <div className="min-w-0">
              <div className="text-[10.5px] font-medium uppercase tracking-wider text-text-muted">IUConfia geral</div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-[18px] font-semibold tracking-tight text-text-primary">92</span>
                <span className="text-[11px] text-text-muted">/ 100</span>
              </div>
              <div className="mt-1.5">
                <Delta value={2} />
                <span className="ml-1.5 text-[10.5px] text-text-muted">vs mês ant.</span>
              </div>
            </div>
          </div>

          {/* Segurança */}
          <ScoreMini icon={ShieldCheck} label="Segurança" value={95} color="success" delta={1} />
          {/* Qualidade */}
          <ScoreMini icon={Sparkles} label="Qualidade" value={89} color="success" delta={-1} />
          {/* Performance */}
          <ScoreMini icon={Activity} label="Performance" value={93} color="success" delta={3} />

          {/* Cobertura de testes */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3">
            <div>
              <div className="text-[10.5px] font-medium uppercase tracking-wider text-text-muted">Cobertura</div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-[20px] font-semibold tracking-tight text-text-primary">87</span>
                <span className="text-[12px] text-text-muted">%</span>
              </div>
              <div className="mt-1">
                <Delta value={4} suffix="pp" />
              </div>
            </div>
            <div className="relative h-12 w-12">
              <Donut value={87} size={48} stroke={5} color="info" />
            </div>
          </div>

          {/* Débito técnico */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3">
            <div>
              <div className="text-[10.5px] font-medium uppercase tracking-wider text-text-muted">Débito técnico</div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-[20px] font-semibold tracking-tight text-text-primary">12.4</span>
                <span className="text-[12px] text-text-muted">h</span>
              </div>
              <div className="mt-1">
                <Delta value={-3} suffix="h" />
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-warning/10">
              <Wrench className="h-5 w-5 text-warning" />
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex items-center gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 border-b-2 px-3.5 py-2.5 text-[13px] transition ${
                activeTab === t.id
                  ? 'border-accent text-text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {t.label}
              {t.count !== undefined && (
                <span
                  className={`rounded px-1.5 py-0.5 text-[10.5px] font-mono ${
                    activeTab === t.id ? 'bg-accent/15 text-accent' : 'bg-[#22232A] text-text-muted'
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && <Overview />}
      {activeTab === 'workflows' && <WorkflowsTab />}
      {activeTab === 'infra' && <InfraTab />}
      {activeTab === 'apis' && <ApisTab />}
      {activeTab === 'deps' && <DepsTab />}
      {activeTab === 'history' && <HistoryTab />}
    </div>
  )
}

function ScoreMini({
  icon: Icon,
  label,
  value,
  color,
  delta,
}: {
  icon: typeof ShieldCheck
  label: string
  value: number
  color: ScoreColor
  delta: number
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3">
      <Donut value={value} size={52} stroke={6} color={color} />
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-wider text-text-muted">
          <Icon className="h-3 w-3" />
          {label}
        </div>
        <div className="mt-0.5 text-[18px] font-semibold tracking-tight text-text-primary">{value}</div>
        <div className="mt-0.5">
          <Delta value={delta} />
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────  OVERVIEW ──────────────────────────── */

function Overview() {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
        {/* Left column 60% */}
        <div className="space-y-5">
          {/* Sobre */}
          <Card title="Sobre esta SA" right={<a className="text-[11.5px] text-text-secondary hover:text-text-primary" href="#">README ↗</a>}>
            <div className="grid grid-cols-1 gap-x-6 gap-y-3 px-4 py-4 text-[12.5px] sm:grid-cols-2">
              <Field label="Descrição" value="Engine PIX (iniciação, callback, SPB)" />
              <Field label="Tier" value="0 (crítico)" valueClass="text-failure" />
              <Field label="Repositório" value="github.com/itau/monorepo-pagamentos" mono />
              <Field label="Path no mono" value="services/pix-core" mono />
              <Field label="Branch default" value="main" mono />
              <Field label="Linguagem" value="Go 1.22 · 412k LOC" />
              <Field label="Onboardada em" value="2025-03-18" />
              <Field label="Migrada de" value="legacy-pix-monolith (sunset 2025-08)" />
              <Field label="Compliance" value="PCI-DSS · BACEN 4.658" />
              <Field label="DR Strategy" value="active-active SP1/SP2 · RPO 0 · RTO 4min" />
            </div>
          </Card>

          {/* Atividade 7d */}
          <Card
            title="Atividade · últimos 7 dias"
            right={
              <div className="flex items-center gap-3 text-[10.5px] text-text-muted">
                <Legend color="bg-info" label="deploys" />
                <Legend color="bg-live" label="workflows" />
                <Legend color="bg-failure" label="incidentes" />
              </div>
            }
          >
            <Activity7d />
          </Card>

          {/* Última execução */}
          <Card title="Última execução de workflow" right={<Link to="/workflows" className="flex items-center gap-1 text-[11.5px] text-text-secondary hover:text-text-primary">todas <ArrowRight className="h-3 w-3" /></Link>}>
            <div className="flex items-start gap-4 px-4 py-4">
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-md bg-live/15 ring-1 ring-live/30">
                <Workflow className="h-5 w-5 text-live" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to="/workflows/wf-01HQ4"
                    className="font-mono text-[13.5px] font-medium text-text-primary hover:text-accent"
                  >
                    onboarding-vanilla-brownfield
                  </Link>
                  <span className="inline-flex items-center gap-1.5 rounded border border-live/30 bg-live/10 px-2 py-0.5 text-[11px] text-live">
                    <span className="h-1.5 w-1.5 rounded-full bg-live animate-pulse-live" />
                    running
                  </span>
                  <span className="text-[11.5px] text-text-muted">step 3 de 5 · deploy</span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-[12px] sm:grid-cols-4">
                  <Inline label="Iniciado por" value="Luigi Lima" />
                  <Inline label="Há" value="2m 13s" mono />
                  <Inline label="Trigger" value="manual via CLI" />
                  <Inline label="Run ID" value="wf-01HQ4-X92K" mono />
                </div>
                <div className="mt-3 flex h-1.5 w-full max-w-md overflow-hidden rounded-full bg-[#22232A]">
                  <div className="bg-success/70" style={{ width: '20%' }} />
                  <div className="bg-success/70" style={{ width: '20%' }} />
                  <div className="bg-success/70" style={{ width: '20%' }} />
                  <div className="bg-live animate-pulse" style={{ width: '12%' }} />
                  <div style={{ width: '28%' }} />
                </div>
                <div className="mt-2 flex max-w-md justify-between text-[10px] uppercase tracking-wide text-text-muted">
                  <span>build ✓</span>
                  <span>komply ✓</span>
                  <span>konstructor ✓</span>
                  <span className="text-live">deploy</span>
                  <span>rollout</span>
                </div>
              </div>
              <Link
                to="/workflows/wf-01HQ4"
                className="flex-none rounded-md border border-border bg-surface px-3 py-1.5 text-[11.5px] text-text-secondary hover:text-text-primary"
              >
                Detalhe
              </Link>
            </div>
          </Card>
        </div>

        {/* Right column 40% — Infra rápida */}
        <div className="space-y-5">
          <Card title="Infra rápida" right={<span className="text-[10.5px] uppercase tracking-wider text-text-muted">10 assets</span>}>
            <InfraGroup
              title="Containers EKS"
              count={3}
              icon={Container}
              items={containers.map((c) => ({
                left: c.name,
                meta: `${c.cluster} · ${c.replicas}`,
                right: c.version,
                status: c.status,
                href: `/assets/${c.name}`,
              }))}
            />
            <InfraGroup
              title="DynamoDB"
              count={2}
              icon={Database}
              items={dynamodbs.map((d) => ({
                left: d.name,
                meta: `${d.rows} rows · RCU ${d.rcu}/WCU ${d.wcu}`,
                right: undefined,
                status: 'ok' as const,
                href: `/assets/${d.name}`,
              }))}
            />
            <InfraGroup
              title="SQS"
              count={1}
              icon={ListOrdered}
              items={sqs.map((q) => ({
                left: q.name,
                meta: `${q.pending} in-flight · DLQ ${q.dlq}`,
                right: undefined,
                status: 'ok' as const,
                href: `/assets/${q.name}`,
              }))}
            />
            <InfraGroup
              title="APIs expostas"
              count={4}
              icon={Cable}
              items={apisOverview.map((a) => ({
                left: a.path,
                meta: `${a.method} · ${a.version}`,
                right: a.p99,
                status: a.version.includes('deprecated') ? ('warning' as const) : ('ok' as const),
                href: `/assets/api-${a.path}`,
              }))}
              last
            />
          </Card>

          <Card title="Aprovações pendentes" right={<span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wider text-warning">1</span>}>
            <div className="flex items-start gap-3 px-4 py-3">
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-md bg-warning/15">
                <Clock3 className="h-4 w-4 text-warning" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] text-text-primary">Komply: liberação de network egress</div>
                <div className="mt-0.5 truncate text-[11.5px] text-text-muted">
                  rollout-canary · awaiting tech lead · 14m
                </div>
              </div>
              <button className="flex-none rounded-md border border-warning/40 bg-warning/10 px-2.5 py-1 text-[11px] font-medium text-warning hover:bg-warning/20">
                Revisar
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Dependency map preview */}
      <Card
        title="Mapa de dependências"
        right={
          <button
            onClick={() => undefined}
            className="flex items-center gap-1 text-[11.5px] text-text-secondary hover:text-text-primary"
          >
            ver grafo completo <ArrowRight className="h-3 w-3" />
          </button>
        }
      >
        <DepMap />
      </Card>
    </section>
  )
}

function Card({
  title,
  right,
  children,
}: {
  title: string
  right?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-[13px] font-semibold tracking-tight">{title}</h3>
        {right}
      </div>
      {children}
    </div>
  )
}

function Field({ label, value, mono, valueClass }: { label: string; value: string; mono?: boolean; valueClass?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-border/60 pb-2 last:border-b-0 sm:border-b-0 sm:pb-0">
      <span className="text-[11px] uppercase tracking-wider text-text-muted">{label}</span>
      <span className={`${mono ? 'font-mono text-[12px]' : 'text-[12.5px]'} text-right ${valueClass || 'text-text-primary'}`}>
        {value}
      </span>
    </div>
  )
}

function Inline({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-text-muted">{label}</div>
      <div className={`${mono ? 'font-mono text-[12px]' : 'text-[12px]'} text-text-primary`}>{value}</div>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-sm ${color}`} />
      {label}
    </span>
  )
}

function Activity7d() {
  const max = 12
  return (
    <div className="px-4 py-5">
      <div className="grid grid-cols-7 gap-3">
        {activity7d.map((d) => {
          const total = d.deploys + d.workflows + d.incidents
          return (
            <div key={d.day} className="flex flex-col items-center gap-2">
              <div className="flex h-32 w-full items-end justify-center gap-1 rounded-md border border-border/60 bg-[#101115] px-1.5 py-1.5">
                <div
                  className="w-2.5 rounded-sm bg-info"
                  style={{ height: `${(d.deploys / max) * 100}%`, minHeight: d.deploys > 0 ? '4px' : 0 }}
                  title={`${d.deploys} deploys`}
                />
                <div
                  className="w-2.5 rounded-sm bg-live"
                  style={{ height: `${(d.workflows / max) * 100}%`, minHeight: d.workflows > 0 ? '4px' : 0 }}
                  title={`${d.workflows} workflows`}
                />
                <div
                  className="w-2.5 rounded-sm bg-failure"
                  style={{ height: `${(d.incidents / max) * 100}%`, minHeight: d.incidents > 0 ? '4px' : 0 }}
                  title={`${d.incidents} incidentes`}
                />
              </div>
              <div className="text-[10.5px] uppercase tracking-wider text-text-muted">{d.day}</div>
              <div className="font-mono text-[10.5px] text-text-secondary">{total}</div>
            </div>
          )
        })}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-3">
        <Stat label="Deploys 7d" value="14" trend={4} />
        <Stat label="Workflows 7d" value="31" trend={9} />
        <Stat label="Incidentes 7d" value="3" trend={-2} />
      </div>
    </div>
  )
}

function Stat({ label, value, trend }: { label: string; value: string; trend: number }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-text-muted">{label}</div>
      <div className="mt-0.5 flex items-baseline gap-2">
        <span className="text-[16px] font-semibold text-text-primary">{value}</span>
        <Delta value={trend} />
      </div>
    </div>
  )
}

function InfraGroup({
  title,
  count,
  icon: Icon,
  items,
  last,
}: {
  title: string
  count: number
  icon: typeof Container
  items: { left: string; meta: string; right?: string; status: 'ok' | 'degraded' | 'warning'; href: string }[]
  last?: boolean
}) {
  const dot = { ok: 'bg-success', degraded: 'bg-warning', warning: 'bg-warning' } as const
  return (
    <div className={last ? '' : 'border-b border-border'}>
      <div className="flex items-center gap-2 px-4 pb-2 pt-3">
        <Icon className="h-3.5 w-3.5 text-text-muted" />
        <span className="text-[11px] font-medium uppercase tracking-wider text-text-muted">{title}</span>
        <span className="font-mono text-[10.5px] text-text-muted">({count})</span>
      </div>
      <ul>
        {items.map((it) => (
          <li
            key={it.left}
            className="group flex cursor-pointer items-center gap-3 px-4 py-2 transition hover:bg-[#181A1F]"
          >
            <span className={`h-1.5 w-1.5 flex-none rounded-full ${dot[it.status]}`} />
            <div className="min-w-0 flex-1">
              <div className="truncate font-mono text-[12px] text-text-primary">{it.left}</div>
              <div className="truncate text-[10.5px] text-text-muted">{it.meta}</div>
            </div>
            {it.right && <span className="font-mono text-[10.5px] text-text-secondary">{it.right}</span>}
            <ChevronRight className="h-3.5 w-3.5 flex-none text-text-muted opacity-0 transition group-hover:opacity-100" />
          </li>
        ))}
      </ul>
    </div>
  )
}

function DepMap() {
  const upstream = deps.filter((d) => d.dir === 'upstream')
  const downstream = deps.filter((d) => d.dir === 'downstream')
  return (
    <div className="relative grid grid-cols-1 gap-4 px-4 py-5 md:grid-cols-[1fr_auto_1fr]">
      {/* Upstream */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-wider text-text-muted">
          <ArrowRight className="h-3 w-3 rotate-180" />
          Depende de ({upstream.length})
        </div>
        {upstream.map((d) => (
          <DepNode key={d.sa} dep={d} side="left" />
        ))}
      </div>

      {/* Center */}
      <div className="flex flex-col items-center justify-center gap-2 md:px-6">
        <div className="hidden md:block">
          <svg width="80" height="160" className="text-border">
            <line x1="0" y1="20" x2="80" y2="80" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="60" x2="80" y2="80" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="100" x2="80" y2="80" stroke="currentColor" strokeWidth="1" />
            <line x1="0" y1="140" x2="80" y2="80" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-lg border-2 border-accent/50 bg-accent/10 px-5 py-4 ring-4 ring-accent/10">
          <Boxes className="h-5 w-5 text-accent" />
          <span className="font-mono text-[13px] font-medium text-text-primary">ssa-pix-core</span>
          <span className="text-[10px] uppercase tracking-wider text-accent">tier-0</span>
        </div>
        <div className="hidden md:block">
          <svg width="80" height="160" className="text-border">
            <line x1="80" y1="20" x2="0" y2="80" stroke="currentColor" strokeWidth="1" />
            <line x1="80" y1="60" x2="0" y2="80" stroke="currentColor" strokeWidth="1" />
            <line x1="80" y1="100" x2="0" y2="80" stroke="currentColor" strokeWidth="1" />
            <line x1="80" y1="140" x2="0" y2="80" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* Downstream */}
      <div className="space-y-2">
        <div className="flex items-center justify-end gap-2 text-[10.5px] font-medium uppercase tracking-wider text-text-muted">
          Consumido por ({downstream.length})
          <ArrowRight className="h-3 w-3" />
        </div>
        {downstream.map((d) => (
          <DepNode key={d.sa} dep={d} side="right" />
        ))}
      </div>

      <div className="absolute right-4 top-3 rounded border border-border bg-[#101115] px-2 py-1 font-mono text-[10px] text-text-muted">
        preview · 10 de 13 vínculos
      </div>
    </div>
  )
}

function DepNode({ dep, side }: { dep: (typeof deps)[number]; side: 'left' | 'right' }) {
  return (
    <Link
      to={`/assets/${dep.sa}`}
      className={`group flex items-center gap-2.5 rounded-md border border-border bg-[#101115] px-3 py-2 transition hover:border-border-strong hover:bg-surface ${
        side === 'right' ? 'flex-row-reverse text-right' : ''
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dep.critical ? 'bg-failure' : 'bg-text-muted'}`} />
      <div className="min-w-0 flex-1">
        <div className="truncate font-mono text-[12px] text-text-primary">{dep.sa}</div>
        <div className="text-[10px] uppercase tracking-wider text-text-muted">
          {dep.kind} {dep.critical && '· crítica'}
        </div>
      </div>
      <ExternalLink className="h-3 w-3 flex-none text-text-muted opacity-0 transition group-hover:opacity-100" />
    </Link>
  )
}

/* ────────────────────────────  OTHER TABS ──────────────────────────── */

function WorkflowsTab() {
  return (
    <section>
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="grid grid-cols-[1.6fr_1.3fr_0.9fr_0.7fr_0.6fr_0.4fr] border-b border-border bg-[#101115] px-4 py-2.5 text-[10.5px] font-medium uppercase tracking-wider text-text-muted">
          <div>Workflow</div>
          <div>Step / resultado</div>
          <div>Iniciado</div>
          <div>Duração</div>
          <div>Status</div>
          <div className="text-right">Por</div>
        </div>
        {recentWorkflows.map((w) => (
          <Link
            key={w.id}
            to={`/workflows/${w.id}`}
            className="group grid grid-cols-[1.6fr_1.3fr_0.9fr_0.7fr_0.6fr_0.4fr] items-center border-b border-border px-4 py-3 text-[13px] last:border-b-0 hover:bg-[#181A1F]"
          >
            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${statusDot[w.status]} ${w.status === 'running' ? 'animate-pulse-live' : ''}`} />
              <span className="font-mono text-text-primary">{w.name}</span>
              <span className="font-mono text-[10.5px] text-text-muted">{w.id}</span>
            </div>
            <div className="truncate text-[12.5px] text-text-secondary">{w.step}</div>
            <div className="text-[12px] text-text-muted">{w.started}</div>
            <div className="font-mono text-[12px] text-text-secondary">{w.elapsed}</div>
            <div>
              <span className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11px] ${statusBadge[w.status]}`}>
                {w.status}
              </span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-[10px] font-medium text-accent">
                {w.user}
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-text-muted opacity-0 group-hover:opacity-100" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

function InfraTab() {
  const [filter, setFilter] = useState<'all' | 'ok' | 'warning' | 'degraded'>('all')
  const filtered = filter === 'all' ? infraDetails : infraDetails.filter((i) => i.status === filter)
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        {(['all', 'ok', 'warning', 'degraded'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md border px-3 py-1.5 text-[11.5px] capitalize transition ${
              filter === f
                ? 'border-accent/40 bg-accent/10 text-accent'
                : 'border-border bg-surface text-text-secondary hover:text-text-primary'
            }`}
          >
            {f === 'all' ? 'Todos' : f}
            <span className="ml-1.5 font-mono text-[10.5px] text-text-muted">
              {f === 'all' ? infraDetails.length : infraDetails.filter((i) => i.status === f).length}
            </span>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="grid grid-cols-[80px_1.4fr_2fr_100px_40px] border-b border-border bg-[#101115] px-4 py-2.5 text-[10.5px] font-medium uppercase tracking-wider text-text-muted">
          <div>Tipo</div>
          <div>Nome</div>
          <div>Detalhe</div>
          <div>Status</div>
          <div />
        </div>
        {filtered.map((i) => {
          const Icon = i.icon
          const dot = { ok: 'bg-success', degraded: 'bg-warning', warning: 'bg-warning' } as const
          return (
            <div
              key={i.name}
              className="group grid cursor-pointer grid-cols-[80px_1.4fr_2fr_100px_40px] items-center border-b border-border px-4 py-2.5 text-[13px] last:border-b-0 hover:bg-[#181A1F]"
            >
              <div className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 text-text-muted" />
                <span className="text-[11px] uppercase tracking-wider text-text-muted">{i.type}</span>
              </div>
              <div className="font-mono text-[12.5px] text-text-primary">{i.name}</div>
              <div className="truncate text-[11.5px] text-text-secondary">{i.meta}</div>
              <div className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${dot[i.status]}`} />
                <span className="text-[11.5px] text-text-secondary capitalize">{i.status}</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-text-muted opacity-0 group-hover:opacity-100" />
            </div>
          )
        })}
      </div>
    </section>
  )
}

function ApisTab() {
  const apis = [
    { path: '/v3/pix/payments', method: 'POST', version: 'v3', sla: '99.95%', p99: '142ms', rps: '4.2k', deprecated: false, sensorOk: true },
    { path: '/v3/pix/payments/{id}', method: 'GET', version: 'v3', sla: '99.99%', p99: '24ms', rps: '8.1k', deprecated: false, sensorOk: true },
    { path: '/v3/pix/keys', method: 'GET', version: 'v3', sla: '99.99%', p99: '38ms', rps: '2.4k', deprecated: false, sensorOk: true },
    { path: '/v3/pix/keys', method: 'POST', version: 'v3', sla: '99.9%', p99: '68ms', rps: '120', deprecated: false, sensorOk: true },
    { path: '/v3/pix/callback', method: 'POST', version: 'v3', sla: '99.95%', p99: '92ms', rps: '3.8k', deprecated: false, sensorOk: true },
    { path: '/v2/pix/refunds', method: 'POST', version: 'v2', sla: '99.9%', p99: '210ms', rps: '12', deprecated: true, sensorOk: false },
    { path: '/v2/pix/legacy-init', method: 'POST', version: 'v2', sla: '99.5%', p99: '480ms', rps: '4', deprecated: true, sensorOk: false },
  ]
  const methodColor = { POST: 'text-info bg-info/10 border-info/30', GET: 'text-success bg-success/10 border-success/30', PUT: 'text-warning bg-warning/10 border-warning/30', DELETE: 'text-failure bg-failure/10 border-failure/30' } as const
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="grid grid-cols-[70px_1.8fr_70px_90px_80px_80px_120px] border-b border-border bg-[#101115] px-4 py-2.5 text-[10.5px] font-medium uppercase tracking-wider text-text-muted">
        <div>Método</div>
        <div>Path</div>
        <div>Versão</div>
        <div>SLA</div>
        <div>p99</div>
        <div>RPS</div>
        <div>Sensores</div>
      </div>
      {apis.map((a, idx) => (
        <div
          key={idx}
          className="group grid cursor-pointer grid-cols-[70px_1.8fr_70px_90px_80px_80px_120px] items-center border-b border-border px-4 py-2.5 text-[13px] last:border-b-0 hover:bg-[#181A1F]"
        >
          <div>
            <span className={`rounded border px-1.5 py-0.5 font-mono text-[10.5px] font-medium ${methodColor[a.method as keyof typeof methodColor]}`}>
              {a.method}
            </span>
          </div>
          <div className="font-mono text-[12.5px] text-text-primary">{a.path}</div>
          <div>
            {a.deprecated ? (
              <span className="font-mono text-[10.5px] text-warning">{a.version} ⚠</span>
            ) : (
              <span className="font-mono text-[10.5px] text-text-secondary">{a.version}</span>
            )}
          </div>
          <div className="font-mono text-[12px] text-text-secondary">{a.sla}</div>
          <div className="font-mono text-[12px] text-text-secondary">{a.p99}</div>
          <div className="font-mono text-[12px] text-text-secondary">{a.rps}</div>
          <div className="flex items-center gap-1.5 text-[11.5px]">
            {a.sensorOk ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                <span className="text-success">3 OK</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                <span className="text-warning">2 warn</span>
              </>
            )}
          </div>
        </div>
      ))}
    </section>
  )
}

function DepsTab() {
  return (
    <section className="space-y-4">
      <Card title="Mapa de dependências" right={<span className="font-mono text-[11px] text-text-muted">10 imediatas · 24 transitivas</span>}>
        <DepMap />
      </Card>

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="grid grid-cols-[120px_1.4fr_100px_120px_100px] border-b border-border bg-[#101115] px-4 py-2.5 text-[10.5px] font-medium uppercase tracking-wider text-text-muted">
          <div>Direção</div>
          <div>SA</div>
          <div>Tipo</div>
          <div>Criticidade</div>
          <div>Latência p99</div>
        </div>
        {deps.map((d, i) => (
          <div
            key={d.sa + i}
            className="grid grid-cols-[120px_1.4fr_100px_120px_100px] items-center border-b border-border px-4 py-2.5 text-[13px] last:border-b-0 hover:bg-[#181A1F]"
          >
            <div className="flex items-center gap-1.5 text-[11.5px]">
              {d.dir === 'upstream' ? (
                <>
                  <ArrowLeftRight className="h-3.5 w-3.5 rotate-180 text-info" />
                  <span className="text-text-secondary">upstream</span>
                </>
              ) : (
                <>
                  <ArrowLeftRight className="h-3.5 w-3.5 text-accent" />
                  <span className="text-text-secondary">downstream</span>
                </>
              )}
            </div>
            <div className="font-mono text-[12.5px] text-text-primary">{d.sa}</div>
            <div className="font-mono text-[11.5px] text-text-secondary">{d.kind}</div>
            <div>
              {d.critical ? (
                <span className="rounded border border-failure/30 bg-failure/10 px-2 py-0.5 text-[11px] text-failure">crítica</span>
              ) : (
                <span className="rounded border border-border bg-[#22232A] px-2 py-0.5 text-[11px] text-text-muted">normal</span>
              )}
            </div>
            <div className="font-mono text-[12px] text-text-secondary">{(Math.random() * 120 + 8).toFixed(0)}ms</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function HistoryTab() {
  const history = [
    { ts: 'há 2m', icon: Rocket, color: 'info', text: 'Deploy v4.18.2 → prod', meta: 'kaptain · MR · success' },
    { ts: 'há 14m', icon: Clock3, color: 'warning', text: 'Aguardando aprovação Komply', meta: 'rollout-canary · awaiting tech lead' },
    { ts: 'há 38m', icon: Hammer, color: 'success', text: 'Build pipeline #4892 passou', meta: 'konstructor · 412 LOC modificadas' },
    { ts: 'há 2h', icon: Database, color: 'info', text: 'Migration pix-to-pix2 concluída', meta: 'migration · 4.2B rows · 24m 11s' },
    { ts: 'há 5h', icon: ShieldCheck, color: 'success', text: 'Patch CVE-2025-3148 aplicado', meta: 'komply · cleared by security-bot' },
    { ts: 'ontem 18:42', icon: XCircle, color: 'failure', text: 'Rollback de v4.18.0 falhou', meta: 'kaptain · traffic-shift error · LL' },
    { ts: 'ontem 16:18', icon: Pencil, color: 'info', text: 'Ownership atualizado', meta: 'transferido para Maria Ribeiro' },
    { ts: 'há 2d', icon: Network, color: 'success', text: 'Shadow traffic validado', meta: 'traffik · 4 sensores OK · MR' },
    { ts: 'há 3d', icon: Bot, color: 'info', text: 'Agente sugeriu refactor de pix-handler', meta: 'PR #1842 · awaiting review' },
    { ts: 'há 5d', icon: AlertTriangle, color: 'failure', text: 'Sensor performance FAIL', meta: 'p99 acima de SLO · auto-rollback' },
    { ts: 'há 7d', icon: Rocket, color: 'info', text: 'Deploy v4.17.9 → prod', meta: 'kaptain · scheduled release' },
  ]
  const colorMap = {
    info: 'text-info bg-info/15',
    success: 'text-success bg-success/15',
    warning: 'text-warning bg-warning/15',
    failure: 'text-failure bg-failure/15',
  } as const
  return (
    <section className="rounded-lg border border-border bg-surface">
      <ul className="divide-y divide-border">
        {history.map((h, i) => {
          const Icon = h.icon
          return (
            <li key={i} className="group flex items-center gap-4 px-5 py-3 hover:bg-[#181A1F]">
              <span className={`flex h-8 w-8 flex-none items-center justify-center rounded-md ${colorMap[h.color as keyof typeof colorMap]}`}>
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] text-text-primary">{h.text}</div>
                <div className="truncate text-[11.5px] text-text-muted">{h.meta}</div>
              </div>
              <span className="font-mono text-[11px] text-text-muted">{h.ts}</span>
              <ExternalLink className="h-3.5 w-3.5 text-text-muted opacity-0 transition group-hover:opacity-100" />
            </li>
          )
        })}
      </ul>
    </section>
  )
}
