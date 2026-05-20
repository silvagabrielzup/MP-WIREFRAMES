import type { WorkflowInstance, WorkflowStatus } from '../../contexts/WorkflowsProvider'

// Status local da tela — 5 valores que casam com os chips de filtro.
// O `WorkflowStatus` do provider tem 5 valores diferentes; ver `mapStatus`.
export type Status = 'running' | 'success' | 'failed' | 'awaiting' | 'cancelled'

export type Row = {
  instance: WorkflowInstance
  status: Status
}

export const ALL_STATUSES: Status[] = ['running', 'success', 'failed', 'awaiting', 'cancelled']

export const PAGE_SIZE = 6

export type StatusMeta = {
  label: string
  chip: string
  dot: string
}

export const STATUS_META: Record<Status, StatusMeta> = {
  running: {
    label: 'running',
    chip: 'border-info/30 bg-info/10 text-info',
    dot: 'bg-info',
  },
  success: {
    label: 'success',
    chip: 'border-success/30 bg-success/10 text-success',
    dot: 'bg-success',
  },
  failed: {
    label: 'failed',
    chip: 'border-failure/30 bg-failure/10 text-failure',
    dot: 'bg-failure',
  },
  awaiting: {
    label: 'awaiting human',
    chip: 'border-warning/30 bg-warning/10 text-warning',
    dot: 'bg-warning',
  },
  cancelled: {
    label: 'cancelled',
    chip: 'border-border bg-bg text-text-muted',
    dot: 'bg-text-muted',
  },
}

// `cancelled` nunca é produzido aqui — existe como chip de filtro reservado
// para o futuro mas o provider hoje não emite esse estado.
export function mapStatus(s: WorkflowStatus): Status {
  if (s === 'completed') return 'success'
  if (s === 'failed') return 'failed'
  if (s === 'awaiting') return 'awaiting'
  return 'running'
}

export function formatDuration(startedAt: string): string {
  const elapsedMs = Date.now() - new Date(startedAt).getTime()
  if (Number.isNaN(elapsedMs) || elapsedMs < 0) return '—'
  const totalSec = Math.floor(elapsedMs / 1000)
  if (totalSec < 60) return `${totalSec}s`
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  if (m < 60) return `${m}m ${s.toString().padStart(2, '0')}s`
  const h = Math.floor(m / 60)
  return `${h}h ${(m % 60).toString().padStart(2, '0')}m`
}

export function currentStepLabel(wf: WorkflowInstance): string {
  if (wf.status === 'completed') return 'completed'
  if (wf.status === 'failed') return 'falhou'
  const step = wf.steps[wf.currentStepIndex]
  return step ? step.title : '—'
}
