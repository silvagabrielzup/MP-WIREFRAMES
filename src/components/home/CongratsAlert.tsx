import { Activity, ArrowRight, Check, LayoutGrid, PartyPopper } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'

function CongratsBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-success">
      <Check className="h-3 w-3" />
      {children}
    </span>
  )
}

// Estado C da Seção 2 — substitui o checklist quando todos os steps estão
// concluídos. CTAs guiam o usuário pro próximo passo (Tracker / Catalog).
export function CongratsAlert({ saName, totalSteps }: { saName: string; totalSteps: number }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-success/40 bg-gradient-to-br from-success/15 via-accent/10 to-bg">
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 28 }).map((_, i) => {
          const cx = (i * 53) % 400
          const cy = (i * 37) % 200
          const r = (i % 3) + 1.5
          const palette = ['#22c55e', '#FF6B2C', '#22D3EE', '#facc15']
          return <circle key={i} cx={cx} cy={cy} r={r} fill={palette[i % palette.length]} opacity={0.45} />
        })}
      </svg>

      <div className="relative px-6 py-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-success/40 bg-success/15 shadow-[0_0_0_6px_rgba(34,197,94,0.06)]">
          <PartyPopper className="h-7 w-7 text-success" />
        </div>
        <h2 className="mt-4 text-[22px] font-semibold tracking-tight text-text-primary">Parabéns, Luigi!</h2>
        <p className="mx-auto mt-2 max-w-[520px] text-[13px] text-text-secondary">
          A migração da SA <span className="font-mono text-text-primary">{saName}</span> foi concluída com sucesso.
          Sua aplicação está <span className="text-success">ON-PLAT</span>.
        </p>

        <div className="mx-auto mt-4 flex max-w-[520px] flex-wrap items-center justify-center gap-2 text-[11px] text-text-muted">
          <CongratsBadge>{totalSteps} passos</CongratsBadge>
          <CongratsBadge>migração concluída</CongratsBadge>
          <CongratsBadge>SA ON-PLAT</CongratsBadge>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <Button asChild>
            <Link to="/workflows-trackers">
              <Activity />
              Ver Workflow Tracker
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/assets-catalogs">
              <LayoutGrid />
              Ver Assets Catalog
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
