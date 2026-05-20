import { useMemo } from 'react'
import { migrationTreeDiffsApi } from '../services/database'
import type { MigrationTreeDiff } from '../types/models'
import { useCrudEntity } from './_useCrudEntity'

// Hook focado em uma única SA (caso de uso da Home). Internamente reusa o
// padrão CRUD genérico e expõe `data` como `MigrationTreeDiff | null`
// (não array) já filtrado pelo `saId`.
export function useMigrationTreeDiff(saId: string) {
  const base = useCrudEntity<
    MigrationTreeDiff,
    Omit<MigrationTreeDiff, 'id'>,
    Partial<Omit<MigrationTreeDiff, 'id'>>
  >(migrationTreeDiffsApi)

  const diff = useMemo<MigrationTreeDiff | null>(
    () => base.data.find((d) => d.saId === saId) ?? null,
    [base.data, saId],
  )

  return {
    data: diff,
    isLoading: base.isLoading,
    error: base.error,
    refetch: base.refetch,
  }
}
