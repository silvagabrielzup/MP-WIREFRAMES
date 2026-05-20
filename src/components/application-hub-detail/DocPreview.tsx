import { ExternalLink, FileText } from 'lucide-react'

type DocPreviewProps = {
  icon: typeof FileText
  title: string
  path: string
  size: string
  modified: string
  snippet: string
}

export function DocPreview({ icon: Icon, title, path, size, modified, snippet }: DocPreviewProps) {
  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-7 w-7 flex-none items-center justify-center rounded-md bg-[#181A1F] text-text-secondary">
            <Icon className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <div className="truncate font-mono text-[12.5px] text-text-primary">{title}</div>
            <div className="truncate font-mono text-[10.5px] text-text-muted">{path}</div>
          </div>
        </div>
        <div className="flex flex-none items-center gap-2 text-[10.5px] text-text-muted">
          <span className="font-mono">{size}</span>
          <span>·</span>
          <span>{modified}</span>
        </div>
      </div>
      <pre className="mt-2 max-h-[160px] overflow-y-auto rounded border border-border bg-[#0B0C10] p-2.5 font-mono text-[10.5px] leading-relaxed text-text-secondary">
{snippet}
      </pre>
      <div className="mt-2 flex justify-end">
        <a href="#" className="inline-flex items-center gap-1 text-[11.5px] text-text-secondary hover:text-text-primary">
          Abrir
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}
