import {
  Plus,
  ArrowRight,
  ShieldCheck,
  Hammer,
  Rocket,
  Network,
  GitBranch,
  Database,
  Boxes,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock3,
  ExternalLink,
  UserCircle2,
} from 'lucide-react'

type Status = 'running' | 'awaiting' | 'success' | 'failure'

const activeWorkflows: {
  name: string
  sa: string
  step: string
  done: number
  total: number
  elapsed: string
  user: { initials: string; color: string }
  status: Status
}[] = [
  {
    name: 'onboarding-vanilla-brownfield',
    sa: 'ssa-pix-core',
    step: 'deploy',
    done: 3,
    total: 5,
    elapsed: '2m 13s',
    user: { initials: 'LL', color: 'bg-accent/25 text-accent' },
    status: 'running',
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
  },
]

const engines: {
  name: string
  desc: string
  icon: typeof ShieldCheck
  status: 'ok' | 'warn' | 'fail'
  throughput: string
  queue: number
}[] = [
  { name: 'Kaptain', desc: 'CD / AWS', icon: Rocket, status: 'ok', throughput: '142 ops/min', queue: 3 },
  { name: 'Komply', desc: 'Policies', icon: ShieldCheck, status: 'warn', throughput: '38 ops/min', queue: 12 },
  { name: 'Konstructor', desc: 'Build', icon: Hammer, status: 'ok', throughput: '76 ops/min', queue: 1 },
  { name: 'Orkestra', desc: 'K8s', icon: Boxes, status: 'ok', throughput: '210 ops/min', queue: 0 },
  { name: 'Traffik', desc: 'Routing / DNS', icon: Network, status: 'ok', throughput: '89 ops/min', queue: 2 },
  { name: 'Pantheon', desc: 'Kafka', icon: GitBranch, status: 'fail', throughput: '0 ops/min', queue: 47 },
  { name: 'Migration', desc: 'Data migration', icon: Database, status: 'ok', throughput: '12 ops/min', queue: 4 },
]

const recentSAs = [
  { sa: 'ssa-pix-core', owner: 'squad-pix', deploy: '4m', workflow: 'onboarding-vanilla', status: 'success' as const },
  { sa: 'ssa-conta-corrente', owner: 'squad-cc', deploy: '12m', workflow: 'rollout-canary', status: 'success' as const },
  { sa: 'ssa-credito-prefixado', owner: 'squad-credito', deploy: '38m', workflow: 'build-and-test', status: 'success' as const },
  { sa: 'ssa-12345', owner: 'squad-platform', deploy: '1h 02m', workflow: 'migration-postgres', status: 'success' as const },
  { sa: 'ssa-investimentos', owner: 'squad-invest', deploy: '2h 18m', workflow: 'rollback', status: 'failure' as const },
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

const engineStatusColor: Record<'ok' | 'warn' | 'fail', string> = {
  ok: 'bg-success',
  warn: 'bg-warning',
  fail: 'bg-failure',
}

const engineRing: Record<'ok' | 'warn' | 'fail', string> = {
  ok: 'ring-success/20',
  warn: 'ring-warning/30',
  fail: 'ring-failure/30',
}

export default function Home() {
  return (
    <div className="space-y-10">
      {/* Section 1 — Hero */}
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

      {/* Section 2 — Workflows ativos */}
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
          <a className="flex items-center gap-1 text-[12px] text-text-secondary hover:text-text-primary" href="/workflows">
            ver todos <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-surface">
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
            return (
              <div
                key={w.name + w.sa}
                className="group grid cursor-pointer grid-cols-[1.6fr_1fr_1.2fr_0.8fr_0.8fr_0.6fr] items-center border-b border-border px-4 py-3 text-[13px] last:border-b-0 hover:bg-[#181A1F]"
              >
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${statusDot[w.status]} ${w.status === 'running' ? 'animate-pulse-live' : ''}`} />
                  <span className="font-medium text-text-primary">{w.name}</span>
                </div>
                <div className="font-mono text-[12px] text-text-secondary">{w.sa}</div>
                <div>
                  <div className="flex items-center gap-2 text-[12.5px] text-text-secondary">
                    <span className="text-text-primary">{w.step}</span>
                    <span className="text-text-muted">({w.done}/{w.total})</span>
                  </div>
                  <div className="mt-1.5 h-1 w-full max-w-[180px] overflow-hidden rounded-full bg-[#22232A]">
                    <div
                      className={`h-full rounded-full ${w.status === 'awaiting' ? 'bg-warning' : 'bg-live'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className="font-mono text-[12px] text-text-secondary">{w.elapsed}</div>
                <div>
                  <span className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11px] ${
                    w.status === 'running' ? 'border-live/30 bg-live/10 text-live' :
                    w.status === 'awaiting' ? 'border-warning/30 bg-warning/10 text-warning' :
                    w.status === 'success' ? 'border-success/30 bg-success/10 text-success' :
                    'border-failure/30 bg-failure/10 text-failure'
                  }`}>
                    {statusLabel[w.status]}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-medium ${w.user.color}`}>
                    {w.user.initials}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-text-muted opacity-0 transition group-hover:opacity-100" />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Section 3 — Saúde dos motores */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold tracking-tight">Saúde dos motores</h2>
          <a className="flex items-center gap-1 text-[12px] text-text-secondary hover:text-text-primary" href="/control-planes">
            painel completo <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
          {engines.map((e) => {
            const Icon = e.icon
            return (
              <div
                key={e.name}
                className={`group flex cursor-pointer flex-col gap-2 rounded-lg border border-border bg-surface p-3.5 ring-1 ${engineRing[e.status]} transition hover:border-border-strong hover:bg-[#181A1F]`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1E2027]">
                    <Icon className="h-3.5 w-3.5 text-text-secondary group-hover:text-text-primary" />
                  </div>
                  <span className={`h-2 w-2 rounded-full ${engineStatusColor[e.status]}`} />
                </div>
                <div>
                  <div className="text-[13px] font-medium text-text-primary">{e.name}</div>
                  <div className="text-[10.5px] uppercase tracking-wide text-text-muted">{e.desc}</div>
                </div>
                <div className="mt-1 flex items-baseline justify-between font-mono text-[11px]">
                  <span className="text-text-secondary">{e.throughput}</span>
                  <span className={e.queue > 10 ? 'text-warning' : 'text-text-muted'}>q:{e.queue}</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Section 4 — Atividade recente */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-[13.5px] font-semibold tracking-tight">SAs ON-PLAT recentemente atualizadas</h3>
            <a className="text-[11.5px] text-text-secondary hover:text-text-primary" href="/assets">ver catálogo</a>
          </div>
          <ul>
            {recentSAs.map((s) => (
              <li key={s.sa} className="group grid grid-cols-[1.4fr_1fr_0.9fr_0.5fr] items-center gap-3 border-b border-border px-4 py-2.5 last:border-b-0 hover:bg-[#181A1F]">
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
        </div>

        <div className="rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-[13.5px] font-semibold tracking-tight">Precisa de atenção</h3>
            <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-warning">
              {attention.length} itens
            </span>
          </div>
          <ul>
            {attention.map((a, i) => {
              const Icon = a.kind === 'approval' ? Clock3 : a.kind === 'failure' ? AlertTriangle : ShieldCheck
              const color =
                a.kind === 'approval'
                  ? 'text-warning bg-warning/15'
                  : a.kind === 'failure'
                  ? 'text-failure bg-failure/15'
                  : 'text-info bg-info/15'
              return (
                <li key={i} className="group flex cursor-pointer items-center gap-3 border-b border-border px-4 py-2.5 last:border-b-0 hover:bg-[#181A1F]">
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
        </div>
      </section>
    </div>
  )
}
