import { Check, ChevronDown, Info, Loader2 } from 'lucide-react'
import { useState } from 'react'
import type { Workflow, WorkflowStep } from '../../contexts/WorkflowsProvider'
import { useOnboardingChecklistContent } from '../../hooks/useOnboardingChecklistContent'
import type { OnboardingChecklistContent } from '../../types/models'
import { Card } from '../ui/card'
import { EmptyState, InlineSpinner } from './atoms'
import { StepDetails } from './step-details'
import { MIGRATION_TEMPLATE_SLUG } from './utils'

function ChecklistRow({
  index,
  step,
  content,
  expanded,
  onToggleComplete,
  onToggleExpand,
}: {
  index: number
  step: WorkflowStep
  content: OnboardingChecklistContent
  expanded: boolean
  onToggleComplete: () => void
  onToggleExpand: () => void
}) {
  const detailsId = `step-details-${step.id}`
  const inProgress = step.status === 'in-progress' && !step.isCompleted

  return (
    <li
      className={`border-b border-l-2 border-border last:border-b-0 ${
        inProgress ? 'border-l-accent' : 'border-l-transparent'
      } ${step.isCompleted ? 'bg-success/[0.025]' : ''}`}
    >
      <div
        className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3 transition hover:bg-bg/40 ${
          step.isCompleted ? 'opacity-70' : ''
        }`}
        onClick={onToggleExpand}
      >
        <button
          type="button"
          role="checkbox"
          aria-checked={step.isCompleted}
          aria-label={`${step.isCompleted ? 'Desmarcar' : 'Concluir'} ${step.name}`}
          onClick={(e) => {
            e.stopPropagation()
            onToggleComplete()
          }}
          className={`flex h-6 w-6 flex-none items-center justify-center rounded-full border font-mono text-[11px] transition ${
            step.isCompleted
              ? 'border-success/40 bg-success/10 text-success'
              : inProgress
                ? 'border-accent/40 bg-accent/10 text-accent'
                : 'border-border bg-bg text-text-muted hover:border-accent/40 hover:text-accent'
          }`}
        >
          {step.isCompleted
            ? <Check className="h-3.5 w-3.5" />
            : inProgress
              ? <Loader2 className="h-3 w-3 animate-spin" />
              : index}
        </button>

        <div className="min-w-0 flex-1">
          <div className={`truncate text-[12.5px] font-medium ${
            step.isCompleted ? 'text-text-secondary' : 'text-text-primary'
          }`}>
            {step.name}
          </div>
          {step.description && (
            <div className="truncate text-[11.5px] text-text-muted">{step.description}</div>
          )}
        </div>

        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={detailsId}
          aria-label={expanded ? 'Recolher detalhes' : 'Expandir detalhes'}
          onClick={(e) => {
            e.stopPropagation()
            onToggleExpand()
          }}
          className="flex h-8 w-8 flex-none items-center justify-center rounded-md text-text-muted transition hover:bg-bg hover:text-text-primary"
        >
          <ChevronDown className={`h-3.5 w-3.5 transition ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {expanded && (
        <div
          id={detailsId}
          aria-live="polite"
          className="mb-3 ml-12 mr-4 rounded-md border border-border bg-bg px-4 py-3"
        >
          <StepDetails stepId={content.stepId} content={content} />
        </div>
      )}
    </li>
  )
}

// Card de Checklist de Onboarding — `onboarding-card.md` §Card Principal.
// Renderiza N rows, uma por step do workflow primário (filtradas pelos steps
// que têm conteúdo estático cadastrado em `onboardingChecklistContent`).
export function OnboardingChecklistCard({
  workflow,
  onToggleStep,
}: {
  workflow: Workflow
  onToggleStep: (stepId: string, nextCompleted: boolean) => void
}) {
  const { data: checklistContent, isLoading } = useOnboardingChecklistContent(MIGRATION_TEMPLATE_SLUG)
  const [expanded, setExpanded] = useState<Set<string> | null>(null)

  const toggleExpand = (stepId: string) => {
    setExpanded((prev) => {
      const base = prev ?? new Set<string>()
      const next = new Set(base)
      if (next.has(stepId)) next.delete(stepId)
      else next.add(stepId)
      return next
    })
  }

  const contentByStepId = new Map(checklistContent.map((c) => [c.stepId, c]))
  const rows = workflow.steps.filter((s) => contentByStepId.has(s.id))

  const effectiveExpanded = (() => {
    if (expanded !== null) return expanded
    const firstPending = rows.find((s) => !s.isCompleted)
    return firstPending ? new Set([firstPending.id]) : new Set<string>()
  })()

  if (isLoading) {
    return (
      <Card>
        <div className="px-4 py-6">
          <InlineSpinner label="Carregando passos do onboarding..." />
        </div>
      </Card>
    )
  }

  if (rows.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={Info}
          title="Sem passos para este workflow"
          hint="O checklist deste workflow ainda não foi cadastrado no banco."
        />
      </Card>
    )
  }

  return (
    <Card>
      <ul>
        {rows.map((step, idx) => {
          const content = contentByStepId.get(step.id)
          if (!content) return null
          return (
            <ChecklistRow
              key={step.id}
              index={idx + 1}
              step={step}
              content={content}
              expanded={effectiveExpanded.has(step.id)}
              onToggleComplete={() => onToggleStep(step.id, !step.isCompleted)}
              onToggleExpand={() => toggleExpand(step.id)}
            />
          )
        })}
      </ul>
    </Card>
  )
}
