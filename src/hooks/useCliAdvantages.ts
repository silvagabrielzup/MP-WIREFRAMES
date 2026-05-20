import { cliAdvantagesApi } from '../services/database'
import type { CliAdvantage } from '../types/models'
import { useCrudEntity } from './_useCrudEntity'

export function useCliAdvantages() {
  return useCrudEntity<CliAdvantage, Omit<CliAdvantage, 'id'>, Partial<Omit<CliAdvantage, 'id'>>>(
    cliAdvantagesApi,
  )
}
