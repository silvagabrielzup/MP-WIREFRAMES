import { Check, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { WorkflowInstance } from '../../contexts/WorkflowsProvider'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { StatusIcon } from './StatusIcon'
import { currentStepLabel, formatDuration, type Row } from './utils'

function ExecutionRow({
  row,
  onAdvance,
}: {
  row: Row
  onAdvance: (id: string) => void
}) {
  const navigate = useNavigate()
  const { instance: w, status } = row
  const isFinished = w.status === 'completed' || w.status === 'failed'
  const stepIdx = w.status === 'completed'
    ? w.steps.length
    : Math.min(w.currentStepIndex + 1, w.steps.length)

  return (
    <tr
      onClick={() => navigate(`/workflows/${w.id}`)}
      className="group cursor-pointer border-b border-border last:border-b-0 transition hover:bg-[#181A1F]"
    >
      <td className="px-3 py-3">
        <StatusIcon status={status} size={5} />
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-text-primary">{w.templateName}</span>
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-text-muted">
          <span className="font-mono">{w.id}</span>
          <span>·</span>
          <span className="font-mono">{w.templateId}</span>
        </div>
      </td>
      <td className="px-3 py-3 text-text-secondary">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-text-muted">
            {stepIdx}/{w.steps.length}
          </span>
          <span>{currentStepLabel(w)}</span>
        </div>
      </td>
      <td className="px-3 py-3 text-right font-mono text-text-secondary">
        {formatDuration(w.startedAt)}
      </td>
      <td className="px-3 py-3 text-right font-mono text-text-muted">—</td>
      <td className="px-3 py-3 text-right">
        {isFinished ? (
          <span className="inline-flex items-center gap-1 text-[10.5px] uppercase tracking-wider text-text-muted">
            encerrado
          </span>
        ) : (
          <AdvanceButton workflow={w} onAdvance={onAdvance} />
        )}
      </td>
    </tr>
  )
}

function AdvanceButton({
  workflow,
  onAdvance,
}: {
  workflow: WorkflowInstance
  onAdvance: (id: string) => void
}) {
  const isLast = workflow.currentStepIndex >= workflow.steps.length - 1
  return (
    <Button
      type="button"
      size="sm"
      onClick={(e) => {
        // Sem `stopPropagation`, o click sobe pra `<tr>` e dispara a
        // navegação — usuário acabaria no detalhe em vez de avançar.
        e.stopPropagation()
        onAdvance(workflow.id)
      }}
      className="h-7 border border-accent/40 bg-accent/10 px-2.5 text-[11.5px] text-accent hover:bg-accent/20"
    >
      <Check />
      {isLast ? 'Concluir' : 'Avançar'}
    </Button>
  )
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-border px-3 py-2.5 text-[11.5px]">
      <span className="text-text-muted">
        Página <span className="font-mono text-text-secondary">{page + 1}</span> de{' '}
        <span className="font-mono text-text-secondary">{totalPages}</span>
      </span>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 px-2 text-[11.5px]"
          onClick={() => onPageChange(Math.max(0, page - 1))}
          disabled={page === 0}
        >
          <ChevronsLeft />
          anterior
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 px-2 text-[11.5px]"
          onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
          disabled={page >= totalPages - 1}
        >
          próxima
          <ChevronsRight />
        </Button>
      </div>
    </div>
  )
}

// Tabela de execuções ligadas — `workflow-tracker-list.md` §Tabela.
// 6 colunas: ícone de status / nome / step atual / duração / custo / ação.
export function ExecutionsTable({
  pageRows,
  page,
  totalPages,
  onPageChange,
  onAdvance,
}: {
  pageRows: Row[]
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onAdvance: (id: string) => void
}) {
  return (
    <Card className="overflow-hidden p-0">
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="border-b border-border bg-[#101115] text-left text-[11px] uppercase tracking-wider text-text-muted">
            <th className="w-10 px-3 py-2.5" />
            <th className="px-3 py-2.5 font-medium">Nome</th>
            <th className="px-3 py-2.5 font-medium">Step atual</th>
            <th className="px-3 py-2.5 text-right font-medium">Duração</th>
            <th className="px-3 py-2.5 text-right font-medium">Custo (R$)</th>
            <th className="px-3 py-2.5 text-right font-medium">Ação</th>
          </tr>
        </thead>
        <tbody>
          {pageRows.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-12 text-center text-[12px] text-text-muted">
                Nenhum workflow corresponde aos filtros aplicados.
              </td>
            </tr>
          ) : (
            pageRows.map((row) => (
              <ExecutionRow key={row.instance.id} row={row} onAdvance={onAdvance} />
            ))
          )}
        </tbody>
      </table>

      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </Card>
  )
}
