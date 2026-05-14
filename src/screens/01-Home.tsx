import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  Workflow as WorkflowIcon,
  Loader2,
  MoreHorizontal,
  Check,
  Sparkles,
  Boxes,
} from 'lucide-react'
import { useWorkflows } from '../contexts/WorkflowsProvider'
import { workflows as workflowTemplates } from '../data/database'

type StepStatus = 'done' | 'in-progress' | 'not-started'

type OnboardingStep = {
  id: number
  stepId: string
  title: string
  description: string
  cta?: string
  estimate?: string
  status: StepStatus
  badge?: string
}

const pendingApprovals: {
  workflow: string
  action: string
  sa: string
  requester: { initials: string; color: string }
  ago: string
  blocking: boolean
}[] = []

const appHubAlerts: {
  kind: 'approval' | 'failure' | 'policy'
  title: string
  detail: string
  ago: string
}[] = []

function EmptyState({
  icon: Icon,
  title,
  hint,
}: {
  icon: typeof CheckCircle2
  title: string
  hint: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-[#181A1F]">
        <Icon className="h-4 w-4 text-text-muted" />
      </span>
      <div className="text-[13px] font-medium text-text-secondary">{title}</div>
      <div className="max-w-[280px] text-[11.5px] text-text-muted">{hint}</div>
    </div>
  )
}

function LiveBadge({ ago }: { ago: string }) {
  return (
    <>
      <span className="flex items-center gap-1.5 rounded-full border border-live/30 bg-live/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-live">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-live opacity-80" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
        </span>
        live
      </span>
      <span className="text-[12px] text-text-muted">atualizado há {ago}</span>
    </>
  )
}

function StepCheckbox({ status }: { status: StepStatus }) {
  if (status === 'done') {
    return (
      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-success/40 bg-success/10">
        <Check className="h-3.5 w-3.5 text-success" />
      </span>
    )
  }
  if (status === 'in-progress') {
    return (
      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-accent bg-accent/10">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
      </span>
    )
  }
  return <span className="h-6 w-6 flex-none rounded-full border border-border bg-bg" />
}

function OnboardingStepRow({
  step,
  attenuated,
}: {
  step: OnboardingStep
  attenuated: boolean
}) {
  const isDone = step.status === 'done'
  const isInProgress = step.status === 'in-progress'

  if (isDone) {
    return (
      <li className="flex items-center gap-3 border-b border-border px-4 py-2.5 opacity-60 last:border-b-0">
        <StepCheckbox status="done" />
        <span className="flex-1 truncate text-[12.5px] text-text-muted line-through">
          {step.title}
        </span>
        {step.badge && (
          <span className="font-mono text-[10.5px] text-text-muted">{step.badge}</span>
        )}
      </li>
    )
  }

  return (
    <li
      className={`flex items-start gap-3 border-b border-border px-4 py-3 last:border-b-0 hover:bg-[#181A1F] ${
        isInProgress ? 'border-l-2 border-l-accent bg-accent/5' : ''
      } ${attenuated ? 'opacity-80' : ''}`}
    >
      <StepCheckbox status={step.status} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-[12.5px] font-medium text-text-primary">{step.title}</span>
          {isInProgress && (
            <span className="flex-none rounded border border-accent/40 bg-accent/10 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-accent">
              em curso
            </span>
          )}
        </div>
        <div className="mt-0.5 truncate text-[11.5px] text-text-muted">{step.description}</div>
        {step.badge && (
          <div className="mt-1 inline-flex items-center gap-1 rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[10.5px] text-text-secondary">
            {step.badge}
          </div>
        )}
      </div>
      <div className="flex flex-none items-center gap-3">
        {step.estimate && (
          <span className="font-mono text-[11px] text-text-muted">{step.estimate}</span>
        )}
        {step.cta && (
          <Link
            to={step.cta}
            className="inline-flex items-center gap-1 text-[11.5px] text-text-secondary hover:text-text-primary"
          >
            Abrir
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
        <button
          aria-label="opções"
          title="dispensar · marcar como feito · lembrar depois"
          className="flex h-6 w-6 items-center justify-center rounded text-text-muted hover:bg-bg hover:text-text-primary"
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </div>
    </li>
  )
}

function OnboardingPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-[#181A1F]">
        <Boxes className="h-5 w-5 text-text-muted" />
      </span>
      <h3 className="text-[15px] font-semibold tracking-tight text-text-primary">
        Nada para fazer agora
      </h3>
      <p className="max-w-[420px] text-[12.5px] text-text-secondary">
        Você ainda não tem uma jornada de onboarding ativa. Escolha um workflow no Assets Catalog
        para que os próximos passos apareçam aqui.
      </p>
      <Link
        to="/catalog"
        className="mt-2 inline-flex h-9 items-center gap-2 rounded-md bg-accent px-4 text-[12.5px] font-medium text-black transition hover:bg-accent-hover"
      >
        <Boxes className="h-4 w-4" />
        Ir para o Assets Catalog
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}

function OnboardingCard({
  steps,
  contextLabel,
}: {
  steps: OnboardingStep[]
  contextLabel?: string
}) {
  if (steps.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <h3 className="text-[14px] font-semibold tracking-tight">Próximos passos</h3>
          </div>
        </div>
        <OnboardingPlaceholder />
      </div>
    )
  }

  const total = steps.length
  const doneCount = steps.filter((s) => s.status === 'done').length
  const pct = Math.round((doneCount / total) * 100)
  const inProgressIdx = steps.findIndex((s) => s.status === 'in-progress')

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          <h3 className="text-[14px] font-semibold tracking-tight">Próximos passos</h3>
          {contextLabel && (
            <span className="rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[10.5px] text-text-secondary">
              {contextLabel}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11.5px] text-text-secondary">
            <span className="font-mono text-text-primary">{doneCount}</span> de{' '}
            <span className="font-mono text-text-primary">{total}</span> passos ·{' '}
            <span className="font-mono text-text-primary">{pct}%</span> completo
          </span>
          <div className="h-1 w-24 overflow-hidden rounded-full bg-bg">
            <div className="h-full bg-accent transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
      <ul>
        {steps.map((s, i) => {
          const attenuated =
            s.status === 'not-started' && inProgressIdx >= 0 && i > inProgressIdx
          return <OnboardingStepRow key={s.id} step={s} attenuated={attenuated} />
        })}
      </ul>
    </div>
  )
}

export default function Home() {
  const { workflows: instances } = useWorkflows()
  const lastWorkflow = instances.length > 0 ? instances[instances.length - 1] : null

  const onboardingSteps: OnboardingStep[] = lastWorkflow
    ? (() => {
        const template = workflowTemplates.find((t) => t.id === lastWorkflow.templateId)
        return lastWorkflow.steps.map((s, i) => {
          const tmplStep = template?.onboardingSteps.find((ts) => ts.id === s.id)
          const status: StepStatus =
            s.status === 'in-progress'
              ? 'in-progress'
              : s.status === 'done'
              ? 'done'
              : 'not-started'
          return {
            id: i + 1,
            stepId: s.id,
            title: s.title,
            description: tmplStep?.description ?? '',
            status,
          }
        })
      })()
    : []

  return (
    <div className="space-y-10">
      {/* Section 1 — Hero compacto */}
      <section>
        <h1 className="text-[26px] font-semibold tracking-tight">Bom dia, Luigi</h1>
        <p className="mt-1.5 text-[13.5px] text-text-secondary">
          Sem workflows ativos no momento — comece onboardando uma SA ou escolhendo um workflow no catálogo.
        </p>
      </section>

      {/* Section 2 — Onboarding card */}
      <section>
        <OnboardingCard
          steps={onboardingSteps}
          contextLabel={lastWorkflow?.templateName}
        />
      </section>

      {/* Section 3 — Resumo de pontos de atenção */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[15px] font-semibold tracking-tight">Pontos de atenção</h2>
            <LiveBadge ago="4s" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <WorkflowIcon className="h-3.5 w-3.5 text-text-muted" />
                <h3 className="text-[13.5px] font-semibold tracking-tight">
                  Fluxos agênticos pendentes aprovação
                </h3>
              </div>
              {pendingApprovals.length > 0 && (
                <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-warning">
                  {pendingApprovals.length} aguardando
                </span>
              )}
            </div>
            {pendingApprovals.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="Nenhuma aprovação pendente"
                hint="Quando um workflow agêntico precisar de input humano, ele aparece aqui."
              />
            ) : (
              <ul>
                {pendingApprovals.map((p) => (
                  <li
                    key={p.workflow + p.sa + p.ago}
                    className="group flex cursor-pointer items-start gap-3 border-b border-border px-4 py-3 last:border-b-0 hover:bg-[#181A1F]"
                  >
                    <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-md bg-warning/15 text-warning">
                      <Clock3 className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-mono text-[12.5px] text-text-primary">
                          {p.workflow}
                        </span>
                        {p.blocking && (
                          <span className="flex-none rounded border border-failure/30 bg-failure/10 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-failure">
                            blocking
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 truncate text-[12px] text-text-secondary">{p.action}</div>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-text-muted">
                        <span className="font-mono">{p.sa}</span>
                        <span>·</span>
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-full text-[9.5px] font-medium ${p.requester.color}`}
                        >
                          {p.requester.initials}
                        </span>
                        <span className="font-mono">há {p.ago}</span>
                      </div>
                    </div>
                    <ArrowRight className="mt-1 h-3.5 w-3.5 flex-none text-text-muted opacity-0 transition group-hover:opacity-100" />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-lg border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-text-muted" />
                <h3 className="text-[13.5px] font-semibold tracking-tight">Alertas da Application Hub</h3>
              </div>
              {appHubAlerts.length > 0 && (
                <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-warning">
                  {appHubAlerts.length} itens
                </span>
              )}
            </div>
            {appHubAlerts.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="Tudo sob controle"
                hint="Nenhuma aprovação pendente, falha recente ou violação de policy."
              />
            ) : (
              <ul>
                {appHubAlerts.map((a, i) => {
                  const Icon =
                    a.kind === 'approval' ? Clock3 : a.kind === 'failure' ? AlertTriangle : ShieldCheck
                  const color =
                    a.kind === 'approval'
                      ? 'text-warning bg-warning/15'
                      : a.kind === 'failure'
                      ? 'text-failure bg-failure/15'
                      : 'text-info bg-info/15'
                  return (
                    <li
                      key={i}
                      className="group flex cursor-pointer items-center gap-3 border-b border-border px-4 py-2.5 last:border-b-0 hover:bg-[#181A1F]"
                    >
                      <span className={`flex h-7 w-7 flex-none items-center justify-center rounded-md ${color}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[12.5px] text-text-primary">{a.title}</div>
                        <div className="truncate text-[11.5px] text-text-muted">{a.detail}</div>
                      </div>
                      <span className="font-mono text-[11px] text-text-muted">{a.ago}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-text-muted opacity-0 transition group-hover:opacity-100" />
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
