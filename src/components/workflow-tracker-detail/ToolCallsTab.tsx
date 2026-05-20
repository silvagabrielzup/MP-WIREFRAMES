import { Card } from '../ui/card'
import { StatusIcon } from './StatusIcon'
import type { StepStatus } from './utils'

const rows: { ts: string; tool: string; step: string; status: StepStatus; dur: string }[] = [
  { ts: '0s', tool: 'github.clone', step: 'step-1', status: 'success', dur: '12s' },
  { ts: '12s', tool: 'konstructor.build', step: 'step-2 · iter 1', status: 'failed', dur: '34s' },
  { ts: '46s', tool: 'konstructor.build', step: 'step-2 · iter 2', status: 'failed', dur: '38s' },
  { ts: '1m 24s', tool: 'konstructor.build', step: 'step-2 · iter 3', status: 'success', dur: '35s' },
  { ts: '1m 59s', tool: 'konstructor.sbom', step: 'step-3', status: 'success', dur: '24s' },
  { ts: '2m 23s', tool: 'komply.evaluate', step: 'step-4', status: 'success', dur: '8s' },
  { ts: '2m 31s', tool: 'kaptain.deploy', step: 'step-5', status: 'running', dur: '2m 14s' },
]

export function ToolCallsTab() {
  return (
    <Card className="overflow-hidden p-0">
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="border-b border-border bg-[#101115] text-left text-[11px] uppercase tracking-wider text-text-muted">
            <th className="px-4 py-2.5 font-medium">t</th>
            <th className="px-4 py-2.5 font-medium">Tool</th>
            <th className="px-4 py-2.5 font-medium">Step</th>
            <th className="px-4 py-2.5 font-medium">Status</th>
            <th className="px-4 py-2.5 font-medium text-right">Duração</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-border last:border-b-0 hover:bg-[#181A1F]">
              <td className="px-4 py-2.5 font-mono text-text-muted">{r.ts}</td>
              <td className="px-4 py-2.5 font-mono text-text-primary">{r.tool}</td>
              <td className="px-4 py-2.5 font-mono text-text-secondary">{r.step}</td>
              <td className="px-4 py-2.5">
                <StatusIcon status={r.status} />
              </td>
              <td className="px-4 py-2.5 text-right font-mono text-text-secondary">{r.dur}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
