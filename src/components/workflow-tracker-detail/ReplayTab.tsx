import { Download, Play, RotateCw } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'

export function ReplayTab() {
  return (
    <Card className="px-5 py-6">
      <div className="flex items-center gap-2">
        <RotateCw className="h-4 w-4 text-accent" />
        <h3 className="text-[14px] font-semibold tracking-tight">Estado capturado</h3>
      </div>
      <p className="mt-1.5 max-w-[640px] text-[12.5px] text-text-secondary">
        Snapshot completo de inputs, outputs e contexto dos motores. Use para re-executar o workflow a partir de qualquer step.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-border bg-bg px-3 py-2.5">
          <div className="text-[10.5px] uppercase tracking-wider text-text-muted">snapshot</div>
          <div className="mt-0.5 font-mono text-[12.5px] text-text-primary">snap-9f3a4c</div>
        </div>
        <div className="rounded-md border border-border bg-bg px-3 py-2.5">
          <div className="text-[10.5px] uppercase tracking-wider text-text-muted">tamanho</div>
          <div className="mt-0.5 font-mono text-[12.5px] text-text-primary">12.4 MB</div>
        </div>
        <div className="rounded-md border border-border bg-bg px-3 py-2.5">
          <div className="text-[10.5px] uppercase tracking-wider text-text-muted">capturado em</div>
          <div className="mt-0.5 font-mono text-[12.5px] text-text-primary">há 4min</div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Button size="sm">
          <Play />
          Re-executar do step…
        </Button>
        <Button variant="outline" size="sm">
          <Download />
          Baixar snapshot
        </Button>
      </div>
    </Card>
  )
}
