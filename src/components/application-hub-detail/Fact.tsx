export function Fact({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-[10.5px] uppercase tracking-wider text-text-muted">{label}</span>
      <span className={`text-[11.5px] text-text-primary ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  )
}
