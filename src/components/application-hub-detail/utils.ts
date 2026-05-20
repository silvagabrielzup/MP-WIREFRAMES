import { AlertTriangle, Hammer, RefreshCw, Rocket } from 'lucide-react'

export type TabKey = 'overview' | 'infra' | 'apis' | 'observability' | 'repos' | 'history'

export const tabs: { id: TabKey; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'infra', label: 'Peças de infra' },
  { id: 'apis', label: 'APIs expostas' },
  { id: 'observability', label: 'Observabilidade' },
  { id: 'repos', label: 'Repos' },
  { id: 'history', label: 'Histórico' },
]

export type AppDetail = {
  sa: string
  squad: string
  tribo: string
  onPlat: boolean
  health: 'healthy' | 'warn' | 'fail'
  description: string
  uptime: number
  p95Ms: number
  errorRate: number
  deploys7d: number
  lastDeploy: string
}

export type InfraPiece = {
  id: string
  name: string
  type: 'EKS' | 'DynamoDB' | 'SQS' | 'S3' | 'Kafka' | 'RDS'
  engine: 'Kaptain' | 'Orkestra' | 'Pantheon' | 'Migration'
  status: 'ok' | 'degraded' | 'down'
  meta: string
}

export type ApiExposed = {
  id: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  version: string
  consumers: number
  p99: number
  sla: number
}

export type Repo = {
  id: string
  name: string
  branch: string
  lastCommit: string
  openPrs: number
  primary: boolean
}

export type HistoryEvent = {
  id: string
  kind: 'deploy' | 'rollback' | 'infra' | 'incident'
  title: string
  detail: string
  ago: string
  status: 'ok' | 'warn' | 'fail'
}

export type UIClickStatus = 'todo' | 'in-progress' | 'review' | 'done' | 'blocked'
export type UIClickType = 'feat' | 'bug' | 'chore' | 'spike' | 'debt'

export type UIClickStory = {
  id: string
  type: UIClickType
  title: string
  status: UIClickStatus
  assignee: { initials: string; name: string }
  updated: string
  points: number
}

export type SparkColor = 'success' | 'warning' | 'failure' | 'info'

export const mock: AppDetail = {
  sa: 'ssa-pix-core',
  squad: 'squad-pix',
  tribo: 'Tribo Pagamentos',
  onPlat: true,
  health: 'warn',
  description:
    'Núcleo transacional do Pix: orquestra entrada/saída de instruções, validações de chave e enriquecimento antes do encaminhamento para o motor de liquidação.',
  uptime: 99.92,
  p95Ms: 184,
  errorRate: 0.42,
  deploys7d: 6,
  lastDeploy: '34min',
}

export const infra: InfraPiece[] = [
  { id: 'eks-prod-1', name: 'pix-core-prod', type: 'EKS', engine: 'Orkestra', status: 'ok', meta: '3 nodes · m5.xlarge' },
  { id: 'eks-prod-2', name: 'pix-core-hml', type: 'EKS', engine: 'Orkestra', status: 'ok', meta: '2 nodes · m5.large' },
  { id: 'ddb-keys', name: 'pix-chaves', type: 'DynamoDB', engine: 'Kaptain', status: 'ok', meta: 'on-demand · 12.4M itens' },
  { id: 'ddb-idem', name: 'pix-idempotency', type: 'DynamoDB', engine: 'Kaptain', status: 'degraded', meta: 'TTL 24h · throttling 0.3%' },
  { id: 'sqs-in', name: 'pix-inbound', type: 'SQS', engine: 'Kaptain', status: 'ok', meta: 'FIFO · DLQ 14msgs' },
  { id: 'sqs-out', name: 'pix-outbound', type: 'SQS', engine: 'Kaptain', status: 'ok', meta: 'standard · DLQ 0msgs' },
  { id: 'kafka-events', name: 'pix.events', type: 'Kafka', engine: 'Pantheon', status: 'degraded', meta: '12 partitions · lag 1.2s' },
  { id: 'rds-audit', name: 'pix-audit', type: 'RDS', engine: 'Migration', status: 'ok', meta: 'postgres 15 · 240GB' },
  { id: 's3-arch', name: 'pix-archive', type: 'S3', engine: 'Kaptain', status: 'ok', meta: 'glacier · 1.2TB' },
]

export const apis: ApiExposed[] = [
  { id: 'a1', method: 'POST', path: '/v1/pix/instructions', version: 'v1', consumers: 12, p99: 142, sla: 200 },
  { id: 'a2', method: 'GET', path: '/v1/pix/instructions/:id', version: 'v1', consumers: 18, p99: 86, sla: 150 },
  { id: 'a3', method: 'POST', path: '/v1/pix/keys/lookup', version: 'v1', consumers: 9, p99: 64, sla: 100 },
  { id: 'a4', method: 'DELETE', path: '/v1/pix/keys/:key', version: 'v1', consumers: 4, p99: 121, sla: 200 },
  { id: 'a5', method: 'GET', path: '/v2/pix/health', version: 'v2-beta', consumers: 2, p99: 22, sla: 50 },
]

export const repos: Repo[] = [
  { id: 'r1', name: 'itau/pix-core-api', branch: 'main', lastCommit: '34min', openPrs: 4, primary: true },
  { id: 'r2', name: 'itau/pix-core-workers', branch: 'main', lastCommit: '2h', openPrs: 1, primary: false },
  { id: 'r3', name: 'itau/pix-core-infra', branch: 'main', lastCommit: '6h', openPrs: 0, primary: false },
]

export const history: HistoryEvent[] = [
  { id: 'h1', kind: 'deploy', title: 'Deploy v0.21.4 → prod', detail: 'canário 100% · sem regressões', ago: '34min', status: 'ok' },
  {
    id: 'h2',
    kind: 'incident',
    title: 'p99 acima do baseline',
    detail: 'ssa-pix-core · pico de 412ms · auto-resolvido',
    ago: '2h',
    status: 'warn',
  },
  {
    id: 'h3',
    kind: 'infra',
    title: 'Kafka pix.events — particionamento ajustado',
    detail: '8 → 12 partitions · Pantheon',
    ago: '5h',
    status: 'ok',
  },
  {
    id: 'h4',
    kind: 'deploy',
    title: 'Deploy v0.21.3 → prod',
    detail: 'canário 50% pausado por sensor de erro',
    ago: '1d',
    status: 'warn',
  },
  {
    id: 'h5',
    kind: 'rollback',
    title: 'Rollback automático v0.21.2',
    detail: 'sensor cve-scan FAIL · CVE-2025-3148',
    ago: '2d',
    status: 'fail',
  },
  { id: 'h6', kind: 'deploy', title: 'Deploy v0.21.1 → prod', detail: 'cleared sensors · success rate 100%', ago: '3d', status: 'ok' },
  {
    id: 'h7',
    kind: 'infra',
    title: 'DDB pix-chaves — switch para on-demand',
    detail: 'Kaptain · reduziu custo ~32%',
    ago: '5d',
    status: 'ok',
  },
]

export const uiclickStories: UIClickStory[] = [
  {
    id: 'UIC-1234',
    type: 'feat',
    title: 'Idempotency key em /v1/pix/instant-pay',
    status: 'in-progress',
    assignee: { initials: 'LL', name: 'Luigi' },
    updated: 'há 2h',
    points: 5,
  },
  {
    id: 'UIC-1245',
    type: 'bug',
    title: 'Lag de dual-write Aurora viola SLO no pico (18h–20h)',
    status: 'todo',
    assignee: { initials: 'CM', name: 'Camila' },
    updated: 'ontem',
    points: 8,
  },
  {
    id: 'UIC-1271',
    type: 'spike',
    title: 'POC failover dual-region via Traffik',
    status: 'review',
    assignee: { initials: 'DR', name: 'Daniel' },
    updated: 'há 5h',
    points: 3,
  },
  {
    id: 'UIC-1289',
    type: 'chore',
    title: 'Migrar config maps de k8s/* pra Vault (SecretProviderClass)',
    status: 'done',
    assignee: { initials: 'LL', name: 'Luigi' },
    updated: 'há 2d',
    points: 3,
  },
  {
    id: 'UIC-1302',
    type: 'feat',
    title: 'Webhook callback assinado via JWS RS256',
    status: 'in-progress',
    assignee: { initials: 'DR', name: 'Daniel' },
    updated: 'há 4h',
    points: 13,
  },
  {
    id: 'UIC-1318',
    type: 'debt',
    title: 'Remover endpoints v0 do contrato Pact e atualizar consumidores',
    status: 'blocked',
    assignee: { initials: 'PA', name: 'Paula' },
    updated: 'há 1d',
    points: 5,
  },
  {
    id: 'UIC-1325',
    type: 'feat',
    title: 'Reconciliação noturna de chaves órfãs via job Pantheon',
    status: 'todo',
    assignee: { initials: 'CM', name: 'Camila' },
    updated: 'há 6h',
    points: 8,
  },
]

export const healthChip: Record<AppDetail['health'], string> = {
  healthy: 'border-success/30 bg-success/10 text-success',
  warn: 'border-warning/30 bg-warning/10 text-warning',
  fail: 'border-failure/30 bg-failure/10 text-failure',
}

export const infraStatusDot: Record<InfraPiece['status'], string> = {
  ok: 'bg-success',
  degraded: 'bg-warning',
  down: 'bg-failure',
}

export const historyIcon: Record<HistoryEvent['kind'], typeof Rocket> = {
  deploy: Rocket,
  rollback: RefreshCw,
  infra: Hammer,
  incident: AlertTriangle,
}

export const historyStatusColor: Record<HistoryEvent['status'], string> = {
  ok: 'text-success bg-success/15',
  warn: 'text-warning bg-warning/15',
  fail: 'text-failure bg-failure/15',
}

export const methodColor: Record<ApiExposed['method'], string> = {
  GET: 'border-info/30 bg-info/10 text-info',
  POST: 'border-success/30 bg-success/10 text-success',
  PUT: 'border-warning/30 bg-warning/10 text-warning',
  DELETE: 'border-failure/30 bg-failure/10 text-failure',
}

export const uiclickStatusMeta: Record<UIClickStatus, { label: string; tone: string }> = {
  todo: { label: 'a fazer', tone: 'border-border bg-bg text-text-muted' },
  'in-progress': { label: 'em curso', tone: 'border-info/30 bg-info/10 text-info' },
  review: { label: 'em review', tone: 'border-warning/30 bg-warning/10 text-warning' },
  done: { label: 'concluído', tone: 'border-success/30 bg-success/10 text-success' },
  blocked: { label: 'bloqueado', tone: 'border-failure/30 bg-failure/10 text-failure' },
}

export const uiclickTypeMeta: Record<UIClickType, { label: string; tone: string }> = {
  feat: { label: 'feat', tone: 'border-accent/30 bg-accent/10 text-accent' },
  bug: { label: 'bug', tone: 'border-failure/30 bg-failure/10 text-failure' },
  chore: { label: 'chore', tone: 'border-border bg-bg text-text-muted' },
  spike: { label: 'spike', tone: 'border-info/30 bg-info/10 text-info' },
  debt: { label: 'débito', tone: 'border-warning/30 bg-warning/10 text-warning' },
}

export function sparkStroke(color: SparkColor): string {
  if (color === 'success') return 'stroke-success'
  if (color === 'warning') return 'stroke-warning'
  if (color === 'failure') return 'stroke-failure'
  return 'stroke-info'
}
