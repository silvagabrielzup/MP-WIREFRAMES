import {
  Plus,
  ArrowRight,
  ShieldCheck,
  Boxes,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock3,
  ExternalLink,
  UserCircle2,
  Inbox,
  Rocket,
  Hammer,
  Database,
  Network,
  Activity,
} from 'lucide-react'

type Status = 'running' | 'awaiting' | 'success' | 'failure'

type Workflow = {
  name: string
  sa: string
  step: string
  done: number
  total: number
  elapsed: string
  user: { initials: string; color: string }
  status: Status
  icon: typeof Rocket
}

const activeWorkflows: Workflow[] = [
  {
    name: 'onboarding-vanilla-brownfield',
    sa: 'ssa-pix-core',
    step: 'deploy',
    done: 3,
    total: 5,
    elapsed: '2m 13s',
    user: { initials: 'LL', color: 'bg-accent/25 text-accent' },
    status: 'running',
    icon: Rocket,
  },
  {
    name: 'rollout-canary',
    sa: 'ssa-conta-corrente',
    step: 'traffic-shift',
    done: 2,
    total: 4,
    elapsed: '6m 41s',
    user: { initials: 'MR', color: 'bg-info/20 text-info' },
    status: 'running',
    icon: Network,
  },
  {
    name: 'migration-pix-to-pix2',
    sa: 'ssa-pix-core',
    step: 'await-approval',
    done: 4,
    total: 7,
    elapsed: '14m 02s',
    user: { initials: 'TS', color: 'bg-warning/20 text-warning' },
    status: 'awaiting',
    icon: Database,
  },
  {
    name: 'build-and-test',
    sa: 'ssa-12345',
    step: 'sensors',
    done: 1,
    total: 3,
    elapsed: '0m 47s',
    user: { initials: 'AC', color: 'bg-success/20 text-success' },
    status: 'running',
    icon: Hammer,
  },
]

const recentSAs: {
  sa: string
  owner: string
  deploy: string
  workflow: string
  status: 'success' | 'failure'
}[] = [
  { sa: 'ssa-pix-core', owner: 'squad-pix', deploy: '4m', workflow: 'onboarding-vanilla', status: 'success' },
  { sa: 'ssa-conta-corrente', owner: 'squad-cc', deploy: '12m', workflow: 'rollout-canary', status: 'success' },
  { sa: 'ssa-credito-prefixado', owner: 'squad-credito', deploy: '38m', workflow: 'build-and-test', status: 'success' },
  { sa: 'ssa-12345', owner: 'squad-platform', deploy: '1h 02m', workflow: 'migration-postgres', status: 'success' },
  { sa: 'ssa-investimentos', owner: 'squad-invest', deploy: '2h 18m', workflow: 'rollback', status: 'failure' },
]

const attention: {
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




const statusDot: Record<Status, string> = {
  running: 'bg-live',
  awaiting: 'bg-warning',
  success: 'bg-success',
  failure: 'bg-failure',
}

const statusLabel: Record<Status, string> = {
  running: 'running',
  awaiting: 'awaiting human',
  success: 'success',
  failure: 'failure',
}

function EmptyState({ icon: Icon, title, hint }: { icon: typeof Inbox; title: string; hint: string }) {
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

      {/* Section 2 — Atividade recente (2 colunas) */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[15px] font-semibold tracking-tight">Atividade recente</h2>
            <span className="flex items-center gap-1.5 rounded-full border border-live/30 bg-live/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-live">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-live opacity-80" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
              </span>
              live
            </span>
            <span className="text-[12px] text-text-muted">atualizado há 4s</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Coluna esquerda — Precisa de atenção (card principal) */}
          <div className="rounded-lg border border-warning/40 bg-surface ring-1 ring-warning/15">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                <h3 className="text-[13.5px] font-semibold tracking-tight">Precisa de atenção</h3>
              </div>
              {attention.length > 0 && (
                <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-warning">
                  {attention.length} itens
                </span>
              )}
            </div>
            {attention.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="Tudo sob controle"
                hint="Nenhuma aprovação pendente, falha recente ou violação de policy."
              />
            ) : (
              <ul>
                {attention.map((a, i) => {
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

          {/* Coluna direita — SAs ON-PLAT recentemente atualizadas */}
          <div className="rounded-lg border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-text-muted" />
                <h3 className="text-[13.5px] font-semibold tracking-tight">
                  SAs ON-PLAT recentemente atualizadas
                </h3>
              </div>
              <a className="text-[11.5px] text-text-secondary hover:text-text-primary" href="/assets">
                ver catálogo
              </a>
            </div>
            {recentSAs.length === 0 ? (
              <EmptyState
                icon={Boxes}
                title="Nenhuma SA atualizada recentemente"
                hint="Quando uma SA ON-PLAT executar um workflow, ela aparecerá aqui."
              />
            ) : (
              <ul>
                {recentSAs.map((s) => (
                  <li
                    key={s.sa}
                    className="group grid cursor-pointer grid-cols-[1.4fr_1fr_0.9fr_0.5fr] items-center gap-3 border-b border-border px-4 py-2.5 last:border-b-0 hover:bg-[#181A1F]"
                  >
                    <div className="flex items-center gap-2">
                      <Boxes className="h-3.5 w-3.5 text-text-muted" />
                      <span className="font-mono text-[12.5px] text-text-primary">{s.sa}</span>
                    </div>
                    <div className="text-[12px] text-text-secondary">
                      <UserCircle2 className="mr-1 inline h-3.5 w-3.5 -translate-y-px text-text-muted" />
                      {s.owner}
                    </div>
                    <div className="truncate text-[11.5px] text-text-muted">{s.workflow}</div>
                    <div className="flex items-center justify-end gap-1.5 text-[11.5px]">
                      {s.status === 'success' ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-failure" />
                      )}
                      <span className="font-mono text-text-secondary">{s.deploy}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Section 3 — Workflows em andamento (real-time) */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[15px] font-semibold tracking-tight">Em execução agora</h2>
            <span className="flex items-center gap-1.5 rounded-full border border-live/30 bg-live/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-live">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-live opacity-80" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
              </span>
              live
            </span>
            <span className="text-[12px] text-text-muted">atualizado há 2s</span>
          </div>
          <a
            className="flex items-center gap-1 text-[12px] text-text-secondary hover:text-text-primary"
            href="/workflows"
          >
            ver todos <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          {activeWorkflows.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="Nenhum workflow em execução"
              hint="Quando alguém disparar um workflow ele aparece aqui em tempo real."
            />
          ) : (
            <>
              <div className="grid grid-cols-[1.6fr_1fr_1.2fr_0.8fr_0.8fr_0.6fr] border-b border-border bg-[#101115] px-4 py-2.5 text-[10.5px] font-medium uppercase tracking-wider text-text-muted">
                <div>Workflow</div>
                <div>SA</div>
                <div>Step atual</div>
                <div>Decorrido</div>
                <div>Status</div>
                <div className="text-right">Por</div>
              </div>
              {activeWorkflows.map((w) => {
                const progress = (w.done / w.total) * 100
                const Icon = w.icon
                return (
                  <a
                    key={w.name + w.sa}
                    href="/workflows/detail"
                    className="group grid cursor-pointer grid-cols-[1.6fr_1fr_1.2fr_0.8fr_0.8fr_0.6fr] items-center border-b border-border px-4 py-3 text-[13px] last:border-b-0 hover:bg-[#181A1F]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${statusDot[w.status]} ${
                          w.status === 'running' ? 'animate-pulse-live' : ''
                        }`}
                      />
                      <Icon className="h-3.5 w-3.5 text-text-muted" />
                      <span className="font-medium text-text-primary">{w.name}</span>
                    </div>
                    <div className="font-mono text-[12px] text-text-secondary">{w.sa}</div>
                    <div>
                      <div className="flex items-center gap-2 text-[12.5px] text-text-secondary">
                        <span className="text-text-primary">{w.step}</span>
                        <span className="text-text-muted">
                          ({w.done}/{w.total})
                        </span>
                      </div>
                      <div className="mt-1.5 h-1 w-full max-w-[180px] overflow-hidden rounded-full bg-[#22232A]">
                        <div
                          className={`h-full rounded-full ${
                            w.status === 'awaiting' ? 'bg-warning' : 'bg-live'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="font-mono text-[12px] text-text-secondary">{w.elapsed}</div>
                    <div>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11px] ${
                          w.status === 'running'
                            ? 'border-live/30 bg-live/10 text-live'
                            : w.status === 'awaiting'
                            ? 'border-warning/30 bg-warning/10 text-warning'
                            : w.status === 'success'
                            ? 'border-success/30 bg-success/10 text-success'
                            : 'border-failure/30 bg-failure/10 text-failure'
                        }`}
                      >
                        {statusLabel[w.status]}
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-medium ${w.user.color}`}
                      >
                        {w.user.initials}
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 text-text-muted opacity-0 transition group-hover:opacity-100" />
                    </div>
                  </a>
                )
              })}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
