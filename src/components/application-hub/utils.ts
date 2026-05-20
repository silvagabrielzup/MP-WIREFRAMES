import type { ApplicationHubHealth } from '../../data/database'

// Latência simulada da query do backend. Mantém UX de loading state realista
// enquanto não há fetch real (`docs/specs/views/aplication-hub.md` §Lógica).
export const QUERY_LATENCY_MS = 600

export type HealthMeta = {
  dot: string
  label: string
  text: string
  pill: string
}

export const HEALTH_META: Record<ApplicationHubHealth, HealthMeta> = {
  healthy: {
    dot: 'bg-success',
    label: 'healthy',
    text: 'text-success',
    pill: 'border-success/30 bg-success/10 text-success',
  },
  warn: {
    dot: 'bg-warning',
    label: 'warn',
    text: 'text-warning',
    pill: 'border-warning/30 bg-warning/10 text-warning',
  },
  fail: {
    dot: 'bg-failure',
    label: 'fail',
    text: 'text-failure',
    pill: 'border-failure/30 bg-failure/10 text-failure',
  },
}

// Deriva o ID da SA a partir do `workflow.name` (ex.: "Migração da
// ssa-pix-core" → "ssa-pix-core"). Fallback para `ssa-pix-core` quando o
// regex não casa — espelha o comportamento da spec.
const SA_REGEX = /ssa-[a-z0-9-]+/i

export function extractSaFromName(workflowName: string): string {
  const match = workflowName.match(SA_REGEX)
  return match ? match[0] : 'ssa-pix-core'
}
