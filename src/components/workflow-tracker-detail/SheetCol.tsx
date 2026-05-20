import type { ReactNode } from 'react'

export function SheetCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex max-h-[420px] flex-col gap-2 overflow-hidden px-4 py-3">
      <div className="text-[10.5px] uppercase tracking-wider text-text-muted">{title}</div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  )
}
