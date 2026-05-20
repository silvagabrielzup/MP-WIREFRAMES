import { useMemo } from 'react'
import { saRepositoriesApi } from '../services/database'
import type { SaRepository } from '../types/models'
import { useCrudEntity } from './_useCrudEntity'

export function useSaRepositories(saId?: string) {
  const base = useCrudEntity<SaRepository, Omit<SaRepository, 'id'>, Partial<Omit<SaRepository, 'id'>>>(
    saRepositoriesApi,
  )

  const filtered = useMemo(
    () => (saId ? base.data.filter((r) => r.saId === saId) : base.data),
    [base.data, saId],
  )

  return { ...base, data: filtered }
}
