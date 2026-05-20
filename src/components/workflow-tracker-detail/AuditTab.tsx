import { Clock3, ShieldCheck } from 'lucide-react'
import { Card } from '../ui/card'

const rows = [
  { kind: 'approval', who: 'Luigi · LL', what: 'Aprovou policy override · network egress', step: 'step-4', ago: '8min' },
  { kind: 'policy', who: 'komply', what: 'Policy evaluation passed', step: 'step-4', ago: '8min' },
  { kind: 'approval', who: 'aguardando · MR', what: 'Aprovar traffic-shift 50%', step: 'step-9', ago: '—' },
]

export function AuditTab() {
  return (
    <ol className="space-y-2">
      {rows.map((r, i) => (
        <Card key={i} className="flex items-center gap-3 px-4 py-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-warning/15 text-warning">
            {r.kind === 'approval' ? <Clock3 className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[12.5px] text-text-primary">{r.what}</div>
            <div className="text-[11.5px] text-text-muted">
              {r.who} · <span className="font-mono">{r.step}</span>
            </div>
          </div>
          <span className="font-mono text-[11px] text-text-muted">{r.ago}</span>
        </Card>
      ))}
    </ol>
  )
}
