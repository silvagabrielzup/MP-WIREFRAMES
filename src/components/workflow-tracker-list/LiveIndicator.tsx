// Pílula "live · N ativos" no header. Dot com pulse cyan reforça a sensação
// de tela real-time (`workflow-tracker-list.md` §Bloco 1).
export function LiveIndicator({ activeCount }: { activeCount: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-live/30 bg-live/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-live">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-live opacity-80" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
      </span>
      live · {activeCount} ativos
    </span>
  )
}
