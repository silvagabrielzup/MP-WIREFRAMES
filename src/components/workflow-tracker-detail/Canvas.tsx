import { AlertTriangle, Map, Maximize2, Minus, Plus, RotateCw, Settings } from 'lucide-react'
import { EdgeLayer } from './EdgeLayer'
import { StepNode } from './StepNode'
import {
  CANVAS_H,
  CANVAS_W,
  NODE_W,
  nodeX,
  steps,
  verbMeta,
  type ApprovalState,
} from './utils'

type CanvasProps = {
  selectedId: string | null
  onSelect: (id: string) => void
  approval: ApprovalState
  onApprove: () => void
  onDecline: () => void
}

export function Canvas({ selectedId, onSelect, approval, onApprove, onDecline }: CanvasProps) {
  const failedStep = steps.find((s) => s.status === 'failed')
  return (
    <div className="space-y-2">
      <div
        className="relative overflow-auto rounded-lg border border-border bg-[#0F1014]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #1c1d22 1px, transparent 0)',
          backgroundSize: '18px 18px',
          minHeight: CANVAS_H + 8,
        }}
      >
        <div className="relative" style={{ width: CANVAS_W, height: CANVAS_H }}>
          <EdgeLayer selectedId={selectedId} />
          {steps.map((s, i) => (
            <StepNode
              key={s.id}
              step={s}
              idx={i}
              selected={selectedId === s.id}
              approval={approval}
              onClick={() => onSelect(s.id)}
              onApprove={onApprove}
              onDecline={onDecline}
            />
          ))}
        </div>

        {failedStep && (
          <div className="pointer-events-none absolute left-3 right-3 top-3 z-10 flex justify-center">
            <div className="pointer-events-auto inline-flex items-center gap-2 rounded-md border border-failure/40 bg-failure/10 px-3 py-1.5 text-[11.5px] text-failure backdrop-blur">
              <AlertTriangle className="h-3.5 w-3.5" />
              Falhou em <span className="font-mono">{failedStep.id}</span> · abrir detalhes
            </div>
          </div>
        )}

        <div className="pointer-events-none sticky top-3 z-10 flex items-start justify-between px-3">
          <div className="pointer-events-auto rounded-md border border-border bg-surface/90 p-2 backdrop-blur">
            <div className="mb-1.5 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-text-muted">
              <Map className="h-3 w-3" />
              mini-mapa
            </div>
            <div className="relative h-10 w-44 rounded border border-border bg-bg">
              {steps.map((s, i) => {
                const meta = verbMeta[s.verb]
                const mx =
                  ((nodeX(i) - nodeX(0)) / (nodeX(steps.length - 1) + NODE_W - nodeX(0))) * 168 + 2
                return (
                  <span
                    key={s.id}
                    className={`absolute top-1/2 h-3 w-2 -translate-y-1/2 rounded-sm ${meta.swatch}`}
                    style={{ left: mx }}
                  />
                )
              })}
              <span className="absolute inset-y-1 left-1 right-1 rounded border border-info/60" />
            </div>
          </div>

          <div className="pointer-events-auto flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1 rounded-md border border-border bg-surface/90 p-1 backdrop-blur">
              <button title="Zoom out" className="rounded p-1 text-text-secondary hover:bg-bg hover:text-text-primary">
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="font-mono text-[10px] text-text-muted">100%</span>
              <button title="Zoom in" className="rounded p-1 text-text-secondary hover:bg-bg hover:text-text-primary">
                <Plus className="h-3.5 w-3.5" />
              </button>
              <span className="mx-0.5 h-4 w-px bg-border" />
              <button
                title="Fit to screen (f)"
                className="rounded p-1 text-text-secondary hover:bg-bg hover:text-text-primary"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
              <button title="Reset (0)" className="rounded p-1 text-text-secondary hover:bg-bg hover:text-text-primary">
                <RotateCw className="h-3.5 w-3.5" />
              </button>
              <button title="Configurar" className="rounded p-1 text-text-secondary hover:bg-bg hover:text-text-primary">
                <Settings className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
