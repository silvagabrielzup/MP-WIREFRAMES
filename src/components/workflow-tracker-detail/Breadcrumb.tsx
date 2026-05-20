import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Breadcrumb({ wfId }: { wfId: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[11.5px] text-text-muted">
      <Link to="/workflows" className="hover:text-text-primary">
        Workflow Tracker
      </Link>
      <ChevronRight className="h-3 w-3" />
      <span className="font-mono text-text-secondary">{wfId}</span>
    </div>
  )
}
