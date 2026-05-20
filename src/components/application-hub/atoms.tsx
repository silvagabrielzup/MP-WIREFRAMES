import type { ApplicationHubHealth } from '../../data/database'
import { Card } from '../ui/card'
import { HEALTH_META } from './utils'

// Decorativo — pulse `live` em 1.5px. Sempre acompanhado de texto visível
// (ex.: "live") pra não depender só da animação.
export function LivePulse() {
  return (
    <span className="relative flex h-1.5 w-1.5">
      <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-failure opacity-80" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-failure" />
    </span>
  )
}

export function HealthPill({ status }: { status: ApplicationHubHealth }) {
  const meta = HEALTH_META[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide ${meta.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  )
}

type StatColor = 'text' | 'success' | 'warning' | 'failure'

export function Stat({
  label,
  value,
  hint,
  color = 'text',
}: {
  label: string
  value: string
  hint: string
  color?: StatColor
}) {
  const tone =
    color === 'success'
      ? 'text-success'
      : color === 'warning'
        ? 'text-warning'
        : color === 'failure'
          ? 'text-failure'
          : 'text-text-primary'
  return (
    <Card className="px-4 py-3 shadow-none">
      <div className="text-[11px] uppercase tracking-wider text-text-muted">{label}</div>
      <div className={`mt-1 font-mono text-[20px] tracking-tight ${tone}`}>{value}</div>
      <div className="mt-0.5 text-[11px] text-text-muted">{hint}</div>
    </Card>
  )
}
