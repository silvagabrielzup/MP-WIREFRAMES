import { Sparkline } from './Sparkline'
import type { SparkColor } from './utils'

type MetricCellProps = {
  label: string
  value: string
  spark: number[]
  color: SparkColor
}

export function MetricCell({ label, value, spark, color }: MetricCellProps) {
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-wider text-text-muted">{label}</div>
      <div className="mt-0.5 font-mono text-[16px] text-text-primary">{value}</div>
      <div className="mt-1">
        <Sparkline values={spark} color={color} />
      </div>
    </div>
  )
}
