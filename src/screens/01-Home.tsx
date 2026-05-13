import {
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  Workflow as WorkflowIcon,
  ListChecks,
  Circle,
  CalendarClock,
  GitPullRequest,
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

type Priority = 'high' | 'medium' | 'low'

const todos: {
  title: string
  detail: string
  priority: Priority
  due: string
  icon: typeof GitPullRequest
}[] = [
  {
    title: 'Revisar PR feat: shadow traffic',
    detail: 'ssa-conta-corrente · 3 arquivos · agente Claude Code',
    priority: 'high',
    due: 'hoje',
    icon: GitPullRequest,
  },
  {
    title: 'Aprovar policy override Komply',
    detail: 'migration-pix-to-pix2 · network egress · ssa-pix-core',
    priority: 'high',
    due: 'hoje',
    icon: ShieldCheck,
  },
  {
    title: 'Validar SLO de p99 pós-rollback',
    detail: 'ssa-investimentos · janela de 24h após o rollback',
    priority: 'medium',
    due: 'amanhã',
    icon: CalendarClock,
  },
]

const priorityChip: Record<Priority, string> = {
  high: 'border-failure/30 bg-failure/10 text-failure',
  medium: 'border-warning/30 bg-warning/10 text-warning',
  low: 'border-border bg-bg text-text-muted',
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

      {/* Section 2 — Lista de tarefas */}
      <section>
        <div className="mb-3 flex items-center gap-2.5">
          <h2 className="text-[15px] font-semibold tracking-tight">Lista de tarefas</h2>
          <span className="text-[12px] text-text-muted">{todos.length} pessoais</span>
        </div>

        <div className="rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <ListChecks className="h-3.5 w-3.5 text-text-muted" />
              <h3 className="text-[13.5px] font-semibold tracking-tight">Suas tarefas</h3>
            </div>
            <button className="text-[11.5px] text-text-secondary hover:text-text-primary">
              ver todas
            </button>
          </div>
          {todos.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="Nenhuma tarefa pendente"
              hint="Quando alguém te marcar como reviewer ou aprovador, aparece aqui."
            />
          ) : (
            <ul>
              {todos.map((t, i) => {
                const Icon = t.icon
                return (
                  <li
                    key={i}
                    className="group flex cursor-pointer items-start gap-3 border-b border-border px-4 py-3 last:border-b-0 hover:bg-[#181A1F]"
                  >
                    <button
                      className="mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded border border-border bg-bg hover:border-accent"
                      aria-label="marcar como concluído"
                    >
                      <Circle className="h-2.5 w-2.5 text-text-muted opacity-0 group-hover:opacity-100" />
                    </button>
                    <Icon className="mt-0.5 h-3.5 w-3.5 flex-none text-text-muted" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12.5px] text-text-primary">{t.title}</div>
                      <div className="truncate text-[11.5px] text-text-muted">{t.detail}</div>
                    </div>
                    <div className="flex flex-none items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${priorityChip[t.priority]}`}
                      >
                        {t.priority}
                      </span>
                      <span className="font-mono text-[11px] text-text-muted">{t.due}</span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>

      {/* Section 3 — Importante atenção (2 colunas) */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[15px] font-semibold tracking-tight">Importante atenção</h2>
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
                  Fluxos agênticos pendentes de aprovação
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
    </div>
  )
}
