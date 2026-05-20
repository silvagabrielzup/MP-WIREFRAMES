import { history, historyIcon, historyStatusColor } from './utils'

export function HistoryTab() {
  return (
    <ol className="space-y-2">
      {history.map((h) => {
        const Icon = historyIcon[h.kind]
        return (
          <li key={h.id} className="flex items-start gap-3 rounded-lg border border-border bg-surface px-4 py-3">
            <span
              className={`mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-md ${historyStatusColor[h.status]}`}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="rounded border border-border bg-bg px-1.5 py-0.5 text-[9.5px] uppercase tracking-wider text-text-muted">
                  {h.kind}
                </span>
                <span className="text-[12.5px] text-text-primary">{h.title}</span>
              </div>
              <div className="mt-0.5 text-[11.5px] text-text-muted">{h.detail}</div>
            </div>
            <span className="font-mono text-[11px] text-text-muted">há {h.ago}</span>
          </li>
        )
      })}
    </ol>
  )
}
