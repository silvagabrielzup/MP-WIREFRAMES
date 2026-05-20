import { tabs, type TabKey } from './utils'

type TabsNavProps = {
  active: TabKey
  onChange: (id: TabKey) => void
}

export function TabsNav({ active, onChange }: TabsNavProps) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 border-b border-border">
      {tabs.map((t) => {
        const isActive = t.id === active
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`-mb-px flex items-center gap-2 border-b-2 px-3 py-2.5 text-[12.5px] transition ${
              isActive
                ? 'border-accent text-text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {t.label}
            {typeof t.count === 'number' && (
              <span
                className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${
                  isActive ? 'bg-accent/15 text-accent' : 'bg-bg text-text-muted'
                }`}
              >
                {t.count}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
