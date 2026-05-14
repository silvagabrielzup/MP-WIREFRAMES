import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  CheckCircle2,
  XCircle,
  Loader2,
  CircleSlash,
  X,
  ChevronsRight,
  ChevronsLeft,
} from 'lucide-react'

type Status = 'running' | 'success' | 'failed' | 'awaiting' | 'cancelled'

type Workflow = {
  id: string
  name: string
  sa: string
  status: Status
  currentStep: string
  duration: string
  cost: number
  steps: { name: string; status: 'success' | 'running' | 'pending' | 'failed' | 'awaiting' | 'skipped' }[]
}

const workflows: Workflow[] = [
  {
    id: 'wf-9a31',
    name: 'onboarding-vanilla-brownfield',
    sa: 'ssa-pix-core',
    status: 'running',
    currentStep: 'kaptain.deploy · provisionando EKS',
    duration: '4m 39s',
    cost: 1.42,
    steps: [
      { name: 'github.clone', status: 'success' },
      { name: 'konstructor.build', status: 'success' },
      { name: 'konstructor.sbom', status: 'success' },
      { name: 'komply.evaluate', status: 'success' },
      { name: 'kaptain.deploy', status: 'running' },
      { name: 'orkestra.apply', status: 'pending' },
      { name: 'kaptain.shift', status: 'pending' },
    ],
  },
  {
    id: 'wf-7b48',
    name: 'migration-pix-to-pix2',
    sa: 'ssa-pix-core',
    status: 'running',
    currentStep: 'migration.run · backfill 14.2M / 18M registros',
    duration: '12m 04s',
    cost: 3.81,
    steps: [
      { name: 'migration.plan', status: 'success' },
      { name: 'migration.dryrun', status: 'success' },
      { name: 'migration.run', status: 'running' },
      { name: 'migration.verify', status: 'pending' },
    ],
  },
  {
    id: 'wf-5c12',
    name: 'rollout-canary',
    sa: 'ssa-conta-corrente',
    status: 'awaiting',
    currentStep: 'kaptain.shift · aguardando aprovação para 50%',
    duration: '22m 18s',
    cost: 0.64,
    steps: [
      { name: 'kaptain.deploy', status: 'success' },
      { name: 'kaptain.shift 10%', status: 'success' },
      { name: 'kaptain.shift 50%', status: 'awaiting' },
      { name: 'kaptain.shift 100%', status: 'pending' },
    ],
  },
  {
    id: 'wf-2d77',
    name: 'rollback',
    sa: 'ssa-investimentos',
    status: 'failed',
    currentStep: 'pantheon.requeue · queue overflow',
    duration: '1m 51s',
    cost: 0.18,
    steps: [
      { name: 'kaptain.snapshot', status: 'success' },
      { name: 'kaptain.restore', status: 'success' },
      { name: 'pantheon.requeue', status: 'failed' },
    ],
  },
  {
    id: 'wf-4e09',
    name: 'onboarding-vanilla-brownfield',
    sa: 'ssa-credito-prefixado',
    status: 'success',
    currentStep: 'completed',
    duration: '8m 02s',
    cost: 2.11,
    steps: [
      { name: 'github.clone', status: 'success' },
      { name: 'konstructor.build', status: 'success' },
      { name: 'komply.evaluate', status: 'success' },
      { name: 'kaptain.deploy', status: 'success' },
      { name: 'orkestra.apply', status: 'success' },
      { name: 'kaptain.shift', status: 'success' },
    ],
  },
  {
    id: 'wf-6f23',
    name: 'build-ci',
    sa: 'ssa-cartoes',
    status: 'success',
    currentStep: 'completed',
    duration: '1m 14s',
    cost: 0.09,
    steps: [
      { name: 'github.clone', status: 'success' },
      { name: 'konstructor.build', status: 'success' },
      { name: 'konstructor.sbom', status: 'success' },
    ],
  },
  {
    id: 'wf-8a51',
    name: 'rollout-canary',
    sa: 'ssa-seguros',
    status: 'cancelled',
    currentStep: 'cancelado em canary 10%',
    duration: '3m 47s',
    cost: 0.32,
    steps: [
      { name: 'kaptain.deploy', status: 'success' },
      { name: 'kaptain.shift 10%', status: 'success' },
      { name: 'kaptain.shift 50%', status: 'skipped' },
    ],
  },
  {
    id: 'wf-1b96',
    name: 'deploy-hotfix',
    sa: 'ssa-onboarding-digital',
    status: 'success',
    currentStep: 'completed',
    duration: '47s',
    cost: 0.07,
    steps: [
      { name: 'github.clone', status: 'success' },
      { name: 'konstructor.build', status: 'success' },
      { name: 'kaptain.deploy', status: 'success' },
    ],
  },
]

const statusMeta: Record<
  Status,
  { label: string; chip: string; dot: string }
> = {
  running: {
    label: 'running',
    chip: 'border-warning/30 bg-warning/10 text-warning',
    dot: 'bg-warning',
  },
  success: {
    label: 'success',
    chip: 'border-success/30 bg-success/10 text-success',
    dot: 'bg-success',
  },
  failed: {
    label: 'failed',
    chip: 'border-failure/30 bg-failure/10 text-failure',
    dot: 'bg-failure',
  },
  awaiting: {
    label: 'awaiting human',
    chip: 'border-warning/30 bg-warning/10 text-warning',
    dot: 'bg-warning',
  },
  cancelled: {
    label: 'cancelled',
    chip: 'border-border bg-bg text-text-muted',
    dot: 'bg-text-muted',
  },
}

const allStatuses: Status[] = ['running', 'success', 'failed', 'awaiting', 'cancelled']

function StatusIcon({ status, size = 4 }: { status: Status; size?: 4 | 5 }) {
  const cls = size === 5 ? 'h-5 w-5' : 'h-4 w-4'
  if (status === 'success') return <CheckCircle2 className={`${cls} text-success`} />
  if (status === 'failed') return <XCircle className={`${cls} text-failure`} />
  if (status === 'cancelled') return <CircleSlash className={`${cls} text-text-muted`} />
  return <Loader2 className={`${cls} animate-spin text-warning`} />
}

const PAGE_SIZE = 6

export default function WorkflowTrackerList() {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState<Set<Status>>(new Set())
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    if (statusFilter.size === 0) return workflows
    return workflows.filter((w) => statusFilter.has(w.status))
  }, [statusFilter])

  const activeCount = workflows.filter((w) => w.status === 'running' || w.status === 'awaiting').length
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const toggleStatus = (s: Status) => {
    setStatusFilter((prev) => {
      const next = new Set(prev)
      if (next.has(s)) next.delete(s)
      else next.add(s)
      return next
    })
    setPage(0)
  }

  return (
    <div className="space-y-5">
      <header className="space-y-2">
        <div className="flex items-center gap-1.5 text-[11.5px] text-text-muted">
          <span>Workflow Tracker</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-text-secondary">Workflows</span>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[24px] font-semibold tracking-tight">Workflows</h1>
            <p className="mt-1 text-[13px] text-text-secondary">Acompanhe execuções agênticas em tempo real.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-live/30 bg-live/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-live">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-live opacity-80" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
            </span>
            live · {activeCount} ativos
          </span>
        </div>
      </header>

      <div className="sticky top-14 z-10 -mx-8 border-b border-border bg-bg/85 px-8 py-2.5 backdrop-blur">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[10.5px] uppercase tracking-wider text-text-muted">status</span>
          {allStatuses.map((s) => {
            const active = statusFilter.has(s)
            const m = statusMeta[s]
            return (
              <button
                key={s}
                onClick={() => toggleStatus(s)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide transition ${
                  active
                    ? m.chip
                    : 'border-border bg-surface text-text-secondary hover:text-text-primary'
                }`}
              >
                <StatusIcon status={s} />
                {m.label}
              </button>
            )
          })}
          {statusFilter.size > 0 && (
            <button
              onClick={() => setStatusFilter(new Set())}
              className="ml-1 inline-flex items-center gap-1 rounded-full border border-border bg-bg px-2 py-1 text-[10.5px] text-text-muted hover:text-text-primary"
            >
              <X className="h-3 w-3" />
              limpar
            </button>
          )}
          <span className="ml-auto text-[11px] text-text-muted">
            {filtered.length} de {workflows.length}
          </span>
        </div>
      </div>

      <section>
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="border-b border-border bg-[#101115] text-left text-[11px] uppercase tracking-wider text-text-muted">
                <th className="w-10 px-3 py-2.5" />
                <th className="px-3 py-2.5 font-medium">Nome</th>
                <th className="px-3 py-2.5 font-medium">Step atual</th>
                <th className="px-3 py-2.5 font-medium text-right">Duração</th>
                <th className="px-3 py-2.5 font-medium text-right">Custo (R$)</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-[12px] text-text-muted">
                    Nenhum workflow corresponde aos filtros aplicados.
                  </td>
                </tr>
              ) : (
                pageRows.map((w) => {
                  return (
                    <tr
                      key={w.id}
                      onClick={() => navigate(`/workflows/${w.id}`)}
                      className="cursor-pointer border-b border-border last:border-b-0 transition hover:bg-[#181A1F]"
                    >
                      <td className="px-3 py-3">
                        <StatusIcon status={w.status} size={5} />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-text-primary">{w.name}</span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-text-muted">
                          <span className="font-mono">{w.id}</span>
                          <span>·</span>
                          <span className="font-mono">{w.sa}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-text-secondary">{w.currentStep}</td>
                      <td className="px-3 py-3 text-right font-mono text-text-secondary">{w.duration}</td>
                      <td className="px-3 py-3 text-right font-mono text-text-secondary">
                        R$ {w.cost.toFixed(2)}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-between gap-3 border-t border-border px-3 py-2.5 text-[11.5px]">
            <span className="text-text-muted">
              Página <span className="font-mono text-text-secondary">{page + 1}</span> de{' '}
              <span className="font-mono text-text-secondary">{totalPages}</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-bg px-2 text-text-secondary transition hover:text-text-primary disabled:opacity-40"
              >
                <ChevronsLeft className="h-3.5 w-3.5" />
                anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-bg px-2 text-text-secondary transition hover:text-text-primary disabled:opacity-40"
              >
                próxima
                <ChevronsRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
