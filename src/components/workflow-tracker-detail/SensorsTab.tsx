import { ShieldCheck } from 'lucide-react'
import { Card } from '../ui/card'

const rows = [
  { sensor: 'cve-scan-deps', step: 'step-3', verdict: 'pass', detail: '0 critical · 2 high (whitelisted)' },
  { sensor: 'policy-gate', step: 'step-4', verdict: 'pass', detail: 'network egress: ok · komply v1.4.0' },
  { sensor: 'slo-baseline', step: 'step-5', verdict: 'warn', detail: 'p95 acima do baseline em hml' },
]

export function SensorsTab() {
  return (
    <div className="space-y-2">
      {rows.map((r, i) => (
        <Card
          key={i}
          className="flex items-center justify-between gap-3 px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#181A1F] text-text-secondary">
              <ShieldCheck className="h-3.5 w-3.5" />
            </span>
            <div>
              <div className="font-mono text-[12.5px] text-text-primary">{r.sensor}</div>
              <div className="text-[11.5px] text-text-muted">{r.detail}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-text-muted">{r.step}</span>
            <span
              className={`rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                r.verdict === 'pass'
                  ? 'border-success/30 bg-success/10 text-success'
                  : r.verdict === 'warn'
                  ? 'border-warning/30 bg-warning/10 text-warning'
                  : 'border-failure/30 bg-failure/10 text-failure'
              }`}
            >
              {r.verdict}
            </span>
          </div>
        </Card>
      ))}
    </div>
  )
}
