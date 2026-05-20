import { Card } from '../components/ui/card'
import { CongratsAlert } from '../components/home/CongratsAlert'
import { OnboardingChecklistCard } from '../components/home/OnboardingChecklistCard'
import {
  PendingAgenticFlowsCard,
  type PendingItem,
} from '../components/home/PendingAgenticFlowsCard'
import { Placeholder } from '../components/home/Placeholder'
import { HOME_SUBTITLE, MIGRATION_TEMPLATE_SLUG, resolveSaName } from '../components/home/utils'
import { useWorkflows } from '../contexts/WorkflowsProvider'
import { migrationExecutionWorkflow } from '../data/database'
import { useOnboardingChecklistContent } from '../hooks/useOnboardingChecklistContent'

export default function Home() {
  const { workflows, completeStep, uncompleteStep, addWorkflow } = useWorkflows()
  const { data: checklistContent } = useOnboardingChecklistContent(MIGRATION_TEMPLATE_SLUG)

  const migrationWorkflow = [...workflows]
    .reverse()
    .find((w) => w.slug === MIGRATION_TEMPLATE_SLUG || w.templateId === MIGRATION_TEMPLATE_SLUG)
    ?? null

  const isCompleted = migrationWorkflow?.status === 'completed'
  const isActive = migrationWorkflow !== null && !isCompleted

  const handleToggleStep = (stepId: string, nextCompleted: boolean) => {
    if (!migrationWorkflow) return
    if (nextCompleted) {
      completeStep(migrationWorkflow.id, stepId)

      // Último step (maior `order` em `onboardingChecklistContent`) dispara o
      // pipeline server-side `wf-onboarding-vanilla-exec`.
      const orderedStepIds = [...checklistContent].sort((a, b) => a.order - b.order).map((c) => c.stepId)
      const lastStepId = orderedStepIds[orderedStepIds.length - 1]
      if (lastStepId && stepId === lastStepId) {
        const alreadyTriggered = workflows.some(
          (w) => w.templateId === migrationExecutionWorkflow.id || w.slug === migrationExecutionWorkflow.id,
        )
        if (!alreadyTriggered) addWorkflow(migrationExecutionWorkflow)
      }
    } else {
      uncompleteStep(migrationWorkflow.id, stepId)
    }
  }

  const pendingItems: PendingItem[] = workflows.flatMap((wf) =>
    wf.pendingAgenticFlow.map((item) => ({
      ...item,
      workflowInstanceId: wf.id,
      workflowName: wf.name,
    })),
  )

  const subtitle = (() => {
    if (!migrationWorkflow) return HOME_SUBTITLE.idle
    if (isCompleted) return HOME_SUBTITLE.completed
    const stepIdsInChecklist = new Set(checklistContent.map((c) => c.stepId))
    const tracked = migrationWorkflow.steps.filter((s) => stepIdsInChecklist.has(s.id))
    const total = tracked.length || migrationWorkflow.steps.length
    const done = tracked.filter((s) => s.isCompleted).length
    return `Onboarding da Migração Vanilla em curso · passo ${Math.min(done + 1, total)} de ${total}.`
  })()

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-[26px] font-semibold tracking-tight">Bom dia, Luigi</h1>
        <p className="mt-1.5 text-[13.5px] text-text-secondary">{subtitle}</p>
      </section>

      <section>
        {!migrationWorkflow && (
          <Card>
            <Placeholder />
          </Card>
        )}

        {isActive && migrationWorkflow && (
          <OnboardingChecklistCard workflow={migrationWorkflow} onToggleStep={handleToggleStep} />
        )}

        {isCompleted && migrationWorkflow && (
          <CongratsAlert
            saName={resolveSaName(migrationWorkflow)}
            totalSteps={migrationWorkflow.steps.length}
          />
        )}
      </section>

      <section>
        <PendingAgenticFlowsCard items={pendingItems} />
      </section>
    </div>
  )
}
