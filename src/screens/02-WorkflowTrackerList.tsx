import { useState } from 'react'
import {
  ChevronRight,
  Search,
  ChevronDown,
  Filter,
  Hammer,
  Rocket,
  Database,
  GitBranch,
  Activity,
  RefreshCw,
  Download,
  X,
  CheckCircle2,
  XCircle,
  Clock3,
  PauseCircle,
  Play,
  ExternalLink,
  Sparkles,
  ChevronLeft,
} from 'lucide-react'

type Status = 'running' | 'success' | 'failed' | 'awaiting' | 'cancelled'
type Verb = 'build' | 'deploy' | 'migration' | 'rollout'

type Workflow = {
  id: string
  type: string
  sa: string
  user: { initials: string; name: string; color: string }
  status: Status
  startedAt: string
  startedAgo: string
  duration: string
  cost: number
  currentStep: { verb: Verb; label: string }
  done: number
  total: number
}

const verbIcon: Record<Verb, typeof Hammer> = {
  build: Hammer,
  deploy: Rocket,
  migration: Database,
  rollout: GitBranch,
}

const workflows: Workflow[] = [
  {
    id: 'wf_8b3f-2a91',
    type: 'onboarding-vanilla-brownfield',
    sa: 'ssa-pix-core',
    user: { initials: 'LL', name: 'luigi.lima', color: 'bg-accent/25 text-accent' },
    status: 'running',
    startedAt: '14:32:18',
    startedAgo: '2m 13s',
    duration: '2m 13s',
    cost: 0.42,
    currentStep: { verb: 'deploy', label: 'kaptain·apply-stack' },
    done: 3,
    total: 5,
  },
  {
    id: 'wf_2c7a-9e14',
    type: 'rollout-canary',
    sa: 'ssa-conta-corrente',
    user: { initials: 'MR', name: 'marcia.r', color: 'bg-info/20 text-info' },
    status: 'running',
    startedAt: '14:27:50',
    startedAgo: '6m 41s',
    duration: '6m 41s',
    cost: 1.18,
    currentStep: { verb: 'rollout', label: 'traffik·shift-5pct' },
    done: 2,
    total: 4,
  },
  {
    id: 'wf_5f02-1d77',
    type: 'build-and-test',
    sa: 'ssa-12345',
    user: { initials: 'AC', name: 'a.cardoso', color: 'bg-success/20 text-success' },
    status: 'running',
    startedAt: '14:33:46',
    startedAgo: '0m 47s',
    duration: '0m 47s',
    cost: 0.04,
    currentStep: { verb: 'build', label: 'konstructor·sensors' },
    done: 1,
    total: 3,
  },
  {
    id: 'wf_a1e9-44b2',
    type: 'migration-pix-to-pix2',
    sa: 'ssa-pix-core',
    user: { initials: 'TS', name: 't.silva', color: 'bg-warning/20 text-warning' },
    status: 'awaiting',
    startedAt: '14:20:31',
    startedAgo: '14m 02s',
    duration: '14m 02s',
    cost: 3.27,
    currentStep: { verb: 'migration', label: 'komply·await-approval' },
    done: 4,
    total: 7,
  },
  {
    id: 'wf_77d2-08ce',
    type: 'onboarding-vanilla-greenfield',
    sa: 'ssa-credito-consignado',
    user: { initials: 'JP', name: 'j.pereira', color: 'bg-info/20 text-info' },
    status: 'awaiting',
    startedAt: '13:51:09',
    startedAgo: '43m 24s',
    duration: '43m 24s',
    cost: 2.81,
    currentStep: { verb: 'deploy', label: 'tech-lead·review-pr' },
    done: 5,
    total: 8,
  },
  {
    id: 'wf_3b4c-7711',
    type: 'rollback',
    sa: 'ssa-investimentos',
    user: { initials: 'RN', name: 'r.nakamura', color: 'bg-failure/20 text-failure' },
    status: 'failed',
    startedAt: '12:18:02',
    startedAgo: '2h 16m',
    duration: '8m 12s',
    cost: 0.97,
    currentStep: { verb: 'rollout', label: 'pantheon·queue-overflow' },
    done: 2,
    total: 5,
  },
  {
    id: 'wf_e6f1-3a08',
    type: 'build-and-test',
    sa: 'ssa-credito-prefixado',
    user: { initials: 'LL', name: 'luigi.lima', color: 'bg-accent/25 text-accent' },
    status: 'failed',
    startedAt: '11:47:34',
    startedAgo: '2h 47m',
    duration: '3m 41s',
    cost: 0.21,
    currentStep: { verb: 'build', label: 'sensors·security-fail' },
    done: 2,
    total: 3,
  },
  {
    id: 'wf_4d8e-92f0',
    type: 'onboarding-vanilla-brownfield',
    sa: 'ssa-cartoes',
    user: { initials: 'FA', name: 'f.almeida', color: 'bg-info/20 text-info' },
    status: 'success',
    startedAt: '14:08:55',
    startedAgo: '25m',
    duration: '11m 33s',
    cost: 2.04,
    currentStep: { verb: 'deploy', label: 'kaptain·done' },
    done: 5,
    total: 5,
  },
  {
    id: 'wf_9c0a-5e22',
    type: 'rollout-canary',
    sa: 'ssa-pix-core',
    user: { initials: 'MR', name: 'marcia.r', color: 'bg-info/20 text-info' },
    status: 'success',
    startedAt: '13:42:11',
    startedAgo: '52m',
    duration: '18m 47s',
    cost: 4.61,
    currentStep: { verb: 'rollout', label: 'traffik·100pct' },
    done: 4,
    total: 4,
  },
  {
    id: 'wf_1f7b-c8d3',
    type: 'build-and-test',
    sa: 'ssa-conta-corrente',
    user: { initials: 'BV', name: 'b.vieira', color: 'bg-warning/20 text-warning' },
    status: 'success',
    startedAt: '13:30:48',
    startedAgo: '1h 04m',
    duration: '4m 22s',
    cost: 0.18,
    currentStep: { verb: 'build', label: 'konstructor·done' },
    done: 3,
    total: 3,
  },
  {
    id: 'wf_6a8d-b045',
    type: 'migration-postgres',
    sa: 'ssa-onboarding-pf',
    user: { initials: 'AC', name: 'a.cardoso', color: 'bg-success/20 text-success' },
    status: 'success',
    startedAt: '12:55:30',
    startedAgo: '1h 39m',
    duration: '22m 06s',
    cost: 8.93,
    currentStep: { verb: 'migration', label: 'migration·done' },
    done: 7,
    total: 7,
  },
  {
    id: 'wf_d3c2-7e91',
    type: 'onboarding-vanilla-brownfield',
    sa: 'ssa-loans-pj',
    user: { initials: 'JP', name: 'j.pereira', color: 'bg-info/20 text-info' },
    status: 'success',
    startedAt: '11:18:22',
    startedAgo: '3h 16m',
    duration: '14m 09s',
    cost: 2.74,
    currentStep: { verb: 'deploy', label: 'kaptain·done' },
    done: 5,
    total: 5,
  },
  {
    id: 'wf_b2a0-fe45',
    type: 'rollout-canary',
    sa: 'ssa-cambio',
    user: { initials: 'TS', name: 't.silva', color: 'bg-warning/20 text-warning' },
    status: 'success',
    startedAt: '10:44:08',
    startedAgo: '3h 50m',
    duration: '27m 51s',
    cost: 6.12,
    currentStep: { verb: 'rollout', label: 'traffik·100pct' },
    done: 4,
    total: 4,
  },
  {
    id: 'wf_7e1f-3b00',
    type: 'build-and-test',
    sa: 'ssa-cartoes',
    user: { initials: 'FA', name: 'f.almeida', color: 'bg-info/20 text-info' },
    status: 'cancelled',
    startedAt: '10:12:55',
    startedAgo: '4h 21m',
    duration: '0m 38s',
    cost: 0.02,
    currentStep: { verb: 'build', label: 'cancelled by user' },
    done: 0,
    total: 3,
  },
  {
    id: 'wf_0c4d-89ab',
    type: 'onboarding-vanilla-greenfield',
    sa: 'ssa-seguros-vida',
    user: { initials: 'RN', name: 'r.nakamura', color: 'bg-failure/20 text-failure' },
    status: 'success',
    startedAt: '09:18:01',
    startedAgo: '5h 16m',
    duration: '38m 14s',
    cost: 11.47,
    currentStep: { verb: 'deploy', label: 'kaptain·done' },
    done: 8,
    total: 8,
  },
  {
    id: 'wf_e9b8-1244',
    type: 'rollback',
    sa: 'ssa-pix-core',
    user: { initials: 'MR', name: 'marcia.r', color: 'bg-info/20 text-info' },
    status: 'success',
    startedAt: '08:55:30',
    startedAgo: '5h 38m',
    duration: '4m 09s',
    cost: 0.61,
    currentStep: { verb: 'rollout', label: 'traffik·rollback-done' },
    done: 3,
    total: 3,
  },
  {
    id: 'wf_5f3a-cb71',
    type: 'migration-mongo',
    sa: 'ssa-12345',
    user: { initials: 'LL', name: 'luigi.lima', color: 'bg-accent/25 text-accent' },
    status: 'success',
    startedAt: '08:02:18',
    startedAgo: '6h 32m',
    duration: '1h 12m',
    cost: 19.84,
    currentStep: { verb: 'migration', label: 'migration·done' },
    done: 9,
    total: 9,
  },
  {
    id: 'wf_aa2c-d5e8',
    type: 'build-and-test',
    sa: 'ssa-pix-pf',
    user: { initials: 'BV', name: 'b.vieira', color: 'bg-warning/20 text-warning' },
    status: 'success',
    startedAt: '07:40:11',
    startedAgo: '6h 54m',
    duration: '3m 02s',
    cost: 0.13,
    currentStep: { verb: 'build', label: 'konstructor·done' },
    done: 3,
    total: 3,
  },
  {
    id: 'wf_3128-49a0',
    type: 'onboarding-vanilla-brownfield',
    sa: 'ssa-corp-mid',
    user: { initials: 'JP', name: 'j.pereira', color: 'bg-info/20 text-info' },
    status: 'success',
    startedAt: '07:11:50',
    startedAgo: '7h 22m',
    duration: '19m 41s',
    cost: 5.78,
    currentStep: { verb: 'deploy', label: 'kaptain·done' },
    done: 5,
    total: 5,
  },
  {
    id: 'wf_6b9d-118f',
    type: 'rollout-canary',
    sa: 'ssa-investimentos',
    user: { initials: 'AC', name: 'a.cardoso', color: 'bg-success/20 text-success' },
    status: 'cancelled',
    startedAt: '06:48:22',
    startedAgo: '7h 46m',
    duration: '12m 18s',
    cost: 2.41,
    currentStep: { verb: 'rollout', label: 'cancelled · sensor warn' },
    done: 2,
    total: 4,
  },
  {
    id: 'wf_4a72-e1d6',
    type: 'build-and-test',
    sa: 'ssa-onboarding-pj',
    user: { initials: 'TS', name: 't.silva', color: 'bg-warning/20 text-warning' },
    status: 'success',
    startedAt: '06:14:01',
    startedAgo: '8h 20m',
    duration: '2m 54s',
    cost: 0.09,
    currentStep: { verb: 'build', label: 'konstructor·done' },
    done: 3,
    total: 3,
  },
  {
    id: 'wf_9d50-3f8b',
    type: 'migration-postgres',
    sa: 'ssa-credito-prefixado',
    user: { initials: 'RN', name: 'r.nakamura', color: 'bg-failure/20 text-failure' },
    status: 'success',
    startedAt: '05:42:55',
    startedAgo: '8h 52m',
    duration: '46m 33s',
    cost: 14.21,
    currentStep: { verb: 'migration', label: 'migration·done' },
    done: 7,
    total: 7,
  },
  {
    id: 'wf_2810-7c4d',
    type: 'onboarding-vanilla-greenfield',
    sa: 'ssa-pix-pj',
    user: { initials: 'FA', name: 'f.almeida', color: 'bg-info/20 text-info' },
    status: 'success',
    startedAt: '04:30:12',
    startedAgo: '10h 04m',
    duration: '52m 18s',
    cost: 16.07,
    currentStep: { verb: 'deploy', label: 'kaptain·done' },
    done: 8,
    total: 8,
  },
  {
    id: 'wf_c5e3-04ba',
    type: 'rollback',
    sa: 'ssa-cambio',
    user: { initials: 'MR', name: 'marcia.r', color: 'bg-info/20 text-info' },
    status: 'success',
    startedAt: '03:11:08',
    startedAgo: '11h 23m',
    duration: '6m 47s',
    cost: 1.02,
    currentStep: { verb: 'rollout', label: 'traffik·rollback-done' },
    done: 3,
    total: 3,
  },
]

const statusMeta: Record<Status, { label: string; classes: string; dot: string }> = {
  running: {
    label: 'running',
    classes: 'border-live/30 bg-live/10 text-live',
    dot: 'bg-live',
  },
  success: {
    label: 'success',
    classes: 'border-success/30 bg-success/10 text-success',
    dot: 'bg-success',
  },
  failed: {
    label: 'failed',
    classes: 'border-failure/30 bg-failure/10 text-failure',
    dot: 'bg-failure',
  },
  awaiting: {
    label: 'awaiting human',
    classes: 'border-warning/30 bg-warning/10 text-warning',
    dot: 'bg-warning',
  },
  cancelled: {
    label: 'cancelled',
    classes: 'border-border-strong bg-[#1E1F25] text-text-muted',
    dot: 'bg-text-muted',
  },
}

const summaryChips: { label: string; value: number; tone: string; status: Status }[] = [
  { label: 'running', value: 3, tone: 'text-live', status: 'running' },
  { label: 'awaiting', value: 2, tone: 'text-warning', status: 'awaiting' },
  { label: 'failed', value: 2, tone: 'text-failure', status: 'failed' },
  { label: 'success (24h)', value: 14, tone: 'text-success', status: 'success' },
  { label: 'cancelled', value: 2, tone: 'text-text-muted', status: 'cancelled' },
]

const timelineSteps = [
  { name: 'konstructor·build', status: 'success' as const, duration: '1m 12s' },
  { name: 'sensors·security', status: 'success' as const, duration: '38s' },
  { name: 'sensors·quality', status: 'success' as const, duration: '24s' },
  { name: 'kaptain·apply-stack', status: 'running' as const, duration: '0m 19s' },
  { name: 'kaptain·smoke-test', status: 'pending' as const, duration: '—' },
]

const timelineStatusMeta = {
  success: { icon: CheckCircle2, color: 'text-success' },
  running: { icon: Activity, color: 'text-live' },
  pending: { icon: Clock3, color: 'text-text-muted' },
  failed: { icon: XCircle, color: 'text-failure' },
}

export default function WorkflowTrackerList() {
  const [selectedId, setSelectedId] = useState<string | null>('wf_8b3f-2a91')
  const [panelOpen, setPanelOpen] = useState(true)
  const [activeStatuses, setActiveStatuses] = useState<Status[]>(['running', 'awaiting', 'failed'])
  const [onlyMine, setOnlyMine] = useState(false)

  const selected = workflows.find((w) => w.id === selectedId) ?? workflows[0]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5 text-[11.5px] text-text-muted">
          <span className="hover:text-text-secondary">Management Plane</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-text-secondary">Workflow Tracker</span>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[24px] font-semibold tracking-tight">Workflows</h1>
              <span className="flex items-center gap-1.5 rounded-full border border-live/30 bg-live/10 px-2.5 py-0.5 text-[10.5px] font-medium uppercase tracking-wider text-live">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-live opacity-80" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
                </span>
                live · 23 ativos
              </span>
            </div>
            <p className="mt-1.5 text-[13px] text-text-secondary">
              Acompanhe execuções agênticas em tempo real
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-[12px] text-text-secondary hover:text-text-primary">
              <RefreshCw className="h-3.5 w-3.5" />
              atualizado há 2s
            </button>
            <button className="flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-[12px] text-text-secondary hover:text-text-primary">
              <Download className="h-3.5 w-3.5" />
              exportar
            </button>
          </div>
        </div>

        {/* Summary chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {summaryChips.map((c) => (
            <button
              key={c.label}
              onClick={() =>
                setActiveStatuses((prev) =>
                  prev.includes(c.status)
                    ? prev.filter((s) => s !== c.status)
                    : [...prev, c.status]
                )
              }
              className={`flex items-center gap-2 rounded-md border px-2.5 py-1 text-[11.5px] transition ${
                activeStatuses.includes(c.status)
                  ? 'border-border-strong bg-[#181A1F]'
                  : 'border-border bg-surface hover:border-border-strong'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${statusMeta[c.status].dot} ${c.status === 'running' ? 'animate-pulse-live' : ''}`} />
              <span className="uppercase tracking-wide text-text-muted">{c.label}</span>
              <span className={`font-mono ${c.tone}`}>{c.value}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter bar (sticky) */}
      <div className="sticky top-14 z-[5] -mx-2 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface/95 px-3 py-2.5 backdrop-blur">
        <div className="relative w-[300px] max-w-full">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="workflow_id, SA ou usuário…"
            className="h-8 w-full rounded-md border border-border bg-bg pl-8 pr-3 text-[12.5px] placeholder:text-text-muted focus:border-border-strong focus:outline-none"
          />
        </div>

        <FilterSelect label="SA" value="3 selecionadas" />
        <FilterSelect label="status" value="4 selecionados" />
        <FilterSelect label="tipo" value="onboarding-vanilla…" />
        <FilterSelect label="período" value="últimas 24h" />

        <label className="ml-auto flex items-center gap-2 rounded-md border border-border bg-bg px-2.5 py-1.5 text-[12px] text-text-secondary">
          <button
            onClick={() => setOnlyMine((m) => !m)}
            className={`relative h-4 w-7 rounded-full transition ${
              onlyMine ? 'bg-accent' : 'bg-[#2A2B30]'
            }`}
          >
            <span
              className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${
                onlyMine ? 'left-3.5' : 'left-0.5'
              }`}
            />
          </button>
          só meus
        </label>

        <button className="flex h-8 items-center gap-1.5 rounded-md border border-border bg-bg px-2.5 text-[12px] text-text-secondary hover:text-text-primary">
          <Filter className="h-3.5 w-3.5" />
          filtros avançados
        </button>
      </div>

      {/* Layout: table + side panel */}
      <div className={`grid gap-4 ${panelOpen ? 'grid-cols-[1fr_360px]' : 'grid-cols-1'}`}>
        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="grid grid-cols-[90px_1.4fr_1.6fr_1.2fr_1fr_0.9fr_0.9fr_0.8fr_1.6fr] border-b border-border bg-[#101115] px-4 py-2.5 text-[10.5px] font-medium uppercase tracking-wider text-text-muted">
            <div>Status</div>
            <div>Workflow</div>
            <div>Tipo</div>
            <div>SA</div>
            <div>Usuário</div>
            <div className="font-mono normal-case tracking-normal text-[10.5px]">Início</div>
            <div>Duração</div>
            <div className="text-right">Custo</div>
            <div>Step atual</div>
          </div>

          {workflows.map((w) => {
            const meta = statusMeta[w.status]
            const progress = (w.done / w.total) * 100
            const VerbIcon = verbIcon[w.currentStep.verb]
            const isSelected = w.id === selectedId
            return (
              <div
                key={w.id}
                onClick={() => {
                  setSelectedId(w.id)
                  setPanelOpen(true)
                }}
                className={`group relative cursor-pointer border-b border-border transition last:border-b-0 ${
                  isSelected ? 'bg-[#181A1F]' : 'hover:bg-[#16181D]'
                }`}
              >
                <div className="grid grid-cols-[90px_1.4fr_1.6fr_1.2fr_1fr_0.9fr_0.9fr_0.8fr_1.6fr] items-center px-4 py-2.5 text-[12.5px]">
                  <div>
                    <span className={`inline-flex items-center gap-1.5 rounded border px-1.5 py-0.5 text-[10.5px] ${meta.classes}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot} ${w.status === 'running' ? 'animate-pulse-live' : ''}`} />
                      {meta.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[12px] text-text-primary">{w.id}</span>
                    {isSelected && <ExternalLink className="h-3 w-3 text-text-muted" />}
                  </div>
                  <div className="truncate text-text-secondary">{w.type}</div>
                  <div className="font-mono text-[12px] text-text-secondary">{w.sa}</div>
                  <div className="flex items-center gap-2">
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[9.5px] font-medium ${w.user.color}`}>
                      {w.user.initials}
                    </span>
                    <span className="truncate text-text-secondary">{w.user.name}</span>
                  </div>
                  <div className="font-mono text-[11.5px] text-text-muted">{w.startedAt}</div>
                  <div className="font-mono text-[11.5px] text-text-secondary">{w.duration}</div>
                  <div className="text-right font-mono text-[11.5px] text-text-secondary">
                    R$ {w.cost.toFixed(2)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-md ${
                        w.status === 'failed'
                          ? 'bg-failure/15 text-failure'
                          : w.status === 'awaiting'
                          ? 'bg-warning/15 text-warning'
                          : w.status === 'cancelled'
                          ? 'bg-[#22232A] text-text-muted'
                          : w.status === 'running'
                          ? 'bg-live/15 text-live'
                          : 'bg-success/15 text-success'
                      }`}
                    >
                      <VerbIcon className="h-3 w-3" />
                    </span>
                    <span className="truncate font-mono text-[11.5px] text-text-secondary">
                      {w.currentStep.label}
                    </span>
                    <span className="ml-auto font-mono text-[10.5px] text-text-muted">
                      {w.done}/{w.total}
                    </span>
                  </div>
                </div>
                {w.status === 'running' && (
                  <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#1B1D22]">
                    <div
                      className="h-full bg-live"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
                {w.status === 'awaiting' && (
                  <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#1B1D22]">
                    <div
                      className="h-full bg-warning"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            )
          })}

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-border bg-[#101115] px-4 py-2.5 text-[11.5px] text-text-muted">
            <div>
              Mostrando <span className="text-text-primary">25</span> de{' '}
              <span className="text-text-primary">487</span> workflows
            </div>
            <div className="flex items-center gap-1.5">
              <button className="flex h-7 w-7 items-center justify-center rounded border border-border bg-bg text-text-muted hover:text-text-primary">
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              {[1, 2, 3, 4, 5].map((p) => (
                <button
                  key={p}
                  className={`h-7 w-7 rounded border text-[11.5px] ${
                    p === 1
                      ? 'border-border-strong bg-[#181A1F] text-text-primary'
                      : 'border-border bg-bg text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {p}
                </button>
              ))}
              <span className="px-1 text-text-muted">…</span>
              <button className="h-7 w-7 rounded border border-border bg-bg text-[11.5px] text-text-secondary hover:text-text-primary">
                20
              </button>
              <button className="flex h-7 w-7 items-center justify-center rounded border border-border bg-bg text-text-secondary hover:text-text-primary">
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Side panel */}
        {panelOpen && selected && (
          <aside className="flex h-fit flex-col gap-4 rounded-lg border border-border bg-surface">
            <div className="flex items-start justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <span className={`flex h-7 w-7 items-center justify-center rounded-md ${statusMeta[selected.status].classes}`}>
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <div>
                  <div className="font-mono text-[12px] text-text-primary">{selected.id}</div>
                  <div className="text-[11px] text-text-muted">{selected.type}</div>
                </div>
              </div>
              <button onClick={() => setPanelOpen(false)} className="text-text-muted hover:text-text-primary">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 px-4">
              <KV label="SA" value={selected.sa} mono />
              <KV label="Status" value={statusMeta[selected.status].label} tone={statusMeta[selected.status].classes} />
              <KV label="Início" value={selected.startedAt} mono />
              <KV label="Duração" value={selected.duration} mono />
              <KV label="Usuário" value={selected.user.name} />
              <KV label="Custo" value={`R$ ${selected.cost.toFixed(2)}`} mono />
            </div>

            <div className="px-4">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                  Timeline
                </h4>
                <span className="font-mono text-[11px] text-text-muted">
                  {selected.done}/{selected.total} steps
                </span>
              </div>
              <ol className="relative space-y-2 border-l border-border pl-4">
                {timelineSteps.map((s) => {
                  const Icon = timelineStatusMeta[s.status].icon
                  return (
                    <li key={s.name} className="relative">
                      <span className={`absolute -left-[22px] flex h-3.5 w-3.5 items-center justify-center rounded-full bg-bg ${timelineStatusMeta[s.status].color}`}>
                        <Icon className={`h-3 w-3 ${s.status === 'running' ? 'animate-pulse-live' : ''}`} />
                      </span>
                      <div className="flex items-center justify-between gap-2 text-[12px]">
                        <span className="truncate font-mono text-text-secondary">{s.name}</span>
                        <span className="flex-none font-mono text-[11px] text-text-muted">{s.duration}</span>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>

            <div className="border-t border-border px-4 py-3">
              <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-text-muted">
                Sensores
              </div>
              <div className="flex flex-wrap gap-1.5">
                <SensorBadge ok label="security" />
                <SensorBadge ok label="quality" />
                <SensorBadge ok label="performance" />
                <SensorBadge ok={false} label="cost-budget" />
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-border bg-[#101115] px-4 py-3">
              <button className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-accent px-3 text-[12px] font-medium text-black transition hover:bg-accent-hover">
                ver detalhe
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-[12px] text-text-secondary hover:text-text-primary">
                <Play className="h-3.5 w-3.5" />
                replay
              </button>
              {selected.status === 'running' && (
                <button className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-text-secondary hover:text-failure">
                  <PauseCircle className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </aside>
        )}

        {!panelOpen && (
          <button
            onClick={() => setPanelOpen(true)}
            className="fixed right-4 top-1/2 flex h-9 -translate-y-1/2 items-center gap-1.5 rounded-l-md border border-border bg-surface px-3 text-[12px] text-text-secondary hover:text-text-primary"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            painel
          </button>
        )}
      </div>
    </div>
  )
}

function FilterSelect({ label, value }: { label: string; value: string }) {
  return (
    <button className="flex h-8 items-center gap-2 rounded-md border border-border bg-bg px-2.5 text-[12px] text-text-secondary hover:text-text-primary">
      <span className="text-[10.5px] uppercase tracking-wide text-text-muted">{label}</span>
      <span className="text-text-primary">{value}</span>
      <ChevronDown className="h-3 w-3 text-text-muted" />
    </button>
  )
}

function KV({ label, value, mono, tone }: { label: string; value: string; mono?: boolean; tone?: string }) {
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-wide text-text-muted">{label}</div>
      {tone ? (
        <span className={`mt-1 inline-flex rounded border px-1.5 py-0.5 text-[11px] ${tone}`}>{value}</span>
      ) : (
        <div className={`mt-0.5 text-[12.5px] text-text-primary ${mono ? 'font-mono text-[12px]' : ''}`}>
          {value}
        </div>
      )}
    </div>
  )
}

function SensorBadge({ ok, label }: { ok: boolean; label: string }) {
  const Icon = ok ? CheckCircle2 : XCircle
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10.5px] ${
        ok ? 'border-success/30 bg-success/10 text-success' : 'border-failure/30 bg-failure/10 text-failure'
      }`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  )
}
