import { ExternalLink } from 'lucide-react'

export function ObsLink({ label }: { label: string }) {
  return (
    <a
      href="#"
      className="flex items-center justify-between gap-2 rounded-md border border-border bg-bg px-3 py-2 hover:border-border-strong"
    >
      <span className="truncate text-text-primary">{label}</span>
      <ExternalLink className="h-3.5 w-3.5 flex-none text-text-muted" />
    </a>
  )
}
