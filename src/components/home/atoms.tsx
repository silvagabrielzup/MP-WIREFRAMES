import { Check, ChevronDown, ChevronRight, Copy, FileCode2, Folder, FolderOpen, Loader2 } from 'lucide-react'
import { createElement, useState } from 'react'
import type { TreeNode } from '../../types/models'
import { ACTION_LABEL, resolveIcon, type IconCmp } from './utils'

// Render proxy — resolve o componente do `lucide-react` dinamicamente por
// nome (vindo de `database.json`). Usa `createElement` para evitar o
// falso-positivo de `react-hooks/static-components`.
export function LucideIcon({ name, className }: { name: string; className?: string }) {
  return createElement(resolveIcon(name), { className })
}

export function EmptyState({ icon: Icon, title, hint }: { icon: IconCmp; title: string; hint: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-[#181A1F]">
        <Icon className="h-4 w-4 text-text-muted" />
      </span>
      <div className="text-[13px] font-medium text-text-secondary">{title}</div>
      <div className="max-w-[280px] text-[11.5px] text-text-muted">{hint}</div>
    </div>
  )
}

export function InlineSpinner({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-bg px-3 py-2 text-[11px] text-text-muted">
      <Loader2 className="h-3.5 w-3.5 animate-spin text-text-secondary" />
      {label}
    </div>
  )
}

function CommandCopyButton({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)
  const handleClick = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(command).catch(() => { })
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={copied ? 'Comando copiado' : 'Copiar comando'}
      title={copied ? 'Copiado!' : 'Copiar comando'}
      className={`flex h-8 flex-none items-center gap-1.5 rounded-md border px-2.5 text-[11px] font-medium transition ${
        copied
          ? 'border-success/40 bg-success/10 text-success'
          : 'border-border bg-bg text-text-secondary hover:border-border-strong hover:text-text-primary'
      }`}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      <span className="hidden sm:inline">{copied ? 'Copiado!' : 'Copiar'}</span>
    </button>
  )
}

export function CommandBlock({ command }: { command: string }) {
  return (
    <div className="flex items-stretch gap-2">
      <code
        tabIndex={0}
        className="flex-1 overflow-x-auto whitespace-nowrap rounded-md border border-border bg-surface-2 px-3 py-1.5 font-mono text-[11.5px] text-text-primary focus:outline-none focus:ring-1 focus:ring-accent/40"
      >
        {command}
      </code>
      <CommandCopyButton command={command} />
    </div>
  )
}

export function TreeNodeView({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [open, setOpen] = useState(node.defaultOpen ?? false)
  const isDir = node.type === 'dir'
  const indent = depth * 12 + 4

  const rowTone =
    node.action === 'added'
      ? 'border-success/25 bg-success/[0.04]'
      : node.action === 'removed'
        ? 'border-failure/25 bg-failure/[0.04]'
        : node.action === 'moved'
          ? 'border-info/25 bg-info/[0.04]'
          : 'border-transparent hover:bg-bg/60'

  const nameTone =
    node.action === 'removed'
      ? 'text-failure line-through'
      : node.action === 'added'
        ? 'text-success'
        : node.action === 'moved'
          ? 'text-info'
          : 'text-text-secondary'

  const badgeTone =
    node.action === 'added'
      ? 'bg-success/15 text-success'
      : node.action === 'removed'
        ? 'bg-failure/15 text-failure'
        : 'bg-info/15 text-info'

  return (
    <>
      <div
        role={isDir ? 'button' : undefined}
        aria-expanded={isDir ? open : undefined}
        onClick={isDir ? () => setOpen((v) => !v) : undefined}
        style={{ paddingLeft: `${indent}px` }}
        className={`flex items-center gap-1 rounded border py-0.5 pr-1 font-mono text-[10.5px] ${
          isDir ? 'cursor-pointer' : 'cursor-default'
        } ${rowTone}`}
      >
        {isDir
          ? open
            ? <ChevronDown className="h-3 w-3 flex-none text-text-muted" />
            : <ChevronRight className="h-3 w-3 flex-none text-text-muted" />
          : <span className="h-3 w-3 flex-none" />}
        {isDir
          ? open
            ? <FolderOpen className="h-3 w-3 flex-none text-accent" />
            : <Folder className="h-3 w-3 flex-none text-text-secondary" />
          : <FileCode2 className="h-3 w-3 flex-none text-text-muted" />}
        <span className={`flex-1 truncate ${nameTone}`}>{node.name}</span>
        {node.action && (
          <span className={`flex-none rounded px-1 text-[9px] font-medium uppercase tracking-wider ${badgeTone}`}>
            {ACTION_LABEL[node.action]}
          </span>
        )}
      </div>
      {isDir && open && node.children?.map((c) => (
        <TreeNodeView key={c.name} node={c} depth={depth + 1} />
      ))}
    </>
  )
}
