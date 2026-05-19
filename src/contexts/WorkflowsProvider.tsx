import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  applicationHubs as applicationHubsSeed,
  executionTemplateIds,
  workflows as workflowTemplates,
  type ApplicationHub,
  type WorkflowAsset,
} from '../data/database'

// =============================================================================
// Spec types — `specs/context/worflow-context.md`
// =============================================================================

export type WorkflowStep = {
  id: string
  slug: string
  name: string
  description: string
  isCompleted: boolean
  /**
   * Algumas ações são async; o passo só pode ser avançado pelo usuário
   * quando `canProgress` for true (ex.: passos manuais com `completedOnClick`).
   */
  canProgress: boolean
  // --- legacy aliases (mantidos pra retro-compatibilidade enquanto consumidores migram) ---
  /** Alias de `name`. */
  title: string
  status: StepInstanceStatus
  startedAt?: string
  completedAt?: string
}

export type ExecutionStepType = 'Inference' | 'Computacional'

export type ExecutionStep = {
  type: ExecutionStepType
  name: string
  slug: string
  /** Se `type === 'Inference'`, sempre true. */
  needHumanApproval: boolean
  /** `null` = usuário ainda não decidiu. */
  isApprovedByHuman: boolean | null
}

export type ExecutionWorkflow = {
  id: string
  slug: string
  name: string
  description: string
  steps: ExecutionStep[]
  /** Slug do step corrente. */
  currentStep: string
  // --- legacy aliases ---
  /** Alias de `slug` — o id do template subjacente. */
  templateId: string
  /** Alias de `name`. */
  templateName: string
  status: WorkflowStatus
  startedAt: string
  /** Mapeia 1-1 com `steps` mantendo o formato legacy de `StepInstance`. */
  legacySteps: StepInstance[]
  currentStepIndex: number
  /** Itens agênticos pendentes derivados dos steps `needHumanApproval`. */
  pendingAgenticFlow: PendingAgenticFlowItem[]
}

export type Workflow = {
  id: string
  slug: string
  name: string
  description: string
  steps: WorkflowStep[]
  /** Aplicações on-platform provisionadas por este workflow. */
  infraOnPlat: ApplicationHub[]
  /** Workflows agênticos/de execução disparados por este workflow. */
  workflowsOnPlat: ExecutionWorkflow[]
  // --- legacy aliases ---
  /** Alias de `slug`. */
  templateId: string
  /** Alias de `name`. */
  templateName: string
  status: WorkflowStatus
  startedAt: string
  /** Mapeia 1-1 com `steps`, mantendo o formato legacy de `StepInstance`. */
  legacySteps: StepInstance[]
  currentStepIndex: number
  pendingAgenticFlow: PendingAgenticFlowItem[]
}

// =============================================================================
// Legacy types — gradualmente sendo migrados pros spec types acima
// =============================================================================

export type StepInstanceStatus = 'pending' | 'in-progress' | 'done'

export type StepInstance = {
  id: string
  title: string
  status: StepInstanceStatus
  startedAt?: string
  completedAt?: string
}

export type WorkflowStatus =
  | 'draft'
  | 'running'
  | 'awaiting'
  | 'completed'
  | 'failed'

export type PendingAgenticFlowItem = {
  stepId: string
  stepTitle: string
  prTitle: string
  prAuthor: string
  prSummary: string
  filesChanged: number
  linesAdded: number
  linesRemoved: number
  createdAt: string
}

// Compat name — usado em consumidores antigos. Sinônimo de `Workflow`.
export type WorkflowInstance = Workflow

export type AppHubAlertKind = 'approval' | 'failure' | 'policy'

export type AppHubAlert = {
  id: string
  kind: AppHubAlertKind
  title: string
  detail: string
  ago: string
}

// =============================================================================
// Context value
// =============================================================================

type WorkflowsContextValue = {
  // ----- Spec-aligned API (CRUD) -----
  workflows: Workflow[]
  createWorkflow: (templateOrAsset: string | WorkflowAsset) => Workflow | null
  getWorkflow: (id: string) => Workflow | undefined
  updateWorkflow: (id: string, update: Partial<Workflow>) => void
  deleteWorkflow: (id: string) => void

  // ----- Derivados / orthogonais -----
  /** Flatten de `workflows[].infraOnPlat`. */
  applicationHubs: ApplicationHub[]
  appHubAlerts: AppHubAlert[]

  // ----- Façades sobre CRUD (mantidas pra retro-compat) -----
  addWorkflow: (templateOrAsset: string | WorkflowAsset) => Workflow | null
  /**
   * Upsert de um `ApplicationHub` na lista global. Se já existir um hub
   * com o mesmo `hub.id`, o registro é substituído (mantém-se em sincronia
   * com o último estado — ex.: seed `pending` vira `completed` quando o
   * `wf-migration-vanilla` é concluído). Invocado pelo provider ao final
   * do workflow primário de migração.
   */
  addApplicationHub: (hub: ApplicationHub) => void
  advanceStep: (workflowId: string) => void
  /**
   * Marca um step específico (por `stepId`) como concluído, sem exigir que
   * seja o step corrente. Usado pelo checklist de onboarding no Home, onde
   * o usuário pode marcar steps fora de ordem via checkbox.
   */
  completeStep: (workflowId: string, stepId: string) => void
  /**
   * Inverso de `completeStep`: desmarca um step específico, retornando-o
   * pra pendente. Usado quando o usuário desmarca o checkbox do step na TODO list.
   */
  uncompleteStep: (workflowId: string, stepId: string) => void
  advanceStatus: (workflowId: string, status: WorkflowStatus) => void
  resolveAgenticItem: (workflowId: string, stepId: string) => void
}

const WorkflowsContext = createContext<WorkflowsContextValue | null>(null)

/**
 * Templates cuja conclusão provisiona um `ApplicationHub`. Hoje é o workflow
 * primário de onboarding (`wf-migration-vanilla`) — o hub é criado quando o
 * usuário fecha todos os 6 steps do checklist (mesmo momento em que o
 * `CongratsAlert` substitui o card de onboarding).
 */
const HUB_PROVISIONING_TEMPLATE_IDS: Set<string> = new Set([
  'wf-migration-vanilla',
])

/** Intervalo entre auto-advances do pipeline server-side. */
const AUTO_ADVANCE_INTERVAL_MS = 2500

// =============================================================================
// Helpers
// =============================================================================

/** Resolve um templateId percorrendo templates raiz e seus triggers. */
function findTemplateById(id: string): WorkflowAsset | undefined {
  for (const t of workflowTemplates) {
    if (t.id === id) return t
    for (const step of t.onboardingSteps) {
      if (step.triggers && step.triggers.id === id) return step.triggers
    }
  }
  return undefined
}

const SA_TO_PROJECT: Record<string, string> = {
  'ssa-pix-core': 'proj-pix-platform',
  'ssa-conta-corrente': 'proj-pagamentos',
  'ssa-investimentos': 'proj-invest',
  'ssa-credito-prefixado': 'proj-credito',
  'ssa-cartoes': 'proj-cartoes',
  'ssa-seguros': 'proj-seguros',
  'ssa-onboarding-digital': 'proj-onboarding',
}

const SA_TO_SQUAD: Record<string, string> = {
  'ssa-pix-core': 'squad-pix',
  'ssa-conta-corrente': 'squad-cc',
  'ssa-investimentos': 'squad-invest',
  'ssa-credito-prefixado': 'squad-credito',
  'ssa-cartoes': 'squad-cartoes',
  'ssa-seguros': 'squad-seguros',
  'ssa-onboarding-digital': 'squad-onboarding',
}

function toFriendlyAppName(sa: string): string {
  return sa
    .replace(/^ssa-/, '')
    .split('-')
    .map((part) => (part.length === 0 ? part : part[0].toUpperCase() + part.slice(1)))
    .join(' ')
}

function buildHubFromTemplate(template: WorkflowAsset): ApplicationHub {
  const saInput = template.inputs.find((i) => i.name === 'sa_id')
  const sa = saInput?.default ?? 'ssa-pix-core'
  const baseName = sa.replace(/^ssa-/, '')
  return {
    id: `ahub-${sa}`,
    sa,
    status: 'completed',
    name: toFriendlyAppName(sa),
    projectId: SA_TO_PROJECT[sa] ?? `proj-${baseName}`,
    squad: SA_TO_SQUAD[sa] ?? `squad-${baseName.split('-')[0]}`,
    onPlat: true,
    health: 'healthy',
    liveIncident: false,
    uptime: 99.95,
    p95Ms: 142,
    errorRate: 0.18,
    deploys7d: 1,
  }
}

function buildAlertFromTemplate(template: WorkflowAsset): AppHubAlert {
  const saInput = template.inputs.find((i) => i.name === 'sa_id')
  const sa = saInput?.default ?? 'ssa-pix-core'
  return {
    id: `alert-${template.id}-infra-partial`,
    kind: 'failure',
    title: `Provisionamento parcial · ${sa}`,
    detail:
      'Pantheon não conseguiu criar o topic Kafka durante o rollout. Aplicação saudável, mas eventos não estão fluindo. Reaplique o template Kaptain para reconciliar.',
    ago: 'agora',
  }
}

function buildPendingAgenticFromTemplate(
  template: WorkflowAsset,
  createdAt: string,
): PendingAgenticFlowItem[] {
  return template.onboardingSteps
    .filter((s) => s.agentic)
    .map((s) => {
      const meta = s.agentic!
      let added = 0
      let removed = 0
      for (const f of meta.files) {
        for (const h of f.hunks) {
          for (const line of h.lines) {
            if (line.kind === 'add') added += 1
            else if (line.kind === 'del') removed += 1
          }
        }
      }
      return {
        stepId: s.id,
        stepTitle: s.title,
        prTitle: meta.prTitle,
        prAuthor: meta.prAuthor,
        prSummary: meta.prSummary,
        filesChanged: meta.files.length,
        linesAdded: added,
        linesRemoved: removed,
        createdAt,
      }
    })
}

function buildWorkflowFromTemplate(template: WorkflowAsset): Workflow {
  const now = new Date().toISOString()
  const steps: WorkflowStep[] = template.onboardingSteps.map((s, i) => ({
    id: s.id,
    slug: s.id,
    name: s.title,
    description: s.description,
    isCompleted: false,
    canProgress: s.completedOnClick,
    // legacy
    title: s.title,
    status: i === 0 ? 'in-progress' : 'pending',
    startedAt: i === 0 ? now : undefined,
  }))
  const legacySteps: StepInstance[] = steps.map((s) => ({
    id: s.id,
    title: s.title,
    status: s.status,
    startedAt: s.startedAt,
    completedAt: s.completedAt,
  }))
  return {
    id: `wfi-${Math.random().toString(36).slice(2, 8)}`,
    slug: template.id,
    name: template.name,
    description: template.description,
    steps,
    infraOnPlat: [],
    workflowsOnPlat: [],
    // legacy
    templateId: template.id,
    templateName: template.name,
    status: steps.length > 0 ? 'running' : 'draft',
    startedAt: now,
    legacySteps,
    currentStepIndex: 0,
    pendingAgenticFlow: buildPendingAgenticFromTemplate(template, now),
  }
}

/** Reconcilia legacy `status`/`legacySteps`/`currentStepIndex` a partir do array novo `steps[]`. */
function reconcileLegacyFields(wf: Workflow): Workflow {
  const firstUnfinished = wf.steps.findIndex((s) => !s.isCompleted)
  const currentStepIndex =
    firstUnfinished < 0 ? wf.steps.length : firstUnfinished
  const allDone = wf.steps.every((s) => s.isCompleted)
  const status: WorkflowStatus = allDone
    ? 'completed'
    : wf.status === 'draft'
      ? 'running'
      : wf.status
  const legacySteps: StepInstance[] = wf.steps.map((s) => ({
    id: s.id,
    title: s.title,
    status: s.status,
    startedAt: s.startedAt,
    completedAt: s.completedAt,
  }))
  return { ...wf, status, currentStepIndex, legacySteps }
}

// =============================================================================
// Provider
// =============================================================================

export function WorkflowsProvider({ children }: { children: ReactNode }) {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  // Hubs vêm de `database.json` (seed) + `addApplicationHub` (provisionado
  // ao concluir o `wf-migration-vanilla`). Estado canônico — substituiu o
  // antigo `wf.infraOnPlat` por-workflow.
  const [applicationHubsState, setApplicationHubsState] = useState<ApplicationHub[]>(
    applicationHubsSeed,
  )
  const [appHubAlerts, setAppHubAlerts] = useState<AppHubAlert[]>([])

  // ---- CRUD ----

  const createWorkflow = useCallback(
    (templateOrAsset: string | WorkflowAsset): Workflow | null => {
      const template =
        typeof templateOrAsset === 'string'
          ? workflowTemplates.find((w) => w.id === templateOrAsset) ??
          findTemplateById(templateOrAsset)
          : templateOrAsset
      if (!template) return null
      const wf = buildWorkflowFromTemplate(template)
      setWorkflows((prev) => [...prev, wf])
      return wf
    },
    [],
  )

  const getWorkflow = useCallback(
    (id: string) => workflows.find((w) => w.id === id),
    [workflows],
  )

  const updateWorkflow = useCallback(
    (id: string, update: Partial<Workflow>) => {
      setWorkflows((prev) =>
        prev.map((wf) =>
          wf.id === id ? reconcileLegacyFields({ ...wf, ...update }) : wf,
        ),
      )
    },
    [],
  )

  const deleteWorkflow = useCallback((id: string) => {
    setWorkflows((prev) => prev.filter((wf) => wf.id !== id))
  }, [])

  // ---- Façades sobre o CRUD ----

  const addWorkflow = createWorkflow

  const addApplicationHub = useCallback((hub: ApplicationHub) => {
    setApplicationHubsState((prev) => {
      const idx = prev.findIndex((h) => h.id === hub.id)
      if (idx < 0) return [...prev, hub]
      // Upsert: substitui o registro existente (ex.: status `pending` →
      // `completed` quando o workflow primário conclui).
      const next = prev.slice()
      next[idx] = hub
      return next
    })
  }, [])

  const advanceStep = useCallback((workflowId: string) => {
    let trajectoryEnded: Workflow | null = null

    setWorkflows((prev) => {
      const next = prev.map((wf) => {
        if (wf.id !== workflowId) return wf
        if (wf.status === 'completed' || wf.status === 'failed') return wf

        const now = new Date().toISOString()
        const idx = wf.steps.findIndex((s) => !s.isCompleted)
        if (idx < 0) return wf

        const steps: WorkflowStep[] = wf.steps.map((s, i) => {
          if (i === idx) {
            return {
              ...s,
              isCompleted: true,
              status: 'done' as const,
              completedAt: now,
            }
          }
          if (i === idx + 1) {
            return {
              ...s,
              status: 'in-progress' as const,
              startedAt: now,
            }
          }
          return s
        })

        const reconciled = reconcileLegacyFields({ ...wf, steps })
        if (reconciled.status === 'completed') trajectoryEnded = reconciled
        return reconciled
      })
      return next
    })

    // Provisiona hub + alerta na conclusão da trajetória do workflow primário
    if (trajectoryEnded) {
      const ended = trajectoryEnded as Workflow
      const template = findTemplateById(ended.slug)
      if (template && HUB_PROVISIONING_TEMPLATE_IDS.has(template.id)) {
        addApplicationHub(buildHubFromTemplate(template))
        const alert = buildAlertFromTemplate(template)
        setAppHubAlerts((prev) =>
          prev.some((a) => a.id === alert.id) ? prev : [...prev, alert],
        )
      }
    }
  }, [addApplicationHub])

  const completeStep = useCallback((workflowId: string, stepId: string) => {
    let trajectoryEnded: Workflow | null = null

    setWorkflows((prev) => {
      const next = prev.map((wf) => {
        if (wf.id !== workflowId) return wf
        if (wf.status === 'completed' || wf.status === 'failed') return wf

        const targetIdx = wf.steps.findIndex((s) => s.id === stepId)
        if (targetIdx < 0) return wf
        if (wf.steps[targetIdx].isCompleted) return wf

        const now = new Date().toISOString()
        const afterCompletion: WorkflowStep[] = wf.steps.map((s, i) => {
          if (i === targetIdx) {
            return {
              ...s,
              isCompleted: true,
              status: 'done' as const,
              completedAt: now,
            }
          }
          return s
        })

        // Re-derive 'in-progress' so it always points at the first un-completed
        // step. Necessary because steps can now be completed out of order.
        const firstUnfinished = afterCompletion.findIndex((s) => !s.isCompleted)
        const withProgress: WorkflowStep[] = afterCompletion.map((s, i) => {
          if (s.isCompleted) return s
          if (i === firstUnfinished) {
            return {
              ...s,
              status: 'in-progress' as const,
              startedAt: s.startedAt ?? now,
            }
          }
          return { ...s, status: 'pending' as const }
        })

        const reconciled = reconcileLegacyFields({ ...wf, steps: withProgress })
        if (reconciled.status === 'completed') trajectoryEnded = reconciled
        return reconciled
      })
      return next
    })

    // Mirror de `advanceStep`: provisiona hub + alerta ao concluir a
    // trajetória completa do workflow primário.
    if (trajectoryEnded) {
      const ended = trajectoryEnded as Workflow
      const template = findTemplateById(ended.slug)
      if (template && HUB_PROVISIONING_TEMPLATE_IDS.has(template.id)) {
        addApplicationHub(buildHubFromTemplate(template))
        const alert = buildAlertFromTemplate(template)
        setAppHubAlerts((prev) =>
          prev.some((a) => a.id === alert.id) ? prev : [...prev, alert],
        )
      }
    }
  }, [addApplicationHub])

  const uncompleteStep = useCallback((workflowId: string, stepId: string) => {
    setWorkflows((prev) =>
      prev.map((wf) => {
        if (wf.id !== workflowId) return wf
        const targetIdx = wf.steps.findIndex((s) => s.id === stepId)
        if (targetIdx < 0) return wf
        if (!wf.steps[targetIdx].isCompleted) return wf

        const undone: WorkflowStep[] = wf.steps.map((s, i) => {
          if (i === targetIdx) {
            return {
              ...s,
              isCompleted: false,
              status: 'pending' as const,
              completedAt: undefined,
            }
          }
          return s
        })

        // Re-derive 'in-progress' como primeiro não concluído.
        const firstUnfinished = undone.findIndex((s) => !s.isCompleted)
        const withProgress: WorkflowStep[] = undone.map((s, i) => {
          if (s.isCompleted) return s
          if (i === firstUnfinished) {
            return {
              ...s,
              status: 'in-progress' as const,
              startedAt: s.startedAt ?? new Date().toISOString(),
            }
          }
          return { ...s, status: 'pending' as const }
        })

        return reconcileLegacyFields({ ...wf, steps: withProgress })
      }),
    )
  }, [])

  const advanceStatus = useCallback((workflowId: string, status: WorkflowStatus) => {
    setWorkflows((prev) =>
      prev.map((wf) => (wf.id === workflowId ? { ...wf, status } : wf)),
    )
  }, [])

  const resolveAgenticItem = useCallback(
    (workflowId: string, stepId: string) => {
      setWorkflows((prev) =>
        prev.map((wf) => {
          if (wf.id !== workflowId) return wf
          // Atualiza dois caminhos: o legacy `pendingAgenticFlow` (filtra fora)
          // e o novo `workflowsOnPlat[].steps[].isApprovedByHuman` (sem reverter
          // — assumimos aprovação por simplicidade no wireframe).
          return {
            ...wf,
            pendingAgenticFlow: wf.pendingAgenticFlow.filter(
              (item) => item.stepId !== stepId,
            ),
            workflowsOnPlat: wf.workflowsOnPlat.map((ew) => ({
              ...ew,
              steps: ew.steps.map((s) =>
                s.slug === stepId && s.needHumanApproval
                  ? { ...s, isApprovedByHuman: true }
                  : s,
              ),
              pendingAgenticFlow: ew.pendingAgenticFlow.filter(
                (item) => item.stepId !== stepId,
              ),
            })),
          }
        }),
      )
    },
    [],
  )

  // Auto-advance global: aplica APENAS aos pipelines server-side
  // (`executionTemplateIds`, ex.: `wf-onboarding-vanilla-exec`). O workflow
  // primário de onboarding (`wf-migration-vanilla`) é manual — cada step do
  // checklist é completado pelo usuário via `handleToggleStep` no Home; o
  // provider não pode avançar sozinho ou a trajetória inteira é "queimada"
  // sem dar tempo do exec rodar (causa CongratsAlert prematuro).
  // Steps de approval (`canProgress=false`) pausam o auto-advance — só
  // finalizam via `completeStep` disparado por UI de aprovação.
  useEffect(() => {
    const timers: number[] = []
    for (const wf of workflows) {
      if (wf.status !== 'running') continue
      if (!executionTemplateIds.has(wf.templateId)) continue
      const current = wf.steps.find((s) => s.status === 'in-progress')
      if (!current) continue
      if (!current.canProgress) continue
      const wfId = wf.id
      const t = window.setTimeout(() => {
        advanceStep(wfId)
      }, AUTO_ADVANCE_INTERVAL_MS)
      timers.push(t)
    }
    return () => {
      for (const t of timers) window.clearTimeout(t)
    }
  }, [workflows, advanceStep])

  // `applicationHubs` é simplesmente o estado canônico (seed do
  // `database.json` + qualquer hub adicionado via `addApplicationHub`).
  // Antes havia um flatMap por `wf.infraOnPlat` — removido depois que o
  // provisionamento passou pra `addApplicationHub`.
  const applicationHubs = useMemo<ApplicationHub[]>(() => {
    return applicationHubsState
  }, [applicationHubsState])

  // Para o WorkflowTrackerList: combina workflows primários + execuções aninhadas
  // sob o mesmo array no contexto, pra que filtros existentes continuem
  // funcionando. Cada ExecutionWorkflow expõe os mesmos campos legacy de
  // Workflow, então o filtro `executionTemplateIds.has(w.templateId)` ainda casa.
  const workflowsExposed = useMemo<Workflow[]>(() => {
    const expanded: Workflow[] = []
    for (const wf of workflows) {
      expanded.push(wf)
      for (const ew of wf.workflowsOnPlat) {
        expanded.push({
          ...ew,
          // Tipos diferem em `steps`/`infraOnPlat`/`workflowsOnPlat`; pra render
          // legacy o WorkflowTrackerList usa templateId/templateName/legacySteps
          // que estão presentes em ambos.
          steps: [],
          infraOnPlat: [],
          workflowsOnPlat: [],
        } as Workflow)
      }
    }
    return expanded
  }, [workflows])

  const value = useMemo<WorkflowsContextValue>(
    () => ({
      workflows: workflowsExposed,
      createWorkflow,
      getWorkflow,
      updateWorkflow,
      deleteWorkflow,
      applicationHubs,
      appHubAlerts,
      addWorkflow,
      addApplicationHub,
      advanceStep,
      completeStep,
      uncompleteStep,
      advanceStatus,
      resolveAgenticItem,
    }),
    [
      workflowsExposed,
      createWorkflow,
      getWorkflow,
      updateWorkflow,
      deleteWorkflow,
      applicationHubs,
      appHubAlerts,
      addWorkflow,
      addApplicationHub,
      advanceStep,
      completeStep,
      uncompleteStep,
      advanceStatus,
      resolveAgenticItem,
    ],
  )

  return <WorkflowsContext.Provider value={value}>{children}</WorkflowsContext.Provider>
}

export function useWorkflows(): WorkflowsContextValue {
  const ctx = useContext(WorkflowsContext)
  if (!ctx) {
    throw new Error('useWorkflows precisa ser usado dentro de <WorkflowsProvider>.')
  }
  return ctx
}
