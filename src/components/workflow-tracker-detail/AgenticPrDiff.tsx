import { Check, FileText, GitPullRequest, X } from 'lucide-react'
import { useState } from 'react'
import type { AgenticPropositionMetadata } from '../../data/database'
import type { ApprovalState } from './utils'

type AgenticPrDiffProps = {
  metadata: AgenticPropositionMetadata
  approval: ApprovalState
  onApprove: () => void
  onDecline: () => void
}

export function AgenticPrDiff({ metadata, approval, onApprove, onDecline }: AgenticPrDiffProps) {
  const [openFile, setOpenFile] = useState<string>(metadata.files[0]?.path ?? '')
  const file = metadata.files.find((f) => f.path === openFile) ?? metadata.files[0]
  return (
    <div className="space-y-3 px-4 py-3">
      <div className="rounded-md border border-accent/30 bg-accent/[0.05] px-3 py-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <GitPullRequest className="mt-0.5 h-4 w-4 flex-none text-accent" />
            <div>
              <div className="text-[12.5px] font-semibold text-text-primary">{metadata.prTitle}</div>
              <div className="mt-0.5 font-mono text-[10.5px] text-text-muted">{metadata.prAuthor}</div>
            </div>
          </div>
          <div className="flex flex-none items-center gap-1.5">
            {approval === 'pending' && (
              <>
                <button
                  type="button"
                  onClick={onDecline}
                  className="inline-flex h-7 items-center gap-1 rounded-md border border-failure/40 bg-failure/10 px-2 text-[11px] font-medium text-failure hover:bg-failure/15"
                >
                  <X className="h-3 w-3" />
                  Declinar
                </button>
                <button
                  type="button"
                  onClick={onApprove}
                  className="inline-flex h-7 items-center gap-1 rounded-md border border-success/40 bg-success/10 px-2 text-[11px] font-medium text-success hover:bg-success/15"
                >
                  <Check className="h-3 w-3" />
                  Aprovar
                </button>
              </>
            )}
            {approval === 'accepted' && (
              <span className="inline-flex items-center gap-1 rounded-md border border-success/40 bg-success/10 px-2 py-1 text-[11px] font-medium text-success">
                <Check className="h-3 w-3" />
                Aprovado
              </span>
            )}
            {approval === 'declined' && (
              <span className="inline-flex items-center gap-1 rounded-md border border-failure/40 bg-failure/10 px-2 py-1 text-[11px] font-medium text-failure">
                <X className="h-3 w-3" />
                Declinado
              </span>
            )}
          </div>
        </div>
        <p className="mt-2 text-[11.5px] text-text-secondary">{metadata.prSummary}</p>
      </div>

      <div className="grid grid-cols-[200px_1fr] gap-3">
        <div className="space-y-1">
          <div className="px-1 text-[10px] uppercase tracking-wider text-text-muted">
            {metadata.files.length} arquivos
          </div>
          {metadata.files.map((f) => {
            const adds = f.hunks.flatMap((h) => h.lines.filter((l) => l.kind === 'add')).length
            const dels = f.hunks.flatMap((h) => h.lines.filter((l) => l.kind === 'del')).length
            return (
              <button
                key={f.path}
                type="button"
                onClick={() => setOpenFile(f.path)}
                className={`flex w-full items-start gap-1.5 rounded border px-2 py-1.5 text-left font-mono text-[10.5px] transition ${
                  openFile === f.path
                    ? 'border-accent/40 bg-accent/[0.08] text-text-primary'
                    : 'border-border bg-bg text-text-secondary hover:border-border-strong hover:text-text-primary'
                }`}
              >
                <FileText className="mt-0.5 h-3 w-3 flex-none opacity-60" />
                <span className="flex-1 break-all leading-tight">{f.path}</span>
                <span className="flex flex-none items-center gap-1 text-[9.5px]">
                  <span className="text-success">+{adds}</span>
                  <span className="text-failure">−{dels}</span>
                </span>
              </button>
            )
          })}
        </div>
        <div className="overflow-hidden rounded border border-border bg-bg">
          <div className="flex items-center justify-between border-b border-border bg-[#0B0C10] px-3 py-1.5">
            <span className="font-mono text-[11px] text-text-primary">{file?.path}</span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
              {file?.language}
            </span>
          </div>
          <div className="max-h-[360px] overflow-y-auto">
            {file?.hunks.map((h, hi) => (
              <div key={hi} className="border-b border-border last:border-b-0">
                <div className="bg-[#0B0C10] px-3 py-1 font-mono text-[10.5px] text-text-muted">{h.header}</div>
                <pre className="overflow-x-auto px-0 py-1 font-mono text-[11px] leading-[1.5]">
                  {h.lines.map((line, li) => {
                    const tone =
                      line.kind === 'add'
                        ? 'bg-success/10 text-success'
                        : line.kind === 'del'
                        ? 'bg-failure/10 text-failure'
                        : 'text-text-secondary'
                    const prefix = line.kind === 'add' ? '+' : line.kind === 'del' ? '−' : ' '
                    return (
                      <div key={li} className={`flex gap-2 px-3 ${tone}`}>
                        <span className="w-3 select-none text-[10.5px] opacity-70">{prefix}</span>
                        <span className="flex-1 whitespace-pre">{line.text}</span>
                      </div>
                    )
                  })}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
