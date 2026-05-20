import { X } from 'lucide-react'
import { StatusIcon } from './StatusIcon'
import { ALL_STATUSES, STATUS_META, type Status } from './utils'

// Barra sticky com chips de filtro de status + contador `{filtrado}/{total}`.
// `-mx-8 px-8` faz o background ocupar a largura total do conteúdo
// (`workflow-tracker-list.md` §Bloco 2).
export function FilterBar({
  statusFilter,
  filteredCount,
  totalCount,
  onToggle,
  onClear,
}: {
  statusFilter: Set<Status>
  filteredCount: number
  totalCount: number
  onToggle: (s: Status) => void
  onClear: () => void
}) {
  return (
    <div className="sticky top-14 z-10 -mx-8 border-b border-border bg-bg/85 px-8 py-2.5 backdrop-blur">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-[10.5px] uppercase tracking-wider text-text-muted">status</span>
        {ALL_STATUSES.map((s) => {
          const active = statusFilter.has(s)
          const meta = STATUS_META[s]
          return (
            <button
              key={s}
              type="button"
              onClick={() => onToggle(s)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide transition ${
                active ? meta.chip : 'border-border bg-surface text-text-secondary hover:text-text-primary'
              }`}
            >
              <StatusIcon status={s} staticIcon />
              {meta.label}
            </button>
          )
        })}
        {statusFilter.size > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="ml-1 inline-flex items-center gap-1 rounded-full border border-border bg-bg px-2 py-1 text-[10.5px] text-text-muted hover:text-text-primary"
          >
            <X className="h-3 w-3" />
            limpar
          </button>
        )}
        <span className="ml-auto text-[11px] text-text-muted">
          {filteredCount} de {totalCount}
        </span>
      </div>
    </div>
  )
}
