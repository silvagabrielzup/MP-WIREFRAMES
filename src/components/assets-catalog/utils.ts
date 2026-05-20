import { Cable, Plug, Radar, Sparkles, Workflow as WorkflowIcon } from 'lucide-react'
import type { ComponentType } from 'react'
import { workflows, type AssetStatus, type WorkflowAsset } from '../../data/database'

// =============================================================================
// Tipos locais — Skills/MCPs/Sensors/APIs ainda vivem aqui como mocks enquanto
// o schema deles está se solidificando. Workflows usam `WorkflowAsset` do
// `data/database` (single source of truth).
// =============================================================================

export type SkillAsset = {
  kind: 'skill'
  id: string
  name: string
  version: string
  owner: string
  description: string
  status: AssetStatus
  category: 'codegen' | 'review' | 'security' | 'observability' | 'infra' | 'data' | 'docs'
  inputs: string[]
  outputs: string[]
  referencedTools: string[]
  usage: { consumers: number; runs7d: number }
}

export type McpAsset = {
  kind: 'mcp'
  id: string
  name: string
  version: string
  owner: string
  description: string
  status: AssetStatus
  server: string
  tools: string[]
  permissionScope: 'sa' | 'repo' | 'org'
  opType: 'read-only' | 'mutating' | 'mixed'
  usage: { consumers: number; runs7d: number }
}

export type SensorAsset = {
  kind: 'sensor'
  id: string
  name: string
  version: string
  owner: string
  description: string
  status: AssetStatus
  category: 'security' | 'quality' | 'performance' | 'compliance'
  severityDefault: 'critical' | 'high' | 'medium' | 'low' | 'info'
  engine: string
  usage: { consumers: number; runs7d: number }
}

export type ApiAsset = {
  kind: 'api'
  id: string
  name: string
  version: string
  owner: string
  description: string
  status: AssetStatus
  baseUrl: string
  authType: 'oauth2' | 'mtls' | 'bearer'
  endpoints: { method: string; path: string }[]
  usage: { consumers: number; runs7d: number }
}

export type AnyAsset = WorkflowAsset | SkillAsset | McpAsset | SensorAsset | ApiAsset

export type TabKey = 'workflows' | 'skills' | 'mcps' | 'sensors' | 'apis'

type IconCmp = ComponentType<{ className?: string }>

// =============================================================================
// Mocks lightweight (até existirem entidades dedicadas no `database.json`)
// =============================================================================

export const skills: SkillAsset[] = [
  {
    kind: 'skill',
    id: 'sk-scaffold-vanilla-app',
    name: 'scaffold-vanilla-app',
    version: '1.2.0',
    owner: 'squad-vanilla-platform',
    description: 'Gera esqueleto de mono-repo no padrão Vanilla, com pipeline e configs base.',
    status: 'stable',
    category: 'codegen',
    inputs: ['sa_id', 'language', 'runtime'],
    outputs: ['repo_url', 'pipeline_id'],
    referencedTools: ['github.create_repo', 'kaptain.bootstrap', 'konstructor.lint'],
    usage: { consumers: 7, runs7d: 22 },
  },
  {
    kind: 'skill',
    id: 'sk-review-pr-comments',
    name: 'review-pr-comments',
    version: '0.9.1',
    owner: 'squad-devex',
    description: 'Faz code review automatizado e posta comentários no PR.',
    status: 'beta',
    category: 'review',
    inputs: ['pr_url'],
    outputs: ['review_summary', 'comment_count'],
    referencedTools: ['github.create_comment', 'github.read_diff'],
    usage: { consumers: 12, runs7d: 87 },
  },
  {
    kind: 'skill',
    id: 'sk-plan-data-migration',
    name: 'plan-data-migration',
    version: '0.3.0',
    owner: 'squad-data-platform',
    description: 'Planeja janelas, estratégia (dual-write/cutover) e batches para backfill.',
    status: 'draft',
    category: 'data',
    inputs: ['source_db', 'target_db', 'row_estimate'],
    outputs: ['migration_plan'],
    referencedTools: ['migration.dryrun', 'migration.estimate'],
    usage: { consumers: 2, runs7d: 4 },
  },
]

export const mcps: McpAsset[] = [
  {
    kind: 'mcp',
    id: 'mcp-kaptain',
    name: 'kaptain.deploy',
    version: '2.1.0',
    owner: 'squad-platform-deploy',
    description: 'Dispara deploys no Kaptain e retorna o tracking id.',
    status: 'stable',
    server: 'mcp-kaptain.itau.internal',
    tools: ['deploy', 'rollback', 'describe_release'],
    permissionScope: 'sa',
    opType: 'mutating',
    usage: { consumers: 8, runs7d: 134 },
  },
  {
    kind: 'mcp',
    id: 'mcp-komply',
    name: 'komply.evaluate',
    version: '1.4.0',
    owner: 'squad-security-platform',
    description: 'Avalia uma SA contra o conjunto vigente de policies.',
    status: 'stable',
    server: 'mcp-komply.itau.internal',
    tools: ['evaluate', 'list_violations'],
    permissionScope: 'org',
    opType: 'read-only',
    usage: { consumers: 14, runs7d: 312 },
  },
  {
    kind: 'mcp',
    id: 'mcp-pantheon',
    name: 'pantheon.topic_create',
    version: '0.7.3',
    owner: 'squad-streaming',
    description: 'Cria tópicos Kafka governados e aplica ACLs.',
    status: 'beta',
    server: 'mcp-pantheon.itau.internal',
    tools: ['topic_create', 'topic_describe', 'acl_apply'],
    permissionScope: 'sa',
    opType: 'mutating',
    usage: { consumers: 5, runs7d: 18 },
  },
]

export const sensors: SensorAsset[] = [
  {
    kind: 'sensor',
    id: 'sn-cve-scan',
    name: 'cve-scan-deps',
    version: '3.2.1',
    owner: 'squad-security-platform',
    description: 'Varre dependências em busca de CVEs ativos e abre violations.',
    status: 'stable',
    category: 'security',
    severityDefault: 'high',
    engine: 'Komply',
    usage: { consumers: 47, runs7d: 940 },
  },
  {
    kind: 'sensor',
    id: 'sn-p99-latency',
    name: 'p99-latency-api',
    version: '1.1.0',
    owner: 'squad-observability',
    description: 'Dispara violação quando p99 sobe além do baseline em janela de 5min.',
    status: 'stable',
    category: 'performance',
    severityDefault: 'medium',
    engine: 'custom',
    usage: { consumers: 22, runs7d: 1280 },
  },
]

export const apis: ApiAsset[] = [
  {
    kind: 'api',
    id: 'api-iam',
    name: 'itau-iam',
    version: 'v3',
    owner: 'squad-iam',
    description: 'API central de identidade e permissões.',
    status: 'stable',
    baseUrl: 'https://iam.itau.internal/v3',
    authType: 'mtls',
    endpoints: [
      { method: 'GET', path: '/users/:id' },
      { method: 'POST', path: '/grants' },
    ],
    usage: { consumers: 63, runs7d: 5400 },
  },
  {
    kind: 'api',
    id: 'api-cmdb',
    name: 'itau-cmdb',
    version: 'v2',
    owner: 'squad-cmdb',
    description: 'Configuration management DB — SAs, recursos, owners.',
    status: 'stable',
    baseUrl: 'https://cmdb.itau.internal/v2',
    authType: 'oauth2',
    endpoints: [
      { method: 'GET', path: '/sa/:id' },
      { method: 'GET', path: '/sa/:id/resources' },
    ],
    usage: { consumers: 41, runs7d: 2100 },
  },
  {
    kind: 'api',
    id: 'api-datadog',
    name: 'itau-datadog',
    version: 'v1',
    owner: 'squad-observability',
    description: 'Proxy interno do Datadog (dashboards, monitors, logs).',
    status: 'stable',
    baseUrl: 'https://dd.itau.internal/v1',
    authType: 'bearer',
    endpoints: [
      { method: 'GET', path: '/monitors' },
      { method: 'GET', path: '/dashboards/:id' },
    ],
    usage: { consumers: 35, runs7d: 1750 },
  },
]

// =============================================================================
// Constantes de UI
// =============================================================================

export const STATUS_CHIP: Record<AssetStatus, string> = {
  draft: 'border-border bg-bg text-text-muted',
  beta: 'border-warning/30 bg-warning/10 text-warning',
  stable: 'border-success/30 bg-success/10 text-success',
  deprecated: 'border-failure/30 bg-failure/10 text-failure',
}

export type TabConfig = {
  id: TabKey
  label: string
  icon: IconCmp
  count: number
}

export const TABS: TabConfig[] = [
  { id: 'workflows', label: 'Workflows', icon: WorkflowIcon, count: workflows.length },
  { id: 'skills', label: 'Skills', icon: Sparkles, count: skills.length },
  { id: 'mcps', label: 'MCPs', icon: Plug, count: mcps.length },
  { id: 'sensors', label: 'Sensors', icon: Radar, count: sensors.length },
  { id: 'apis', label: 'APIs', icon: Cable, count: apis.length },
]

export const TAB_ICON: Record<TabKey, IconCmp> = {
  workflows: WorkflowIcon,
  skills: Sparkles,
  mcps: Plug,
  sensors: Radar,
  apis: Cable,
}
