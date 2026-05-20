import { availableSasApi } from '../services/database'
import type { AvailableSa } from '../types/models'
import { useCrudEntity } from './_useCrudEntity'

export function useAvailableSas() {
  return useCrudEntity<AvailableSa, Omit<AvailableSa, 'id'>, Partial<Omit<AvailableSa, 'id'>>>(
    availableSasApi,
  )
}
