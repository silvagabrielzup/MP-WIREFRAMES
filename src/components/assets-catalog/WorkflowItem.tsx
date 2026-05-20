import { CheckCircle2, ChevronDown, Sparkles, Tag, Workflow as WorkflowIcon, Zap, ArrowRight } from 'lucide-react'
import type { MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkflows } from '../../contexts/WorkflowsProvider'
import type { WorkflowAsset } from '../../data/database'
import { Button } from '../ui/button'
import { AssetMeta } from './AssetMeta'
import { StatusBadge } from './StatusBadge'

export function WorkflowItem({
  wf,
  expanded,
  onToggle,
}: {
  wf: WorkflowAsset
  expanded: boolean
  onToggle: () => void
}) {
  const navigate = useNavigate()
  const { addWorkflow } = useWorkflows()

  const handleUse = (e: MouseEvent) => {
    e.stopPropagation()
    const instance = addWorkflow(wf.id)
    if (instance) navigate('/')
  }

  return (
    <div
      className={`rounded-lg border bg-surface transition ${
        expanded ? 'border-accent ring-1 ring-accent/40' : 'border-border'
      }`}
    >
      <button
        onClick={onToggle}
        aria-expanded={expanded}
        className="w-full border-b border-border px-5 py-4 text-left hover:bg-[#181A1F]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <ChevronDown
                className={`h-3.5 w-3.5 flex-none text-text-muted transition-transform ${
                  expanded ? 'rotate-0' : '-rotate-90'
                }`}
              />
              <WorkflowIcon className="h-4 w-4 flex-none text-accent" />
              <h3 className="truncate font-mono text-[14px] text-text-primary">{wf.name}</h3>
              <StatusBadge status={wf.status} />
              <span className="rounded border border-border bg-bg px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-text-muted">
                {wf.type}
              </span>
            </div>
            <p className="mt-1.5 max-w-[640px] text-[12.5px] text-text-secondary">{wf.description}</p>
          </div>
          <Button
            asChild
            size="sm"
            className="flex-none"
          >
            <span
              role="button"
              tabIndex={0}
              onClick={handleUse}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleUse(e as unknown as MouseEvent)
                }
              }}
            >
              Usar workflow
              <ArrowRight />
            </span>
          </Button>
        </div>
        <AssetMeta asset={wf} />
      </button>

      {expanded && (
        <div className="space-y-5 px-5 py-5">
          <section>
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-text-muted" />
              <h4 className="text-[12.5px] font-semibold tracking-tight">Steps</h4>
              <span className="text-[11px] text-text-muted">
                {wf.onboardingSteps.length} passos · consumidos pelo to-do contextual do Home
              </span>
            </div>
            <ol className="flex flex-col gap-2">
              {wf.onboardingSteps.map((s, i) => (
                <li
                  key={s.id}
                  className="flex items-start gap-3 rounded-md border border-border bg-bg px-3 py-2.5"
                >
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border border-border bg-surface font-mono text-[10.5px] text-text-secondary">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11.5px] text-text-muted">{s.id}</span>
                      {s.required ? (
                        <span className="rounded border border-failure/30 bg-failure/10 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-failure">
                          required
                        </span>
                      ) : (
                        <span className="rounded border border-border bg-bg px-1.5 py-0.5 text-[9.5px] uppercase tracking-wider text-text-muted">
                          optional
                        </span>
                      )}
                      {s.completedOnClick && (
                        <span className="rounded border border-info/30 bg-info/10 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-info">
                          click → done
                        </span>
                      )}
                      {s.agentic && (
                        <span className="inline-flex items-center gap-1 rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-accent">
                          <Sparkles className="h-2.5 w-2.5" />
                          agêntico
                        </span>
                      )}
                      {s.triggers && (
                        <span className="inline-flex items-center gap-1 rounded border border-warning/30 bg-warning/10 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-warning">
                          <Zap className="h-2.5 w-2.5" />
                          triggers
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-[12.5px] text-text-primary">{s.title}</div>
                    <div className="mt-0.5 text-[11.5px] text-text-muted">{s.description}</div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-text-muted">
                      <span className="inline-flex items-center gap-1">
                        <span className="uppercase tracking-wider">CTA</span>
                        <span className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-text-secondary">
                          {s.ctaLabel}
                        </span>
                      </span>
                      {s.dependsOn.length > 0 && (
                        <span className="flex flex-wrap items-center gap-1">
                          <span className="uppercase tracking-wider">depende de</span>
                          {s.dependsOn.map((d) => (
                            <span
                              key={d}
                              className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono"
                            >
                              {d}
                            </span>
                          ))}
                        </span>
                      )}
                      {s.triggers && (
                        <span className="flex items-center gap-1">
                          <span className="uppercase tracking-wider">dispara</span>
                          <span className="rounded border border-warning/30 bg-warning/5 px-1.5 py-0.5 font-mono text-warning">
                            {s.triggers.id}
                          </span>
                        </span>
                      )}
                    </div>
                    {s.agentic && (
                      <div className="mt-2 rounded border border-accent/25 bg-accent/[0.04] px-2.5 py-2 text-[11px]">
                        <div className="flex items-center gap-1.5 text-accent">
                          <Sparkles className="h-3 w-3" />
                          <span className="font-mono text-text-primary">{s.agentic.prTitle}</span>
                        </div>
                        <div className="mt-0.5 text-[10.5px] text-text-muted">
                          por <span className="font-mono">{s.agentic.prAuthor}</span> ·{' '}
                          <span className="font-mono">{s.agentic.files.length}</span> arquivos
                        </div>
                        <div className="mt-1 line-clamp-2 text-text-secondary">
                          {s.agentic.prSummary}
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-md border border-border bg-bg px-3 py-2.5">
            <div className="flex items-center gap-2 text-[11px] text-text-muted">
              <Tag className="h-3 w-3" />
              <span className="uppercase tracking-wider">Maturidade</span>
              <span className="font-mono text-text-secondary">{wf.maturity}</span>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
