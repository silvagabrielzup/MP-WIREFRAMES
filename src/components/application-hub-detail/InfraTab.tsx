import { ArrowRight } from 'lucide-react'
import { Card } from '../ui/card'
import { infra, infraStatusDot } from './utils'

export function InfraTab() {
  return (
    <Card className="overflow-hidden p-0">
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="border-b border-border bg-[#101115] text-left text-[11px] uppercase tracking-wider text-text-muted">
            <th className="px-4 py-2.5 font-medium">Recurso</th>
            <th className="px-4 py-2.5 font-medium">Tipo</th>
            <th className="px-4 py-2.5 font-medium">Motor</th>
            <th className="px-4 py-2.5 font-medium">Status</th>
            <th className="px-4 py-2.5 font-medium">Meta</th>
            <th className="px-4 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {infra.map((p) => (
            <tr key={p.id} className="group border-b border-border last:border-b-0 hover:bg-[#181A1F]">
              <td className="px-4 py-2.5 font-mono text-text-primary">{p.name}</td>
              <td className="px-4 py-2.5">
                <span className="rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[10.5px] text-text-secondary">
                  {p.type}
                </span>
              </td>
              <td className="px-4 py-2.5 text-text-secondary">{p.engine}</td>
              <td className="px-4 py-2.5">
                <span className="inline-flex items-center gap-2 text-[12px]">
                  <span className={`h-1.5 w-1.5 rounded-full ${infraStatusDot[p.status]}`} />
                  {p.status}
                </span>
              </td>
              <td className="px-4 py-2.5 text-text-muted">{p.meta}</td>
              <td className="px-4 py-2.5 text-right opacity-0 transition group-hover:opacity-100">
                <span className="inline-flex items-center gap-1 text-[11.5px] text-text-muted hover:text-text-primary">
                  ver
                  <ArrowRight className="h-3 w-3" />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
