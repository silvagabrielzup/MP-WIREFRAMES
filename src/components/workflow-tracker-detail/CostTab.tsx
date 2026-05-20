import { Card } from '../ui/card'

const rows = [
  { step: 'step-1', tool: 'github.clone', tokens: 0, brl: 0.0, latency: '12s' },
  { step: 'step-2', tool: 'konstructor.build', tokens: 24800, brl: 0.42, latency: '1m 47s' },
  { step: 'step-3', tool: 'konstructor.sbom', tokens: 1240, brl: 0.04, latency: '24s' },
  { step: 'step-4', tool: 'komply.evaluate', tokens: 8200, brl: 0.18, latency: '8s' },
  { step: 'step-5', tool: 'kaptain.deploy', tokens: 11900, brl: 0.27, latency: '2m 14s (em curso)' },
]

export function CostTab() {
  const totalTokens = rows.reduce((a, b) => a + b.tokens, 0)
  const totalBrl = rows.reduce((a, b) => a + b.brl, 0)
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="px-4 py-3">
          <div className="text-[10.5px] uppercase tracking-wider text-text-muted">tokens</div>
          <div className="mt-0.5 font-mono text-[20px] text-text-primary">{totalTokens.toLocaleString()}</div>
        </Card>
        <Card className="px-4 py-3">
          <div className="text-[10.5px] uppercase tracking-wider text-text-muted">custo estimado</div>
          <div className="mt-0.5 font-mono text-[20px] text-text-primary">R$ {totalBrl.toFixed(2)}</div>
        </Card>
        <Card className="px-4 py-3">
          <div className="text-[10.5px] uppercase tracking-wider text-text-muted">latência total</div>
          <div className="mt-0.5 font-mono text-[20px] text-text-primary">4m 39s</div>
        </Card>
      </div>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="border-b border-border bg-[#101115] text-left text-[11px] uppercase tracking-wider text-text-muted">
              <th className="px-4 py-2.5 font-medium">Step</th>
              <th className="px-4 py-2.5 font-medium">Tool</th>
              <th className="px-4 py-2.5 font-medium text-right">Tokens</th>
              <th className="px-4 py-2.5 font-medium text-right">R$</th>
              <th className="px-4 py-2.5 font-medium text-right">Latência</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-border last:border-b-0 hover:bg-[#181A1F]">
                <td className="px-4 py-2.5 font-mono text-text-primary">{r.step}</td>
                <td className="px-4 py-2.5 font-mono text-text-secondary">{r.tool}</td>
                <td className="px-4 py-2.5 text-right font-mono text-text-secondary">{r.tokens.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right font-mono text-text-secondary">R$ {r.brl.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-right font-mono text-text-muted">{r.latency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
