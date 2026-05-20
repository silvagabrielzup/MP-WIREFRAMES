import { ArrowRight, Boxes } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { Card } from '../ui/card'

// Card pontilhado quando `rows.length === 0` — sem nenhuma execução ligada.
// CTA aponta pra Home (origem das execuções via trigger), não pro Catalog.
export function EmptyState() {
  return (
    <Card className="flex flex-col items-center justify-center gap-3 border-dashed px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-[#181A1F]">
        <Boxes className="h-5 w-5 text-text-muted" />
      </span>
      <h3 className="text-[15px] font-semibold tracking-tight text-text-primary">
        Nenhuma execução em andamento
      </h3>
      <p className="max-w-[420px] text-[12.5px] text-text-secondary">
        Execuções aparecem aqui quando um workflow de onboarding lança seu pipeline ligado
        (ex.: ao concluir o step &quot;Lançar workflow de onboarding&quot; na Home).
      </p>
      <Button asChild className="mt-1">
        <Link to="/">
          <Boxes />
          Voltar para a Home
          <ArrowRight />
        </Link>
      </Button>
    </Card>
  )
}
