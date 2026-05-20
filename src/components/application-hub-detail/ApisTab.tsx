import { Card } from '../ui/card'
import { apis, methodColor } from './utils'

export function ApisTab() {
  return (
    <Card className="overflow-hidden p-0">
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="border-b border-border bg-[#101115] text-left text-[11px] uppercase tracking-wider text-text-muted">
            <th className="px-4 py-2.5 font-medium">Endpoint</th>
            <th className="px-4 py-2.5 font-medium">Versão</th>
            <th className="px-4 py-2.5 font-medium text-right">Consumidores</th>
            <th className="px-4 py-2.5 font-medium text-right">p99</th>
            <th className="px-4 py-2.5 font-medium text-right">SLA</th>
          </tr>
        </thead>
        <tbody>
          {apis.map((a) => (
            <tr key={a.id} className="border-b border-border last:border-b-0 hover:bg-[#181A1F]">
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex w-14 justify-center rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${methodColor[a.method]}`}
                  >
                    {a.method}
                  </span>
                  <span className="font-mono text-text-primary">{a.path}</span>
                </div>
              </td>
              <td className="px-4 py-2.5 font-mono text-text-secondary">{a.version}</td>
              <td className="px-4 py-2.5 text-right font-mono text-text-secondary">{a.consumers}</td>
              <td
                className={`px-4 py-2.5 text-right font-mono ${a.p99 > a.sla ? 'text-failure' : 'text-text-primary'}`}
              >
                {a.p99}ms
              </td>
              <td className="px-4 py-2.5 text-right font-mono text-text-muted">{a.sla}ms</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
