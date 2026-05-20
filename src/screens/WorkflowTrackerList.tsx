import { ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { EmptyState } from '../components/workflow-tracker-list/EmptyState'
import { ExecutionsTable } from '../components/workflow-tracker-list/ExecutionsTable'
import { FilterBar } from '../components/workflow-tracker-list/FilterBar'
import { LiveIndicator } from '../components/workflow-tracker-list/LiveIndicator'
import {
  mapStatus,
  PAGE_SIZE,
  type Row,
  type Status,
} from '../components/workflow-tracker-list/utils'
import { useWorkflows } from '../contexts/WorkflowsProvider'
import { executionTemplateIds } from '../data/database'

export default function WorkflowTrackerList() {
  const { workflows, advanceStep } = useWorkflows()
  const [statusFilter, setStatusFilter] = useState<Set<Status>>(new Set(['running']))
  const [page, setPage] = useState(0)

  // Apenas execuções ligadas — workflows primários ficam fora desta tela
  // (vivem na Home). Decisão arquitetural da spec.
  const rows = useMemo<Row[]>(
    () =>
      workflows
        .filter((w) => executionTemplateIds.has(w.templateId))
        .map((w) => ({ instance: w, status: mapStatus(w.status) })),
    [workflows],
  )

  const filtered = useMemo<Row[]>(() => {
    if (statusFilter.size === 0) return rows
    return rows.filter((r) => statusFilter.has(r.status))
  }, [rows, statusFilter])

  const activeCount = rows.filter((r) => r.status === 'running' || r.status === 'awaiting').length
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const handleToggle = (s: Status) => {
    setStatusFilter((prev) => {
      const next = new Set(prev)
      if (next.has(s)) next.delete(s)
      else next.add(s)
      return next
    })
    setPage(0)
  }

  const handleClear = () => {
    setStatusFilter(new Set())
    setPage(0)
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
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
          <LiveIndicator activeCount={activeCount} />
        </div>
      </header>

      <FilterBar
        statusFilter={statusFilter}
        filteredCount={filtered.length}
        totalCount={rows.length}
        onToggle={handleToggle}
        onClear={handleClear}
      />

      <section>
        {rows.length === 0 ? (
          <EmptyState />
        ) : (
          <ExecutionsTable
            pageRows={pageRows}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onAdvance={advanceStep}
          />
        )}
      </section>
    </div>
  )
}
