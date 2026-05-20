import type { ComponentType } from 'react'
import { AssetMeta } from './AssetMeta'
import { StatusBadge } from './StatusBadge'
import type { AnyAsset } from './utils'

type IconCmp = ComponentType<{ className?: string }>

export function AssetCard({
  asset,
  selected,
  onClick,
  icon: Icon,
  badge,
}: {
  asset: AnyAsset
  selected: boolean
  onClick: () => void
  icon: IconCmp
  badge?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg border bg-surface px-4 py-3 text-left transition hover:border-border-strong ${
        selected ? 'border-accent ring-1 ring-accent/40' : 'border-border'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-md bg-[#181A1F] text-text-secondary">
            <Icon className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <div className="truncate font-mono text-[13px] text-text-primary">{asset.name}</div>
            <div className="mt-0.5 line-clamp-2 text-[11.5px] text-text-secondary">{asset.description}</div>
          </div>
        </div>
        <div className="flex flex-none items-center gap-1.5">
          {badge && (
            <span className="rounded border border-border bg-bg px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-text-muted">
              {badge}
            </span>
          )}
          <StatusBadge status={asset.status} />
        </div>
      </div>
      <AssetMeta asset={asset} />
    </button>
  )
}
