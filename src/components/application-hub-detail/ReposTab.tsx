import { ExternalLink, GitBranch, GitPullRequest } from 'lucide-react'
import { Card } from '../ui/card'
import { repos } from './utils'

export function ReposTab() {
  return (
    <Card className="overflow-hidden p-0">
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="border-b border-border bg-[#101115] text-left text-[11px] uppercase tracking-wider text-text-muted">
            <th className="px-4 py-2.5 font-medium">Repositório</th>
            <th className="px-4 py-2.5 font-medium">Branch principal</th>
            <th className="px-4 py-2.5 font-medium">Último commit</th>
            <th className="px-4 py-2.5 font-medium text-right">PRs abertos</th>
            <th className="px-4 py-2.5 font-medium text-right" />
          </tr>
        </thead>
        <tbody>
          {repos.map((r) => (
            <tr key={r.id} className="border-b border-border last:border-b-0 hover:bg-[#181A1F]">
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-3.5 w-3.5 text-text-muted" />
                  <span className="font-mono text-text-primary">{r.name}</span>
                  {r.primary && (
                    <span className="rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-accent">
                      primary
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-2.5 font-mono text-text-secondary">{r.branch}</td>
              <td className="px-4 py-2.5 text-text-secondary">há {r.lastCommit}</td>
              <td className="px-4 py-2.5 text-right">
                <span className="inline-flex items-center gap-1 font-mono text-text-secondary">
                  <GitPullRequest className="h-3 w-3" />
                  {r.openPrs}
                </span>
              </td>
              <td className="px-4 py-2.5 text-right">
                <a href="#" className="inline-flex items-center gap-1 text-[11.5px] text-text-muted hover:text-text-primary">
                  abrir
                  <ExternalLink className="h-3 w-3" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
