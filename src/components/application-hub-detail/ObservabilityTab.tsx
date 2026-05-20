import { Activity, CheckCircle2, ListOrdered } from 'lucide-react'
import { Card } from '../ui/card'
import { ObsLink } from './ObsLink'

export function ObservabilityTab() {
  return (
    <div className="space-y-4">
      <Card className="block p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-info" />
            <h3 className="text-[13.5px] font-semibold tracking-tight">Datadog — dashboards & monitors</h3>
          </div>
          <span className="text-[11px] text-text-muted">link direto</span>
        </div>
        <div className="grid grid-cols-1 gap-2 px-4 py-3 sm:grid-cols-2">
          <ObsLink label="Dashboard · pix-core overview" />
          <ObsLink label="Dashboard · pix-core SLO" />
          <ObsLink label="Monitor · p99 latency" />
          <ObsLink label="Monitor · error rate" />
          <ObsLink label="Monitor · kafka lag" />
          <ObsLink label="Monitor · DDB throttle" />
        </div>
      </Card>

      <Card className="block p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <ListOrdered className="h-3.5 w-3.5 text-text-muted" />
            <h3 className="text-[13.5px] font-semibold tracking-tight">Logs & traces</h3>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 px-4 py-3 sm:grid-cols-2">
          <ObsLink label="Logs · pix-core errors (1h)" />
          <ObsLink label="Logs · pix-core all (15m)" />
          <ObsLink label="Traces · pix-core slow (1h)" />
          <ObsLink label="Traces · pix-core errors (1h)" />
        </div>
      </Card>

      <Card className="px-4 py-3 text-[12px] text-text-muted">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
          <span>Instrumentação OK · traces, métricas e logs reportando há 9s.</span>
        </div>
      </Card>
    </div>
  )
}
