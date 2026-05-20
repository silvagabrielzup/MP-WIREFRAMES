import { Boxes, Loader2 } from 'lucide-react'
import { Card } from '../ui/card'

// Loading state — `aplication-hub.md` §Bloco 2.A.
// Linha mono fake da query reforça a sensação de "tela conectada a backend".
export function LoadingState() {
  return (
    <Card className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <Loader2 className="h-5 w-5 animate-spin text-accent" />
      <div className="text-[13px] font-medium text-text-secondary">
        Consultando Application Hubs…
      </div>
      <div className="font-mono text-[10.5px] text-text-muted">
        GET /api/application-hubs?status=completed
      </div>
    </Card>
  )
}

// Empty state — `aplication-hub.md` §Bloco 2.B.
export function EmptyState() {
  return (
    <Card className="flex flex-col items-center justify-center gap-3 border-dashed px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-[#181A1F]">
        <Boxes className="h-5 w-5 text-text-muted" />
      </span>
      <h3 className="text-[15px] font-semibold tracking-tight text-text-primary">
        Nenhuma aplicação on-platform
      </h3>
      <p className="max-w-[460px] text-[12.5px] text-text-secondary">
        Application Hubs aparecem aqui depois que uma SA conclui o onboarding Vanilla e tem
        o pipeline de provisionamento finalizado.
      </p>
    </Card>
  )
}
