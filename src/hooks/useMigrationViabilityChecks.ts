import { migrationViabilityChecksApi } from '../services/database'
import type { MigrationViabilityCheck } from '../types/models'
import { useCrudEntity } from './_useCrudEntity'

export function useMigrationViabilityChecks() {
  return useCrudEntity<
    MigrationViabilityCheck,
    Omit<MigrationViabilityCheck, 'id'>,
    Partial<Omit<MigrationViabilityCheck, 'id'>>
  >(migrationViabilityChecksApi)
}
