import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Breadcrumb({ sa }: { sa: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[11.5px] text-text-muted">
      <Link to="/application-hub" className="hover:text-text-primary">
        Application Hub
      </Link>
      <ChevronRight className="h-3 w-3" />
      <span className="font-mono text-text-secondary">{sa}</span>
    </div>
  )
}
