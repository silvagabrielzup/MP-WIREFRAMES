import { sparkStroke, type SparkColor } from './utils'

export function Sparkline({ values, color = 'success' }: { values: number[]; color?: SparkColor }) {
  const w = 120
  const h = 32
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const step = w / (values.length - 1)
  const points = values.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`).join(' ')
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline fill="none" strokeWidth="1.5" className={sparkStroke(color)} points={points} />
    </svg>
  )
}
