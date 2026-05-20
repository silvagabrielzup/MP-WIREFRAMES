import { ArrowRight, Boxes } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'

// Estado vazio centralizado — `docs/specs/placeholder/placeholder.md`.
// Aparece na Seção 2 da Home quando o usuário não tem workflow de migração ativo.
export function Placeholder() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-[#181A1F]">
        <Boxes className="h-5 w-5 text-text-muted" />
      </span>
      <h3 className="text-[15px] font-semibold tracking-tight text-text-primary">Nada para fazer agora</h3>
      <p className="max-w-[420px] text-[12.5px] text-text-secondary">
        Você ainda não tem uma jornada de onboarding ativa. Escolha um workflow no Assets Catalog para que os
        próximos passos apareçam aqui.
      </p>
      <Button asChild className="mt-2">
        <Link to="/assets-catalogs">
          <Boxes />
          Ir para o Assets Catalog
          <ArrowRight />
        </Link>
      </Button>
    </div>
  )
}
