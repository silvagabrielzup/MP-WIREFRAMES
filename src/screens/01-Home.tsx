import { Link } from 'react-router-dom'
import {
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  Workflow as WorkflowIcon,
  Terminal,
  GitBranch,
  Settings,
  Play,
  Rocket,
  Activity,
  Loader2,
  MoreHorizontal,
  Check,
  Sparkles,
  LayoutGrid,
} from 'lucide-react'

const pendingApprovals: {
  workflow: string
  action: string
  sa: string
  requester: { initials: string; color: string }
  ago: string
  blocking: boolean
}[] = [
  {
    workflow: 'onboarding-vanilla-brownfield',
    action: 'Aprovar policy override · network egress',
    sa: 'ssa-pix-core',
    requester: { initials: 'LL', color: 'bg-accent/25 text-accent' },
    ago: '4m',
    blocking: true,
  },
  {
    workflow: 'migration-pix-to-pix2',
    action: 'Aprovar plano de backfill · 18M registros',
    sa: 'ssa-pix-core',
    requester: { initials: 'MR', color: 'bg-info/20 text-info' },
    ago: '14m',
    blocking: true,
  },
  {
    workflow: 'rollout-canary',
    action: 'Aprovar traffic-shift para 50%',
    sa: 'ssa-conta-corrente',
    requester: { initials: 'TS', color: 'bg-warning/20 text-warning' },
    ago: '37m',
    blocking: false,
  },
  {
    workflow: 'onboarding-vanilla-brownfield',
    action: 'Aprovar provisionamento Kaptain · EKS staging',
    sa: 'ssa-credito-prefixado',
    requester: { initials: 'AC', color: 'bg-success/20 text-success' },
    ago: '1h 12m',
    blocking: false,
  },
  {
    workflow: 'rollback',
    action: 'Aprovar restauração do snapshot pré-migração',
    sa: 'ssa-investimentos',
    requester: { initials: 'PV', color: 'bg-failure/20 text-failure' },
    ago: '2h 41m',
    blocking: true,
  },
]

const appHubAlerts: {
  kind: 'approval' | 'failure' | 'policy'
  title: string
  detail: string
  ago: string
}[] = [
  { kind: 'approval', title: 'Aprovação Komply pendente', detail: 'migration-pix-to-pix2 · ssa-pix-core', ago: '14m' },
  { kind: 'approval', title: 'PR aguardando tech lead', detail: 'feat: shadow traffic · ssa-conta-corrente', ago: '37m' },
  { kind: 'failure', title: 'Workflow falhou', detail: 'rollback · ssa-investimentos · Pantheon queue overflow', ago: '2h' },
  { kind: 'failure', title: 'Sensor security FAIL', detail: 'ssa-credito-prefixado · CVE-2025-3148 em dependência', ago: '3h' },
  { kind: 'policy', title: 'Nova violação de policy', detail: 'ssa-12345 · network egress fora da allowlist', ago: '5h' },
]

type StepStatus = 'done' | 'in-progress' | 'not-started'

type OnboardingStep = {
  id: number
  title: string
  description: string
  icon: typeof Terminal
  cta: string
  estimate: string
  status: StepStatus
  badge?: string
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Instalar CLI do StackSpot',
    description: 'Binário oficial + autenticação inicial com SSO Itaú.',
    icon: Terminal,
    cta: '/cli/install',
    estimate: '~2min',
    status: 'done',
    badge: 'CLI v1.4.2 instalado',
  },
  {
    id: 2,
    title: 'Permissionar acesso ao Itaú Cloud',
    description: 'Solicitar role e aguardar aprovação automatizada.',
    icon: ShieldCheck,
    cta: '/access/request',
    estimate: '~5min',
    status: 'done',
    badge: 'role granted',
  },
  {
    id: 3,
    title: 'Selecionar repos pra migração',
    description: 'Escolher quais repositórios entram na primeira leva.',
    icon: GitBranch,
    cta: '/migration/repo-picker',
    estimate: '~3min',
    status: 'done',
    badge: '2 repos',
  },
  {
    id: 4,
    title: 'Configurar workflow de onboarding',
    description: 'Parametrizar verbos da Operação Vanilla pro repo selecionado.',
    icon: Settings,
    cta: '/workflows/new',
    estimate: '~8min',
    status: 'in-progress',
    badge: '3/5 campos preenchidos',
  },
  {
    id: 5,
    title: 'Disparar primeira execução',
    description: 'Rodar onboarding-vanilla-brownfield em dev pela primeira vez.',
    icon: Play,
    cta: '/workflows',
    estimate: '~1min',
    status: 'not-started',
  },
  {
    id: 6,
    title: 'Validar resultado em dev',
    description: 'Conferir saúde do workflow, logs e checks de Komply.',
    icon: CheckCircle2,
    cta: '/workflows/wf-7a2b1c',
    estimate: '~10min',
    status: 'not-started',
  },
  {
    id: 7,
    title: 'Promover pra homologação',
    description: 'Disparar rollout canário com gate humano em 50%.',
    icon: Rocket,
    cta: '/applications/ssa-pix-core',
    estimate: '~12min',
    status: 'not-started',
  },
  {
    id: 8,
    title: 'Configurar observabilidade',
    description: 'Linkar dashboards Datadog e monitores p99 / erro %.',
    icon: Activity,
    cta: '/applications/ssa-pix-core?tab=obs',
    estimate: '~6min',
    status: 'not-started',
  },
]

const appHealth: {
  sa: string
  title: string
  level: 'healthy' | 'warn' | 'fail'
  metric: string
  detail: string
}[] = [
  {
    sa: 'ssa-pix-core',
    title: 'ssa-pix-core',
    level: 'warn',
    metric: 'p99 acima do baseline',
    detail: 'pico de 412ms · auto-mitigação em curso',
  },
  {
    sa: 'ssa-conta-corrente',
    title: 'ssa-conta-corrente',
    level: 'healthy',
    metric: 'uptime 99.99% · 11 deploys 7d',
    detail: 'rollouts limpos, sem regressões',
  },
  {
    sa: 'ssa-investimentos',
    title: 'ssa-investimentos',
    level: 'fail',
    metric: 'rollback em curso',
    detail: 'Pantheon queue overflow · 24min',
  },
  {
    sa: 'ssa-credito-prefixado',
    title: 'ssa-credito-prefixado',
    level: 'healthy',
    metric: 'uptime 99.97% · 8 deploys 7d',
    detail: 'sensores ok · 0 violações 24h',
  },
]

const healthMeta: Record<
  (typeof appHealth)[number]['level'],
  { label: string; pill: string; dot: string; ring: string }
> = {
  healthy: {
    label: 'healthy',
    pill: 'border-success/30 bg-success/10 text-success',
    dot: 'bg-success',
    ring: 'border-border',
  },
  warn: {
    label: 'warn',
    pill: 'border-warning/30 bg-warning/10 text-warning',
    dot: 'bg-warning',
    ring: 'border-warning/40',
  },
  fail: {
    label: 'fail',
    pill: 'border-failure/30 bg-failure/10 text-failure',
    dot: 'bg-failure',
    ring: 'border-failure/40 ring-1 ring-failure/15',
  },
}

function EmptyState({ icon: Icon, title, hint }: { icon: typeof CheckCircle2; title: string; hint: string }) {
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

function OnboardingStepRow({ step }: { step: OnboardingStep }) {
  const Icon = step.icon
  const isDone = step.status === 'done'
  const isInProgress = step.status === 'in-progress'

  if (isDone) {
    return (
      <li className="flex items-center gap-3 border-b border-border px-4 py-2.5 last:border-b-0 opacity-60">
        <StepCheckbox status="done" />
        <Icon className="h-3.5 w-3.5 flex-none text-text-muted" />
        <span className="flex-1 truncate text-[12.5px] text-text-muted line-through">{step.title}</span>
        {step.badge && (
          <span className="font-mono text-[10.5px] text-text-muted">{step.badge}</span>
        )}
      </li>
    )
  }

  return (
    <li
      className={`flex items-start gap-3 border-b border-border px-4 py-3 last:border-b-0 hover:bg-[#181A1F] ${
        isInProgress ? 'bg-accent/5' : ''
      } ${!isInProgress && step.id > 4 ? 'opacity-80' : ''}`}
    >
      <StepCheckbox status={step.status} />
      <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-md bg-[#181A1F] text-text-secondary">
        <Icon className="h-3.5 w-3.5" />
      </span>
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
        <span className="font-mono text-[11px] text-text-muted">{step.estimate}</span>
        <Link
          to={step.cta}
          className="inline-flex items-center gap-1 text-[11.5px] text-text-secondary hover:text-text-primary"
        >
          Abrir
          <ArrowRight className="h-3 w-3" />
        </Link>
        <button
          aria-label="opções"
          className="flex h-6 w-6 items-center justify-center rounded text-text-muted hover:bg-bg hover:text-text-primary"
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </div>
    </li>
  )
}

function OnboardingCard() {
  const total = onboardingSteps.length
  const doneCount = onboardingSteps.filter((s) => s.status === 'done').length
  const pct = Math.round((doneCount / total) * 100)

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          <h3 className="text-[14px] font-semibold tracking-tight">Próximos passos</h3>
          <span className="rounded border border-border bg-bg px-1.5 py-0.5 text-[10.5px] uppercase tracking-wider text-text-muted">
            pós-migração · 12 mai
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11.5px] text-text-secondary">
            <span className="font-mono text-text-primary">{doneCount}</span> de{' '}
            <span className="font-mono text-text-primary">{total}</span> passos ·{' '}
            <span className="font-mono text-text-primary">{pct}%</span> completo
          </span>
          <div className="h-1 w-24 overflow-hidden rounded-full bg-bg">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
      <ul>
        {onboardingSteps.map((s) => (
          <OnboardingStepRow key={s.id} step={s} />
        ))}
      </ul>
    </div>
  )
}

function HealthCard({ item }: { item: (typeof appHealth)[number] }) {
  const m = healthMeta[item.level]
  return (
    <div className={`rounded-lg border bg-surface px-4 py-3.5 ${m.ring}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`h-1.5 w-1.5 flex-none rounded-full ${m.dot}`} />
            <h3 className="truncate font-mono text-[13.5px] text-text-primary">{item.title}</h3>
          </div>
          <div className="mt-1.5 text-[12px] text-text-secondary">{item.metric}</div>
          <div className="mt-0.5 text-[11px] text-text-muted">{item.detail}</div>
        </div>
        <span
          className={`flex-none rounded-full border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide ${m.pill}`}
        >
          {m.label}
        </span>
      </div>
      <div className="mt-3 border-t border-border pt-2.5">
        <Link
          to={`/application-hub/${item.sa}`}
          className="inline-flex items-center gap-1 text-[11.5px] text-text-secondary hover:text-text-primary"
        >
          Abrir aplicação
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="space-y-10">
      {/* Section 1 — Hero compacto */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight">Bom dia, Luigi</h1>
          <p className="mt-1.5 text-[13.5px] text-text-secondary">
            Você tem{' '}
            <span className="text-text-primary">3 workflows ativos</span> em{' '}
            <span className="text-text-primary">2 SAs</span> e{' '}
            <span className="text-warning">1 aprovação pendente</span>.
          </p>
        </div>
        <button className="inline-flex h-10 items-center gap-2 self-start rounded-md bg-accent px-4 text-[13px] font-medium text-black transition hover:bg-accent-hover sm:self-auto">
          <Plus className="h-4 w-4" />
          Onboardar nova SA
        </button>
      </section>

      {/* Section 2 — Onboarding card */}
      <section>
        <OnboardingCard />
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
          {/* Coluna esquerda — Fluxos agênticos pendentes aprovação */}
          <div className="rounded-lg border border-warning/40 bg-surface ring-1 ring-warning/15">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <WorkflowIcon className="h-3.5 w-3.5 text-warning" />
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
                        <span className="truncate font-mono text-[12.5px] text-text-primary">{p.workflow}</span>
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

          {/* Coluna direita — Alertas da Application Hub */}
          <div className="rounded-lg border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-warning" />
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

      {/* Section 4 — Saúde da Application Hub */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LayoutGrid className="h-3.5 w-3.5 text-text-muted" />
            <h2 className="text-[15px] font-semibold tracking-tight">Saúde da Application Hub</h2>
            <span className="text-[12px] text-text-muted">{appHealth.length} aplicações</span>
          </div>
          <Link
            to="/application-hub"
            className="inline-flex items-center gap-1 text-[11.5px] text-text-secondary hover:text-text-primary"
          >
            ver tudo
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {appHealth.map((h) => (
            <HealthCard key={h.sa} item={h} />
          ))}
        </div>
      </section>
    </div>
  )
}
