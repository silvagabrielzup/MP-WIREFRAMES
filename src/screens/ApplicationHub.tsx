import { ChevronRight, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ApplicationsTable } from '../components/application-hub/ApplicationsTable'
import { RecentlyMigratedBanner } from '../components/application-hub/RecentlyMigratedBanner'
import { StatRow } from '../components/application-hub/StatRow'
import { EmptyState, LoadingState } from '../components/application-hub/states'
import { QUERY_LATENCY_MS, extractSaFromName } from '../components/application-hub/utils'
import { Input } from '../components/ui/input'
import { useWorkflows } from '../contexts/WorkflowsProvider'
import type { ApplicationHub as Hub } from '../data/database'

export default function ApplicationHub() {
  const { applicationHubs, workflows } = useWorkflows()

  // Query simulada — re-roda quando `applicationHubs` muda. Mantém o
  // loading state visível por 600ms para reforçar a sensação de "tela
  // conectada ao backend" (`docs/specs/views/aplication-hub.md`).
  const [isLoading, setIsLoading] = useState(true)
  const [displayedHubs, setDisplayedHubs] = useState<Hub[]>([])

  useEffect(() => {
    let cancelled = false
    // Reset síncrono intencional — a spec exige que o loading reapareça
    // sempre que `applicationHubs` muda. A regra `set-state-in-effect`
    // protege contra cascading renders, mas aqui o re-render é o efeito
    // desejado pela UX.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true)
    const timer = window.setTimeout(() => {
      if (cancelled) return
      setDisplayedHubs(applicationHubs.filter((h) => h.status === 'completed'))
      setIsLoading(false)
    }, QUERY_LATENCY_MS)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [applicationHubs])

  // SAs recém-migradas: derivado dos workflows `completed` via regex em
  // `workflow.name`. Lookup O(1) na renderização da tabela e do banner.
  const recentlyMigratedSAs = new Set(
    workflows
      .filter((w) => w.status === 'completed')
      .map((w) => extractSaFromName(w.name)),
  )

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-[11.5px] text-text-muted">
          <span>Application Hub</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-text-secondary">Visão geral</span>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[24px] font-semibold tracking-tight">Application Hub</h1>
            <p className="mt-1 max-w-[680px] text-[13px] text-text-secondary">
              Centro de operações pós-migração. Visualize saúde, dependências e contexto técnico
              de cada aplicação — substituindo os control planes antigos.
            </p>
          </div>
          <div className="relative w-full max-w-[320px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
            <Input
              type="text"
              placeholder="Buscar SA, owner, tag…"
              className="pl-9"
            />
          </div>
        </div>
      </header>

      {isLoading && <LoadingState />}

      {!isLoading && displayedHubs.length === 0 && <EmptyState />}

      {!isLoading && displayedHubs.length > 0 && (
        <>
          {recentlyMigratedSAs.size > 0 && <RecentlyMigratedBanner sas={[...recentlyMigratedSAs]} />}
          <StatRow apps={displayedHubs} />
          <ApplicationsTable apps={displayedHubs} recentlyMigratedSAs={recentlyMigratedSAs} />
        </>
      )}
    </div>
  )
}
