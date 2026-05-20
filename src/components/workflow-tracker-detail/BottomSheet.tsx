import { ChevronRight, FileText, GripHorizontal, ShieldCheck, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { AgenticPrDiff } from './AgenticPrDiff'
import { SheetCol } from './SheetCol'
import { StatusIcon } from './StatusIcon'
import { steps, verbMeta, type ApprovalState } from './utils'

type BottomSheetProps = {
  stepId: string
  approval: ApprovalState
  onApprove: () => void
  onDecline: () => void
  onClose: () => void
}

export function BottomSheet({ stepId, approval, onApprove, onDecline, onClose }: BottomSheetProps) {
  const step = steps.find((s) => s.id === stepId)
  const [iter, setIter] = useState(1)
  if (!step) return null
  const verb = verbMeta[step.verb]
  const VerbIcon = verb.icon
  const isIterated = (step.iterations ?? 1) > 1
  const isAgentic = step.verb === 'agentic' && !!step.agentic

  return (
    <Card className="p-0">
      <div className="flex flex-col gap-2 border-b border-border px-4 py-3">
        <div className="flex items-center justify-center">
          <span
            className="flex h-1 w-10 cursor-row-resize items-center justify-center rounded-full bg-border"
            aria-label="redimensionar"
          >
            <GripHorizontal className="h-3 w-3 text-text-muted" />
          </span>
        </div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <StatusIcon status={step.status} />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-[14px] font-semibold text-text-primary">{step.name}</h3>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide ${verb.border} ${verb.bodyBg} ${verb.text}`}
                >
                  <VerbIcon className="h-3 w-3" />
                  {verb.label}
                </span>
                {step.duration && (
                  <span className="font-mono text-[11px] text-text-muted">duração · {step.duration}</span>
                )}
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider text-text-muted">
                <span className={verb.text}>{verb.label}</span>
                <ChevronRight className="h-3 w-3" />
                <span className="font-mono normal-case tracking-normal text-text-secondary">
                  {step.tool ?? step.id}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isIterated && (
              <div className="flex items-center gap-1 rounded-md border border-border bg-bg px-1.5 py-1">
                <span className="mr-1 text-[10px] uppercase tracking-wider text-text-muted">iter</span>
                {Array.from({ length: step.iterations! }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIter(i + 1)}
                    className={`rounded px-1.5 py-0.5 font-mono text-[10.5px] transition ${
                      iter === i + 1
                        ? 'bg-accent/15 text-accent'
                        : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
            <Button variant="outline" size="sm" className="h-7 px-2 text-[11.5px]">
              <FileText />
              Ver raw trace
            </Button>
            <Button variant="outline" size="sm" className="h-7 px-2 text-[11.5px]">
              Pular para Replay
              <ChevronRight />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="fechar"
              className="h-7 w-7 text-text-muted"
            >
              <X />
            </Button>
          </div>
        </div>
      </div>

      {isAgentic && step.agentic ? (
        <AgenticPrDiff
          metadata={step.agentic}
          approval={approval}
          onApprove={onApprove}
          onDecline={onDecline}
        />
      ) : (
        <div className="grid grid-cols-1 divide-border md:grid-cols-2 md:divide-x lg:grid-cols-4">
          <SheetCol title="Input">
            <pre className="overflow-x-auto rounded bg-[#0B0C10] p-2.5 font-mono text-[10.5px] leading-relaxed text-text-secondary">
{`{
  "sa_id": "ssa-pix-core",
  "target_env": "hml",
  "image": "ghcr.io/itau/ssa-pix-core:0.21.4",
  "replicas": 3
}`}
            </pre>
          </SheetCol>

          <SheetCol title="Output">
            {step.status === 'pending' || step.status === 'skipped' ? (
              <div className="text-[11.5px] text-text-muted">Sem output — step ainda não executou.</div>
            ) : (
              <pre className="overflow-x-auto rounded bg-[#0B0C10] p-2.5 font-mono text-[10.5px] leading-relaxed text-text-secondary">
{`{
  "release_id": "rel-9f3a",
  "endpoint": "https://pix-core.itau.internal",
  "artifacts": [
    "s3://itau-deploys/rel-9f3a/manifest.yaml"
  ]
}`}
              </pre>
            )}
          </SheetCol>

          <SheetCol title="Sensores">
            {step.sensor ? (
              <ul className="space-y-1.5">
                <li className="flex items-center justify-between rounded border border-border bg-bg px-2.5 py-1.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-text-muted" />
                    <span className="font-mono text-[11.5px] text-text-primary">{step.sensor.name}</span>
                  </div>
                  <span
                    className={`rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                      step.sensor.verdict === 'pass'
                        ? 'border-success/30 bg-success/10 text-success'
                        : step.sensor.verdict === 'warn'
                        ? 'border-warning/30 bg-warning/10 text-warning'
                        : 'border-failure/30 bg-failure/10 text-failure'
                    }`}
                  >
                    {step.sensor.verdict}
                  </span>
                </li>
              </ul>
            ) : (
              <div className="text-[11.5px] text-text-muted">Nenhum sensor acionado neste step.</div>
            )}
          </SheetCol>

          <SheetCol title="Decisão do agente">
            <div className="space-y-2 text-[11.5px] text-text-secondary">
              <p>
                Selecionado <span className="font-mono text-text-primary">kaptain.deploy</span> em vez de{' '}
                <span className="font-mono">kaptain.bootstrap</span>: a SA já possui release anterior — bootstrap só se aplica em
                primeira execução.
              </p>
              <div className="rounded border border-border bg-bg px-2.5 py-2">
                <div className="text-[10.5px] uppercase tracking-wider text-text-muted">alternatives_considered</div>
                <ul className="mt-1 list-disc pl-4 text-[11px]">
                  <li>
                    <span className="font-mono">kaptain.bootstrap</span> — rejeitado (sa já provisionada)
                  </li>
                  <li>
                    <span className="font-mono">orkestra.apply</span> direto — rejeitado (precisa de release id)
                  </li>
                </ul>
              </div>
            </div>
          </SheetCol>
        </div>
      )}
    </Card>
  )
}
