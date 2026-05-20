import {
  ArrowLeftRight,
  CheckCircle2,
  Clock3,
  Hammer,
  Loader2,
  MinusCircle,
  Play,
  Rocket,
  Sparkles,
  XCircle,
} from 'lucide-react'
import { migrationExecutionWorkflow, type AgenticPropositionMetadata } from '../../data/database'

export type StepStatus = 'pending' | 'running' | 'success' | 'failed' | 'skipped'
export type Verb = 'build' | 'agentic' | 'deploy' | 'migration' | 'rollout'
export type ApprovalState = 'pending' | 'accepted' | 'declined'

export type Step = {
  id: string
  verb: Verb
  name: string
  tool?: string
  status: StepStatus
  duration?: string
  sensor?: { name: string; verdict: 'pass' | 'warn' | 'fail' }
  iterations?: number
  agentic?: AgenticPropositionMetadata
}

export type Edge = {
  from: string
  to: string
  conditional?: boolean
  conditionLabel?: string
  active?: boolean
  failedPath?: boolean
  dead?: boolean
}

export type TabKey = 'fluxo' | 'tools' | 'sensors' | 'audit' | 'replay' | 'cost'

export type VerbMeta = {
  label: string
  icon: typeof Hammer
  text: string
  headerBg: string
  bodyBg: string
  border: string
  swatch: string
}

export type StatusMetaEntry = {
  icon: typeof CheckCircle2
  color: string
  label: string
}

export const AGENTIC_STEP_ID = 'step-agentic-java-21'
export const AGENTIC_TEMPLATE_STEP_ID =
  migrationExecutionWorkflow.onboardingSteps.find((s) => s.agentic)?.id ??
  'agentic-java-21-upgrade'

export const agenticMetadata =
  migrationExecutionWorkflow.onboardingSteps.find(
    (s) => s.id === AGENTIC_TEMPLATE_STEP_ID,
  )?.agentic ?? null

export const verbMeta: Record<Verb, VerbMeta> = {
  build: {
    label: 'Build',
    icon: Hammer,
    text: 'text-info',
    headerBg: 'bg-info',
    bodyBg: 'bg-info/10',
    border: 'border-info/60',
    swatch: 'bg-info',
  },
  agentic: {
    label: 'Agente',
    icon: Sparkles,
    text: 'text-accent',
    headerBg: 'bg-accent',
    bodyBg: 'bg-accent/10',
    border: 'border-accent/60',
    swatch: 'bg-accent',
  },
  deploy: {
    label: 'Deploy',
    icon: Rocket,
    text: 'text-success',
    headerBg: 'bg-success',
    bodyBg: 'bg-success/10',
    border: 'border-success/60',
    swatch: 'bg-success',
  },
  migration: {
    label: 'Migration',
    icon: ArrowLeftRight,
    text: 'text-warning',
    headerBg: 'bg-warning',
    bodyBg: 'bg-warning/10',
    border: 'border-warning/60',
    swatch: 'bg-warning',
  },
  rollout: {
    label: 'Rollout',
    icon: Play,
    text: 'text-accent',
    headerBg: 'bg-accent',
    bodyBg: 'bg-accent/10',
    border: 'border-accent/60',
    swatch: 'bg-accent',
  },
}

export const statusMeta: Record<StepStatus, StatusMetaEntry> = {
  pending: { icon: Clock3, color: 'text-text-muted', label: 'pending' },
  running: { icon: Loader2, color: 'text-info', label: 'running' },
  success: { icon: CheckCircle2, color: 'text-success', label: 'success' },
  failed: { icon: XCircle, color: 'text-failure', label: 'failed' },
  skipped: { icon: MinusCircle, color: 'text-text-muted', label: 'skipped' },
}

export const steps: Step[] = [
  { id: 'step-1', verb: 'build', name: 'Clonar repositório', tool: 'github.clone', status: 'success', duration: '12s' },
  {
    id: 'step-2',
    verb: 'build',
    name: 'Build do mono-repo',
    tool: 'konstructor.build',
    status: 'success',
    duration: '1m 47s',
    iterations: 3,
  },
  {
    id: 'step-3',
    verb: 'build',
    name: 'Scan de dependências',
    tool: 'konstructor.sbom',
    status: 'success',
    duration: '24s',
    sensor: { name: 'cve-scan-deps', verdict: 'pass' },
  },
  {
    id: AGENTIC_STEP_ID,
    verb: 'agentic',
    name: 'Upgrade Java 8 → 21 (agêntico)',
    tool: 'konstructor.java-bot',
    status: 'pending',
    agentic: agenticMetadata ?? undefined,
  },
  {
    id: 'step-4',
    verb: 'deploy',
    name: 'Avaliar policies Komply',
    tool: 'komply.evaluate',
    status: 'success',
    duration: '8s',
    sensor: { name: 'policy-gate', verdict: 'pass' },
  },
  {
    id: 'step-5',
    verb: 'deploy',
    name: 'Provisionar infra (EKS)',
    tool: 'kaptain.deploy',
    status: 'running',
    duration: '2m 14s',
  },
  { id: 'step-6', verb: 'deploy', name: 'Aplicar manifestos K8s', tool: 'orkestra.apply', status: 'pending' },
  { id: 'step-7', verb: 'migration', name: 'Planejar migração de dados', tool: 'migration.plan', status: 'success', duration: '31s' },
  { id: 'step-8', verb: 'migration', name: 'Executar backfill', tool: 'migration.run', status: 'skipped' },
  { id: 'step-9', verb: 'rollout', name: 'Canary 10 → 50%', tool: 'kaptain.shift', status: 'pending' },
  { id: 'step-10', verb: 'rollout', name: 'Promover para 100%', tool: 'kaptain.promote', status: 'pending' },
]

export const edges: Edge[] = [
  { from: 'step-1', to: 'step-2' },
  { from: 'step-2', to: 'step-3' },
  { from: 'step-3', to: AGENTIC_STEP_ID },
  { from: AGENTIC_STEP_ID, to: 'step-4' },
  { from: 'step-4', to: 'step-5' },
  { from: 'step-5', to: 'step-6', active: true },
  { from: 'step-6', to: 'step-7' },
  { from: 'step-7', to: 'step-8', conditional: true, conditionLabel: 'if data_strategy=dual-write', dead: true },
  { from: 'step-8', to: 'step-9' },
  { from: 'step-9', to: 'step-10' },
]

export const tabs: { id: TabKey; label: string; count?: number }[] = [
  { id: 'fluxo', label: 'Fluxo' },
  { id: 'tools', label: 'Tool calls', count: 38 },
  { id: 'sensors', label: 'Sensores', count: 6 },
  { id: 'audit', label: 'Auditoria', count: 3 },
  { id: 'replay', label: 'Replay' },
  { id: 'cost', label: 'Custo' },
]

export const NODE_W = 260
export const NODE_H = 116
export const NODE_GAP = 64
export const NODE_PAD_X = 48
export const ROW_Y = 56
export const CANVAS_PAD_BOTTOM = 56

export const CANVAS_W = NODE_PAD_X * 2 + steps.length * NODE_W + (steps.length - 1) * NODE_GAP
export const CANVAS_H = ROW_Y + NODE_H + CANVAS_PAD_BOTTOM
export const NODE_Y = ROW_Y

export function nodeX(idx: number) {
  return NODE_PAD_X + idx * (NODE_W + NODE_GAP)
}

export function indexOf(id: string) {
  return steps.findIndex((s) => s.id === id)
}

export function edgePath(fromIdx: number, toIdx: number) {
  const x1 = nodeX(fromIdx) + NODE_W
  const y1 = NODE_Y + NODE_H / 2
  const x2 = nodeX(toIdx)
  const y2 = NODE_Y + NODE_H / 2
  const dx = Math.max(40, (x2 - x1) * 0.5)
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`
}

export function verbToken(v: Verb): 'info' | 'success' | 'warning' | 'accent' {
  if (v === 'build') return 'info'
  if (v === 'deploy') return 'success'
  if (v === 'migration') return 'warning'
  return 'accent'
}
