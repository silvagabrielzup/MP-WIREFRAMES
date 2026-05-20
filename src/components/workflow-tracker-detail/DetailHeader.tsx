import {
  AlertTriangle,
  Download,
  Loader2,
  MoreHorizontal,
  RotateCw,
  Workflow as WorkflowIcon,
} from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'

export function DetailHeader({ wfId }: { wfId: string }) {
  return (
    <Card className="px-5 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <WorkflowIcon className="h-4 w-4 text-accent" />
            <h1 className="font-mono text-[20px] text-text-primary">{wfId}</h1>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-info/30 bg-info/10 px-2.5 py-1 text-[11.5px] font-medium uppercase tracking-wide text-info">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              running
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-live/30 bg-live/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-live">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-live opacity-80" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
              </span>
              live · updated 1s ago
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-text-muted">
            <span className="rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[10.5px]">
              onboarding-vanilla-brownfield
            </span>
            <span>·</span>
            <span className="font-mono">ssa-pix-core</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/25 text-[9.5px] font-medium text-accent">
                LL
              </span>
              Luigi
            </span>
            <span>·</span>
            <span>iniciado há 4min 21s</span>
            <span>·</span>
            <span className="font-mono">duração 4m 39s</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            <RotateCw />
            Replay
          </Button>
          <Button variant="outline" size="sm">
            <AlertTriangle />
            Annotate as failure
          </Button>
          <Button variant="outline" size="sm">
            <Download />
            Export trace
          </Button>
          <Button variant="outline" size="icon" aria-label="mais opções" className="h-8 w-8">
            <MoreHorizontal />
          </Button>
        </div>
      </div>
    </Card>
  )
}
