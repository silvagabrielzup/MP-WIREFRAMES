// Camada de acesso ao `database.json` para as entidades de conteúdo estático
// da Home (e qualquer outra view que reutilize). Cada Api segue o padrão do
// `mock-database` skill: getAll / getById / create / update / remove com
// `delay()` simulado e estado mutável em memória.
//
// O `src/data/database.ts` legado segue exportando seus próprios mocks para
// workflows/asset catalog/hubs — este arquivo é independente.

import db from '../data/database.json'
import type {
  AvailableSa,
  CliAdvantage,
  MigrationTreeDiff,
  MigrationVerb,
  MigrationViabilityCheck,
  MonorepoComparison,
  OnboardingChecklistContent,
  SaRepository,
} from '../types/models'
import { delay, generateId } from './_helpers'

// =============================================================================
// Estado mutável em memória — clonado do JSON na inicialização do módulo
// =============================================================================

let availableSas: AvailableSa[] = [...(db.availableSas as AvailableSa[])]
let saRepositories: SaRepository[] = [...(db.saRepositories as SaRepository[])]
let cliAdvantages: CliAdvantage[] = [...(db.cliAdvantages as CliAdvantage[])]
let migrationViabilityChecks: MigrationViabilityCheck[] = [...(db.migrationViabilityChecks as MigrationViabilityCheck[])]
let migrationVerbs: MigrationVerb[] = [...(db.migrationVerbs as MigrationVerb[])]
let monorepoComparisons: MonorepoComparison[] = [...(db.monorepoComparisons as MonorepoComparison[])]
let migrationTreeDiffs: MigrationTreeDiff[] = [...(db.migrationTreeDiffs as MigrationTreeDiff[])]
let onboardingChecklistContent: OnboardingChecklistContent[] = [
  ...(db.onboardingChecklistContent as OnboardingChecklistContent[]),
]

// =============================================================================
// availableSas
// =============================================================================

export const availableSasApi = {
  async getAll(): Promise<AvailableSa[]> {
    await delay()
    return [...availableSas]
  },
  async getById(id: string): Promise<AvailableSa | null> {
    await delay()
    return availableSas.find((s) => s.id === id) ?? null
  },
  async create(data: Omit<AvailableSa, 'id'>): Promise<AvailableSa> {
    await delay()
    const next: AvailableSa = { ...data, id: generateId('ssa-') }
    availableSas = [...availableSas, next]
    return next
  },
  async update(id: string, patch: Partial<Omit<AvailableSa, 'id'>>): Promise<AvailableSa> {
    await delay()
    const idx = availableSas.findIndex((s) => s.id === id)
    if (idx === -1) throw new Error(`SA ${id} não encontrada`)
    const current = availableSas[idx]
    if (!current) throw new Error(`SA ${id} não encontrada`)
    const updated: AvailableSa = { ...current, ...patch }
    availableSas[idx] = updated
    return updated
  },
  async remove(id: string): Promise<void> {
    await delay()
    availableSas = availableSas.filter((s) => s.id !== id)
  },
}

// =============================================================================
// saRepositories
// =============================================================================

export const saRepositoriesApi = {
  async getAll(): Promise<SaRepository[]> {
    await delay()
    return [...saRepositories]
  },
  async getById(id: string): Promise<SaRepository | null> {
    await delay()
    return saRepositories.find((r) => r.id === id) ?? null
  },
  async getBySa(saId: string): Promise<SaRepository[]> {
    await delay()
    return saRepositories.filter((r) => r.saId === saId)
  },
  async create(data: Omit<SaRepository, 'id'>): Promise<SaRepository> {
    await delay()
    const next: SaRepository = { ...data, id: generateId('repo-') }
    saRepositories = [...saRepositories, next]
    return next
  },
  async update(id: string, patch: Partial<Omit<SaRepository, 'id'>>): Promise<SaRepository> {
    await delay()
    const idx = saRepositories.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error(`Repo ${id} não encontrado`)
    const current = saRepositories[idx]
    if (!current) throw new Error(`Repo ${id} não encontrado`)
    const updated: SaRepository = { ...current, ...patch }
    saRepositories[idx] = updated
    return updated
  },
  async remove(id: string): Promise<void> {
    await delay()
    saRepositories = saRepositories.filter((r) => r.id !== id)
  },
}

// =============================================================================
// cliAdvantages
// =============================================================================

export const cliAdvantagesApi = {
  async getAll(): Promise<CliAdvantage[]> {
    await delay()
    return [...cliAdvantages].sort((a, b) => a.order - b.order)
  },
  async getById(id: string): Promise<CliAdvantage | null> {
    await delay()
    return cliAdvantages.find((a) => a.id === id) ?? null
  },
  async create(data: Omit<CliAdvantage, 'id'>): Promise<CliAdvantage> {
    await delay()
    const next: CliAdvantage = { ...data, id: generateId('adv-') }
    cliAdvantages = [...cliAdvantages, next]
    return next
  },
  async update(id: string, patch: Partial<Omit<CliAdvantage, 'id'>>): Promise<CliAdvantage> {
    await delay()
    const idx = cliAdvantages.findIndex((a) => a.id === id)
    if (idx === -1) throw new Error(`CLI advantage ${id} não encontrada`)
    const current = cliAdvantages[idx]
    if (!current) throw new Error(`CLI advantage ${id} não encontrada`)
    const updated: CliAdvantage = { ...current, ...patch }
    cliAdvantages[idx] = updated
    return updated
  },
  async remove(id: string): Promise<void> {
    await delay()
    cliAdvantages = cliAdvantages.filter((a) => a.id !== id)
  },
}

// =============================================================================
// migrationViabilityChecks
// =============================================================================

export const migrationViabilityChecksApi = {
  async getAll(): Promise<MigrationViabilityCheck[]> {
    await delay()
    return [...migrationViabilityChecks]
  },
  async getById(id: string): Promise<MigrationViabilityCheck | null> {
    await delay()
    return migrationViabilityChecks.find((c) => c.id === id) ?? null
  },
  async create(data: Omit<MigrationViabilityCheck, 'id'>): Promise<MigrationViabilityCheck> {
    await delay()
    const next: MigrationViabilityCheck = { ...data, id: generateId('vc-') }
    migrationViabilityChecks = [...migrationViabilityChecks, next]
    return next
  },
  async update(id: string, patch: Partial<Omit<MigrationViabilityCheck, 'id'>>): Promise<MigrationViabilityCheck> {
    await delay()
    const idx = migrationViabilityChecks.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error(`Check ${id} não encontrado`)
    const current = migrationViabilityChecks[idx]
    if (!current) throw new Error(`Check ${id} não encontrado`)
    const updated: MigrationViabilityCheck = { ...current, ...patch }
    migrationViabilityChecks[idx] = updated
    return updated
  },
  async remove(id: string): Promise<void> {
    await delay()
    migrationViabilityChecks = migrationViabilityChecks.filter((c) => c.id !== id)
  },
}

// =============================================================================
// migrationVerbs
// =============================================================================

export const migrationVerbsApi = {
  async getAll(): Promise<MigrationVerb[]> {
    await delay()
    return [...migrationVerbs].sort((a, b) => a.order - b.order)
  },
  async getById(id: string): Promise<MigrationVerb | null> {
    await delay()
    return migrationVerbs.find((v) => v.id === id) ?? null
  },
  async create(data: Omit<MigrationVerb, 'id'>): Promise<MigrationVerb> {
    await delay()
    const next: MigrationVerb = { ...data, id: generateId('verb-') }
    migrationVerbs = [...migrationVerbs, next]
    return next
  },
  async update(id: string, patch: Partial<Omit<MigrationVerb, 'id'>>): Promise<MigrationVerb> {
    await delay()
    const idx = migrationVerbs.findIndex((v) => v.id === id)
    if (idx === -1) throw new Error(`Verb ${id} não encontrado`)
    const current = migrationVerbs[idx]
    if (!current) throw new Error(`Verb ${id} não encontrado`)
    const updated: MigrationVerb = { ...current, ...patch }
    migrationVerbs[idx] = updated
    return updated
  },
  async remove(id: string): Promise<void> {
    await delay()
    migrationVerbs = migrationVerbs.filter((v) => v.id !== id)
  },
}

// =============================================================================
// monorepoComparisons
// =============================================================================

export const monorepoComparisonsApi = {
  async getAll(): Promise<MonorepoComparison[]> {
    await delay()
    return [...monorepoComparisons].sort((a, b) => a.order - b.order)
  },
  async getById(id: string): Promise<MonorepoComparison | null> {
    await delay()
    return monorepoComparisons.find((c) => c.id === id) ?? null
  },
  async create(data: Omit<MonorepoComparison, 'id'>): Promise<MonorepoComparison> {
    await delay()
    const next: MonorepoComparison = { ...data, id: generateId('cmp-') }
    monorepoComparisons = [...monorepoComparisons, next]
    return next
  },
  async update(id: string, patch: Partial<Omit<MonorepoComparison, 'id'>>): Promise<MonorepoComparison> {
    await delay()
    const idx = monorepoComparisons.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error(`Comparação ${id} não encontrada`)
    const current = monorepoComparisons[idx]
    if (!current) throw new Error(`Comparação ${id} não encontrada`)
    const updated: MonorepoComparison = { ...current, ...patch }
    monorepoComparisons[idx] = updated
    return updated
  },
  async remove(id: string): Promise<void> {
    await delay()
    monorepoComparisons = monorepoComparisons.filter((c) => c.id !== id)
  },
}

// =============================================================================
// migrationTreeDiffs
// =============================================================================

export const migrationTreeDiffsApi = {
  async getAll(): Promise<MigrationTreeDiff[]> {
    await delay()
    return [...migrationTreeDiffs]
  },
  async getById(id: string): Promise<MigrationTreeDiff | null> {
    await delay()
    return migrationTreeDiffs.find((d) => d.id === id) ?? null
  },
  async getBySa(saId: string): Promise<MigrationTreeDiff | null> {
    await delay()
    return migrationTreeDiffs.find((d) => d.saId === saId) ?? null
  },
  async create(data: Omit<MigrationTreeDiff, 'id'>): Promise<MigrationTreeDiff> {
    await delay()
    const next: MigrationTreeDiff = { ...data, id: generateId('tdf-') }
    migrationTreeDiffs = [...migrationTreeDiffs, next]
    return next
  },
  async update(id: string, patch: Partial<Omit<MigrationTreeDiff, 'id'>>): Promise<MigrationTreeDiff> {
    await delay()
    const idx = migrationTreeDiffs.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error(`Tree diff ${id} não encontrado`)
    const current = migrationTreeDiffs[idx]
    if (!current) throw new Error(`Tree diff ${id} não encontrado`)
    const updated: MigrationTreeDiff = { ...current, ...patch }
    migrationTreeDiffs[idx] = updated
    return updated
  },
  async remove(id: string): Promise<void> {
    await delay()
    migrationTreeDiffs = migrationTreeDiffs.filter((d) => d.id !== id)
  },
}

// =============================================================================
// onboardingChecklistContent
// =============================================================================

export const onboardingChecklistContentApi = {
  async getAll(): Promise<OnboardingChecklistContent[]> {
    await delay()
    return [...onboardingChecklistContent].sort((a, b) => a.order - b.order)
  },
  async getById(id: string): Promise<OnboardingChecklistContent | null> {
    await delay()
    return onboardingChecklistContent.find((c) => c.id === id) ?? null
  },
  async getByWorkflow(workflowSlug: string): Promise<OnboardingChecklistContent[]> {
    await delay()
    return onboardingChecklistContent
      .filter((c) => c.workflowSlug === workflowSlug)
      .sort((a, b) => a.order - b.order)
  },
  async create(data: Omit<OnboardingChecklistContent, 'id'>): Promise<OnboardingChecklistContent> {
    await delay()
    const next: OnboardingChecklistContent = { ...data, id: generateId('occ-') }
    onboardingChecklistContent = [...onboardingChecklistContent, next]
    return next
  },
  async update(
    id: string,
    patch: Partial<Omit<OnboardingChecklistContent, 'id'>>,
  ): Promise<OnboardingChecklistContent> {
    await delay()
    const idx = onboardingChecklistContent.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error(`Checklist content ${id} não encontrado`)
    const current = onboardingChecklistContent[idx]
    if (!current) throw new Error(`Checklist content ${id} não encontrado`)
    const updated: OnboardingChecklistContent = { ...current, ...patch }
    onboardingChecklistContent[idx] = updated
    return updated
  },
  async remove(id: string): Promise<void> {
    await delay()
    onboardingChecklistContent = onboardingChecklistContent.filter((c) => c.id !== id)
  },
}
