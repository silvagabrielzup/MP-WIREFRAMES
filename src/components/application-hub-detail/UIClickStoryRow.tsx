import { ArrowRight } from 'lucide-react'
import { uiclickStatusMeta, uiclickTypeMeta, type UIClickStory } from './utils'

export function UIClickStoryRow({ story }: { story: UIClickStory }) {
  const status = uiclickStatusMeta[story.status]
  const type = uiclickTypeMeta[story.type]
  return (
    <li className="group flex cursor-pointer items-start gap-3 border-b border-border px-4 py-2.5 last:border-b-0 hover:bg-[#181A1F]">
      <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-md border border-border bg-bg font-mono text-[9.5px] text-text-secondary">
        {story.points}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] text-text-muted">{story.id}</span>
          <span
            className={`rounded border px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider ${type.tone}`}
          >
            {type.label}
          </span>
          <span
            className={`rounded-full border px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider ${status.tone}`}
          >
            {status.label}
          </span>
        </div>
        <div className="mt-0.5 truncate text-[12.5px] text-text-primary">{story.title}</div>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-text-muted">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/20 text-[9.5px] font-medium text-accent">
            {story.assignee.initials}
          </span>
          <span>{story.assignee.name}</span>
          <span>·</span>
          <span className="font-mono">atualizado {story.updated}</span>
        </div>
      </div>
      <ArrowRight className="mt-1 h-3.5 w-3.5 flex-none text-text-muted opacity-0 transition group-hover:opacity-100" />
    </li>
  )
}
