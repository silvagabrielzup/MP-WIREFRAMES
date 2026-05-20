import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ApplicationHub } from '../../data/database'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { HealthPill, LivePulse } from './atoms'
import { HEALTH_META } from './utils'

function ApplicationRow({
  app,
  isRecentlyMigrated,
}: {
  app: ApplicationHub
  isRecentlyMigrated: boolean
}) {
  const meta = HEALTH_META[app.health]
  return (
    <tr className="group border-b border-border last:border-b-0 hover:bg-[#181A1F]">
      <td className="px-4 py-2.5">
        <Link to={`/application-hub/${app.sa}`} className="block">
          <div className="flex items-center gap-2">
            <span className="text-text-primary">{app.name}</span>
            {app.onPlat && (
              <span className="rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-accent">
                on-plat
              </span>
            )}
            {isRecentlyMigrated && (
              <span className="inline-flex items-center gap-1 rounded border border-success/30 bg-success/10 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-success">
                <Sparkles className="h-2.5 w-2.5" />
                recém-migrada
              </span>
            )}
          </div>
          <div className="mt-0.5 font-mono text-[10.5px] text-text-muted">{app.sa}</div>
        </Link>
      </td>
      <td className="px-4 py-2.5 text-text-secondary">{app.squad}</td>
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-2">
          <HealthPill status={app.health} />
          {app.liveIncident && (
            <span className="inline-flex items-center gap-1 text-[10.5px] uppercase tracking-wider text-failure">
              <LivePulse />
              live
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-2.5 text-right font-mono text-text-primary">{app.uptime.toFixed(2)}%</td>
      <td className="px-4 py-2.5 text-right font-mono text-text-secondary">{app.p95Ms}ms</td>
      <td className={`px-4 py-2.5 text-right font-mono ${meta.text}`}>{app.errorRate.toFixed(2)}%</td>
      <td className="px-4 py-2.5 text-right font-mono text-text-secondary">{app.deploys7d}</td>
      <td className="px-4 py-2.5 text-right">
        <Link
          to={`/application-hub/${app.sa}`}
          className="inline-flex items-center gap-1 text-[11.5px] text-text-muted opacity-0 transition group-hover:opacity-100 hover:text-text-primary"
        >
          detalhe
          <ArrowRight className="h-3 w-3" />
        </Link>
      </td>
    </tr>
  )
}

// Tabela de aplicações on-platform — `aplication-hub.md` §Tabela.
// 8 colunas; nome da SA é `<Link>` clicável; CTA "detalhe" aparece em hover.
export function ApplicationsTable({
  apps,
  recentlyMigratedSAs,
}: {
  apps: ApplicationHub[]
  recentlyMigratedSAs: Set<string>
}) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-semibold tracking-tight">Aplicações</h2>
          <span className="text-[12px] text-text-muted">{apps.length} on-platform</span>
        </div>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-[11.5px]">
          ver todas
        </Button>
      </div>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="border-b border-border bg-[#101115] text-left text-[11px] uppercase tracking-wider text-text-muted">
              <th className="px-4 py-2.5 font-medium">Aplicação</th>
              <th className="px-4 py-2.5 font-medium">Squad</th>
              <th className="px-4 py-2.5 font-medium">Saúde</th>
              <th className="px-4 py-2.5 text-right font-medium">Uptime</th>
              <th className="px-4 py-2.5 text-right font-medium">p95</th>
              <th className="px-4 py-2.5 text-right font-medium">Erro %</th>
              <th className="px-4 py-2.5 text-right font-medium">Deploys 7d</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {apps.map((app) => (
              <ApplicationRow
                key={app.id}
                app={app}
                isRecentlyMigrated={recentlyMigratedSAs.has(app.sa)}
              />
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  )
}
