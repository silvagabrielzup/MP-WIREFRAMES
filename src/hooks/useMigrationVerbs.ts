import { migrationVerbsApi } from '../services/database'
import type { MigrationVerb } from '../types/models'
import { useCrudEntity } from './_useCrudEntity'

export function useMigrationVerbs() {
  return useCrudEntity<MigrationVerb, Omit<MigrationVerb, 'id'>, Partial<Omit<MigrationVerb, 'id'>>>(
    migrationVerbsApi,
  )
}
