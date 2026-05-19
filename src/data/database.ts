/**
 * Catálogo de assets agênticos do Management Plane.
 *
 * Os dados ficam no banco local `./database.json`, modelado como 3 entidades
 * relacionais: `assetsCatalog`, `workflowTrackers` e `applicationHubs` (+ as
 * notificações do hub). Este módulo é a camada tipada de leitura: declara os
 * types das entidades novas e ainda expõe a API legacy (`workflows`,
 * `migrationWorkflow`, etc.) derivada por mapeamento new→old, pra que os
 * consumidores existentes continuem funcionando enquanto migram pro schema
 * novo.
 */

import databaseJson from './database.json'

// =============================================================================
// Entidades novas (alinhadas com `PROGRESS.md` — 2026-05-19)
// =============================================================================

export type AssetCategory = 'workflows' | 'Skills' | 'MCP' | 'Sensors' | 'Apis'

/** Passo de alto nível listado no Assets Catalog (apenas pra category=workflows). */
export type AssetCatalogStep = {
  id: string
  name: string
  description: string
}

/**
 * Item do Assets Catalog. Campos `owner`/`status`/`maturity`/`type`/
 * `dependencies`/`inputs`/`usage` são extensões opcionais sobre o spec — só
 * existem em itens da category `workflows` e preservam metadata que a UI atual
 * (`06-AssetsCatalog`) já consome.
 */
export type AssetCatalogItem = {
  id: string
  slug: string
  category: AssetCategory
  name: string
  description: string
  version: string
  create_at: string
  updated_at: string
  steps?: AssetCatalogStep[]
  // --- extensões pra category=workflows ---
  owner?: string
  type?: WorkflowType
  status?: AssetStatus
  maturity?: AssetMaturity
  /** FK refs (ids) pra outros itens do Assets Catalog. */
  dependencies?: {
    skills: string[]
    mcps: string[]
    apis: string[]
  }
  inputs?: WorkflowInput[]
  usage?: WorkflowUsage
}

export type WorkflowTrackerInnerStepType = 'Inference' | 'Computacional'

/**
 * Passo "stepper" do React Flow renderizado dentro de um outer step.
 * Convenção: `type === 'Inference'` implica `needHumamAproval === true`.
 * `isAprovadedByHumam === null` quando o usuário ainda não decidiu.
 *
 * Os nomes `needHumamAproval` e `isAprovadedByHumam` seguem o spec do
 * `PROGRESS.md` (typos intencionais) — não renomeie sem alinhar com o autor.
 */
export type WorkflowTrackerInnerStep = {
  type: WorkflowTrackerInnerStepType
  name: string
  slug: string
  needHumamAproval: boolean
  isAprovadedByHumam: boolean | null
  /** Extensão: metadata do PR proposto pelo agente (apenas Inference). */
  agentic?: AgenticPropositionMetadata
}

export type WorkflowTrackerStep = {
  id: string
  slug: string
  name: string
  description: string
  steps: WorkflowTrackerInnerStep[]
  // --- extensões legacy (alinhadas com OnboardingStep antigo) ---
  required?: boolean
  dependsOn?: string[]
  completedOnClick?: boolean
  ctaLabel?: string
  /** Comando CLI exibido pelo card "clipboard rápido" do onboarding. */
  clipboardCommand?: string
  /** Se preenchido, este passo dispara o `WorkflowTracker` referenciado. */
  triggers_workflow_tracker_id?: string
}

export type WorkflowTracker = {
  id: string
  slug: string
  name: string
  description: string
  version: string
  create_at: string
  updated_at: string
  assets_catalog_id: string
  sa: string
  steps: WorkflowTrackerStep[]
}

// =============================================================================
// Types legacy — preservados pra retro-compat dos consumidores existentes
// =============================================================================

export type AssetStatus = 'draft' | 'beta' | 'stable' | 'deprecated'
export type AssetMaturity = 'experimental' | 'production-ready'

export type WorkflowType =
  | 'onboarding'
  | 'build'
  | 'deploy'
  | 'rollout'
  | 'migration'
  | 'custom'

export type OnboardingStep = {
  id: string
  title: string
  description: string
  required: boolean
  dependsOn: string[]
  completedOnClick: boolean
  ctaLabel: string
  triggers?: WorkflowAsset
  agentic?: AgenticPropositionMetadata
}

export type AgenticPropositionMetadata = {
  kind: 'pr'
  prTitle: string
  prAuthor: string
  prSummary: string
  files: AgenticPropositionFile[]
}

export type AgenticPropositionFile = {
  path: string
  language: string
  hunks: AgenticPropositionHunk[]
}

export type AgenticPropositionHunk = {
  header: string
  lines: { kind: 'context' | 'add' | 'del'; text: string }[]
}

export type WorkflowInput = {
  name: string
  type: string
  required: boolean
  description: string
  default?: string
}

export type WorkflowDependencies = {
  skills: string[]
  mcps: string[]
  apis: string[]
}

export type WorkflowUsage = {
  consumers: number
  runs7d: number
}

export type WorkflowAsset = {
  kind: 'workflow'
  id: string
  name: string
  version: string
  owner: string
  description: string
  type: WorkflowType
  status: AssetStatus
  maturity: AssetMaturity
  onboardingSteps: OnboardingStep[]
  dependencies: WorkflowDependencies
  inputs: WorkflowInput[]
  usage: WorkflowUsage
}

// =============================================================================
// Application Hub
// =============================================================================

export type ApplicationHubHealth = 'healthy' | 'warn' | 'fail'

/**
 * Estado do provisionamento do hub. `pending` = provisioning rodando,
 * `completed` = hub pronto e visível, `failed` = abortou. A tela
 * `04-ApplicationHub` filtra por `status === 'completed'`.
 */
export type ApplicationHubStatus = 'pending' | 'completed' | 'failed'

export type ApplicationHub = {
  id: string
  sa: string
  name: string
  projectId: string
  squad: string
  onPlat: boolean
  status: ApplicationHubStatus
  health: ApplicationHubHealth
  liveIncident: boolean
  uptime: number
  p95Ms: number
  errorRate: number
  deploys7d: number
}

export type ApplicationHubNotificationIcon =
  | 'CheckCircle2'
  | 'AlertTriangle'
  | 'ShieldCheck'
  | 'Activity'
  | 'Rocket'

export type ApplicationHubNotification = {
  id: string
  icon: ApplicationHubNotificationIcon
  title: string
  description: string
  cta: string
  link: string
  applicationHubId: string
  projectId: string
}

// =============================================================================
// Exports — novos (entidades relacionais)
// =============================================================================

export const assetsCatalog: AssetCatalogItem[] =
  databaseJson.assetsCatalog as AssetCatalogItem[]

export const workflowTrackers: WorkflowTracker[] =
  databaseJson.workflowTrackers as WorkflowTracker[]

export const applicationHubs: ApplicationHub[] =
  databaseJson.applicationHubs as ApplicationHub[]

export const applicationHubNotifications: ApplicationHubNotification[] =
  databaseJson.applicationHubNotifications as ApplicationHubNotification[]

// =============================================================================
// Compat layer — re-deriva a API legacy a partir das entidades novas
// =============================================================================

const catalogById: Map<string, AssetCatalogItem> = new Map(
  assetsCatalog.map((c) => [c.id, c]),
)
const catalogBySlug: Map<string, AssetCatalogItem> = new Map(
  assetsCatalog.map((c) => [c.slug, c]),
)
const trackerById: Map<string, WorkflowTracker> = new Map(
  workflowTrackers.map((t) => [t.id, t]),
)

/** Resolve `cat-skill-foo` (id) ou `foo` (slug) → slug em string pra API legacy. */
function resolveDependencySlug(idOrSlug: string): string {
  return catalogById.get(idOrSlug)?.slug ?? idOrSlug
}

function buildOnboardingStep(step: WorkflowTrackerStep): OnboardingStep {
  const agenticInner = step.steps.find((s) => s.agentic)
  return {
    id: step.id,
    title: step.name,
    description: step.description,
    required: step.required ?? true,
    dependsOn: step.dependsOn ?? [],
    completedOnClick: step.completedOnClick ?? true,
    ctaLabel: step.ctaLabel ?? 'Avançar',
    triggers: step.triggers_workflow_tracker_id
      ? buildWorkflowAssetFromTrackerId(step.triggers_workflow_tracker_id)
      : undefined,
    agentic: agenticInner?.agentic,
  }
}

function buildWorkflowAssetFromTrackerId(trackerId: string): WorkflowAsset {
  const tracker = trackerById.get(trackerId)
  if (!tracker) throw new Error(`WorkflowTracker ${trackerId} não encontrado.`)
  return buildWorkflowAsset(tracker)
}

function buildWorkflowAsset(tracker: WorkflowTracker): WorkflowAsset {
  const catalog = catalogById.get(tracker.assets_catalog_id)
  if (!catalog) {
    throw new Error(
      `AssetCatalog ${tracker.assets_catalog_id} não encontrado pro tracker ${tracker.id}.`,
    )
  }
  const deps = catalog.dependencies ?? { skills: [], mcps: [], apis: [] }
  return {
    kind: 'workflow',
    id: tracker.slug,
    name: tracker.name,
    version: tracker.version,
    owner: catalog.owner ?? 'unknown',
    description: tracker.description,
    type: catalog.type ?? 'custom',
    status: catalog.status ?? 'beta',
    maturity: catalog.maturity ?? 'experimental',
    onboardingSteps: tracker.steps.map(buildOnboardingStep),
    dependencies: {
      skills: deps.skills.map(resolveDependencySlug),
      mcps: deps.mcps.map(resolveDependencySlug),
      apis: deps.apis.map(resolveDependencySlug),
    },
    inputs: catalog.inputs ?? [],
    usage: catalog.usage ?? { consumers: 0, runs7d: 0 },
  }
}

/** Trackers "top-level" = não são alvo de `triggers_workflow_tracker_id` de outro. */
const triggeredTrackerIds = new Set(
  workflowTrackers.flatMap((t) =>
    t.steps
      .map((s) => s.triggers_workflow_tracker_id)
      .filter((id): id is string => Boolean(id)),
  ),
)

export const workflows: WorkflowAsset[] = workflowTrackers
  .filter((t) => !triggeredTrackerIds.has(t.id))
  .map(buildWorkflowAsset)

function requireWorkflowBySlug(slug: string): WorkflowAsset {
  const found = workflowTrackers.find((t) => t.slug === slug)
  if (!found) throw new Error(`WorkflowTracker com slug ${slug} ausente.`)
  return buildWorkflowAsset(found)
}

export const migrationWorkflow: WorkflowAsset =
  requireWorkflowBySlug('wf-migration-vanilla')
export const migrationExecutionWorkflow: WorkflowAsset =
  requireWorkflowBySlug('wf-onboarding-vanilla-exec')

/**
 * IDs (slugs legacy) dos workflows que são execuções "ligadas" — disparados
 * via `step.triggers` por outro template. Usado pra separar instâncias
 * primárias (Home / onboarding) de instâncias de execução (Workflow Tracker).
 */
export const executionTemplateIds: Set<string> = new Set(
  workflowTrackers
    .filter((t) => triggeredTrackerIds.has(t.id))
    .map((t) => t.slug),
)

// Re-export pra evitar warning de `catalogBySlug` não usado em strict mode.
// Pode ser útil pra consumidores futuros olharem catalog por slug.
export { catalogBySlug }
