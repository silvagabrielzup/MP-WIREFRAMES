import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  CheckCircle2,
  XCircle,
  Loader2,
  CircleSlash,
  X,
  ChevronsRight,
  ChevronsLeft,
  Boxes,
  ArrowRight,
} from 'lucide-react'
import { useWorkflows, type WorkflowInstance, type WorkflowStatus } from '../contexts/WorkflowsProvider'

type Status = 'running' | 'success' | 'failed' | 'awaiting' | 'cancelled'

const statusMeta: Record<Status, { label: string; chip: string; dot: string }> = {
  running: {
    label: 'running',
    chip: 'border-info/30 bg-info/10 text-info',
    dot: 'bg-info',
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

function mapStatus(s: WorkflowStatus): Status {
  if (s === 'completed') return 'success'
  if (s === 'failed') return 'failed'
  if (s === 'awaiting') return 'awaiting'
  return 'running'
}

function StatusIcon({
  status,
  size = 4,
  staticIcon = false,
}: {
  status: Status
  size?: 4 | 5
  staticIcon?: boolean
}) {
  const cls = size === 5 ? 'h-5 w-5' : 'h-4 w-4'
  if (status === 'success') return <CheckCircle2 className={`${cls} text-success`} />
  if (status === 'failed') return <XCircle className={`${cls} text-failure`} />
  if (status === 'cancelled') return <CircleSlash className={`${cls} text-text-muted`} />
  if (status === 'running')
    return <Loader2 className={`${cls} ${staticIcon ? '' : 'animate-spin'} text-info`} />
  return <Loader2 className={`${cls} text-warning`} />
}

function formatDuration(startedAt: string): string {
  const elapsedMs = Date.now() - new Date(startedAt).getTime()
  if (Number.isNaN(elapsedMs) || elapsedMs < 0) return '—'
  const totalSec = Math.floor(elapsedMs / 1000)
  if (totalSec < 60) return `${totalSec}s`
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  if (m < 60) return `${m}m ${s.toString().padStart(2, '0')}s`
  const h = Math.floor(m / 60)
  return `${h}h ${(m % 60).toString().padStart(2, '0')}m`
}

function currentStepLabel(wf: WorkflowInstance): string {
  if (wf.status === 'completed') return 'completed'
  if (wf.status === 'failed') return 'falhou'
  const step = wf.steps[wf.currentStepIndex]
  return step ? step.title : '—'
}

const PAGE_SIZE = 6

export default function WorkflowTrackerList() {
  const navigate = useNavigate()
  const { workflows } = useWorkflows()
  const [statusFilter, setStatusFilter] = useState<Set<Status>>(new Set())
  const [page, setPage] = useState(0)

  const rows = useMemo(
    () =>
      workflows.map((w) => ({
        instance: w,
        status: mapStatus(w.status),
      })),
    [workflows],
  )

  const filtered = useMemo(() => {
    if (statusFilter.size === 0) return rows
    return rows.filter((r) => statusFilter.has(r.status))
  }, [rows, statusFilter])

  const activeCount = rows.filter((r) => r.status === 'running' || r.status === 'awaiting').length
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
            <p className="mt-1 text-[13px] text-text-secondary">
              Acompanhe execuções agênticas em tempo real.
            </p>
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
                <StatusIcon status={s} staticIcon />
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
            {filtered.length} de {rows.length}
          </span>
        </div>
      </div>

      <section>
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-surface px-6 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-[#181A1F]">
              <Boxes className="h-5 w-5 text-text-muted" />
            </span>
            <h3 className="text-[15px] font-semibold tracking-tight text-text-primary">
              Nenhum workflow em andamento
            </h3>
            <p className="max-w-[420px] text-[12.5px] text-text-secondary">
              Quando um workflow do catálogo for iniciado, ele aparece aqui em tempo real.
            </p>
            <Link
              to="/catalog"
              className="mt-1 inline-flex h-9 items-center gap-2 rounded-md bg-accent px-4 text-[12.5px] font-medium text-black transition hover:bg-accent-hover"
            >
              <Boxes className="h-4 w-4" />
              Ir para o Assets Catalog
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
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
                  pageRows.map(({ instance: w, status }) => {
                    const stepIdx =
                      w.status === 'completed'
                        ? w.steps.length
                        : Math.min(w.currentStepIndex + 1, w.steps.length)
                    return (
                      <tr
                        key={w.id}
                        onClick={() => navigate(`/workflows/${w.id}`)}
                        className="cursor-pointer border-b border-border last:border-b-0 transition hover:bg-[#181A1F]"
                      >
                        <td className="px-3 py-3">
                          <StatusIcon status={status} size={5} />
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-text-primary">{w.templateName}</span>
                          </div>
                          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-text-muted">
                            <span className="font-mono">{w.id}</span>
                            <span>·</span>
                            <span className="font-mono">{w.templateId}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-text-secondary">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-text-muted">
                              {stepIdx}/{w.steps.length}
                            </span>
                            <span>{currentStepLabel(w)}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-right font-mono text-text-secondary">
                          {formatDuration(w.startedAt)}
                        </td>
                        <td className="px-3 py-3 text-right font-mono text-text-muted">—</td>
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
        )}
      </section>
    </div>
  )
}
