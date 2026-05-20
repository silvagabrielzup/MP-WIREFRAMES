import { ChevronRight, Cable, Plug, Radar, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { AssetCard } from '../components/assets-catalog/AssetCard'
import { EmptyAssetList } from '../components/assets-catalog/EmptyAssetList'
import { WorkflowItem } from '../components/assets-catalog/WorkflowItem'
import { apis, mcps, sensors, skills, TABS, type TabKey } from '../components/assets-catalog/utils'
import { workflows } from '../data/database'

export default function AssetsCatalog() {
  const [tab, setTab] = useState<TabKey>('workflows')
  const [expandedWorkflows, setExpandedWorkflows] = useState<Set<string>>(new Set())

  const toggleWorkflow = (id: string) => {
    setExpandedWorkflows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-[11.5px] text-text-muted">
          <span>Catálogo</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-text-secondary">Agentic Assets</span>
        </div>
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight">Agentic Assets</h1>
          <p className="mt-1 max-w-[680px] text-[13px] text-text-secondary">
            Vitrine dos building blocks do harness — workflows, skills, MCPs, sensors e APIs.
            Hoje é vitrine pequena; no futuro vira marketplace interno conforme a criação de
            flows abre pra usuários.
          </p>
        </div>
      </header>

      <nav className="flex flex-wrap items-center gap-1.5 border-b border-border">
        {TABS.map((t) => {
          const Icon = t.icon
          const active = t.id === tab
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`-mb-px flex items-center gap-2 border-b-2 px-3 py-2.5 text-[12.5px] transition ${
                active
                  ? 'border-accent text-text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
              <span
                className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${
                  active ? 'bg-accent/15 text-accent' : 'bg-bg text-text-muted'
                }`}
              >
                {t.count}
              </span>
            </button>
          )
        })}
      </nav>

      {tab === 'workflows' && (
        <section className="flex flex-col gap-3">
          {workflows.map((wf) => (
            <WorkflowItem
              key={wf.id}
              wf={wf}
              expanded={expandedWorkflows.has(wf.id)}
              onToggle={() => toggleWorkflow(wf.id)}
            />
          ))}
        </section>
      )}

      {tab === 'skills' && (
        <section className="flex flex-col gap-3">
          {skills.length === 0 ? (
            <EmptyAssetList kind="skills" />
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {skills.map((s) => (
                <AssetCard
                  key={s.id}
                  asset={s}
                  selected={false}
                  onClick={() => { }}
                  icon={Sparkles}
                  badge={s.category}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {tab === 'mcps' && (
        <section className="flex flex-col gap-3">
          {mcps.length === 0 ? (
            <EmptyAssetList kind="mcps" />
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {mcps.map((m) => (
                <AssetCard
                  key={m.id}
                  asset={m}
                  selected={false}
                  onClick={() => { }}
                  icon={Plug}
                  badge={m.opType}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {tab === 'sensors' && (
        <section className="flex flex-col gap-3">
          {sensors.length === 0 ? (
            <EmptyAssetList kind="sensors" />
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {sensors.map((s) => (
                <AssetCard
                  key={s.id}
                  asset={s}
                  selected={false}
                  onClick={() => { }}
                  icon={Radar}
                  badge={s.category}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {tab === 'apis' && (
        <section className="flex flex-col gap-3">
          {apis.length === 0 ? (
            <EmptyAssetList kind="apis" />
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {apis.map((a) => (
                <AssetCard
                  key={a.id}
                  asset={a}
                  selected={false}
                  onClick={() => { }}
                  icon={Cable}
                  badge={a.authType}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
