// Tipos que espelham o schema do `src/data/database.json`. Mantidos em sincronia
// manualmente — alterar um sem o outro quebra a tipagem da camada de serviço.

export type AvailableSa = {
  id: string
  name: string
  squad: string
}

export type RepoKind = 'code' | 'ci-cd' | 'infra' | 'db' | 'config'
export type RepoPlatStatus = 'OFF-PLAT' | 'ON-PLAT'

export type SaRepository = {
  id: string
  saId: string
  name: string
  kind: RepoKind
  stack: string
  size: string
  platStatus: RepoPlatStatus
  techDebtCount: number
}

export type CliAdvantage = {
  id: string
  order: number
  iconName: string
  title: string
  detail: string
}

export type ViabilityCheckStatus = 'pass' | 'warn' | 'fail'

export type MigrationViabilityCheck = {
  id: string
  engine: string
  status: ViabilityCheckStatus
  detail: string
}

export type VerbStatus = 'idle' | 'progress' | 'done'

export type MigrationVerb = {
  id: string
  order: number
  label: string
  iconName: string
  status: VerbStatus
}

export type MonorepoComparison = {
  id: string
  order: number
  label: string
  before: string
  after: string
}

export type TreeAction = 'moved' | 'added' | 'removed'

export type TreeNode = {
  name: string
  type: 'dir' | 'file'
  action?: TreeAction
  defaultOpen?: boolean
  children?: TreeNode[]
}

export type MigrationTreeDiff = {
  id: string
  saId: string
  before: TreeNode[]
  after: TreeNode
}

export type OnboardingChecklistContent = {
  id: string
  workflowSlug: string
  stepId: string
  order: number
  iconName: string
  clipboardCommand: string
  // Campos opcionais — variam por step:
  claudeCodeInstallCommand?: string
  recommendedVersion?: string
  realm?: string
  tokenValidity?: string
  sessionStatus?: string
  defaultSaId?: string
}
