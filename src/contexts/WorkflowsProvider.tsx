import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  applicationHubs as applicationHubsSeed,
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

export type WorkflowInstance = {
  id: string
  templateId: string
  templateName: string
  status: WorkflowStatus
  startedAt: string
  steps: StepInstance[]
  currentStepIndex: number
}

type WorkflowsContextValue = {
  workflows: WorkflowInstance[]
  applicationHubs: ApplicationHub[]
  getWorkflow: (workflowId: string) => WorkflowInstance | undefined
  addWorkflow: (templateOrAsset: string | WorkflowAsset) => WorkflowInstance | null
  advanceStep: (workflowId: string) => void
  advanceStatus: (workflowId: string, status: WorkflowStatus) => void
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

function buildInstance(template: WorkflowAsset): WorkflowInstance {
  const steps: StepInstance[] = template.onboardingSteps.map((s, i) => ({
    id: s.id,
    title: s.title,
    status: i === 0 ? 'in-progress' : 'pending',
  }))
  const now = new Date().toISOString()
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
  }
}

export function WorkflowsProvider({ children }: { children: ReactNode }) {
  const [workflows, setWorkflows] = useState<WorkflowInstance[]>([])
  const [applicationHubs, setApplicationHubs] = useState<ApplicationHub[]>(
    applicationHubsSeed,
  )

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
    let justFinished: WorkflowInstance | null = null
    setWorkflows((prev) => {
      const next = prev.map((wf) => {
        if (wf.id !== workflowId) return wf
        if (wf.status === 'completed' || wf.status === 'failed') return wf

        const now = new Date().toISOString()
        const idx = wf.currentStepIndex
        if (idx < 0 || idx >= wf.steps.length) return wf

        const steps = wf.steps.map((s, i) => {
          if (i === idx) return { ...s, status: 'done' as const, completedAt: now }
          if (i === idx + 1) return { ...s, status: 'in-progress' as const, startedAt: now }
          return s
        })

        const reachedEnd = idx + 1 >= wf.steps.length
        const updated: WorkflowInstance = {
          ...wf,
          steps,
          currentStepIndex: reachedEnd ? wf.steps.length : idx + 1,
          status: reachedEnd ? 'completed' : wf.status === 'draft' ? 'running' : wf.status,
        }
        if (reachedEnd) justFinished = updated
        return updated
      })
      return next
    })

    if (justFinished) {
      const template = findTemplateById((justFinished as WorkflowInstance).templateId)
      if (template) {
        const hub = buildHubFromTemplate(template)
        setApplicationHubs((prev) =>
          prev.some((h) => h.id === hub.id) ? prev : [...prev, hub],
        )
      }
    }
  }, [])

  const advanceStatus = useCallback((workflowId: string, status: WorkflowStatus) => {
    setWorkflows((prev) =>
      prev.map((wf) => (wf.id === workflowId ? { ...wf, status } : wf)),
    )
  }, [])

  const value = useMemo<WorkflowsContextValue>(
    () => ({
      workflows,
      applicationHubs,
      getWorkflow,
      addWorkflow,
      advanceStep,
      advanceStatus,
    }),
    [workflows, applicationHubs, getWorkflow, addWorkflow, advanceStep, advanceStatus],
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
