import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  applicationHubs as applicationHubsSeed,
  executionTemplateIds,
  workflows as workflowTemplates,
  type ApplicationHub,
  type WorkflowAsset,
} from '../data/database'

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
  /** ID do step agêntico dentro do template. */
  stepId: string
  /** Título humano do step. */
  stepTitle: string
  /** Título da PR/ação proposta pelo agente. */
  prTitle: string
  /** Identificação do agente proponente. */
  prAuthor: string
  /** Resumo curto da proposição (1-2 frases). */
  prSummary: string
  /** Número de arquivos modificados. */
  filesChanged: number
  /** Total de linhas adicionadas no diff. */
  linesAdded: number
  /** Total de linhas removidas no diff. */
  linesRemoved: number
  /** ISO timestamp de quando o item foi enfileirado. */
  createdAt: string
}

export type WorkflowInstance = {
  id: string
  templateId: string
  templateName: string
  status: WorkflowStatus
  startedAt: string
  steps: StepInstance[]
  currentStepIndex: number
  /**
   * Itens agênticos que ainda precisam de aprovação humana. Populado na
   * criação da instância a partir dos steps do template que carregam
   * `agentic` metadata; pode ser usado pela Home pra surfar ações pendentes.
   */
  pendingAgenticFlow: PendingAgenticFlowItem[]
}

export type AppHubAlertKind = 'approval' | 'failure' | 'policy'

export type AppHubAlert = {
  id: string
  kind: AppHubAlertKind
  title: string
  detail: string
  ago: string
}

type WorkflowsContextValue = {
  workflows: WorkflowInstance[]
  applicationHubs: ApplicationHub[]
  appHubAlerts: AppHubAlert[]
  getWorkflow: (workflowId: string) => WorkflowInstance | undefined
  addWorkflow: (templateOrAsset: string | WorkflowAsset) => WorkflowInstance | null
  advanceStep: (workflowId: string) => void
  advanceStatus: (workflowId: string, status: WorkflowStatus) => void
  /**
   * Remove o item agêntico (matched por stepId) do `pendingAgenticFlow`
   * da instância indicada — chamado depois da decisão humana (Aprovar/Declinar).
   */
  resolveAgenticItem: (workflowId: string, stepId: string) => void
}

const WorkflowsContext = createContext<WorkflowsContextValue | null>(null)

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

/** "ssa-pix-core" → "Pix Core"; "ssa-conta-corrente" → "Conta Corrente". */
function toFriendlyAppName(sa: string): string {
  return sa
    .replace(/^ssa-/, '')
    .split('-')
    .map((part) => (part.length === 0 ? part : part[0].toUpperCase() + part.slice(1)))
    .join(' ')
}

/**
 * Gera um Application Hub plausível a partir do template do workflow que
 * acabou de finalizar. Pega o `sa_id` dos inputs do template e deriva
 * projectId/squad via lookup. Métricas refletem um app recém-promovido para
 * HML: SLO saudável, baixíssima taxa de erro, deploy zero-vinte-quatro horas.
 */
function buildHubFromTemplate(template: WorkflowAsset): ApplicationHub {
  const saInput = template.inputs.find((i) => i.name === 'sa_id')
  const sa = saInput?.default ?? 'ssa-pix-core'
  const baseName = sa.replace(/^ssa-/, '')
  return {
    id: `ahub-${sa}`,
    sa,
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

/**
 * Gera um alerta da Application Hub representando falha parcial na infra
 * provisionada pelo workflow recém-concluído. Pensado pra surfar como
 * "algo não subiu corretamente" mesmo o workflow tendo terminado.
 */
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

function buildInstance(template: WorkflowAsset): WorkflowInstance {
  const steps: StepInstance[] = template.onboardingSteps.map((s, i) => ({
    id: s.id,
    title: s.title,
    status: i === 0 ? 'in-progress' : 'pending',
  }))
  const now = new Date().toISOString()
  const pendingAgenticFlow: PendingAgenticFlowItem[] = template.onboardingSteps
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
        createdAt: now,
      }
    })
  return {
    id: `wfi-${Math.random().toString(36).slice(2, 8)}`,
    templateId: template.id,
    templateName: template.name,
    status: steps.length > 0 ? 'running' : 'draft',
    startedAt: now,
    steps: steps.map((s, i) =>
      i === 0 ? { ...s, startedAt: now } : s,
    ),
    currentStepIndex: 0,
    pendingAgenticFlow,
  }
}

export function WorkflowsProvider({ children }: { children: ReactNode }) {
  const [workflows, setWorkflows] = useState<WorkflowInstance[]>([])
  const [applicationHubs, setApplicationHubs] = useState<ApplicationHub[]>(
    applicationHubsSeed,
  )
  const [appHubAlerts, setAppHubAlerts] = useState<AppHubAlert[]>([])

  const getWorkflow = useCallback(
    (workflowId: string) => workflows.find((w) => w.id === workflowId),
    [workflows],
  )

  const addWorkflow = useCallback(
    (templateOrAsset: string | WorkflowAsset): WorkflowInstance | null => {
      const template =
        typeof templateOrAsset === 'string'
          ? workflowTemplates.find((w) => w.id === templateOrAsset)
          : templateOrAsset
      if (!template) return null
      const instance = buildInstance(template)
      setWorkflows((prev) => [...prev, instance])
      return instance
    },
    [],
  )

  const advanceStep = useCallback((workflowId: string) => {
    let trajectoryEnded: WorkflowInstance | null = null
    let finalStepTrigger: WorkflowAsset | null = null
    setWorkflows((prev) => {
      const next = prev.map((wf) => {
        if (wf.id !== workflowId) return wf
        if (wf.status === 'completed' || wf.status === 'failed') return wf

        const now = new Date().toISOString()
        const idx = wf.currentStepIndex
        if (idx < 0 || idx >= wf.steps.length) return wf

        // Olha pra próxima posição: se for um step marcado finalStep, a
        // trajetória do usuário é considerada concluída na entrada — o
        // finalStep é eager-completed junto com o avanço.
        const nextStepId = wf.steps[idx + 1]?.id
        const tmpl = findTemplateById(wf.templateId)
        const nextTmplStep = nextStepId
          ? tmpl?.onboardingSteps.find((s) => s.id === nextStepId)
          : undefined
        const enteringFinal = !!nextTmplStep?.finalStep

        const steps = wf.steps.map((s, i) => {
          if (i === idx) return { ...s, status: 'done' as const, completedAt: now }
          if (i === idx + 1) {
            if (enteringFinal) {
              return {
                ...s,
                status: 'done' as const,
                startedAt: now,
                completedAt: now,
              }
            }
            return { ...s, status: 'in-progress' as const, startedAt: now }
          }
          return s
        })

        const naturallyEnded = idx + 1 >= wf.steps.length
        const reachedEnd = naturallyEnded || enteringFinal
        const updated: WorkflowInstance = {
          ...wf,
          steps,
          currentStepIndex: reachedEnd ? wf.steps.length : idx + 1,
          status: reachedEnd ? 'completed' : wf.status === 'draft' ? 'running' : wf.status,
        }
        if (reachedEnd) trajectoryEnded = updated
        if (enteringFinal && nextTmplStep?.triggers) {
          finalStepTrigger = nextTmplStep.triggers
        }
        return updated
      })
      return next
    })

    if (trajectoryEnded) {
      const template = findTemplateById((trajectoryEnded as WorkflowInstance).templateId)
      if (template && !executionTemplateIds.has(template.id)) {
        // Só primárias (onboarding) criam Application Hub + alerta —
        // execuções ligadas terminam em silêncio.
        const hub = buildHubFromTemplate(template)
        setApplicationHubs((prev) =>
          prev.some((h) => h.id === hub.id) ? prev : [...prev, hub],
        )
        const alert = buildAlertFromTemplate(template)
        setAppHubAlerts((prev) =>
          prev.some((a) => a.id === alert.id) ? prev : [...prev, alert],
        )
      }
    }

    // Auto-completar um finalStep ainda precisa disparar os `triggers` que
    // o step carrega (no caso, `hmlPromotionWorkflow`) — o usuário não vai
    // clicar manualmente nele, então o provider que cuide.
    if (finalStepTrigger) {
      const captured = finalStepTrigger as WorkflowAsset
      setWorkflows((prev) =>
        prev.some((w) => w.templateId === captured.id)
          ? prev
          : [...prev, buildInstance(captured)],
      )
    }
  }, [])

  const advanceStatus = useCallback((workflowId: string, status: WorkflowStatus) => {
    setWorkflows((prev) =>
      prev.map((wf) => (wf.id === workflowId ? { ...wf, status } : wf)),
    )
  }, [])

  const resolveAgenticItem = useCallback((workflowId: string, stepId: string) => {
    setWorkflows((prev) =>
      prev.map((wf) =>
        wf.id === workflowId
          ? {
              ...wf,
              pendingAgenticFlow: wf.pendingAgenticFlow.filter(
                (item) => item.stepId !== stepId,
              ),
            }
          : wf,
      ),
    )
  }, [])

  const value = useMemo<WorkflowsContextValue>(
    () => ({
      workflows,
      applicationHubs,
      appHubAlerts,
      getWorkflow,
      addWorkflow,
      advanceStep,
      advanceStatus,
      resolveAgenticItem,
    }),
    [
      workflows,
      applicationHubs,
      appHubAlerts,
      getWorkflow,
      addWorkflow,
      advanceStep,
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
