import { Link } from 'react-router-dom'
import {
  ChevronRight,
  Activity,
  ArrowRight,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Rocket,
  ShieldCheck,
  Hammer,
  Container,
  Network,
  Database,
  ArrowLeftRight,
  Layers,
} from 'lucide-react'

type HealthStatus = 'healthy' | 'warn' | 'fail'

type App = {
  id: string
  sa: string
  squad: string
  onPlat: boolean
  health: HealthStatus
  liveIncident: boolean
  uptime: number
  p95Ms: number
  errorRate: number
  deploys7d: number
}

const apps: App[] = [
  {
    id: 'ssa-pix-core',
    sa: 'ssa-pix-core',
    squad: 'squad-pix',
    onPlat: true,
    health: 'warn',
    liveIncident: true,
    uptime: 99.92,
    p95Ms: 184,
    errorRate: 0.42,
    deploys7d: 6,
  },
  {
    id: 'ssa-conta-corrente',
    sa: 'ssa-conta-corrente',
    squad: 'squad-cc',
    onPlat: true,
    health: 'healthy',
    liveIncident: false,
    uptime: 99.99,
    p95Ms: 92,
    errorRate: 0.08,
    deploys7d: 11,
  },
  {
    id: 'ssa-investimentos',
    sa: 'ssa-investimentos',
    squad: 'squad-invest',
    onPlat: true,
    health: 'fail',
    liveIncident: true,
    uptime: 99.62,
    p95Ms: 412,
    errorRate: 2.31,
    deploys7d: 2,
  },
  {
    id: 'ssa-credito-prefixado',
    sa: 'ssa-credito-prefixado',
    squad: 'squad-credito',
    onPlat: true,
    health: 'healthy',
    liveIncident: false,
    uptime: 99.97,
    p95Ms: 121,
    errorRate: 0.11,
    deploys7d: 8,
  },
  {
    id: 'ssa-cartoes',
    sa: 'ssa-cartoes',
    squad: 'squad-cartoes',
    onPlat: false,
    health: 'warn',
    liveIncident: false,
    uptime: 99.81,
    p95Ms: 247,
    errorRate: 0.74,
    deploys7d: 3,
  },
  {
    id: 'ssa-seguros',
    sa: 'ssa-seguros',
    squad: 'squad-seguros',
    onPlat: true,
    health: 'healthy',
    liveIncident: false,
    uptime: 99.96,
    p95Ms: 108,
    errorRate: 0.13,
    deploys7d: 5,
  },
  {
    id: 'ssa-onboarding-digital',
    sa: 'ssa-onboarding-digital',
    squad: 'squad-onboarding',
    onPlat: true,
    health: 'healthy',
    liveIncident: false,
    uptime: 99.94,
    p95Ms: 156,
    errorRate: 0.21,
    deploys7d: 9,
  },
  {
    id: 'ssa-12345',
    sa: 'ssa-12345',
    squad: 'squad-platform',
    onPlat: false,
    health: 'warn',
    liveIncident: false,
    uptime: 99.78,
    p95Ms: 271,
    errorRate: 0.91,
    deploys7d: 1,
  },
]

type ControlPlane = {
  id: string
  name: string
  description: string
  status: 'ok' | 'degraded' | 'down'
  icon: typeof Rocket
  runs7d: number
  successRate: number
  lastCheck: string
}

const controlPlanes: ControlPlane[] = [
  {
    id: 'kaptain',
    name: 'Kaptain',
    description: 'CD / AWS',
    status: 'ok',
    icon: Rocket,
    runs7d: 1284,
    successRate: 98.7,
    lastCheck: '12s',
  },
  {
    id: 'komply',
    name: 'Komply',
    description: 'Policies',
    status: 'ok',
    icon: ShieldCheck,
    runs7d: 2150,
    successRate: 99.4,
    lastCheck: '18s',
  },
  {
    id: 'konstructor',
    name: 'Konstructor',
    description: 'Build',
    status: 'ok',
    icon: Hammer,
    runs7d: 3420,
    successRate: 97.9,
    lastCheck: '9s',
  },
  {
    id: 'orkestra',
    name: 'Orkestra',
    description: 'Kubernetes',
    status: 'degraded',
    icon: Container,
    runs7d: 890,
    successRate: 94.2,
    lastCheck: '34s',
  },
  {
    id: 'traffik',
    name: 'Traffik',
    description: 'Routing / DNS',
    status: 'ok',
    icon: Network,
    runs7d: 540,
    successRate: 99.8,
    lastCheck: '6s',
  },
  {
    id: 'pantheon',
    name: 'Pantheon',
    description: 'Kafka',
    status: 'degraded',
    icon: Database,
    runs7d: 1740,
    successRate: 91.6,
    lastCheck: '2min',
  },
  {
    id: 'migration',
    name: 'Migration',
    description: 'Data migration',
    status: 'ok',
    icon: ArrowLeftRight,
    runs7d: 92,
    successRate: 96.3,
    lastCheck: '47s',
  },
]

const healthMeta: Record<
  HealthStatus,
  { dot: string; label: string; text: string; pill: string }
> = {
  healthy: {
    dot: 'bg-success',
    label: 'healthy',
    text: 'text-success',
    pill: 'border-success/30 bg-success/10 text-success',
  },
  warn: {
    dot: 'bg-warning',
    label: 'warn',
    text: 'text-warning',
    pill: 'border-warning/30 bg-warning/10 text-warning',
  },
  fail: {
    dot: 'bg-failure',
    label: 'fail',
    text: 'text-failure',
    pill: 'border-failure/30 bg-failure/10 text-failure',
  },
}

const cpStatusMeta: Record<
  ControlPlane['status'],
  { dot: string; pill: string; icon: typeof CheckCircle2 }
> = {
  ok: {
    dot: 'bg-success',
    pill: 'border-success/30 bg-success/10 text-success',
    icon: CheckCircle2,
  },
  degraded: {
    dot: 'bg-warning',
    pill: 'border-warning/30 bg-warning/10 text-warning',
    icon: AlertTriangle,
  },
  down: {
    dot: 'bg-failure',
    pill: 'border-failure/30 bg-failure/10 text-failure',
    icon: XCircle,
  },
}

function LivePulse() {
  return (
    <span className="relative flex h-1.5 w-1.5">
      <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-failure opacity-80" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-failure" />
    </span>
  )
}

function HealthPill({ status }: { status: HealthStatus }) {
  const m = healthMeta[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide ${m.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  )
}

function StatRow({ apps }: { apps: App[] }) {
  const healthy = apps.filter((a) => a.health === 'healthy').length
  const warn = apps.filter((a) => a.health === 'warn').length
  const fail = apps.filter((a) => a.health === 'fail').length
  const onPlat = apps.filter((a) => a.onPlat).length
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Stat label="Aplicações" value={apps.length.toString()} hint={`${onPlat} on-plat`} />
      <Stat label="Healthy" value={healthy.toString()} hint="último 5min" color="success" />
      <Stat label="Warn" value={warn.toString()} hint="último 5min" color="warning" />
      <Stat label="Fail" value={fail.toString()} hint="último 5min" color="failure" />
    </div>
  )
}

function Stat({
  label,
  value,
  hint,
  color = 'text',
}: {
  label: string
  value: string
  hint: string
  color?: 'text' | 'success' | 'warning' | 'failure'
}) {
  const tone =
    color === 'success'
      ? 'text-success'
      : color === 'warning'
      ? 'text-warning'
      : color === 'failure'
      ? 'text-failure'
      : 'text-text-primary'
  return (
    <div className="rounded-lg border border-border bg-surface px-4 py-3">
      <div className="text-[11px] uppercase tracking-wider text-text-muted">{label}</div>
      <div className={`mt-1 font-mono text-[20px] tracking-tight ${tone}`}>{value}</div>
      <div className="mt-0.5 text-[11px] text-text-muted">{hint}</div>
    </div>
  )
}

export default function ApplicationHub() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-1.5 text-[11.5px] text-text-muted">
          <span>Application Hub</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-text-secondary">Visão geral</span>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[24px] font-semibold tracking-tight">Application Hub</h1>
            <p className="mt-1 max-w-[680px] text-[13px] text-text-secondary">
              Centro de operações pós-migração. Visualize saúde, dependências e contexto técnico
              de cada aplicação — substituindo os control planes antigos.
            </p>
          </div>
          <div className="relative w-full max-w-[320px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Buscar SA, owner, tag…"
              className="h-9 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-[12.5px] placeholder:text-text-muted focus:border-border-strong focus:outline-none"
            />
          </div>
        </div>
      </header>

      <StatRow apps={apps} />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[15px] font-semibold tracking-tight">Aplicações</h2>
            <span className="text-[12px] text-text-muted">{apps.length} on-platform</span>
          </div>
          <button className="text-[11.5px] text-text-secondary hover:text-text-primary">
            ver todas
          </button>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="border-b border-border bg-[#101115] text-left text-[11px] uppercase tracking-wider text-text-muted">
                <th className="px-4 py-2.5 font-medium">SA</th>
                <th className="px-4 py-2.5 font-medium">Squad</th>
                <th className="px-4 py-2.5 font-medium">Saúde</th>
                <th className="px-4 py-2.5 font-medium text-right">Uptime</th>
                <th className="px-4 py-2.5 font-medium text-right">p95</th>
                <th className="px-4 py-2.5 font-medium text-right">Erro %</th>
                <th className="px-4 py-2.5 font-medium text-right">Deploys 7d</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {apps.map((a) => {
                const meta = healthMeta[a.health]
                return (
                  <tr key={a.id} className="group border-b border-border last:border-b-0 hover:bg-[#181A1F]">
                    <td className="px-4 py-2.5">
                      <Link to={`/application-hub/${a.sa}`} className="flex items-center gap-2">
                        <span className="font-mono text-text-primary">{a.sa}</span>
                        {a.onPlat && (
                          <span className="rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-accent">
                            on-plat
                          </span>
                        )}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 text-text-secondary">{a.squad}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <HealthPill status={a.health} />
                        {a.liveIncident && (
                          <span className="inline-flex items-center gap-1 text-[10.5px] uppercase tracking-wider text-failure">
                            <LivePulse />
                            live
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-text-primary">{a.uptime.toFixed(2)}%</td>
                    <td className="px-4 py-2.5 text-right font-mono text-text-secondary">{a.p95Ms}ms</td>
                    <td className={`px-4 py-2.5 text-right font-mono ${meta.text}`}>{a.errorRate.toFixed(2)}%</td>
                    <td className="px-4 py-2.5 text-right font-mono text-text-secondary">{a.deploys7d}</td>
                    <td className="px-4 py-2.5 text-right">
                      <Link
                        to={`/application-hub/${a.sa}`}
                        className="inline-flex items-center gap-1 text-[11.5px] text-text-muted opacity-0 transition group-hover:opacity-100 hover:text-text-primary"
                      >
                        detalhe
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2.5">
          <Layers className="h-3.5 w-3.5 text-text-muted" />
          <h2 className="text-[15px] font-semibold tracking-tight">Saúde dos control planes</h2>
          <span className="flex items-center gap-1.5 rounded-full border border-live/30 bg-live/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-live">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-live opacity-80" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
            </span>
            live
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {controlPlanes.map((cp) => {
            const Icon = cp.icon
            const StatusIcon = cpStatusMeta[cp.status].icon
            const meta = cpStatusMeta[cp.status]
            return (
              <div
                key={cp.id}
                className="rounded-lg border border-border bg-surface px-4 py-3.5 transition hover:border-border-strong"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-md bg-[#181A1F] text-text-secondary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-[13.5px] font-semibold tracking-tight">{cp.name}</div>
                      <div className="text-[11.5px] text-text-muted">{cp.description}</div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide ${meta.pill}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {cp.status}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="font-mono text-[14px] text-text-primary">{cp.runs7d}</div>
                    <div className="text-[10px] uppercase tracking-wider text-text-muted">runs 7d</div>
                  </div>
                  <div>
                    <div className="font-mono text-[14px] text-text-primary">{cp.successRate.toFixed(1)}%</div>
                    <div className="text-[10px] uppercase tracking-wider text-text-muted">sucesso</div>
                  </div>
                  <div>
                    <div className="font-mono text-[14px] text-text-secondary">{cp.lastCheck}</div>
                    <div className="text-[10px] uppercase tracking-wider text-text-muted">há</div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5 text-[11.5px] text-text-muted">
                  <span className="inline-flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    pings 1m
                  </span>
                  <button className="text-text-secondary hover:text-text-primary">detalhe operacional</button>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
