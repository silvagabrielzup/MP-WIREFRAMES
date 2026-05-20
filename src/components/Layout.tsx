import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Activity,
  Boxes,
  House,
  LayoutGrid,
  ChevronDown,
  Sparkles,
} from 'lucide-react'

const navItems = [
  { to: '/workflows', label: 'Workflow Tracker', icon: Activity },
  { to: '/application-hub', label: 'Application Hub', icon: LayoutGrid },
  { to: '/assets-catalogs', label: 'Assets Catalog', icon: Boxes },
]

export function Layout() {
  const location = useLocation()
  const onHome = location.pathname === '/'

  return (
    <div className="flex h-full min-h-screen w-full bg-bg text-text-primary">
      <aside className="fixed inset-y-0 left-0 z-20 flex w-[240px] flex-col border-r border-border bg-[#0C0D10]">
        <NavLink to="/" className="flex items-center gap-2 px-5 pt-5 pb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/15 ring-1 ring-accent/40">
            <Sparkles className="h-4 w-4 text-accent" />
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold tracking-tight">StackSpot</div>
            <div className="text-[11px] text-text-secondary">Management Plane</div>
          </div>
        </NavLink>

        <nav className="px-3">
          <NavLink
            to="/"
            className={() =>
              `mb-1 flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] transition ${
                onHome
                  ? 'bg-surface text-text-primary'
                  : 'text-text-secondary hover:bg-surface hover:text-text-primary'
              }`
            }
          >
            <House className="h-4 w-4" />
            Home
          </NavLink>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `mb-1 flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] transition ${
                  isActive
                    ? 'bg-surface text-text-primary'
                    : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-border px-4 py-3 text-[11px] text-text-muted">
          <div className="flex items-center justify-between">
            <span>v0.1.0 · proto</span>
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-live opacity-80" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
              </span>
              live
            </span>
          </div>
        </div>
      </aside>

      <div className="flex w-full flex-col pl-[240px]">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border bg-bg/85 px-6 backdrop-blur">
          <div className="ml-auto flex items-center gap-2">
            <button className="flex h-9 items-center gap-2 rounded-md border border-border bg-surface pl-1 pr-3 text-[12px] hover:border-border-strong">
              <span className="flex h-7 w-7 items-center justify-center rounded bg-accent/20 text-[11px] font-medium text-accent">
                LL
              </span>
              <span className="hidden sm:inline text-text-primary">Luigi</span>
              <ChevronDown className="h-3.5 w-3.5 text-text-secondary" />
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1400px] px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
