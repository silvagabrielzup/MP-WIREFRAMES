import { Check, RotateCw, ShieldCheck, X } from 'lucide-react'
import { StatusIcon } from './StatusIcon'
import {
  NODE_H,
  NODE_W,
  NODE_Y,
  nodeX,
  verbMeta,
  type ApprovalState,
  type Step,
  type StepStatus,
} from './utils'

type StepNodeProps = {
  step: Step
  idx: number
  selected: boolean
  approval: ApprovalState
  onClick: () => void
  onApprove: () => void
  onDecline: () => void
}

export function StepNode({ step, idx, selected, approval, onClick, onApprove, onDecline }: StepNodeProps) {
  const x = nodeX(idx)
  const verb = verbMeta[step.verb]
  const VerbIcon = verb.icon

  const effectiveStatus: StepStatus =
    step.verb === 'agentic'
      ? approval === 'accepted'
        ? 'success'
        : approval === 'declined'
        ? 'failed'
        : 'running'
      : step.status

  const isRunning = effectiveStatus === 'running'
  const isFailed = effectiveStatus === 'failed'
  const isPending = effectiveStatus === 'pending'
  const isSkipped = effectiveStatus === 'skipped'
  const isAgenticPending = step.verb === 'agentic' && approval === 'pending'

  return (
    <button
      onClick={onClick}
      style={{ left: x, top: NODE_Y, width: NODE_W, height: NODE_H }}
      className={`absolute overflow-hidden rounded-lg border bg-surface text-left transition hover:shadow-lg ${
        isFailed ? 'border-failure ring-1 ring-failure/30' : verb.border
      } ${selected ? 'ring-2 ring-text-primary' : ''} ${
        step.verb !== 'agentic' && isPending ? 'opacity-50' : ''
      } ${isSkipped ? 'opacity-50 [border-style:dashed]' : ''} ${
        isRunning && step.verb !== 'agentic' ? `${verb.border} animate-pulse-live` : ''
      } ${isAgenticPending ? 'shadow-[0_0_0_3px_rgba(255,107,44,0.18)]' : ''}`}
    >
      <div className={`flex h-7 items-center gap-1.5 px-2.5 ${verb.headerBg} text-black/90`}>
        <VerbIcon className="h-3 w-3" />
        <span className="text-[10.5px] font-semibold uppercase tracking-wider">
          {verb.label}
          {step.tool && (
            <span className="font-mono normal-case opacity-80"> · {step.tool.split('.')[0]}</span>
          )}
        </span>
        {isAgenticPending && (
          <span className="ml-auto rounded-full bg-black/30 px-1.5 py-0.5 text-[9.5px] font-mono uppercase tracking-wider text-black/90">
            aprovação
          </span>
        )}
      </div>

      <span
        aria-hidden
        className={`absolute left-0 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border ${verb.swatch}`}
      />
      <span
        aria-hidden
        className={`absolute right-0 top-1/2 h-2 w-2 translate-x-1/2 -translate-y-1/2 rounded-full border border-border ${verb.swatch}`}
      />

      <div className={`flex flex-1 flex-col gap-1.5 px-3 py-2 ${verb.bodyBg}`}>
        <div className="flex items-center gap-2">
          <StatusIcon status={effectiveStatus} />
          <span className="truncate text-[12.5px] font-semibold text-text-primary">{step.name}</span>
        </div>
        {step.tool && (
          <div className="truncate font-mono text-[11px] text-text-secondary">{step.tool}</div>
        )}
        <div className="mt-auto flex items-center gap-1.5">
          {isAgenticPending ? (
            <>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation()
                  onDecline()
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    e.stopPropagation()
                    onDecline()
                  }
                }}
                className="inline-flex cursor-pointer items-center gap-1 rounded border border-failure/30 bg-failure/10 px-1.5 py-0.5 text-[10px] font-medium text-failure hover:bg-failure/15"
              >
                <X className="h-2.5 w-2.5" />
                Declinar
              </span>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation()
                  onApprove()
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    e.stopPropagation()
                    onApprove()
                  }
                }}
                className="inline-flex cursor-pointer items-center gap-1 rounded border border-success/30 bg-success/10 px-1.5 py-0.5 text-[10px] font-medium text-success hover:bg-success/15"
              >
                <Check className="h-2.5 w-2.5" />
                Aprovar
              </span>
            </>
          ) : (
            <>
              {step.duration && (
                <span className="rounded border border-border bg-bg/80 px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
                  {step.duration}
                </span>
              )}
              {step.sensor && (
                <span
                  className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium ${
                    step.sensor.verdict === 'pass'
                      ? 'border-success/30 bg-success/10 text-success'
                      : step.sensor.verdict === 'warn'
                      ? 'border-warning/30 bg-warning/10 text-warning'
                      : 'border-failure/30 bg-failure/10 text-failure'
                  }`}
                >
                  <ShieldCheck className="h-2.5 w-2.5" />
                  {step.sensor.name}
                </span>
              )}
              {step.iterations && step.iterations > 1 && (
                <span className="inline-flex items-center gap-1 rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
                  <RotateCw className="h-2.5 w-2.5" />
                  {step.iterations}
                </span>
              )}
              {step.verb === 'agentic' && approval === 'accepted' && (
                <span className="inline-flex items-center gap-1 rounded border border-success/30 bg-success/10 px-1.5 py-0.5 text-[10px] font-medium text-success">
                  <Check className="h-2.5 w-2.5" />
                  aprovado
                </span>
              )}
              {step.verb === 'agentic' && approval === 'declined' && (
                <span className="inline-flex items-center gap-1 rounded border border-failure/30 bg-failure/10 px-1.5 py-0.5 text-[10px] font-medium text-failure">
                  <X className="h-2.5 w-2.5" />
                  declinado
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </button>
  )
}
