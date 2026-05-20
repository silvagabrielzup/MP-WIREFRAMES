import { useMemo } from 'react'
import { onboardingChecklistContentApi } from '../services/database'
import type { OnboardingChecklistContent } from '../types/models'
import { useCrudEntity } from './_useCrudEntity'

export function useOnboardingChecklistContent(workflowSlug?: string) {
  const base = useCrudEntity<
    OnboardingChecklistContent,
    Omit<OnboardingChecklistContent, 'id'>,
    Partial<Omit<OnboardingChecklistContent, 'id'>>
  >(onboardingChecklistContentApi)

  const filtered = useMemo(() => {
    const items = workflowSlug
      ? base.data.filter((c) => c.workflowSlug === workflowSlug)
      : base.data
    return [...items].sort((a, b) => a.order - b.order)
  }, [base.data, workflowSlug])

  return { ...base, data: filtered }
}
