import type { AssetStatus } from '../../data/database'
import { STATUS_CHIP } from './utils'

export function StatusBadge({ status }: { status: AssetStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${STATUS_CHIP[status]}`}
    >
      {status}
    </span>
  )
}
