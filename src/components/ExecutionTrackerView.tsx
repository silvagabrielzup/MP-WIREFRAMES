import { Link } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  Check,
  CheckCircle2,
  ExternalLink,
  FileText,
  GitPullRequest,
  Hammer,
  Rocket,
  Server,
  ShieldCheck,
  Wrench,
  XCircle,
} from 'lucide-react'
import {
  useWorkflows,
  type Workflow,
  type WorkflowStep,
} from '../contexts/WorkflowsProvider'
import {
  migrationExecutionWorkflow,
  workflows as workflowTemplates,
} from '../data/database'

/**
 * Visualização "live" do pipeline `wfk-onboarding-vanilla-exec` — usada no
 * Home e na tela de detalhe do Workflow Tracker. Renderiza o stepper
 * horizontal + cards de aprovação (PR e Deploy on Prod) quando aplicável.
 * O auto-advance dos steps Computacional roda no `WorkflowsProvider`.
 */

export const EXEC_PR_STEP_ID = 'exec-05-pr-approval'
export const EXEC_DEPLOY_GATE_STEP_ID = 'exec-06-deploy-approval'

type ExecStepMeta = {
  shortLabel: string
  icon: typeof Hammer
}

const EXEC_STEP_META: Record<string, ExecStepMeta> = {
  'exec-01-vuln-scan': { shortLabel: 'Varredura', icon: ShieldCheck },
  'exec-02-auto-fix': { shortLabel: 'Correção', icon: Wrench },
  'exec-03-build': { shortLabel: 'Build', icon: Hammer },
  'exec-04-provision-infra': { shortLabel: 'Infra', icon: Server },
  'exec-05-pr-approval': { shortLabel: 'Aprovar PR', icon: GitPullRequest },
  'exec-06-deploy-approval': { shortLabel: 'Aprovar Deploy', icon: ShieldCheck },
  'exec-07-deploy': { shortLabel: 'Deploy', icon: Rocket },
}

export function ExecutionStepper({ workflow }: { workflow: Workflow }) {
  const steps = workflow.steps
  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-live opacity-80" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
          </span>
          <h3 className="text-[13px] font-semibold tracking-tight text-text-primary">
            Pipeline em execução · {workflow.templateName}
          </h3>
        </div>
        <span className="font-mono text-[10.5px] text-text-muted">
          {workflow.steps.filter((s) => s.isCompleted).length}/{steps.length} steps
        </span>
      </div>
      <div className="overflow-x-auto px-4 py-4">
        <ol className="flex min-w-max items-start gap-1">
          {steps.map((step, idx) => {
            const meta = EXEC_STEP_META[step.id] ?? {
              shortLabel: step.title,
              icon: Hammer,
            }
            const Icon = meta.icon
            const isCompleted = step.isCompleted
            const isCurrent = step.status === 'in-progress'
            const isLast = idx === steps.length - 1

            const nodeTone = isCompleted
              ? 'border-success/40 bg-success/10 text-success'
              : isCurrent
              ? 'border-accent bg-accent/10 text-accent shadow-[0_0_0_4px_rgba(255,107,44,0.12)]'
              : 'border-border bg-bg text-text-muted'
            const labelTone = isCompleted
              ? 'text-success'
              : isCurrent
              ? 'text-text-primary'
              : 'text-text-muted'
            const connectorTone = isCompleted
              ? 'bg-success/40'
              : isCurrent
              ? 'bg-gradient-to-r from-accent/60 to-border'
              : 'bg-border'

            return (
              <li
                key={step.id}
                className="flex items-start gap-1"
                aria-current={isCurrent ? 'step' : undefined}
              >
                <div className="flex w-[110px] flex-col items-center text-center">
                  <span
                    className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition ${nodeTone}`}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    {isCurrent && (
                      <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-live opacity-80" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-live" />
                      </span>
                    )}
                  </span>
                  <span className="mt-1.5 font-mono text-[9.5px] uppercase tracking-wider text-text-muted">
                    {idx + 1} / {steps.length}
                  </span>
                  <span
                    className={`mt-0.5 line-clamp-2 text-[11.5px] font-medium ${labelTone}`}
                  >
                    {meta.shortLabel}
                  </span>
                </div>
                {!isLast && (
                  <div className="mt-5 h-0.5 w-12 flex-none">
                    <div className={`h-full w-full rounded-full ${connectorTone}`} />
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

export function ExecPrApprovalCard({
  step,
  onApprove,
  onDecline,
}: {
  step: WorkflowStep
  onApprove: () => void
  onDecline: () => void
}) {
  const agentic = (() => {
    const tmpl = workflowTemplates.find((t) => t.id === migrationExecutionWorkflow.id)
    const tmplStep = tmpl?.onboardingSteps.find((s) => s.id === step.id)
    return tmplStep?.agentic ?? null
  })()

  const linesAdded =
    agentic?.files.reduce(
      (sum, f) =>
        sum +
        f.hunks.reduce(
          (hs, h) => hs + h.lines.filter((l) => l.kind === 'add').length,
          0,
        ),
      0,
    ) ?? 0
  const linesRemoved =
    agentic?.files.reduce(
      (sum, f) =>
        sum +
        f.hunks.reduce(
          (hs, h) => hs + h.lines.filter((l) => l.kind === 'del').length,
          0,
        ),
      0,
    ) ?? 0

  const firstFile = agentic?.files[0] ?? null

  return (
    <div className="rounded-lg border border-warning/40 bg-warning/[0.06]">
      <div className="flex items-center justify-between gap-3 border-b border-warning/30 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <GitPullRequest className="h-3.5 w-3.5 text-warning" />
          <h3 className="text-[13px] font-semibold tracking-tight text-text-primary">
            Aprovação do PR · gate humano
          </h3>
          <span className="rounded-full border border-warning/40 bg-warning/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-warning">
            pendente
          </span>
        </div>
        <a
          href="https://github.itau.com.br/pix-platform/pix-core/pull/4287"
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1 text-[11.5px] font-medium text-accent hover:underline"
        >
          Ver no GitHub
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <div className="space-y-3 px-4 py-3">
        {agentic ? (
          <>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-[12.5px] font-semibold text-text-primary">
                  {agentic.prTitle}
                </h4>
                <span className="font-mono text-[10.5px] text-text-muted">
                  {agentic.prAuthor}
                </span>
              </div>
              <p className="mt-1 text-[11.5px] text-text-secondary">{agentic.prSummary}</p>
              <div className="mt-1.5 flex items-center gap-2 text-[10.5px] text-text-muted">
                <span className="inline-flex items-center gap-1">
                  <FileText className="h-2.5 w-2.5" />
                  <span className="font-mono">{agentic.files.length}</span> arquivos
                </span>
                <span>·</span>
                <span className="font-mono text-success">+{linesAdded}</span>
                <span className="font-mono text-failure">−{linesRemoved}</span>
              </div>
            </div>
            {firstFile && (
              <div className="rounded-md border border-border bg-bg">
                <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
                  <span className="truncate font-mono text-[10.5px] text-text-secondary">
                    {firstFile.path}
                  </span>
                  <span className="font-mono text-[9.5px] uppercase tracking-wider text-text-muted">
                    preview · 1 de {agentic.files.length}
                  </span>
                </div>
                <div className="max-h-[180px] overflow-y-auto px-3 py-1.5 font-mono text-[10.5px] leading-relaxed">
                  {firstFile.hunks.map((h, hi) => (
                    <div key={hi}>
                      <div className="my-1 text-[9.5px] text-text-muted">{h.header}</div>
                      {h.lines.map((l, li) => {
                        const tone =
                          l.kind === 'add'
                            ? 'bg-success/10 text-success'
                            : l.kind === 'del'
                            ? 'bg-failure/10 text-failure'
                            : 'text-text-secondary'
                        const prefix =
                          l.kind === 'add' ? '+' : l.kind === 'del' ? '−' : ' '
                        return (
                          <div key={li} className={`whitespace-pre px-1 ${tone}`}>
                            {prefix} {l.text}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-[11.5px] text-text-muted">
            PR sem metadata visível — abra o diff completo no Workflow Tracker.
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onApprove}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-success px-4 text-[12.5px] font-medium text-black transition hover:opacity-90"
          >
            <Check className="h-3.5 w-3.5" />
            Aprovar PR
          </button>
          <button
            type="button"
            onClick={onDecline}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-failure/40 bg-failure/10 px-4 text-[12.5px] font-medium text-failure transition hover:bg-failure/15"
          >
            <XCircle className="h-3.5 w-3.5" />
            Recusar
          </button>
          <Link
            to="/workflows"
            className="ml-auto inline-flex items-center gap-1 text-[11.5px] text-text-muted hover:text-text-primary"
          >
            Abrir Workflow Tracker
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export function ExecDeployApprovalCard({
  onApprove,
  onDecline,
}: {
  step: WorkflowStep
  onApprove: () => void
  onDecline: () => void
}) {
  return (
    <div className="rounded-lg border border-warning/40 bg-warning/[0.06]">
      <div className="flex items-center justify-between gap-3 border-b border-warning/30 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-warning" />
          <h3 className="text-[13px] font-semibold tracking-tight text-text-primary">
            Aprovação do Deploy on Prod · gate final
          </h3>
          <span className="rounded-full border border-warning/40 bg-warning/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-warning">
            pendente
          </span>
        </div>
        <span className="font-mono text-[10.5px] text-text-muted">ssa-pix-core · prod</span>
      </div>
      <div className="space-y-3 px-4 py-3">
        <p className="text-[11.5px] text-text-secondary">
          PR aprovado, infra provisionada e build assinado. Falta o gate humano
          antes do cutover canário (1% → 10% → 50% → 100%) via Traffik. Em caso
          de violação de SLO em qualquer estágio, auto-rollback dispara em
          até 5 minutos.
        </p>
        <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
          <li className="rounded border border-border bg-bg p-2">
            <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider text-text-muted">
              <CheckCircle2 className="h-3 w-3 text-success" /> PR
            </div>
            <div className="mt-0.5 font-mono text-[11.5px] text-success">aprovado</div>
          </li>
          <li className="rounded border border-border bg-bg p-2">
            <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider text-text-muted">
              <CheckCircle2 className="h-3 w-3 text-success" /> Infra
            </div>
            <div className="mt-0.5 font-mono text-[11.5px] text-success">provisionada</div>
          </li>
          <li className="rounded border border-border bg-bg p-2">
            <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider text-text-muted">
              <Activity className="h-3 w-3 text-info" /> Canário
            </div>
            <div className="mt-0.5 font-mono text-[11.5px] text-text-primary">1% → 100%</div>
          </li>
        </ul>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onApprove}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-success px-4 text-[12.5px] font-medium text-black transition hover:opacity-90"
          >
            <Rocket className="h-3.5 w-3.5" />
            Aprovar Deploy on Prod
          </button>
          <button
            type="button"
            onClick={onDecline}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-failure/40 bg-failure/10 px-4 text-[12.5px] font-medium text-failure transition hover:bg-failure/15"
          >
            <XCircle className="h-3.5 w-3.5" />
            Recusar
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Composite: stepper + card de aprovação quando aplicável. Único componente
 * que consumers precisam renderizar; ele encapsula a derivação de step
 * corrente, gates e os handlers de approval (chamando `completeStep` +
 * `resolveAgenticItem` do contexto).
 */
export function ExecutionTrackerView({ workflow }: { workflow: Workflow }) {
  const { completeStep, resolveAgenticItem } = useWorkflows()

  const currentStep =
    workflow.steps.find((s) => s.status === 'in-progress') ?? null
  const isAwaitingPr =
    currentStep?.id === EXEC_PR_STEP_ID && workflow.status === 'running'
  const isAwaitingDeploy =
    currentStep?.id === EXEC_DEPLOY_GATE_STEP_ID && workflow.status === 'running'

  const handleApprovePr = () => {
    if (!currentStep) return
    resolveAgenticItem(workflow.id, currentStep.id)
    completeStep(workflow.id, currentStep.id)
  }
  const handleApproveDeploy = () => {
    if (!currentStep) return
    completeStep(workflow.id, currentStep.id)
  }
  const handleDecline = () => {
    // Wireframe: no-op. Em produção, marcaria step como failed.
  }

  return (
    <div className="flex flex-col gap-3">
      <ExecutionStepper workflow={workflow} />
      {isAwaitingPr && currentStep && (
        <ExecPrApprovalCard
          step={currentStep}
          onApprove={handleApprovePr}
          onDecline={handleDecline}
        />
      )}
      {isAwaitingDeploy && currentStep && (
        <ExecDeployApprovalCard
          step={currentStep}
          onApprove={handleApproveDeploy}
          onDecline={handleDecline}
        />
      )}
    </div>
  )
}
