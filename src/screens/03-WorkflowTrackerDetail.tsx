import { useState } from 'react'
import {
  ChevronRight,
  ChevronDown,
  Activity,
  CheckCircle2,
  XCircle,
  Clock3,
  Hammer,
  Rocket,
  Database,
  GitBranch,
  Play,
  Flag,
  Download,
  MoreHorizontal,
  Sparkles,
  ShieldCheck,
  Terminal,
  Bot,
  RefreshCcw,
  Zap,
  Code2,
  ExternalLink,
} from 'lucide-react'

type StepStatus = 'success' | 'running' | 'pending' | 'failed' | 'awaiting'
type Verb = 'build' | 'deploy' | 'migration' | 'rollout'
type SensorVerdict = 'pass' | 'warn' | 'fail'

type Sensor = { name: string; verdict: SensorVerdict; detail: string }

type Step = {
  id: string
  name: string
  tool?: string
  engine?: string
  duration: string
  status: StepStatus
  iterations?: number
  sensors?: Sensor[]
  startedAt?: string
  cost?: number
}

type VerbGroup = {
  verb: Verb
  label: string
  engineLabel: string
  steps: Step[]
}

const verbMeta: Record<Verb, {
  icon: typeof Hammer
  color: string
  bg: string
  border: string
  ring: string
  dotBg: string
}> = {
  build: {
    icon: Hammer,
    color: 'text-info',
    bg: 'bg-info/10',
    border: 'border-info/30',
    ring: 'ring-info/30',
    dotBg: 'bg-info',
  },
  deploy: {
    icon: Rocket,
    color: 'text-accent',
    bg: 'bg-accent/10',
    border: 'border-accent/30',
    ring: 'ring-accent/30',
    dotBg: 'bg-accent',
  },
  migration: {
    icon: Database,
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/30',
    ring: 'ring-warning/30',
    dotBg: 'bg-warning',
  },
  rollout: {
    icon: GitBranch,
    color: 'text-live',
    bg: 'bg-live/10',
    border: 'border-live/30',
    ring: 'ring-live/30',
    dotBg: 'bg-live',
  },
}

const stepStatusMeta: Record<StepStatus, { icon: typeof CheckCircle2; color: string; ring: string }> = {
  success: { icon: CheckCircle2, color: 'text-success', ring: 'ring-success/30' },
  running: { icon: Activity, color: 'text-live', ring: 'ring-live/40' },
  pending: { icon: Clock3, color: 'text-text-muted', ring: 'ring-border' },
  failed: { icon: XCircle, color: 'text-failure', ring: 'ring-failure/30' },
  awaiting: { icon: Clock3, color: 'text-warning', ring: 'ring-warning/30' },
}

const verbGroups: VerbGroup[] = [
  {
    verb: 'build',
    label: 'Build',
    engineLabel: 'Konstructor',
    steps: [
      {
        id: 's-plan',
        name: 'plan-build',
        tool: 'konstructor.plan',
        engine: 'Konstructor',
        duration: '8s',
        status: 'success',
        startedAt: '14:32:18',
        cost: 0.01,
      },
      {
        id: 's-docker',
        name: 'docker-build',
        tool: 'konstructor.build_image',
        engine: 'Konstructor',
        duration: '1m 42s',
        status: 'success',
        startedAt: '14:32:26',
        cost: 0.07,
      },
      {
        id: 's-sec',
        name: 'security-scan',
        tool: 'sensors.security',
        engine: 'Sensors',
        duration: '38s',
        status: 'success',
        startedAt: '14:34:08',
        cost: 0.03,
        sensors: [
          { name: 'cve-scan', verdict: 'pass', detail: '0 critical, 2 medium' },
          { name: 'secrets', verdict: 'pass', detail: 'no secrets leaked' },
          { name: 'sbom', verdict: 'pass', detail: '147 deps, all signed' },
        ],
      },
      {
        id: 's-qual',
        name: 'quality-check',
        tool: 'sensors.quality',
        engine: 'Sensors',
        duration: '1m 21s',
        status: 'success',
        iterations: 3,
        startedAt: '14:34:46',
        cost: 0.12,
        sensors: [
          { name: 'lint', verdict: 'pass', detail: 'fixed 4 issues automaticamente' },
          { name: 'tests', verdict: 'pass', detail: '218 passed, coverage 81%' },
          { name: 'complexity', verdict: 'warn', detail: 'getOrder() ciclo=14' },
        ],
      },
    ],
  },
  {
    verb: 'deploy',
    label: 'Deploy',
    engineLabel: 'Kaptain + Orkestra',
    steps: [
      {
        id: 's-policy',
        name: 'policy-check',
        tool: 'komply.evaluate',
        engine: 'Komply',
        duration: '12s',
        status: 'success',
        startedAt: '14:36:07',
        cost: 0.02,
        sensors: [
          { name: 'network-egress', verdict: 'pass', detail: 'allowlist OK' },
          { name: 'iam-least-priv', verdict: 'pass', detail: '3 roles, no *' },
        ],
      },
      {
        id: 's-apply',
        name: 'apply-stack',
        tool: 'kaptain.apply',
        engine: 'Kaptain',
        duration: '0m 19s',
        status: 'running',
        startedAt: '14:36:19',
        cost: 0.04,
      },
      {
        id: 's-k8s',
        name: 'k8s-deploy',
        tool: 'orkestra.rollout',
        engine: 'Orkestra',
        duration: '—',
        status: 'pending',
      },
      {
        id: 's-smoke',
        name: 'smoke-test',
        tool: 'kaptain.smoke',
        engine: 'Kaptain',
        duration: '—',
        status: 'pending',
      },
    ],
  },
  {
    verb: 'migration',
    label: 'Migration',
    engineLabel: 'Migration + Traffik',
    steps: [
      {
        id: 's-schema',
        name: 'schema-diff',
        tool: 'migration.diff',
        engine: 'Migration',
        duration: '—',
        status: 'pending',
      },
      {
        id: 's-canary',
        name: 'canary-route',
        tool: 'traffik.canary',
        engine: 'Traffik',
        duration: '—',
        status: 'pending',
      },
    ],
  },
  {
    verb: 'rollout',
    label: 'Rollout',
    engineLabel: 'Kaptain',
    steps: [
      {
        id: 's-shift-5',
        name: 'shift-5pct',
        tool: 'kaptain.traffic_shift',
        engine: 'Kaptain',
        duration: '—',
        status: 'pending',
      },
      {
        id: 's-shift-50',
        name: 'shift-50pct',
        tool: 'kaptain.traffic_shift',
        engine: 'Kaptain',
        duration: '—',
        status: 'pending',
      },
      {
        id: 's-shift-100',
        name: 'shift-100pct',
        tool: 'kaptain.traffic_shift',
        engine: 'Kaptain',
        duration: '—',
        status: 'pending',
      },
    ],
  },
]

const stepDetailMap: Record<string, {
  input: { key: string; value: string }[]
  output: { key: string; value: string }[]
  decision: { rationale: string; alternatives: { option: string; reason: string }[] }
}> = {
  's-apply': {
    input: [
      { key: 'sa', value: 'ssa-pix-core' },
      { key: 'environment', value: 'prod-eu-west-1' },
      { key: 'image_digest', value: 'sha256:b2c4…d8f1' },
      { key: 'stack_template', value: 'vanilla/v3.2.1' },
      { key: 'parallel_replicas', value: '4' },
    ],
    output: [
      { key: 'cloudformation_id', value: 'arn:aws:cf:eu-west-1:…:stack/pix/3f' },
      { key: 'estimated_completion', value: '2m 04s' },
      { key: 'resources_planned', value: '17 (3 IAM, 4 SG, 6 ECS, 4 ALB)' },
    ],
    decision: {
      rationale:
        'Selecionei stack template vanilla/v3.2.1 (LTS) ao invés de v3.3.0-rc porque a SA está marcada como tier-1 e o release candidate não foi validado em workload PIX. O grupo migration tem dependência direta em CF outputs, então apply-stack precisa concluir antes do diff schema.',
      alternatives: [
        { option: 'vanilla/v3.3.0-rc', reason: 'RC, não validado em tier-1 PIX' },
        { option: 'kaptain.apply --dry-run primeiro', reason: 'duplicaria latência sem ganho — sensors já validaram' },
      ],
    },
  },
}

const toolCallsCount = 47
const sensorsCount = 9
const auditEventsCount = 3

const tabs = [
  { id: 'timeline', label: 'Timeline', icon: Activity, badge: undefined as string | undefined },
  { id: 'tools', label: 'Tool calls', icon: Terminal, badge: String(toolCallsCount) },
  { id: 'sensors', label: 'Sensores', icon: ShieldCheck, badge: String(sensorsCount) },
  { id: 'audit', label: 'Auditoria', icon: Flag, badge: String(auditEventsCount) },
  { id: 'replay', label: 'Replay', icon: RefreshCcw, badge: undefined },
  { id: 'cost', label: 'Custo', icon: Zap, badge: 'R$ 0,42' },
]

export default function WorkflowTrackerDetail() {
  const [selectedStepId, setSelectedStepId] = useState<string>('s-apply')
  const [activeTab, setActiveTab] = useState<string>('timeline')
  const [open, setOpen] = useState({ input: true, output: true, sensors: true, decision: true })

  const allSteps = verbGroups.flatMap((g) => g.steps.map((s) => ({ ...s, verb: g.verb })))
  const selectedStep = allSteps.find((s) => s.id === selectedStepId) ?? allSteps[0]
  const selectedDetail = stepDetailMap[selectedStep.id] ?? stepDetailMap['s-apply']
  const verb = verbMeta[selectedStep.verb]

  const totalSteps = allSteps.length
  const doneSteps = allSteps.filter((s) => s.status === 'success').length

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[11.5px] text-text-muted">
        <span className="hover:text-text-secondary">Management Plane</span>
        <ChevronRight className="h-3 w-3" />
        <a href="/workflows" className="hover:text-text-secondary">Workflow Tracker</a>
        <ChevronRight className="h-3 w-3" />
        <span className="font-mono text-text-secondary">wf_8b3f-2a91</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-mono text-[24px] font-semibold tracking-tight">wf_8b3f-2a91</h1>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-live/30 bg-live/10 px-2.5 py-1 text-[11.5px] font-medium uppercase tracking-wider text-live">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-pulse-live rounded-full bg-live opacity-80" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
                </span>
                running
              </span>
              <span className="flex items-center gap-1.5 text-[11.5px] text-text-muted">
                <Activity className="h-3 w-3 text-live animate-pulse-live" />
                live · updated 1s ago
              </span>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12.5px] text-text-secondary">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <span>onboarding-vanilla-brownfield</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-text-muted">SA:</span>
                <a href="/assets/ssa-pix-core" className="font-mono text-text-primary hover:text-accent">ssa-pix-core</a>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/25 text-[9.5px] font-medium text-accent">LL</span>
                <span>luigi.lima</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-text-muted">início</span>
                <span className="font-mono">14:32:18</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-text-muted">duração</span>
                <span className="font-mono text-text-primary">2m 13s</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-text-muted">custo</span>
                <span className="font-mono">R$ 0,42</span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button className="flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-[12.5px] text-text-secondary hover:text-text-primary">
              <Play className="h-3.5 w-3.5" />
              Replay
            </button>
            <button className="flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-[12.5px] text-text-secondary hover:text-text-primary">
              <Flag className="h-3.5 w-3.5" />
              Annotate as failure
            </button>
            <button className="flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-[12.5px] text-text-secondary hover:text-text-primary">
              <Download className="h-3.5 w-3.5" />
              Export trace
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-text-secondary hover:text-text-primary">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress strip */}
        <div className="rounded-lg border border-border bg-surface px-4 py-3">
          <div className="flex items-center justify-between text-[11.5px]">
            <div className="flex items-center gap-3 text-text-muted">
              <span>
                <span className="text-text-primary">{doneSteps}</span> / {totalSteps} steps
              </span>
              <span className="h-3 w-px bg-border" />
              <span>
                <span className="text-text-primary">{toolCallsCount}</span> tool calls
              </span>
              <span className="h-3 w-px bg-border" />
              <span>
                <span className="text-text-primary">{sensorsCount}</span> sensores
              </span>
              <span className="h-3 w-px bg-border" />
              <span>
                <span className="text-warning">1</span> iteração automática
              </span>
            </div>
            <div className="text-text-muted">
              ETA <span className="font-mono text-text-primary">3m 47s</span>
            </div>
          </div>
          <div className="mt-2.5 flex h-1.5 w-full overflow-hidden rounded-full bg-[#1B1D22]">
            {verbGroups.map((g) => {
              const total = g.steps.length
              const done = g.steps.filter((s) => s.status === 'success').length
              const running = g.steps.some((s) => s.status === 'running')
              const meta = verbMeta[g.verb]
              const widthPct = (total / totalSteps) * 100
              const fillPct = running ? ((done + 0.5) / total) * 100 : (done / total) * 100
              return (
                <div
                  key={g.verb}
                  className="relative border-r border-bg/60 last:border-r-0"
                  style={{ width: `${widthPct}%` }}
                  title={`${g.label}: ${done}/${total}`}
                >
                  <div className={`absolute inset-y-0 left-0 ${meta.dotBg}`} style={{ width: `${fillPct}%` }} />
                </div>
              )
            })}
          </div>
          <div className="mt-2 flex items-center justify-between text-[10.5px] uppercase tracking-wide text-text-muted">
            {verbGroups.map((g) => (
              <span key={g.verb} className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${verbMeta[g.verb].dotBg}`} />
                {g.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {tabs.map((t) => {
          const Icon = t.icon
          const active = activeTab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`relative flex items-center gap-2 px-3.5 py-2.5 text-[12.5px] transition ${
                active ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{t.label}</span>
              {t.badge && (
                <span className="rounded-full bg-[#1E2027] px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
                  {t.badge}
                </span>
              )}
              {active && <span className="absolute inset-x-0 -bottom-px h-[2px] bg-accent" />}
            </button>
          )
        })}
      </div>

      {/* Tab content: Timeline */}
      {activeTab === 'timeline' && (
        <div className="grid grid-cols-[1.4fr_1fr] gap-5">
          {/* Left: Timeline */}
          <div className="space-y-5">
            {verbGroups.map((group) => {
              const meta = verbMeta[group.verb]
              const Icon = meta.icon
              const doneInGroup = group.steps.filter((s) => s.status === 'success').length
              const runningInGroup = group.steps.some((s) => s.status === 'running')
              const totalInGroup = group.steps.length
              return (
                <div key={group.verb} className="rounded-lg border border-border bg-surface">
                  <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`flex h-7 w-7 items-center justify-center rounded-md border ${meta.bg} ${meta.border}`}>
                        <Icon className={`h-3.5 w-3.5 ${meta.color}`} />
                      </span>
                      <div>
                        <div className={`text-[13px] font-semibold ${meta.color}`}>{group.label}</div>
                        <div className="text-[10.5px] uppercase tracking-wide text-text-muted">{group.engineLabel}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      {runningInGroup && (
                        <span className="inline-flex items-center gap-1 rounded border border-live/30 bg-live/10 px-1.5 py-0.5 text-live">
                          <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-live" />
                          em execução
                        </span>
                      )}
                      <span className="font-mono text-text-muted">
                        <span className={doneInGroup === totalInGroup ? 'text-success' : 'text-text-primary'}>{doneInGroup}</span>
                        /{totalInGroup}
                      </span>
                    </div>
                  </div>

                  <ol className="relative px-4 py-3">
                    <span className="absolute left-[26px] top-5 bottom-5 w-px bg-border" />
                    {group.steps.map((step, idx) => {
                      const status = stepStatusMeta[step.status]
                      const StatusIcon = status.icon
                      const isSelected = step.id === selectedStepId
                      const sensorPass = step.sensors?.filter((s) => s.verdict === 'pass').length ?? 0
                      const sensorWarn = step.sensors?.filter((s) => s.verdict === 'warn').length ?? 0
                      const sensorFail = step.sensors?.filter((s) => s.verdict === 'fail').length ?? 0
                      return (
                        <li key={step.id} className="relative">
                          <button
                            onClick={() => setSelectedStepId(step.id)}
                            className={`group relative my-1 flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left transition ${
                              isSelected
                                ? `border-border-strong bg-[#1B1D22] ring-1 ${verb.ring}`
                                : 'border-transparent hover:bg-[#181A1F]'
                            }`}
                          >
                            <span
                              className={`relative z-[1] flex h-6 w-6 flex-none items-center justify-center rounded-full bg-bg ring-1 ${status.ring}`}
                            >
                              <StatusIcon className={`h-3.5 w-3.5 ${status.color} ${step.status === 'running' ? 'animate-pulse-live' : ''}`} />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-[13px] font-medium ${step.status === 'pending' ? 'text-text-muted' : 'text-text-primary'}`}>
                                  {step.name}
                                </span>
                                {step.tool && (
                                  <span className="font-mono text-[11px] text-text-muted">{step.tool}</span>
                                )}
                                {step.iterations && step.iterations > 1 && (
                                  <span className="inline-flex items-center gap-1 rounded border border-warning/30 bg-warning/10 px-1.5 py-0.5 text-[10px] text-warning">
                                    <RefreshCcw className="h-2.5 w-2.5" />
                                    {step.iterations} iterações
                                  </span>
                                )}
                              </div>
                              <div className="mt-1 flex items-center gap-2 text-[11px] text-text-muted">
                                {step.startedAt && (
                                  <span className="font-mono">início {step.startedAt}</span>
                                )}
                                {step.sensors && step.sensors.length > 0 && (
                                  <>
                                    <span className="text-border-strong">·</span>
                                    <span className="inline-flex items-center gap-1">
                                      <ShieldCheck className="h-2.5 w-2.5" />
                                      {sensorPass > 0 && <span className="text-success">{sensorPass} ok</span>}
                                      {sensorWarn > 0 && <span className="text-warning">{sensorWarn} warn</span>}
                                      {sensorFail > 0 && <span className="text-failure">{sensorFail} fail</span>}
                                    </span>
                                  </>
                                )}
                                {step.cost !== undefined && (
                                  <>
                                    <span className="text-border-strong">·</span>
                                    <span className="font-mono">R$ {step.cost.toFixed(2)}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <span className={`flex-none font-mono text-[11.5px] ${step.status === 'pending' ? 'text-text-muted' : step.status === 'running' ? 'text-live' : 'text-text-secondary'}`}>
                              {step.duration}
                            </span>
                            <ChevronRight className={`h-3.5 w-3.5 flex-none transition ${isSelected ? 'text-text-secondary' : 'text-text-muted opacity-0 group-hover:opacity-100'}`} />
                          </button>
                          {idx < group.steps.length - 1 && <div className="h-1" />}
                        </li>
                      )
                    })}
                  </ol>
                </div>
              )
            })}
          </div>

          {/* Right: Step detail (sticky) */}
          <aside className="sticky top-20 h-fit max-h-[calc(100vh-6rem)] overflow-y-auto rounded-lg border border-border bg-surface">
            {/* Header */}
            <div className={`flex items-start justify-between gap-3 border-b border-border px-4 py-3.5 ${verb.bg}`}>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-md border ${verb.border} bg-bg`}>
                    {(() => { const I = verb.icon; return <I className={`h-3 w-3 ${verb.color}`} /> })()}
                  </span>
                  <span className={`text-[10.5px] font-medium uppercase tracking-wide ${verb.color}`}>
                    {selectedStep.verb}
                  </span>
                  <span className="text-[10.5px] text-text-muted">·</span>
                  <span className="text-[10.5px] text-text-muted">{selectedStep.engine}</span>
                </div>
                <div className="mt-1.5 text-[15px] font-semibold text-text-primary">{selectedStep.name}</div>
                {selectedStep.tool && (
                  <div className="mt-1 font-mono text-[11.5px] text-text-muted">{selectedStep.tool}</div>
                )}
              </div>
              <div className="flex-none text-right">
                <div className={`inline-flex items-center gap-1.5 rounded border px-1.5 py-0.5 text-[10.5px] ${
                  selectedStep.status === 'running' ? 'border-live/30 bg-live/15 text-live' :
                  selectedStep.status === 'success' ? 'border-success/30 bg-success/15 text-success' :
                  selectedStep.status === 'failed' ? 'border-failure/30 bg-failure/15 text-failure' :
                  selectedStep.status === 'awaiting' ? 'border-warning/30 bg-warning/15 text-warning' :
                  'border-border bg-bg text-text-muted'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    selectedStep.status === 'running' ? 'bg-live animate-pulse-live' :
                    selectedStep.status === 'success' ? 'bg-success' :
                    selectedStep.status === 'failed' ? 'bg-failure' :
                    selectedStep.status === 'awaiting' ? 'bg-warning' :
                    'bg-text-muted'
                  }`} />
                  {selectedStep.status}
                </div>
                <div className="mt-1.5 font-mono text-[11.5px] text-text-secondary">{selectedStep.duration}</div>
              </div>
            </div>

            {/* Section: Input */}
            <Collapsible
              open={open.input}
              onToggle={() => setOpen((o) => ({ ...o, input: !o.input }))}
              label="Input"
              count={selectedDetail.input.length}
              icon={<Code2 className="h-3 w-3" />}
            >
              <ul className="space-y-1.5 px-4 pb-3">
                {selectedDetail.input.map((kv) => (
                  <li key={kv.key} className="grid grid-cols-[110px_1fr] gap-2 text-[11.5px]">
                    <span className="text-text-muted">{kv.key}</span>
                    <span className="break-all font-mono text-text-primary">{kv.value}</span>
                  </li>
                ))}
              </ul>
            </Collapsible>

            {/* Section: Output */}
            <Collapsible
              open={open.output}
              onToggle={() => setOpen((o) => ({ ...o, output: !o.output }))}
              label="Output"
              count={selectedDetail.output.length}
              icon={<Terminal className="h-3 w-3" />}
              live={selectedStep.status === 'running'}
            >
              <ul className="space-y-1.5 px-4 pb-3">
                {selectedDetail.output.map((kv) => (
                  <li key={kv.key} className="grid grid-cols-[140px_1fr] gap-2 text-[11.5px]">
                    <span className="text-text-muted">{kv.key}</span>
                    <span className="break-all font-mono text-text-primary">{kv.value}</span>
                  </li>
                ))}
                {selectedStep.status === 'running' && (
                  <li className="flex items-center gap-2 pt-1 text-[11px] text-live">
                    <Activity className="h-3 w-3 animate-pulse-live" />
                    streaming…
                  </li>
                )}
              </ul>
            </Collapsible>

            {/* Section: Sensores */}
            <Collapsible
              open={open.sensors}
              onToggle={() => setOpen((o) => ({ ...o, sensors: !o.sensors }))}
              label="Sensores"
              count={selectedStep.sensors?.length ?? 0}
              icon={<ShieldCheck className="h-3 w-3" />}
            >
              <div className="px-4 pb-3">
                {selectedStep.sensors && selectedStep.sensors.length > 0 ? (
                  <ul className="space-y-1.5">
                    {selectedStep.sensors.map((s) => {
                      const v = s.verdict
                      const SensorIcon = v === 'pass' ? CheckCircle2 : v === 'fail' ? XCircle : Clock3
                      const colorCls = v === 'pass' ? 'text-success' : v === 'fail' ? 'text-failure' : 'text-warning'
                      return (
                        <li key={s.name} className="flex items-start gap-2 rounded-md border border-border bg-bg px-2.5 py-1.5 text-[11.5px]">
                          <SensorIcon className={`mt-0.5 h-3 w-3 flex-none ${colorCls}`} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-text-primary">{s.name}</span>
                              <span className={`text-[10px] uppercase tracking-wide ${colorCls}`}>{v}</span>
                            </div>
                            <div className="text-[11px] text-text-secondary">{s.detail}</div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p className="text-[11.5px] text-text-muted">Nenhum sensor acionado neste step.</p>
                )}
              </div>
            </Collapsible>

            {/* Section: Decisão do agente */}
            <Collapsible
              open={open.decision}
              onToggle={() => setOpen((o) => ({ ...o, decision: !o.decision }))}
              label="Decisão do agente"
              icon={<Bot className="h-3 w-3" />}
              accent
            >
              <div className="space-y-3 px-4 pb-3 text-[12px]">
                <div>
                  <div className="mb-1 text-[10.5px] uppercase tracking-wide text-text-muted">rationale</div>
                  <p className="leading-relaxed text-text-secondary">{selectedDetail.decision.rationale}</p>
                </div>
                <div>
                  <div className="mb-1.5 text-[10.5px] uppercase tracking-wide text-text-muted">alternatives considered</div>
                  <ul className="space-y-1.5">
                    {selectedDetail.decision.alternatives.map((a, i) => (
                      <li key={i} className="rounded-md border border-border bg-bg px-2.5 py-1.5">
                        <div className="font-mono text-[11.5px] text-text-primary">{a.option}</div>
                        <div className="text-[11px] text-text-muted">→ {a.reason}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Collapsible>

            {/* Footer */}
            <div className="flex items-center gap-2 border-t border-border bg-[#101115] px-4 py-3">
              <button className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-surface px-3 text-[11.5px] text-text-secondary hover:text-text-primary">
                <Code2 className="h-3.5 w-3.5" />
                Ver raw trace
                <ExternalLink className="h-3 w-3" />
              </button>
              <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-[11.5px] text-text-secondary hover:text-text-primary">
                <Play className="h-3.5 w-3.5" />
                Replay step
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Other tabs (placeholder content but consistent style) */}
      {activeTab !== 'timeline' && (
        <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed border-border bg-surface">
          <div className="text-center">
            <div className="text-[14px] text-text-primary">Tab "{tabs.find((t) => t.id === activeTab)?.label}"</div>
            <div className="mt-1 text-[12px] text-text-muted">Conteúdo desta aba ainda não gerado pelo loop.</div>
          </div>
        </div>
      )}
    </div>
  )
}

function Collapsible({
  open,
  onToggle,
  label,
  count,
  icon,
  accent,
  live,
  children,
}: {
  open: boolean
  onToggle: () => void
  label: string
  count?: number
  icon?: React.ReactNode
  accent?: boolean
  live?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-2.5 text-left transition hover:bg-[#181A1F]"
      >
        <div className="flex items-center gap-2">
          <span className={`flex h-5 w-5 items-center justify-center rounded ${accent ? 'bg-accent/15 text-accent' : 'bg-[#1E2027] text-text-secondary'}`}>
            {icon}
          </span>
          <span className={`text-[11.5px] font-medium uppercase tracking-wider ${accent ? 'text-accent' : 'text-text-secondary'}`}>
            {label}
          </span>
          {count !== undefined && count > 0 && (
            <span className="rounded-full bg-[#1E2027] px-1.5 py-0.5 font-mono text-[10px] text-text-muted">{count}</span>
          )}
          {live && (
            <span className="inline-flex items-center gap-1 rounded border border-live/30 bg-live/10 px-1.5 py-0.5 text-[10px] text-live">
              <span className="h-1 w-1 animate-pulse-live rounded-full bg-live" />
              live
            </span>
          )}
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-text-muted transition ${open ? 'rotate-0' : '-rotate-90'}`} />
      </button>
      {open && children}
    </div>
  )
}
