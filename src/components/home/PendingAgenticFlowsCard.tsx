import { ArrowRight, CheckCircle2, FileText, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '../ui/card'
import { EmptyState } from './atoms'
import { formatRelativeAgo, isFreshSince } from './utils'

export type PendingItem = {
  workflowInstanceId: string
  workflowName: string
  stepId: string
  stepTitle: string
  prTitle: string
  prAuthor: string
  prSummary: string
  filesChanged: number
  linesAdded: number
  linesRemoved: number
  createdAt: string
}

// Seção 3 da Home — card único listando aprovações agênticas pendentes.
// Cada linha leva para `/workflows-trackers/{workflowInstanceId}`.
export function PendingAgenticFlowsCard({ items }: { items: PendingItem[] }) {
  return (
    <Card>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          <h3 className="text-[13.5px] font-semibold tracking-tight">Fluxos agênticos pendentes aprovação</h3>
        </div>
        {items.length > 0 && (
          <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-warning">
            {items.length} aguardando
          </span>
        )}
      </div>
      {items.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="Nenhuma aprovação pendente"
          hint="Quando um workflow agêntico precisar de input humano, ele aparece aqui."
        />
      ) : (
        <ul>
          {items.map((p) => {
            const ago = formatRelativeAgo(p.createdAt)
            const isFresh = isFreshSince(p.createdAt)
            return (
              <Link
                key={`${p.workflowInstanceId}-${p.stepId}`}
                to={`/workflows-trackers/${p.workflowInstanceId}`}
                className="group flex cursor-pointer items-start gap-3 border-b border-border px-4 py-3 last:border-b-0 hover:bg-[#181A1F]"
              >
                <span className="relative mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-md bg-accent/15 text-accent">
                  <Sparkles className="h-3.5 w-3.5" />
                  {isFresh && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-live opacity-80" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
                    </span>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[12.5px] font-medium text-text-primary">{p.stepTitle}</span>
                    <span className="flex-none rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-accent">
                      agêntico
                    </span>
                    <span className="flex-none text-[10.5px] text-text-muted">{ago}</span>
                  </div>
                  <div className="mt-0.5 truncate font-mono text-[11.5px] text-text-secondary">{p.prTitle}</div>
                  <div className="mt-0.5 line-clamp-2 text-[11px] text-text-muted">{p.prSummary}</div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] text-text-muted">
                    <span className="font-mono">{p.prAuthor}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <FileText className="h-2.5 w-2.5" />
                      <span className="font-mono">{p.filesChanged}</span> arquivos
                    </span>
                    <span>·</span>
                    <span className="font-mono text-success">+{p.linesAdded}</span>
                    <span className="font-mono text-failure">−{p.linesRemoved}</span>
                    <span>·</span>
                    <span className="font-mono">{p.workflowName}</span>
                  </div>
                </div>
                <ArrowRight className="mt-1 h-3.5 w-3.5 flex-none text-text-muted opacity-0 transition group-hover:opacity-100" />
              </Link>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
