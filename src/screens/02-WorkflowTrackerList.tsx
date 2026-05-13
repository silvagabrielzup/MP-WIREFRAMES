import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Search,
  X,
  Play,
  PauseCircle,
  CheckCircle2,
  XCircle,
  Clock3,
  Activity,
  Sparkles,
} from 'lucide-react'

type Status = 'running' | 'success' | 'failed' | 'awaiting' | 'cancelled'
type Period = '1h' | '24h' | '7d' | '30d' | 'all'

type Workflow = {
  id: string
  type: string
  sa: string
  user: { initials: string; name: string; color: string }
  status: Status
  startedAt: string
  duration: string
  cost: number
  currentStep: { label: string }
  done: number
  total: number
}

const statusMeta: Record<
  Status,
  { label: string; badge: string; dot: string; pulse: boolean }
> = {
  running: {
    label: 'running',
    badge: 'border-live/30 bg-live/10 text-live',
    dot: 'bg-live',
    pulse: true,
  },
  success: {
    label: 'success',
    badge: 'border-success/50 bg-success/20 text-success',
    dot: 'bg-success',
    pulse: false,
  },
  failed: {
    label: 'failed',
    badge: 'border-failure/30 bg-failure/10 text-failure',
    dot: 'bg-failure',
    pulse: false,
  },
  awaiting: {
    label: 'awaiting human',
    badge: 'border-warning/30 bg-warning/10 text-warning',
    dot: 'bg-warning',
    pulse: false,
  },
  cancelled: {
    label: 'cancelled',
    badge: 'border-border-strong bg-[#1E1F25] text-text-muted',
    dot: 'bg-text-muted',
    pulse: false,
  },
}

const workflows: Workflow[] = [
  { id: 'wf_8b3f-2a91', type: 'onboarding-vanilla-brownfield', sa: 'ssa-pix-core', user: { initials: 'LL', name: 'luigi.lima', color: 'bg-accent/25 text-accent' }, status: 'running', startedAt: '14:32:18', duration: '2m 13s', cost: 0.42, currentStep: { label: 'kaptain·apply-stack' }, done: 3, total: 5 },
  { id: 'wf_2c7a-9e14', type: 'rollout-canary', sa: 'ssa-conta-corrente', user: { initials: 'MR', name: 'marcia.r', color: 'bg-info/20 text-info' }, status: 'running', startedAt: '14:27:50', duration: '6m 41s', cost: 1.18, currentStep: { label: 'traffik·shift-5pct' }, done: 2, total: 4 },
  { id: 'wf_5f02-1d77', type: 'build-and-test', sa: 'ssa-12345', user: { initials: 'AC', name: 'a.cardoso', color: 'bg-success/20 text-success' }, status: 'running', startedAt: '14:33:46', duration: '0m 47s', cost: 0.04, currentStep: { label: 'konstructor·sensors' }, done: 1, total: 3 },
  { id: 'wf_a1e9-44b2', type: 'migration-pix-to-pix2', sa: 'ssa-pix-core', user: { initials: 'TS', name: 't.silva', color: 'bg-warning/20 text-warning' }, status: 'awaiting', startedAt: '14:20:31', duration: '14m 02s', cost: 3.27, currentStep: { label: 'komply·await-approval' }, done: 4, total: 7 },
  { id: 'wf_77d2-08ce', type: 'onboarding-vanilla-greenfield', sa: 'ssa-credito-consignado', user: { initials: 'JP', name: 'j.pereira', color: 'bg-info/20 text-info' }, status: 'awaiting', startedAt: '13:51:09', duration: '43m 24s', cost: 2.81, currentStep: { label: 'tech-lead·review-pr' }, done: 5, total: 8 },
  { id: 'wf_3b4c-7711', type: 'rollback', sa: 'ssa-investimentos', user: { initials: 'RN', name: 'r.nakamura', color: 'bg-failure/20 text-failure' }, status: 'failed', startedAt: '12:18:02', duration: '8m 12s', cost: 0.97, currentStep: { label: 'pantheon·queue-overflow' }, done: 2, total: 5 },
  { id: 'wf_e6f1-3a08', type: 'build-and-test', sa: 'ssa-credito-prefixado', user: { initials: 'LL', name: 'luigi.lima', color: 'bg-accent/25 text-accent' }, status: 'failed', startedAt: '11:47:34', duration: '3m 41s', cost: 0.21, currentStep: { label: 'sensors·security-fail' }, done: 2, total: 3 },
  { id: 'wf_4d8e-92f0', type: 'onboarding-vanilla-brownfield', sa: 'ssa-cartoes', user: { initials: 'FA', name: 'f.almeida', color: 'bg-info/20 text-info' }, status: 'success', startedAt: '14:08:55', duration: '11m 33s', cost: 2.04, currentStep: { label: 'kaptain·done' }, done: 5, total: 5 },
  { id: 'wf_9c0a-5e22', type: 'rollout-canary', sa: 'ssa-pix-core', user: { initials: 'MR', name: 'marcia.r', color: 'bg-info/20 text-info' }, status: 'success', startedAt: '13:42:11', duration: '18m 47s', cost: 4.61, currentStep: { label: 'traffik·100pct' }, done: 4, total: 4 },
  { id: 'wf_1f7b-c8d3', type: 'build-and-test', sa: 'ssa-conta-corrente', user: { initials: 'BV', name: 'b.vieira', color: 'bg-warning/20 text-warning' }, status: 'success', startedAt: '13:30:48', duration: '4m 22s', cost: 0.18, currentStep: { label: 'konstructor·done' }, done: 3, total: 3 },
  { id: 'wf_6a8d-b045', type: 'migration-postgres', sa: 'ssa-onboarding-pf', user: { initials: 'AC', name: 'a.cardoso', color: 'bg-success/20 text-success' }, status: 'success', startedAt: '12:55:30', duration: '22m 06s', cost: 8.93, currentStep: { label: 'migration·done' }, done: 7, total: 7 },
  { id: 'wf_d3c2-7e91', type: 'onboarding-vanilla-brownfield', sa: 'ssa-loans-pj', user: { initials: 'JP', name: 'j.pereira', color: 'bg-info/20 text-info' }, status: 'success', startedAt: '11:18:22', duration: '14m 09s', cost: 2.74, currentStep: { label: 'kaptain·done' }, done: 5, total: 5 },
  { id: 'wf_b2a0-fe45', type: 'rollout-canary', sa: 'ssa-cambio', user: { initials: 'TS', name: 't.silva', color: 'bg-warning/20 text-warning' }, status: 'success', startedAt: '10:44:08', duration: '27m 51s', cost: 6.12, currentStep: { label: 'traffik·100pct' }, done: 4, total: 4 },
  { id: 'wf_7e1f-3b00', type: 'build-and-test', sa: 'ssa-cartoes', user: { initials: 'FA', name: 'f.almeida', color: 'bg-info/20 text-info' }, status: 'cancelled', startedAt: '10:12:55', duration: '0m 38s', cost: 0.02, currentStep: { label: 'cancelled by user' }, done: 0, total: 3 },
  { id: 'wf_0c4d-89ab', type: 'onboarding-vanilla-greenfield', sa: 'ssa-seguros-vida', user: { initials: 'RN', name: 'r.nakamura', color: 'bg-failure/20 text-failure' }, status: 'success', startedAt: '09:18:01', duration: '38m 14s', cost: 11.47, currentStep: { label: 'kaptain·done' }, done: 8, total: 8 },
  { id: 'wf_e9b8-1244', type: 'rollback', sa: 'ssa-pix-core', user: { initials: 'MR', name: 'marcia.r', color: 'bg-info/20 text-info' }, status: 'success', startedAt: '08:55:30', duration: '4m 09s', cost: 0.61, currentStep: { label: 'traffik·rollback-done' }, done: 3, total: 3 },
  { id: 'wf_5f3a-cb71', type: 'migration-mongo', sa: 'ssa-12345', user: { initials: 'LL', name: 'luigi.lima', color: 'bg-accent/25 text-accent' }, status: 'success', startedAt: '08:02:18', duration: '1h 12m', cost: 19.84, currentStep: { label: 'migration·done' }, done: 9, total: 9 },
  { id: 'wf_aa2c-d5e8', type: 'build-and-test', sa: 'ssa-pix-pf', user: { initials: 'BV', name: 'b.vieira', color: 'bg-warning/20 text-warning' }, status: 'success', startedAt: '07:40:11', duration: '3m 02s', cost: 0.13, currentStep: { label: 'konstructor·done' }, done: 3, total: 3 },
  { id: 'wf_3128-49a0', type: 'onboarding-vanilla-brownfield', sa: 'ssa-corp-mid', user: { initials: 'JP', name: 'j.pereira', color: 'bg-info/20 text-info' }, status: 'success', startedAt: '07:11:50', duration: '19m 41s', cost: 5.78, currentStep: { label: 'kaptain·done' }, done: 5, total: 5 },
  { id: 'wf_6b9d-118f', type: 'rollout-canary', sa: 'ssa-investimentos', user: { initials: 'AC', name: 'a.cardoso', color: 'bg-success/20 text-success' }, status: 'cancelled', startedAt: '06:48:22', duration: '12m 18s', cost: 2.41, currentStep: { label: 'cancelled · sensor warn' }, done: 2, total: 4 },
  { id: 'wf_4a72-e1d6', type: 'build-and-test', sa: 'ssa-onboarding-pj', user: { initials: 'TS', name: 't.silva', color: 'bg-warning/20 text-warning' }, status: 'success', startedAt: '06:14:01', duration: '2m 54s', cost: 0.09, currentStep: { label: 'konstructor·done' }, done: 3, total: 3 },
  { id: 'wf_9d50-3f8b', type: 'migration-postgres', sa: 'ssa-credito-prefixado', user: { initials: 'RN', name: 'r.nakamura', color: 'bg-failure/20 text-failure' }, status: 'success', startedAt: '05:42:55', duration: '46m 33s', cost: 14.21, currentStep: { label: 'migration·done' }, done: 7, total: 7 },
  { id: 'wf_2810-7c4d', type: 'onboarding-vanilla-greenfield', sa: 'ssa-pix-pj', user: { initials: 'FA', name: 'f.almeida', color: 'bg-info/20 text-info' }, status: 'success', startedAt: '04:30:12', duration: '52m 18s', cost: 16.07, currentStep: { label: 'kaptain·done' }, done: 8, total: 8 },
  { id: 'wf_c5e3-04ba', type: 'rollback', sa: 'ssa-cambio', user: { initials: 'MR', name: 'marcia.r', color: 'bg-info/20 text-info' }, status: 'success', startedAt: '03:11:08', duration: '6m 47s', cost: 1.02, currentStep: { label: 'traffik·rollback-done' }, done: 3, total: 3 },
]

const allSAs = Array.from(new Set(workflows.map((w) => w.sa))).sort()
const allTypes = Array.from(new Set(workflows.map((w) => w.type))).sort()
const allStatuses: Status[] = ['running', 'success', 'failed', 'awaiting', 'cancelled']

const periodLabel: Record<Period, string> = {
  '1h': 'Última 1h',
  '24h': 'Últimas 24h',
  '7d': 'Últimos 7d',
  '30d': 'Últimos 30d',
  all: 'Sempre',
}

const timelineSteps: { name: string; status: 'success' | 'running' | 'pending' | 'failed'; duration: string }[] = [
  { name: 'konstructor·build', status: 'success', duration: '1m 12s' },
  { name: 'sensors·security', status: 'success', duration: '38s' },
  { name: 'sensors·quality', status: 'success', duration: '24s' },
  { name: 'kaptain·apply-stack', status: 'running', duration: '0m 19s' },
  { name: 'kaptain·smoke-test', status: 'pending', duration: '—' },
]

const timelineIcon = {
  success: { icon: CheckCircle2, color: 'text-success' },
  running: { icon: Activity, color: 'text-live' },
  pending: { icon: Clock3, color: 'text-text-muted' },
  failed: { icon: XCircle, color: 'text-failure' },
}

const PAGE_SIZE = 12

export default function WorkflowTrackerList() {
  const navigate = useNavigate()

  // Filters
  const [search, setSearch] = useState('')
  const [selectedSAs, setSelectedSAs] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([])
  const [selectedType, setSelectedType] = useState<string | 'all'>('all')
  const [period, setPeriod] = useState<Period>('24h')

  // Dropdown open state
  const [openMenu, setOpenMenu] = useState<'sa' | 'status' | 'type' | 'period' | null>(null)

  // Pagination
  const [page, setPage] = useState(1)

  // Side panel
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return workflows.filter((w) => {
      if (selectedSAs.length && !selectedSAs.includes(w.sa)) return false
      if (selectedStatuses.length && !selectedStatuses.includes(w.status)) return false
      if (selectedType !== 'all' && w.type !== selectedType) return false
      if (q) {
        const hay = `${w.id} ${w.sa} ${w.user.name}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [search, selectedSAs, selectedStatuses, selectedType])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const liveCount = workflows.filter((w) => w.status === 'running').length
  const selected = selectedId ? workflows.find((w) => w.id === selectedId) : null

  const activeFilterCount =
    (search ? 1 : 0) +
    selectedSAs.length +
    selectedStatuses.length +
    (selectedType !== 'all' ? 1 : 0)

  function toggle<T>(arr: T[], item: T, set: (v: T[]) => void) {
    set(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item])
    setPage(1)
  }

  function clearAll() {
    setSearch('')
    setSelectedSAs([])
    setSelectedStatuses([])
    setSelectedType('all')
    setPage(1)
  }

  function openPreview(id: string) {
    setSelectedId(id)
    setPanelOpen(true)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <nav className="flex items-center gap-1.5 text-[11.5px] text-text-muted">
          <span className="hover:text-text-secondary">Management Plane</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-text-secondary">Workflow Tracker</span>
        </nav>
        <div className="mt-2 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[24px] font-semibold tracking-tight">Workflows</h1>
              <span className="flex items-center gap-1.5 rounded-full border border-live/30 bg-live/10 px-2.5 py-0.5 text-[10.5px] font-medium uppercase tracking-wider text-live">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-live opacity-80" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
                </span>
                live · {liveCount} ativos
              </span>
            </div>
            <p className="mt-1.5 text-[13px] text-text-secondary">
              Acompanhe execuções agênticas em tempo real
            </p>
          </div>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-14 z-[5] -mx-2 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface/95 px-3 py-2.5 backdrop-blur">
        {/* Search */}
        <div className="relative w-[300px] max-w-full">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="workflow_id, SA ou usuário…"
            className="h-8 w-full rounded-md border border-border bg-bg pl-8 pr-3 text-[12.5px] placeholder:text-text-muted focus:border-border-strong focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* SA multi-select */}
        <MultiSelect
          label="SA"
          open={openMenu === 'sa'}
          onToggle={() => setOpenMenu((m) => (m === 'sa' ? null : 'sa'))}
          values={selectedSAs}
          options={allSAs}
          onPick={(v) => toggle(selectedSAs, v, setSelectedSAs)}
          renderLabel={(v) => v}
          monoOptions
        />

        {/* Status multi-select */}
        <MultiSelect
          label="status"
          open={openMenu === 'status'}
          onToggle={() => setOpenMenu((m) => (m === 'status' ? null : 'status'))}
          values={selectedStatuses}
          options={allStatuses}
          onPick={(v) => toggle(selectedStatuses, v, setSelectedStatuses)}
          renderLabel={(v) => statusMeta[v].label}
          renderPrefix={(v) => (
            <span className={`h-1.5 w-1.5 rounded-full ${statusMeta[v].dot}`} />
          )}
        />

        {/* Tipo single-select */}
        <SingleSelect
          label="tipo"
          open={openMenu === 'type'}
          onToggle={() => setOpenMenu((m) => (m === 'type' ? null : 'type'))}
          value={selectedType}
          options={[{ value: 'all', label: 'todos os tipos' }, ...allTypes.map((t) => ({ value: t, label: t }))]}
          onPick={(v) => {
            setSelectedType(v)
            setPage(1)
            setOpenMenu(null)
          }}
        />

        {/* Período single-select */}
        <SingleSelect
          label="período"
          open={openMenu === 'period'}
          onToggle={() => setOpenMenu((m) => (m === 'period' ? null : 'period'))}
          value={period}
          options={(Object.keys(periodLabel) as Period[]).map((p) => ({
            value: p,
            label: periodLabel[p],
          }))}
          onPick={(v) => {
            setPeriod(v as Period)
            setOpenMenu(null)
          }}
        />

        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            className="ml-auto flex h-8 items-center gap-1.5 rounded-md border border-border bg-bg px-2.5 text-[11.5px] text-text-muted hover:text-text-primary"
          >
            <X className="h-3 w-3" />
            limpar {activeFilterCount} filtros
          </button>
        )}
      </div>

      {/* Layout: table + side panel */}
      <div className={`grid gap-4 ${panelOpen ? 'grid-cols-[1fr_360px]' : 'grid-cols-1'}`}>
        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="grid grid-cols-[100px_1.4fr_1.6fr_0.9fr_0.9fr_0.8fr_1.6fr] border-b border-border bg-[#101115] px-4 py-2.5 text-[10.5px] font-medium uppercase tracking-wider text-text-muted">
            <div>Status</div>
            <div>Workflow ID</div>
            <div>Tipo</div>
            <div className="font-mono normal-case tracking-normal">Início</div>
            <div>Duração</div>
            <div className="text-right">Custo</div>
            <div>Step atual</div>
          </div>

          {pageRows.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-16 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-[#181A1F]">
                <Search className="h-4 w-4 text-text-muted" />
              </span>
              <div className="text-[13px] font-medium text-text-secondary">
                Nenhum workflow corresponde
              </div>
              <button
                onClick={clearAll}
                className="text-[11.5px] text-accent hover:underline"
              >
                limpar filtros
              </button>
            </div>
          ) : (
            pageRows.map((w) => {
              const meta = statusMeta[w.status]
              const isSelected = w.id === selectedId
              return (
                <div
                  key={w.id}
                  onClick={() => navigate(`/workflows/${w.id}`)}
                  className={`group relative grid cursor-pointer grid-cols-[100px_1.4fr_1.6fr_0.9fr_0.9fr_0.8fr_1.6fr] items-center border-b border-border px-4 py-2.5 text-[12.5px] transition last:border-b-0 ${
                    isSelected ? 'bg-[#181A1F]' : 'hover:bg-[#16181D]'
                  }`}
                >
                  {/* Status badge */}
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded border px-1.5 py-0.5 text-[10.5px] ${meta.badge}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${meta.dot} ${
                          meta.pulse ? 'animate-pulse-live' : ''
                        }`}
                      />
                      {meta.label}
                    </span>
                  </div>

                  {/* Workflow ID + preview affordance */}
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[12px] text-text-primary">{w.id}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        openPreview(w.id)
                      }}
                      className={`flex h-5 items-center gap-1 rounded px-1.5 text-[10px] text-text-muted transition hover:bg-[#22232A] hover:text-text-primary ${
                        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                      aria-label="abrir preview"
                      title="abrir preview"
                    >
                      preview
                    </button>
                  </div>

                  {/* Tipo */}
                  <div className="truncate text-text-secondary">{w.type}</div>

                  {/* Início */}
                  <div className="font-mono text-[11.5px] text-text-muted">{w.startedAt}</div>

                  {/* Duração */}
                  <div className="font-mono text-[11.5px] text-text-secondary">{w.duration}</div>

                  {/* Custo */}
                  <div className="text-right font-mono text-[11.5px] text-text-secondary">
                    R$ {w.cost.toFixed(2)}
                  </div>

                  {/* Step atual */}
                  <div className="flex items-center gap-2">
                    <span className="truncate font-mono text-[11.5px] text-text-secondary">
                      {w.currentStep.label}
                    </span>
                    <span className="ml-auto font-mono text-[10.5px] text-text-muted">
                      {w.done}/{w.total}
                    </span>
                  </div>
                </div>
              )
            })
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-border bg-[#101115] px-4 py-2.5 text-[11.5px] text-text-muted">
            <div>
              Mostrando{' '}
              <span className="text-text-primary">{pageRows.length}</span> de{' '}
              <span className="text-text-primary">{filtered.length}</span> workflows
              {filtered.length !== workflows.length && (
                <span className="text-text-muted"> (de {workflows.length} no total)</span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-7 w-7 items-center justify-center rounded border border-border bg-bg text-text-muted transition hover:text-text-primary disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const p = idx + 1
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-7 w-7 rounded border text-[11.5px] transition ${
                      page === p
                        ? 'border-border-strong bg-[#181A1F] text-text-primary'
                        : 'border-border bg-bg text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {p}
                  </button>
                )
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-7 w-7 items-center justify-center rounded border border-border bg-bg text-text-secondary transition hover:text-text-primary disabled:opacity-40"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Side preview panel (default closed) */}
        {panelOpen && selected && (
          <aside className="flex h-fit flex-col rounded-lg border border-border bg-surface">
            <div className="flex items-start justify-between gap-2 border-b border-border px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-md ${statusMeta[selected.status].badge}`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0">
                  <div className="truncate font-mono text-[12.5px] text-text-primary">
                    {selected.id}
                  </div>
                  <div className="truncate text-[11px] text-text-muted">{selected.type}</div>
                </div>
              </div>
              <button
                onClick={() => setPanelOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded text-text-muted hover:bg-[#1E1F25] hover:text-text-primary"
                aria-label="fechar painel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* KVs */}
            <div className="grid grid-cols-2 gap-3 px-4 py-3">
              <KV label="SA" value={selected.sa} mono />
              <KV label="Status" value={statusMeta[selected.status].label} chip={statusMeta[selected.status].badge} />
              <KV label="Início" value={selected.startedAt} mono />
              <KV label="Duração" value={selected.duration} mono />
              <KV label="Usuário" value={selected.user.name} />
              <KV label="Custo" value={`R$ ${selected.cost.toFixed(2)}`} mono />
            </div>

            {/* Mini timeline */}
            <div className="px-4 pb-4">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-[10.5px] font-medium uppercase tracking-wider text-text-muted">
                  Mini timeline
                </h4>
                <span className="font-mono text-[11px] text-text-muted">
                  {selected.done}/{selected.total} steps
                </span>
              </div>
              <ol className="relative space-y-2 border-l border-border pl-4">
                {timelineSteps.map((s) => {
                  const Icon = timelineIcon[s.status].icon
                  return (
                    <li key={s.name} className="relative">
                      <span
                        className={`absolute -left-[22px] flex h-3.5 w-3.5 items-center justify-center rounded-full bg-bg ${timelineIcon[s.status].color}`}
                      >
                        <Icon
                          className={`h-3 w-3 ${s.status === 'running' ? 'animate-pulse-live' : ''}`}
                        />
                      </span>
                      <div className="flex items-center justify-between gap-2 text-[12px]">
                        <span className="truncate font-mono text-text-secondary">{s.name}</span>
                        <span className="flex-none font-mono text-[11px] text-text-muted">
                          {s.duration}
                        </span>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 border-t border-border bg-[#101115] px-4 py-3">
              <Link
                to={`/workflows/${selected.id}`}
                className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-accent px-3 text-[12px] font-medium text-black transition hover:bg-accent-hover"
              >
                Ver detalhe completo
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
              <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-[12px] text-text-secondary hover:text-text-primary">
                <Play className="h-3.5 w-3.5" />
                Replay
              </button>
              {selected.status === 'running' && (
                <button
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-text-secondary hover:text-failure"
                  aria-label="pausar"
                >
                  <PauseCircle className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </aside>
        )}

        {/* Floating re-open tab when panel is closed and there's a selection */}
        {!panelOpen && selectedId && (
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

/* ──────────────────────────────────────────────────────────────
   Filter helpers
   ────────────────────────────────────────────────────────────── */

function MultiSelect<T extends string>({
  label,
  open,
  onToggle,
  values,
  options,
  onPick,
  renderLabel,
  renderPrefix,
  monoOptions,
}: {
  label: string
  open: boolean
  onToggle: () => void
  values: T[]
  options: T[]
  onPick: (v: T) => void
  renderLabel: (v: T) => string
  renderPrefix?: (v: T) => React.ReactNode
  monoOptions?: boolean
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex h-8 items-center gap-2 rounded-md border bg-bg px-2.5 text-[12px] transition ${
          values.length
            ? 'border-accent/40 bg-accent/10 text-accent'
            : 'border-border text-text-secondary hover:text-text-primary'
        }`}
      >
        <span className="text-[10.5px] uppercase tracking-wide text-text-muted">{label}</span>
        <span className="text-text-primary">
          {values.length === 0
            ? 'todos'
            : values.length === 1
            ? renderLabel(values[0])
            : `${values.length} selecionados`}
        </span>
        <ChevronDown className="h-3 w-3 text-text-muted" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 max-h-[280px] w-[240px] overflow-auto rounded-md border border-border bg-surface p-1.5 shadow-xl">
          {options.map((opt) => {
            const checked = values.includes(opt)
            return (
              <button
                key={opt}
                onClick={() => onPick(opt)}
                className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[12px] hover:bg-bg ${
                  monoOptions ? 'font-mono text-[11.5px]' : ''
                } ${checked ? 'text-text-primary' : 'text-text-secondary'}`}
              >
                <span
                  className={`flex h-3.5 w-3.5 flex-none items-center justify-center rounded-sm border ${
                    checked ? 'border-accent bg-accent/30' : 'border-border bg-transparent'
                  }`}
                >
                  {checked && <CheckCircle2 className="h-2.5 w-2.5 text-accent" />}
                </span>
                {renderPrefix && renderPrefix(opt)}
                <span className="truncate">{renderLabel(opt)}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function SingleSelect({
  label,
  open,
  onToggle,
  value,
  options,
  onPick,
}: {
  label: string
  open: boolean
  onToggle: () => void
  value: string
  options: { value: string; label: string }[]
  onPick: (v: string) => void
}) {
  const current = options.find((o) => o.value === value)
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex h-8 items-center gap-2 rounded-md border border-border bg-bg px-2.5 text-[12px] text-text-secondary hover:text-text-primary"
      >
        <span className="text-[10.5px] uppercase tracking-wide text-text-muted">{label}</span>
        <span className="text-text-primary">{current?.label ?? value}</span>
        <ChevronDown className="h-3 w-3 text-text-muted" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 max-h-[280px] w-[240px] overflow-auto rounded-md border border-border bg-surface p-1.5 shadow-xl">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onPick(opt.value)}
              className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[12px] hover:bg-bg ${
                opt.value === value ? 'text-text-primary' : 'text-text-secondary'
              }`}
            >
              <span
                className={`flex h-3.5 w-3.5 flex-none items-center justify-center rounded-full border ${
                  opt.value === value ? 'border-accent bg-accent/30' : 'border-border'
                }`}
              >
                {opt.value === value && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
              </span>
              <span className="truncate">{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function KV({
  label,
  value,
  mono,
  chip,
}: {
  label: string
  value: string
  mono?: boolean
  chip?: string
}) {
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-wide text-text-muted">{label}</div>
      {chip ? (
        <span className={`mt-1 inline-flex rounded border px-1.5 py-0.5 text-[11px] ${chip}`}>
          {value}
        </span>
      ) : (
        <div
          className={`mt-0.5 text-[12.5px] text-text-primary ${
            mono ? 'font-mono text-[12px]' : ''
          }`}
        >
          {value}
        </div>
      )}
    </div>
  )
}
