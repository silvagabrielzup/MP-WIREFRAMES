import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ChevronRight,
  Play,
  Hammer,
  Rocket,
  ArrowLeftRight,
  ShieldCheck,
  Search,
  Settings,
  CheckCircle2,
  XCircle,
  Clock3,
  AlertTriangle,
  Loader2,
  MinusCircle,
  RotateCw,
  Map,
  Maximize2,
  Plus,
  Minus,
  X,
  Download,
  FileText,
  MoreHorizontal,
  Workflow as WorkflowIcon,
  GripHorizontal,
  Sparkles,
  Check,
  GitPullRequest,
} from 'lucide-react'
import { migrationExecutionWorkflow, type AgenticPropositionMetadata } from '../data/database'

type StepStatus = 'pending' | 'running' | 'success' | 'failed' | 'skipped'
type Verb = 'build' | 'agentic' | 'deploy' | 'migration' | 'rollout'

type ApprovalState = 'pending' | 'accepted' | 'declined'

type Step = {
  id: string
  verb: Verb
  name: string
  tool?: string
  status: StepStatus
  duration?: string
  sensor?: { name: string; verdict: 'pass' | 'warn' | 'fail' }
  iterations?: number
  /** Quando presente, indica que o step é agêntico — Accept/Decline obrigatório. */
  agentic?: AgenticPropositionMetadata
}

const AGENTIC_STEP_ID = 'step-agentic-java-21'
const agenticMetadata =
  migrationExecutionWorkflow.onboardingSteps.find(
    (s) => s.id === 'agentic-java-21-upgrade',
  )?.agentic ?? null

type Edge = {
  from: string
  to: string
  conditional?: boolean
  conditionLabel?: string
  active?: boolean
  failedPath?: boolean
  dead?: boolean
}

const steps: Step[] = [
  { id: 'step-1', verb: 'build', name: 'Clonar repositório', tool: 'github.clone', status: 'success', duration: '12s' },
  { id: 'step-2', verb: 'build', name: 'Build do mono-repo', tool: 'konstructor.build', status: 'success', duration: '1m 47s', iterations: 3 },
  { id: 'step-3', verb: 'build', name: 'Scan de dependências', tool: 'konstructor.sbom', status: 'success', duration: '24s', sensor: { name: 'cve-scan-deps', verdict: 'pass' } },
  {
    id: AGENTIC_STEP_ID,
    verb: 'agentic',
    name: 'Upgrade Java 8 → 21 (agêntico)',
    tool: 'konstructor.java-bot',
    status: 'pending',
    agentic: agenticMetadata ?? undefined,
  },
  { id: 'step-4', verb: 'deploy', name: 'Avaliar policies Komply', tool: 'komply.evaluate', status: 'success', duration: '8s', sensor: { name: 'policy-gate', verdict: 'pass' } },
  { id: 'step-5', verb: 'deploy', name: 'Provisionar infra (EKS)', tool: 'kaptain.deploy', status: 'running', duration: '2m 14s' },
  { id: 'step-6', verb: 'deploy', name: 'Aplicar manifestos K8s', tool: 'orkestra.apply', status: 'pending' },
  { id: 'step-7', verb: 'migration', name: 'Planejar migração de dados', tool: 'migration.plan', status: 'success', duration: '31s' },
  { id: 'step-8', verb: 'migration', name: 'Executar backfill', tool: 'migration.run', status: 'skipped' },
  { id: 'step-9', verb: 'rollout', name: 'Canary 10 → 50%', tool: 'kaptain.shift', status: 'pending' },
  { id: 'step-10', verb: 'rollout', name: 'Promover para 100%', tool: 'kaptain.promote', status: 'pending' },
]

const edges: Edge[] = [
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

const verbMeta: Record<
  Verb,
  {
    label: string
    icon: typeof Hammer
    text: string
    headerBg: string
    bodyBg: string
    border: string
    swatch: string
  }
> = {
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

const statusMeta: Record<
  StepStatus,
  { icon: typeof CheckCircle2; color: string; label: string }
> = {
  pending: { icon: Clock3, color: 'text-text-muted', label: 'pending' },
  running: { icon: Loader2, color: 'text-info', label: 'running' },
  success: { icon: CheckCircle2, color: 'text-success', label: 'success' },
  failed: { icon: XCircle, color: 'text-failure', label: 'failed' },
  skipped: { icon: MinusCircle, color: 'text-text-muted', label: 'skipped' },
}

const NODE_W = 260
const NODE_H = 116
const NODE_GAP = 64
const NODE_PAD_X = 48
const ROW_Y = 56
const CANVAS_PAD_BOTTOM = 56

const CANVAS_W = NODE_PAD_X * 2 + steps.length * NODE_W + (steps.length - 1) * NODE_GAP
const CANVAS_H = ROW_Y + NODE_H + CANVAS_PAD_BOTTOM

function nodeX(idx: number) {
  return NODE_PAD_X + idx * (NODE_W + NODE_GAP)
}
const NODE_Y = ROW_Y

const verbsOrder: Verb[] = ['build', 'agentic', 'deploy', 'migration', 'rollout']

type Phase = { verb: Verb; startIdx: number; endIdx: number; count: number }

function computePhases(): Phase[] {
  const out: Phase[] = []
  steps.forEach((s, i) => {
    const last = out[out.length - 1]
    if (last && last.verb === s.verb) {
      last.endIdx = i
      last.count += 1
    } else {
      out.push({ verb: s.verb, startIdx: i, endIdx: i, count: 1 })
    }
  })
  return out
}

const phases = computePhases()

type TabKey = 'fluxo' | 'tools' | 'sensors' | 'audit' | 'replay' | 'cost'

const tabs: { id: TabKey; label: string; count?: number }[] = [
  { id: 'fluxo', label: 'Fluxo' },
  { id: 'tools', label: 'Tool calls', count: 38 },
  { id: 'sensors', label: 'Sensores', count: 6 },
  { id: 'audit', label: 'Auditoria', count: 3 },
  { id: 'replay', label: 'Replay' },
  { id: 'cost', label: 'Custo' },
]

function StatusIcon({ status }: { status: StepStatus }) {
  const m = statusMeta[status]
  const Icon = m.icon
  return <Icon className={`h-4 w-4 ${m.color} ${status === 'running' ? 'animate-spin' : ''}`} />
}

function StepNode({
  step,
  idx,
  selected,
  approval,
  onClick,
  onApprove,
  onDecline,
}: {
  step: Step
  idx: number
  selected: boolean
  approval: ApprovalState
  onClick: () => void
  onApprove: () => void
  onDecline: () => void
}) {
  const x = nodeX(idx)
  const verb = verbMeta[step.verb]
  const VerbIcon = verb.icon

  // For the agentic step, override the apparent status based on approval state.
  const effectiveStatus: StepStatus =
    step.verb === 'agentic'
      ? approval === 'accepted'
        ? 'success'
        : approval === 'declined'
        ? 'failed'
        : 'running'
      : step.status

  const isRunning = effectiveStatus === 'running'
  const isFailed = effectiveStatus === 'failed'
  const isPending = effectiveStatus === 'pending'
  const isSkipped = effectiveStatus === 'skipped'
  const isAgenticPending = step.verb === 'agentic' && approval === 'pending'

  return (
    <button
      onClick={onClick}
      style={{ left: x, top: NODE_Y, width: NODE_W, height: NODE_H }}
      className={`absolute overflow-hidden rounded-lg border bg-surface text-left transition hover:shadow-lg ${
        isFailed ? 'border-failure ring-1 ring-failure/30' : verb.border
      } ${selected ? 'ring-2 ring-text-primary' : ''} ${
        step.verb !== 'agentic' && isPending ? 'opacity-50' : ''
      } ${isSkipped ? 'opacity-50 [border-style:dashed]' : ''} ${
        isRunning && step.verb !== 'agentic' ? `${verb.border} animate-pulse-live` : ''
      } ${isAgenticPending ? 'shadow-[0_0_0_3px_rgba(255,107,44,0.18)]' : ''}`}
    >
      <div className={`flex h-7 items-center gap-1.5 px-2.5 ${verb.headerBg} text-black/90`}>
        <VerbIcon className="h-3 w-3" />
        <span className="text-[10.5px] font-semibold uppercase tracking-wider">
          {verb.label}
          {step.tool && (
            <span className="font-mono normal-case opacity-80"> · {step.tool.split('.')[0]}</span>
          )}
        </span>
        {isAgenticPending && (
          <span className="ml-auto rounded-full bg-black/30 px-1.5 py-0.5 text-[9.5px] font-mono uppercase tracking-wider text-black/90">
            aprovação
          </span>
        )}
      </div>

      <span aria-hidden className={`absolute left-0 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border ${verb.swatch}`} />
      <span aria-hidden className={`absolute right-0 top-1/2 h-2 w-2 translate-x-1/2 -translate-y-1/2 rounded-full border border-border ${verb.swatch}`} />

      <div className={`flex flex-1 flex-col gap-1.5 px-3 py-2 ${verb.bodyBg}`}>
        <div className="flex items-center gap-2">
          <StatusIcon status={effectiveStatus} />
          <span className="truncate text-[12.5px] font-semibold text-text-primary">{step.name}</span>
        </div>
        {step.tool && (
          <div className="truncate font-mono text-[11px] text-text-secondary">{step.tool}</div>
        )}
        <div className="mt-auto flex items-center gap-1.5">
          {isAgenticPending ? (
            <>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation()
                  onDecline()
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    e.stopPropagation()
                    onDecline()
                  }
                }}
                className="inline-flex cursor-pointer items-center gap-1 rounded border border-failure/30 bg-failure/10 px-1.5 py-0.5 text-[10px] font-medium text-failure hover:bg-failure/15"
              >
                <X className="h-2.5 w-2.5" />
                Declinar
              </span>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation()
                  onApprove()
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    e.stopPropagation()
                    onApprove()
                  }
                }}
                className="inline-flex cursor-pointer items-center gap-1 rounded border border-success/30 bg-success/10 px-1.5 py-0.5 text-[10px] font-medium text-success hover:bg-success/15"
              >
                <Check className="h-2.5 w-2.5" />
                Aprovar
              </span>
            </>
          ) : (
            <>
              {step.duration && (
                <span className="rounded border border-border bg-bg/80 px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
                  {step.duration}
                </span>
              )}
              {step.sensor && (
                <span
                  className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium ${
                    step.sensor.verdict === 'pass'
                      ? 'border-success/30 bg-success/10 text-success'
                      : step.sensor.verdict === 'warn'
                      ? 'border-warning/30 bg-warning/10 text-warning'
                      : 'border-failure/30 bg-failure/10 text-failure'
                  }`}
                >
                  <ShieldCheck className="h-2.5 w-2.5" />
                  {step.sensor.name}
                </span>
              )}
              {step.iterations && step.iterations > 1 && (
                <span className="inline-flex items-center gap-1 rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
                  <RotateCw className="h-2.5 w-2.5" />
                  {step.iterations}
                </span>
              )}
              {step.verb === 'agentic' && approval === 'accepted' && (
                <span className="inline-flex items-center gap-1 rounded border border-success/30 bg-success/10 px-1.5 py-0.5 text-[10px] font-medium text-success">
                  <Check className="h-2.5 w-2.5" />
                  aprovado
                </span>
              )}
              {step.verb === 'agentic' && approval === 'declined' && (
                <span className="inline-flex items-center gap-1 rounded border border-failure/30 bg-failure/10 px-1.5 py-0.5 text-[10px] font-medium text-failure">
                  <X className="h-2.5 w-2.5" />
                  declinado
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </button>
  )
}

function indexOf(id: string) {
  return steps.findIndex((s) => s.id === id)
}

function edgePath(fromIdx: number, toIdx: number) {
  const x1 = nodeX(fromIdx) + NODE_W
  const y1 = NODE_Y + NODE_H / 2
  const x2 = nodeX(toIdx)
  const y2 = NODE_Y + NODE_H / 2
  const dx = Math.max(40, (x2 - x1) * 0.5)
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`
}

function EdgeLayer({ selectedId }: { selectedId: string | null }) {
  return (
    <svg width={CANVAS_W} height={CANVAS_H} className="pointer-events-none absolute inset-0">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#3a3c45" />
        </marker>
        <marker id="arrow-active" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" className="fill-info" />
        </marker>
        <marker id="arrow-dead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#2a2b32" />
        </marker>
        {/* gradient per verb-pair for crossing edges */}
        {(['info', 'success', 'warning', 'accent'] as const).map((from) =>
          (['info', 'success', 'warning', 'accent'] as const).map((to) =>
            from === to ? null : (
              <linearGradient
                key={`${from}-${to}`}
                id={`g-${from}-${to}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" className={`text-${from}`} stopColor="currentColor" />
                <stop offset="100%" className={`text-${to}`} stopColor="currentColor" />
              </linearGradient>
            ),
          ),
        )}
      </defs>
      {edges.map((e) => {
        const fromIdx = indexOf(e.from)
        const toIdx = indexOf(e.to)
        if (fromIdx < 0 || toIdx < 0) return null
        const fromStep = steps[fromIdx]
        const toStep = steps[toIdx]
        const d = edgePath(fromIdx, toIdx)
        const isCross = fromStep.verb !== toStep.verb

        const verbToken = (v: Verb) =>
          v === 'build'
            ? 'info'
            : v === 'deploy'
            ? 'success'
            : v === 'migration'
            ? 'warning'
            : 'accent' // 'rollout' and 'agentic' both share accent

        const stroke = e.failedPath
          ? 'stroke-failure'
          : e.active
          ? 'stroke-info'
          : e.dead
          ? 'stroke-[#2a2b32]'
          : isCross
          ? `[stroke:url(#g-${verbToken(fromStep.verb)}-${verbToken(toStep.verb)})]`
          : 'stroke-[#3a3c45]'

        const marker = e.active
          ? 'url(#arrow-active)'
          : e.dead
          ? 'url(#arrow-dead)'
          : 'url(#arrow)'

        const labelX = (nodeX(fromIdx) + NODE_W + nodeX(toIdx)) / 2
        const labelY = NODE_Y + NODE_H / 2 - 14

        const touched = selectedId && (selectedId === e.from || selectedId === e.to)
        return (
          <g key={`${e.from}-${e.to}`}>
            <path
              d={d}
              fill="none"
              strokeWidth={touched ? 2 : 1.5}
              className={`${stroke} ${e.conditional ? '[stroke-dasharray:4_4]' : ''}`}
              markerEnd={marker}
            />
            {e.conditionLabel && (
              <g>
                <rect
                  x={labelX - 110}
                  y={labelY - 9}
                  rx={3}
                  ry={3}
                  width={220}
                  height={18}
                  className="fill-[#101115] stroke-border"
                  strokeWidth={1}
                />
                <text
                  x={labelX}
                  y={labelY + 4}
                  textAnchor="middle"
                  className="fill-text-muted"
                  style={{ font: '10px ui-monospace, SFMono-Regular, monospace' }}
                >
                  {e.conditionLabel}
                </text>
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function PhaseStrip({ onJump }: { onJump: (verb: Verb) => void }) {
  const totalSpan = nodeX(steps.length - 1) + NODE_W - nodeX(0)
  return (
    <div className="relative h-9 w-full overflow-hidden rounded-md border border-border bg-[#101115]">
      {phases.map((p) => {
        const left = nodeX(p.startIdx) - nodeX(0)
        const width = nodeX(p.endIdx) + NODE_W - nodeX(p.startIdx)
        const meta = verbMeta[p.verb]
        const Icon = meta.icon
        return (
          <button
            key={p.verb + p.startIdx}
            onClick={() => onJump(p.verb)}
            style={{
              left: `${(left / totalSpan) * 100}%`,
              width: `${(width / totalSpan) * 100}%`,
            }}
            className={`absolute inset-y-0 flex items-center gap-1.5 border-r border-border/40 px-2 ${meta.bodyBg} hover:opacity-90`}
          >
            <span className={`flex h-4 w-4 items-center justify-center rounded ${meta.headerBg} text-black`}>
              <Icon className="h-2.5 w-2.5" />
            </span>
            <span className={`text-[10.5px] font-semibold uppercase tracking-wider ${meta.text}`}>
              {meta.label}
            </span>
            <span className="text-[10px] text-text-muted">· {p.count}</span>
          </button>
        )
      })}
    </div>
  )
}

function Legend() {
  return (
    <div className="pointer-events-auto flex items-center gap-2 rounded-md border border-border bg-surface/90 px-2 py-1.5 backdrop-blur">
      <span className="text-[10px] uppercase tracking-wider text-text-muted">verbos</span>
      {verbsOrder.map((v) => {
        const m = verbMeta[v]
        return (
          <span key={v} className="flex items-center gap-1">
            <span className={`h-2 w-2 rounded-sm ${m.swatch}`} />
            <span className={`text-[10.5px] font-semibold uppercase tracking-wider ${m.text}`}>
              {m.label}
            </span>
          </span>
        )
      })}
    </div>
  )
}

function Canvas({
  selectedId,
  onSelect,
  onJumpToVerb,
  approval,
  onApprove,
  onDecline,
}: {
  selectedId: string | null
  onSelect: (id: string) => void
  onJumpToVerb: (v: Verb) => void
  approval: ApprovalState
  onApprove: () => void
  onDecline: () => void
}) {
  const failedStep = steps.find((s) => s.status === 'failed')
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative w-full max-w-[320px]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="buscar step, tool, sensor, verbo…"
            className="h-8 w-full rounded-md border border-border bg-surface pl-7 pr-10 text-[11.5px] placeholder:text-text-muted focus:border-border-strong focus:outline-none"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border bg-bg px-1 font-mono text-[9.5px] text-text-muted">
            ⌘K
          </kbd>
        </div>
        <div className="flex-1">
          <PhaseStrip onJump={onJumpToVerb} />
        </div>
      </div>

      <div
        className="relative overflow-auto rounded-lg border border-border bg-[#0F1014]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #1c1d22 1px, transparent 0)',
          backgroundSize: '18px 18px',
          minHeight: CANVAS_H + 8,
        }}
      >
        <div className="relative" style={{ width: CANVAS_W, height: CANVAS_H }}>
          <EdgeLayer selectedId={selectedId} />
          {steps.map((s, i) => (
            <StepNode
              key={s.id}
              step={s}
              idx={i}
              selected={selectedId === s.id}
              approval={approval}
              onClick={() => onSelect(s.id)}
              onApprove={onApprove}
              onDecline={onDecline}
            />
          ))}
        </div>

        {failedStep && (
          <div className="pointer-events-none absolute left-3 right-3 top-3 z-10 flex justify-center">
            <div className="pointer-events-auto inline-flex items-center gap-2 rounded-md border border-failure/40 bg-failure/10 px-3 py-1.5 text-[11.5px] text-failure backdrop-blur">
              <AlertTriangle className="h-3.5 w-3.5" />
              Falhou em <span className="font-mono">{failedStep.id}</span> · abrir detalhes
            </div>
          </div>
        )}

        {/* Minimap top-left */}
        <div className="pointer-events-none sticky top-3 z-10 flex items-start justify-between px-3">
          <div className="pointer-events-auto rounded-md border border-border bg-surface/90 p-2 backdrop-blur">
            <div className="mb-1.5 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-text-muted">
              <Map className="h-3 w-3" />
              mini-mapa
            </div>
            <div className="relative h-10 w-44 rounded border border-border bg-bg">
              {steps.map((s, i) => {
                const meta = verbMeta[s.verb]
                const mx = ((nodeX(i) - nodeX(0)) / (nodeX(steps.length - 1) + NODE_W - nodeX(0))) * 168 + 2
                return (
                  <span
                    key={s.id}
                    className={`absolute top-1/2 h-3 w-2 -translate-y-1/2 rounded-sm ${meta.swatch}`}
                    style={{ left: mx }}
                  />
                )
              })}
              <span className="absolute inset-y-1 left-1 right-1 rounded border border-info/60" />
            </div>
          </div>

          {/* Legend + Toolbar top-right */}
          <div className="pointer-events-auto flex flex-col items-end gap-1.5">
            <Legend />
            <div className="flex items-center gap-1 rounded-md border border-border bg-surface/90 p-1 backdrop-blur">
              <button title="Zoom out" className="rounded p-1 text-text-secondary hover:bg-bg hover:text-text-primary">
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="font-mono text-[10px] text-text-muted">100%</span>
              <button title="Zoom in" className="rounded p-1 text-text-secondary hover:bg-bg hover:text-text-primary">
                <Plus className="h-3.5 w-3.5" />
              </button>
              <span className="mx-0.5 h-4 w-px bg-border" />
              <button title="Fit to screen (f)" className="rounded p-1 text-text-secondary hover:bg-bg hover:text-text-primary">
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
              <button title="Reset (0)" className="rounded p-1 text-text-secondary hover:bg-bg hover:text-text-primary">
                <RotateCw className="h-3.5 w-3.5" />
              </button>
              <button title="Configurar" className="rounded p-1 text-text-secondary hover:bg-bg hover:text-text-primary">
                <Settings className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AgenticPrDiff({
  metadata,
  approval,
  onApprove,
  onDecline,
}: {
  metadata: AgenticPropositionMetadata
  approval: ApprovalState
  onApprove: () => void
  onDecline: () => void
}) {
  const [openFile, setOpenFile] = useState<string>(metadata.files[0]?.path ?? '')
  const file = metadata.files.find((f) => f.path === openFile) ?? metadata.files[0]
  return (
    <div className="space-y-3 px-4 py-3">
      <div className="rounded-md border border-accent/30 bg-accent/[0.05] px-3 py-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <GitPullRequest className="mt-0.5 h-4 w-4 flex-none text-accent" />
            <div>
              <div className="text-[12.5px] font-semibold text-text-primary">
                {metadata.prTitle}
              </div>
              <div className="mt-0.5 font-mono text-[10.5px] text-text-muted">
                {metadata.prAuthor}
              </div>
            </div>
          </div>
          <div className="flex flex-none items-center gap-1.5">
            {approval === 'pending' && (
              <>
                <button
                  type="button"
                  onClick={onDecline}
                  className="inline-flex h-7 items-center gap-1 rounded-md border border-failure/40 bg-failure/10 px-2 text-[11px] font-medium text-failure hover:bg-failure/15"
                >
                  <X className="h-3 w-3" />
                  Declinar
                </button>
                <button
                  type="button"
                  onClick={onApprove}
                  className="inline-flex h-7 items-center gap-1 rounded-md border border-success/40 bg-success/10 px-2 text-[11px] font-medium text-success hover:bg-success/15"
                >
                  <Check className="h-3 w-3" />
                  Aprovar
                </button>
              </>
            )}
            {approval === 'accepted' && (
              <span className="inline-flex items-center gap-1 rounded-md border border-success/40 bg-success/10 px-2 py-1 text-[11px] font-medium text-success">
                <Check className="h-3 w-3" />
                Aprovado
              </span>
            )}
            {approval === 'declined' && (
              <span className="inline-flex items-center gap-1 rounded-md border border-failure/40 bg-failure/10 px-2 py-1 text-[11px] font-medium text-failure">
                <X className="h-3 w-3" />
                Declinado
              </span>
            )}
          </div>
        </div>
        <p className="mt-2 text-[11.5px] text-text-secondary">{metadata.prSummary}</p>
      </div>

      <div className="grid grid-cols-[200px_1fr] gap-3">
        <div className="space-y-1">
          <div className="px-1 text-[10px] uppercase tracking-wider text-text-muted">
            {metadata.files.length} arquivos
          </div>
          {metadata.files.map((f) => {
            const adds = f.hunks.flatMap((h) => h.lines.filter((l) => l.kind === 'add')).length
            const dels = f.hunks.flatMap((h) => h.lines.filter((l) => l.kind === 'del')).length
            return (
              <button
                key={f.path}
                type="button"
                onClick={() => setOpenFile(f.path)}
                className={`flex w-full items-start gap-1.5 rounded border px-2 py-1.5 text-left font-mono text-[10.5px] transition ${
                  openFile === f.path
                    ? 'border-accent/40 bg-accent/[0.08] text-text-primary'
                    : 'border-border bg-bg text-text-secondary hover:border-border-strong hover:text-text-primary'
                }`}
              >
                <FileText className="mt-0.5 h-3 w-3 flex-none opacity-60" />
                <span className="flex-1 break-all leading-tight">{f.path}</span>
                <span className="flex flex-none items-center gap-1 text-[9.5px]">
                  <span className="text-success">+{adds}</span>
                  <span className="text-failure">−{dels}</span>
                </span>
              </button>
            )
          })}
        </div>
        <div className="overflow-hidden rounded border border-border bg-bg">
          <div className="flex items-center justify-between border-b border-border bg-[#0B0C10] px-3 py-1.5">
            <span className="font-mono text-[11px] text-text-primary">{file?.path}</span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
              {file?.language}
            </span>
          </div>
          <div className="max-h-[360px] overflow-y-auto">
            {file?.hunks.map((h, hi) => (
              <div key={hi} className="border-b border-border last:border-b-0">
                <div className="bg-[#0B0C10] px-3 py-1 font-mono text-[10.5px] text-text-muted">
                  {h.header}
                </div>
                <pre className="overflow-x-auto px-0 py-1 font-mono text-[11px] leading-[1.5]">
                  {h.lines.map((line, li) => {
                    const tone =
                      line.kind === 'add'
                        ? 'bg-success/10 text-success'
                        : line.kind === 'del'
                        ? 'bg-failure/10 text-failure'
                        : 'text-text-secondary'
                    const prefix =
                      line.kind === 'add' ? '+' : line.kind === 'del' ? '−' : ' '
                    return (
                      <div
                        key={li}
                        className={`flex gap-2 px-3 ${tone}`}
                      >
                        <span className="w-3 select-none text-[10.5px] opacity-70">
                          {prefix}
                        </span>
                        <span className="flex-1 whitespace-pre">{line.text}</span>
                      </div>
                    )
                  })}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function BottomSheet({
  stepId,
  approval,
  onApprove,
  onDecline,
  onClose,
}: {
  stepId: string
  approval: ApprovalState
  onApprove: () => void
  onDecline: () => void
  onClose: () => void
}) {
  const step = steps.find((s) => s.id === stepId)
  const [iter, setIter] = useState(1)
  if (!step) return null
  const verb = verbMeta[step.verb]
  const VerbIcon = verb.icon
  const isIterated = (step.iterations ?? 1) > 1
  const isAgentic = step.verb === 'agentic' && !!step.agentic

  return (
    <section className="rounded-lg border border-border bg-surface">
      <div className="flex flex-col gap-2 border-b border-border px-4 py-3">
        <div className="flex items-center justify-center">
          <span className="flex h-1 w-10 cursor-row-resize items-center justify-center rounded-full bg-border" aria-label="redimensionar">
            <GripHorizontal className="h-3 w-3 text-text-muted" />
          </span>
        </div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <StatusIcon status={step.status} />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-[14px] font-semibold text-text-primary">{step.name}</h3>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide ${verb.border} ${verb.bodyBg} ${verb.text}`}
                >
                  <VerbIcon className="h-3 w-3" />
                  {verb.label}
                </span>
                {step.duration && (
                  <span className="font-mono text-[11px] text-text-muted">duração · {step.duration}</span>
                )}
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider text-text-muted">
                <span className={verb.text}>{verb.label}</span>
                <ChevronRight className="h-3 w-3" />
                <span className="font-mono normal-case tracking-normal text-text-secondary">{step.tool ?? step.id}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isIterated && (
              <div className="flex items-center gap-1 rounded-md border border-border bg-bg px-1.5 py-1">
                <span className="mr-1 text-[10px] uppercase tracking-wider text-text-muted">iter</span>
                {Array.from({ length: step.iterations! }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIter(i + 1)}
                    className={`rounded px-1.5 py-0.5 font-mono text-[10.5px] transition ${
                      iter === i + 1
                        ? 'bg-accent/15 text-accent'
                        : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
            <button className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border bg-bg px-2 text-[11.5px] text-text-secondary hover:text-text-primary">
              <FileText className="h-3.5 w-3.5" />
              Ver raw trace
            </button>
            <button className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border bg-bg px-2 text-[11.5px] text-text-secondary hover:text-text-primary">
              Pular para Replay
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onClose}
              aria-label="fechar"
              className="rounded p-1 text-text-muted hover:bg-bg hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {isAgentic && step.agentic ? (
        <AgenticPrDiff
          metadata={step.agentic}
          approval={approval}
          onApprove={onApprove}
          onDecline={onDecline}
        />
      ) : (
      <div className="grid grid-cols-1 divide-border md:grid-cols-2 md:divide-x lg:grid-cols-4">
        <SheetCol title="Input">
          <pre className="overflow-x-auto rounded bg-[#0B0C10] p-2.5 font-mono text-[10.5px] leading-relaxed text-text-secondary">
{`{
  "sa_id": "ssa-pix-core",
  "target_env": "hml",
  "image": "ghcr.io/itau/ssa-pix-core:0.21.4",
  "replicas": 3
}`}
          </pre>
        </SheetCol>

        <SheetCol title="Output">
          {step.status === 'pending' || step.status === 'skipped' ? (
            <div className="text-[11.5px] text-text-muted">Sem output — step ainda não executou.</div>
          ) : (
            <pre className="overflow-x-auto rounded bg-[#0B0C10] p-2.5 font-mono text-[10.5px] leading-relaxed text-text-secondary">
{`{
  "release_id": "rel-9f3a",
  "endpoint": "https://pix-core.itau.internal",
  "artifacts": [
    "s3://itau-deploys/rel-9f3a/manifest.yaml"
  ]
}`}
            </pre>
          )}
        </SheetCol>

        <SheetCol title="Sensores">
          {step.sensor ? (
            <ul className="space-y-1.5">
              <li className="flex items-center justify-between rounded border border-border bg-bg px-2.5 py-1.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-text-muted" />
                  <span className="font-mono text-[11.5px] text-text-primary">{step.sensor.name}</span>
                </div>
                <span
                  className={`rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                    step.sensor.verdict === 'pass'
                      ? 'border-success/30 bg-success/10 text-success'
                      : step.sensor.verdict === 'warn'
                      ? 'border-warning/30 bg-warning/10 text-warning'
                      : 'border-failure/30 bg-failure/10 text-failure'
                  }`}
                >
                  {step.sensor.verdict}
                </span>
              </li>
            </ul>
          ) : (
            <div className="text-[11.5px] text-text-muted">Nenhum sensor acionado neste step.</div>
          )}
        </SheetCol>

        <SheetCol title="Decisão do agente">
          <div className="space-y-2 text-[11.5px] text-text-secondary">
            <p>
              Selecionado <span className="font-mono text-text-primary">kaptain.deploy</span> em vez de{' '}
              <span className="font-mono">kaptain.bootstrap</span>: a SA já possui release anterior — bootstrap só se aplica em primeira execução.
            </p>
            <div className="rounded border border-border bg-bg px-2.5 py-2">
              <div className="text-[10.5px] uppercase tracking-wider text-text-muted">alternatives_considered</div>
              <ul className="mt-1 list-disc pl-4 text-[11px]">
                <li><span className="font-mono">kaptain.bootstrap</span> — rejeitado (sa já provisionada)</li>
                <li><span className="font-mono">orkestra.apply</span> direto — rejeitado (precisa de release id)</li>
              </ul>
            </div>
          </div>
        </SheetCol>
      </div>
      )}
    </section>
  )
}

function SheetCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex max-h-[420px] flex-col gap-2 overflow-hidden px-4 py-3">
      <div className="text-[10.5px] uppercase tracking-wider text-text-muted">{title}</div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  )
}

function ToolCallsTab() {
  const rows = [
    { ts: '0s', tool: 'github.clone', step: 'step-1', status: 'success' as StepStatus, dur: '12s' },
    { ts: '12s', tool: 'konstructor.build', step: 'step-2 · iter 1', status: 'failed' as StepStatus, dur: '34s' },
    { ts: '46s', tool: 'konstructor.build', step: 'step-2 · iter 2', status: 'failed' as StepStatus, dur: '38s' },
    { ts: '1m 24s', tool: 'konstructor.build', step: 'step-2 · iter 3', status: 'success' as StepStatus, dur: '35s' },
    { ts: '1m 59s', tool: 'konstructor.sbom', step: 'step-3', status: 'success' as StepStatus, dur: '24s' },
    { ts: '2m 23s', tool: 'komply.evaluate', step: 'step-4', status: 'success' as StepStatus, dur: '8s' },
    { ts: '2m 31s', tool: 'kaptain.deploy', step: 'step-5', status: 'running' as StepStatus, dur: '2m 14s' },
  ]
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="border-b border-border bg-[#101115] text-left text-[11px] uppercase tracking-wider text-text-muted">
            <th className="px-4 py-2.5 font-medium">t</th>
            <th className="px-4 py-2.5 font-medium">Tool</th>
            <th className="px-4 py-2.5 font-medium">Step</th>
            <th className="px-4 py-2.5 font-medium">Status</th>
            <th className="px-4 py-2.5 font-medium text-right">Duração</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-border last:border-b-0 hover:bg-[#181A1F]">
              <td className="px-4 py-2.5 font-mono text-text-muted">{r.ts}</td>
              <td className="px-4 py-2.5 font-mono text-text-primary">{r.tool}</td>
              <td className="px-4 py-2.5 font-mono text-text-secondary">{r.step}</td>
              <td className="px-4 py-2.5">
                <StatusIcon status={r.status} />
              </td>
              <td className="px-4 py-2.5 text-right font-mono text-text-secondary">{r.dur}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SensorsTab() {
  const rows = [
    { sensor: 'cve-scan-deps', step: 'step-3', verdict: 'pass', detail: '0 critical · 2 high (whitelisted)' },
    { sensor: 'policy-gate', step: 'step-4', verdict: 'pass', detail: 'network egress: ok · komply v1.4.0' },
    { sensor: 'slo-baseline', step: 'step-5', verdict: 'warn', detail: 'p95 acima do baseline em hml' },
  ]
  return (
    <div className="space-y-2">
      {rows.map((r, i) => (
        <div key={i} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#181A1F] text-text-secondary">
              <ShieldCheck className="h-3.5 w-3.5" />
            </span>
            <div>
              <div className="font-mono text-[12.5px] text-text-primary">{r.sensor}</div>
              <div className="text-[11.5px] text-text-muted">{r.detail}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-text-muted">{r.step}</span>
            <span
              className={`rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                r.verdict === 'pass'
                  ? 'border-success/30 bg-success/10 text-success'
                  : r.verdict === 'warn'
                  ? 'border-warning/30 bg-warning/10 text-warning'
                  : 'border-failure/30 bg-failure/10 text-failure'
              }`}
            >
              {r.verdict}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function AuditTab() {
  const rows = [
    { kind: 'approval', who: 'Luigi · LL', what: 'Aprovou policy override · network egress', step: 'step-4', ago: '8min' },
    { kind: 'policy', who: 'komply', what: 'Policy evaluation passed', step: 'step-4', ago: '8min' },
    { kind: 'approval', who: 'aguardando · MR', what: 'Aprovar traffic-shift 50%', step: 'step-9', ago: '—' },
  ]
  return (
    <ol className="space-y-2">
      {rows.map((r, i) => (
        <li key={i} className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-warning/15 text-warning">
            {r.kind === 'approval' ? <Clock3 className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[12.5px] text-text-primary">{r.what}</div>
            <div className="text-[11.5px] text-text-muted">
              {r.who} · <span className="font-mono">{r.step}</span>
            </div>
          </div>
          <span className="font-mono text-[11px] text-text-muted">{r.ago}</span>
        </li>
      ))}
    </ol>
  )
}

function ReplayTab() {
  return (
    <div className="rounded-lg border border-border bg-surface px-5 py-6">
      <div className="flex items-center gap-2">
        <RotateCw className="h-4 w-4 text-accent" />
        <h3 className="text-[14px] font-semibold tracking-tight">Estado capturado</h3>
      </div>
      <p className="mt-1.5 max-w-[640px] text-[12.5px] text-text-secondary">
        Snapshot completo de inputs, outputs e contexto dos motores. Use para re-executar o workflow a partir de qualquer step.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-border bg-bg px-3 py-2.5">
          <div className="text-[10.5px] uppercase tracking-wider text-text-muted">snapshot</div>
          <div className="mt-0.5 font-mono text-[12.5px] text-text-primary">snap-9f3a4c</div>
        </div>
        <div className="rounded-md border border-border bg-bg px-3 py-2.5">
          <div className="text-[10.5px] uppercase tracking-wider text-text-muted">tamanho</div>
          <div className="mt-0.5 font-mono text-[12.5px] text-text-primary">12.4 MB</div>
        </div>
        <div className="rounded-md border border-border bg-bg px-3 py-2.5">
          <div className="text-[10.5px] uppercase tracking-wider text-text-muted">capturado em</div>
          <div className="mt-0.5 font-mono text-[12.5px] text-text-primary">há 4min</div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <button className="inline-flex h-8 items-center gap-1.5 rounded-md bg-accent px-3 text-[12px] font-medium text-black hover:bg-accent-hover">
          <Play className="h-3.5 w-3.5" />
          Re-executar do step…
        </button>
        <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-bg px-3 text-[12px] text-text-secondary hover:text-text-primary">
          <Download className="h-3.5 w-3.5" />
          Baixar snapshot
        </button>
      </div>
    </div>
  )
}

function CostTab() {
  const rows = [
    { step: 'step-1', tool: 'github.clone', tokens: 0, brl: 0.0, latency: '12s' },
    { step: 'step-2', tool: 'konstructor.build', tokens: 24800, brl: 0.42, latency: '1m 47s' },
    { step: 'step-3', tool: 'konstructor.sbom', tokens: 1240, brl: 0.04, latency: '24s' },
    { step: 'step-4', tool: 'komply.evaluate', tokens: 8200, brl: 0.18, latency: '8s' },
    { step: 'step-5', tool: 'kaptain.deploy', tokens: 11900, brl: 0.27, latency: '2m 14s (em curso)' },
  ]
  const totalTokens = rows.reduce((a, b) => a + b.tokens, 0)
  const totalBrl = rows.reduce((a, b) => a + b.brl, 0)
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-surface px-4 py-3">
          <div className="text-[10.5px] uppercase tracking-wider text-text-muted">tokens</div>
          <div className="mt-0.5 font-mono text-[20px] text-text-primary">{totalTokens.toLocaleString()}</div>
        </div>
        <div className="rounded-lg border border-border bg-surface px-4 py-3">
          <div className="text-[10.5px] uppercase tracking-wider text-text-muted">custo estimado</div>
          <div className="mt-0.5 font-mono text-[20px] text-text-primary">R$ {totalBrl.toFixed(2)}</div>
        </div>
        <div className="rounded-lg border border-border bg-surface px-4 py-3">
          <div className="text-[10.5px] uppercase tracking-wider text-text-muted">latência total</div>
          <div className="mt-0.5 font-mono text-[20px] text-text-primary">4m 39s</div>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="border-b border-border bg-[#101115] text-left text-[11px] uppercase tracking-wider text-text-muted">
              <th className="px-4 py-2.5 font-medium">Step</th>
              <th className="px-4 py-2.5 font-medium">Tool</th>
              <th className="px-4 py-2.5 font-medium text-right">Tokens</th>
              <th className="px-4 py-2.5 font-medium text-right">R$</th>
              <th className="px-4 py-2.5 font-medium text-right">Latência</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-border last:border-b-0 hover:bg-[#181A1F]">
                <td className="px-4 py-2.5 font-mono text-text-primary">{r.step}</td>
                <td className="px-4 py-2.5 font-mono text-text-secondary">{r.tool}</td>
                <td className="px-4 py-2.5 text-right font-mono text-text-secondary">{r.tokens.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right font-mono text-text-secondary">R$ {r.brl.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-right font-mono text-text-muted">{r.latency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function WorkflowTrackerDetail() {
  const { id } = useParams<{ id: string }>()
  const [tab, setTab] = useState<TabKey>('fluxo')
  const [selectedId, setSelectedId] = useState<string | null>(AGENTIC_STEP_ID)
  const [approval, setApproval] = useState<ApprovalState>('pending')

  const wfId = id ?? 'wf-abc123'

  const handleApprove = () => setApproval('accepted')
  const handleDecline = () => setApproval('declined')

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-1.5 text-[11.5px] text-text-muted">
        <Link to="/workflows" className="hover:text-text-primary">
          Workflow Tracker
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-mono text-text-secondary">{wfId}</span>
      </div>

      <header className="rounded-lg border border-border bg-surface px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <WorkflowIcon className="h-4 w-4 text-accent" />
              <h1 className="font-mono text-[20px] text-text-primary">{wfId}</h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-info/30 bg-info/10 px-2.5 py-1 text-[11.5px] font-medium uppercase tracking-wide text-info">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                running
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-live/30 bg-live/10 px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide text-live">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-live opacity-80" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
                </span>
                live · updated 1s ago
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-text-muted">
              <span className="rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[10.5px]">onboarding-vanilla-brownfield</span>
              <span>·</span>
              <span className="font-mono">ssa-pix-core</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/25 text-[9.5px] font-medium text-accent">
                  LL
                </span>
                Luigi
              </span>
              <span>·</span>
              <span>iniciado há 4min 21s</span>
              <span>·</span>
              <span className="font-mono">duração 4m 39s</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-bg px-3 text-[12px] text-text-secondary hover:text-text-primary">
              <RotateCw className="h-3.5 w-3.5" />
              Replay
            </button>
            <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-bg px-3 text-[12px] text-text-secondary hover:text-text-primary">
              <AlertTriangle className="h-3.5 w-3.5" />
              Annotate as failure
            </button>
            <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-bg px-3 text-[12px] text-text-secondary hover:text-text-primary">
              <Download className="h-3.5 w-3.5" />
              Export trace
            </button>
            <button
              aria-label="mais opções"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-bg text-text-secondary hover:text-text-primary"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      <nav className="flex flex-wrap items-center gap-1.5 border-b border-border">
        {tabs.map((t) => {
          const active = t.id === tab
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`-mb-px flex items-center gap-2 border-b-2 px-3 py-2.5 text-[12.5px] transition ${
                active
                  ? 'border-accent text-text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {t.label}
              {typeof t.count === 'number' && (
                <span
                  className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${
                    active ? 'bg-accent/15 text-accent' : 'bg-bg text-text-muted'
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {tab === 'fluxo' && (
        <section className="space-y-4">
          <Canvas
            selectedId={selectedId}
            onSelect={setSelectedId}
            onJumpToVerb={() => {
              /* in a wireframe; would pan canvas */
            }}
            approval={approval}
            onApprove={handleApprove}
            onDecline={handleDecline}
          />
          {selectedId && (
            <BottomSheet
              stepId={selectedId}
              approval={approval}
              onApprove={handleApprove}
              onDecline={handleDecline}
              onClose={() => setSelectedId(null)}
            />
          )}
        </section>
      )}

      {tab === 'tools' && <ToolCallsTab />}
      {tab === 'sensors' && <SensorsTab />}
      {tab === 'audit' && <AuditTab />}
      {tab === 'replay' && <ReplayTab />}
      {tab === 'cost' && <CostTab />}
    </div>
  )
}
