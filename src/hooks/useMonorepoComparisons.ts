import { monorepoComparisonsApi } from '../services/database'
import type { MonorepoComparison } from '../types/models'
import { useCrudEntity } from './_useCrudEntity'

export function useMonorepoComparisons() {
  return useCrudEntity<
    MonorepoComparison,
    Omit<MonorepoComparison, 'id'>,
    Partial<Omit<MonorepoComparison, 'id'>>
  >(monorepoComparisonsApi)
}
