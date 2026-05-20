import { ArrowLeft, Clock3, Rocket } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { healthChip, type AppDetail } from './utils'

export function DetailHeader({ app }: { app: AppDetail }) {
  return (
    <Card className="px-5 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Link
            to="/application-hub"
            className="mt-1 flex h-7 w-7 items-center justify-center rounded-md border border-border bg-bg text-text-muted hover:text-text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-[20px] text-text-primary">{app.sa}</h1>
              {app.onPlat && (
                <span className="rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent">
                  on-plat
                </span>
              )}
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide ${healthChip[app.health]}`}
              >
                {app.health}
              </span>
            </div>
            <p className="mt-1 max-w-[640px] text-[12.5px] text-text-secondary">{app.description}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-text-muted">
              <span>{app.squad}</span>
              <span>·</span>
              <span>{app.tribo}</span>
              <span>·</span>
              <span>último deploy há {app.lastDeploy}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            <Clock3 />
            Pausar alertas
          </Button>
          <Button size="sm">
            <Rocket />
            Disparar workflow
          </Button>
        </div>
      </div>
    </Card>
  )
}
