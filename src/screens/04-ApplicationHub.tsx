import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  ArrowRight,
  Search,
  Boxes,
  Sparkles,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
import { type ApplicationHub, type ApplicationHubHealth } from '../data/database'
import { useWorkflows } from '../contexts/WorkflowsProvider'

/** Latência simulada da query do backend de Application Hubs. */
const QUERY_LATENCY_MS = 600

const healthMeta: Record<
  ApplicationHubHealth,
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

function LivePulse() {
  return (
    <span className="relative flex h-1.5 w-1.5">
      <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-failure opacity-80" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-failure" />
    </span>
  )
}

function HealthPill({ status }: { status: ApplicationHubHealth }) {
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

function StatRow({ apps }: { apps: ApplicationHub[] }) {
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
  const { applicationHubs, workflows } = useWorkflows()

  // Query simulada: filtra hubs direto pela própria entidade
  // (`status === 'completed'`). Não cruza mais com `workflows` — o estado
  // do hub é canônico. Wireframe — em produção isso seria um fetch real.
  const [isLoading, setIsLoading] = useState(true)
  const [displayedHubs, setDisplayedHubs] = useState<ApplicationHub[]>([])
  useEffect(() => {
    setIsLoading(true)
    const timer = window.setTimeout(() => {
      setDisplayedHubs(applicationHubs.filter((h) => h.status === 'completed'))
      setIsLoading(false)
    }, QUERY_LATENCY_MS)

    console.log(applicationHubs)
    return () => window.clearTimeout(timer)
  }, [applicationHubs])

  // SAs recém-migrados: workflow de execução `wf-onboarding-vanilla-exec`
  // concluído → hub provisionado pelo provider.
  const recentlyMigratedSAs = new Set(
    workflows
      .filter((w) => w.status === 'completed')
      .map((w) => {
        const saInput = w.name.match(/ssa-[a-z0-9-]+/i)
        return saInput ? saInput[0] : 'ssa-pix-core'
      }),
  )

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

      {isLoading ? (
        <section className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-surface px-6 py-16 text-center">
          <Loader2 className="h-5 w-5 animate-spin text-accent" />
          <div className="text-[13px] font-medium text-text-secondary">
            Consultando Application Hubs…
          </div>
          <div className="font-mono text-[10.5px] text-text-muted">
            GET /api/application-hubs?status=completed
          </div>
        </section>
      ) : displayedHubs.length === 0 ? (
        <section className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-surface px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-[#181A1F]">
            <Boxes className="h-5 w-5 text-text-muted" />
          </span>
          <h3 className="text-[15px] font-semibold tracking-tight text-text-primary">
            Nenhuma aplicação on-platform
          </h3>
          <p className="max-w-[460px] text-[12.5px] text-text-secondary">
            Application Hubs aparecem aqui depois que uma SA conclui o onboarding Vanilla e tem
            o pipeline de provisionamento finalizado.
          </p>
        </section>
      ) : (
        <>
          {recentlyMigratedSAs.size > 0 && (
            <div className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/[0.08] px-4 py-3">
              <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-md bg-success/15 text-success">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium text-text-primary">
                  {recentlyMigratedSAs.size === 1
                    ? 'Aplicação migrada para a StackSpot'
                    : `${recentlyMigratedSAs.size} aplicações migradas para a StackSpot`}
                </div>
                <div className="mt-0.5 text-[11.5px] text-text-secondary">
                  {[...recentlyMigratedSAs].map((sa) => (
                    <span
                      key={sa}
                      className="mr-1.5 inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 font-mono text-[10.5px] text-success"
                    >
                      <Sparkles className="h-2.5 w-2.5" />
                      {sa}
                    </span>
                  ))}
                  <span>· agora visível na lista abaixo.</span>
                </div>
              </div>
            </div>
          )}
          <StatRow apps={displayedHubs} />

          <section>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <h2 className="text-[15px] font-semibold tracking-tight">Aplicações</h2>
                <span className="text-[12px] text-text-muted">
                  {displayedHubs.length} on-platform
                </span>
              </div>
              <button className="text-[11.5px] text-text-secondary hover:text-text-primary">
                ver todas
              </button>
            </div>

            <div className="overflow-hidden rounded-lg border border-border bg-surface">
              <table className="w-full text-[12.5px]">
                <thead>
                  <tr className="border-b border-border bg-[#101115] text-left text-[11px] uppercase tracking-wider text-text-muted">
                    <th className="px-4 py-2.5 font-medium">Aplicação</th>
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
                  {displayedHubs.map((a) => {
                    const meta = healthMeta[a.health]
                    return (
                      <tr key={a.id} className="group border-b border-border last:border-b-0 hover:bg-[#181A1F]">
                        <td className="px-4 py-2.5">
                          <Link to={`/application-hub/${a.sa}`} className="block">
                            <div className="flex items-center gap-2">
                              <span className="text-text-primary">{a.name}</span>
                              {a.onPlat && (
                                <span className="rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-accent">
                                  on-plat
                                </span>
                              )}
                              {recentlyMigratedSAs.has(a.sa) && (
                                <span className="inline-flex items-center gap-1 rounded border border-success/30 bg-success/10 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-success">
                                  <Sparkles className="h-2.5 w-2.5" />
                                  recém-migrada
                                </span>
                              )}
                            </div>
                            <div className="mt-0.5 font-mono text-[10.5px] text-text-muted">{a.sa}</div>
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
        </>
      )}

    </div>
  )
}
