import { CheckCircle2, Sparkles } from 'lucide-react'

// Banner success que destaca SAs recém-migradas — `aplication-hub.md`
// §Banner. Renderiza-se condicionalmente (a página filtra `size > 0`).
export function RecentlyMigratedBanner({ sas }: { sas: string[] }) {
  const count = sas.length
  return (
    <div className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/[0.08] px-4 py-3">
      <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-md bg-success/15 text-success">
        <CheckCircle2 className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-medium text-text-primary">
          {count === 1
            ? 'Aplicação migrada para a StackSpot'
            : `${count} aplicações migradas para a StackSpot`}
        </div>
        <div className="mt-0.5 text-[11.5px] text-text-secondary">
          {sas.map((sa) => (
            <span
              key={sa}
              className="mr-1.5 inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 font-mono text-[10.5px] text-success"
            >
              <Sparkles className="h-2.5 w-2.5" />
              {sa}
            </span>
          ))}
          <span>· agora visível na lista abaixo.</span>
        </div>
      </div>
    </div>
  )
}
