import { Sparkles } from 'lucide-react'
import { Card } from '../ui/card'
import type { TabKey } from './utils'

export function EmptyAssetList({ kind }: { kind: TabKey }) {
  return (
    <Card className="flex flex-col items-center justify-center gap-2 border-dashed bg-surface/40 px-6 py-12 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-[#181A1F]">
        <Sparkles className="h-4 w-4 text-text-muted" />
      </span>
      <div className="text-[13px] font-medium text-text-secondary">Catálogo de {kind} em construção</div>
      <div className="max-w-[360px] text-[11.5px] text-text-muted">
        O schema desses assets já está definido. À medida que squads contribuírem, eles aparecem aqui.
      </div>
    </Card>
  )
}
