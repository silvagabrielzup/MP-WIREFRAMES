import { User } from 'lucide-react'
import type { AnyAsset } from './utils'

export function AssetMeta({ asset }: { asset: AnyAsset }) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-text-muted">
      <span className="inline-flex items-center gap-1">
        <User className="h-3 w-3" />
        {asset.owner}
      </span>
      <span className="inline-flex items-center gap-1 font-mono">v{asset.version}</span>
      <span>·</span>
      <span>{asset.usage.consumers} consumidores</span>
      <span>·</span>
      <span>{asset.usage.runs7d} execuções 7d</span>
    </div>
  )
}
