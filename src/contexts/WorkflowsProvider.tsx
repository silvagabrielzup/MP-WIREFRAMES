import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { workflows as workflowTemplates, type WorkflowAsset } from '../data/database'

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
  getWorkflow: (workflowId: string) => WorkflowInstance | undefined
  addWorkflow: (templateId: string) => WorkflowInstance | null
  advanceStep: (workflowId: string) => void
  advanceStatus: (workflowId: string, status: WorkflowStatus) => void
}

const WorkflowsContext = createContext<WorkflowsContextValue | null>(null)

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

  const getWorkflow = useCallback(
    (workflowId: string) => workflows.find((w) => w.id === workflowId),
    [workflows],
  )

  const addWorkflow = useCallback((templateId: string): WorkflowInstance | null => {
    const template = workflowTemplates.find((w) => w.id === templateId)
    if (!template) return null
    const instance = buildInstance(template)
    setWorkflows((prev) => [...prev, instance])
    return instance
  }, [])

  const advanceStep = useCallback((workflowId: string) => {
    setWorkflows((prev) =>
      prev.map((wf) => {
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
        return {
          ...wf,
          steps,
          currentStepIndex: reachedEnd ? wf.steps.length : idx + 1,
          status: reachedEnd ? 'completed' : wf.status === 'draft' ? 'running' : wf.status,
        }
      }),
    )
  }, [])

  const advanceStatus = useCallback((workflowId: string, status: WorkflowStatus) => {
    setWorkflows((prev) =>
      prev.map((wf) => (wf.id === workflowId ? { ...wf, status } : wf)),
    )
  }, [])

  const value = useMemo<WorkflowsContextValue>(
    () => ({ workflows, getWorkflow, addWorkflow, advanceStep, advanceStatus }),
    [workflows, getWorkflow, addWorkflow, advanceStep, advanceStatus],
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
