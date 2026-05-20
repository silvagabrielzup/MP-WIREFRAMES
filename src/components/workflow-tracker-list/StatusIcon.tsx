import { CheckCircle2, CircleSlash, Loader2, XCircle } from 'lucide-react'
import type { Status } from './utils'

// Ícone por status. `staticIcon` desliga o `animate-spin` do `Loader2`,
// usado nos chips de filtro (sempre estáticos) e no `awaiting` da tabela.
export function StatusIcon({
  status,
  size = 4,
  staticIcon = false,
}: {
  status: Status
  size?: 4 | 5
  staticIcon?: boolean
}) {
  const cls = size === 5 ? 'h-5 w-5' : 'h-4 w-4'
  if (status === 'success') return <CheckCircle2 className={`${cls} text-success`} />
  if (status === 'failed') return <XCircle className={`${cls} text-failure`} />
  if (status === 'cancelled') return <CircleSlash className={`${cls} text-text-muted`} />
  if (status === 'running') {
    return <Loader2 className={`${cls} ${staticIcon ? '' : 'animate-spin'} text-info`} />
  }
  // awaiting — Loader2 sem spin
  return <Loader2 className={`${cls} text-warning`} />
}
