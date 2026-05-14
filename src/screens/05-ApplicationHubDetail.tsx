import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Activity,
  GitBranch,
  GitPullRequest,
  ListOrdered,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  Rocket,
  Hammer,
  Layers,
  FileText,
  RefreshCw,
  TrendingUp,
  BookOpen,
  Sparkles,
  Bot,
} from 'lucide-react'

type TabKey = 'overview' | 'infra' | 'apis' | 'observability' | 'repos' | 'history'

const tabs: { id: TabKey; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'infra', label: 'Peças de infra' },
  { id: 'apis', label: 'APIs expostas' },
  { id: 'observability', label: 'Observabilidade' },
  { id: 'repos', label: 'Repos' },
  { id: 'history', label: 'Histórico' },
]

type AppDetail = {
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

const mock: AppDetail = {
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

type InfraPiece = {
  id: string
  name: string
  type: 'EKS' | 'DynamoDB' | 'SQS' | 'S3' | 'Kafka' | 'RDS'
  engine: 'Kaptain' | 'Orkestra' | 'Pantheon' | 'Migration'
  status: 'ok' | 'degraded' | 'down'
  meta: string
}

const infra: InfraPiece[] = [
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

type ApiExposed = {
  id: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  version: string
  consumers: number
  p99: number
  sla: number
}

const apis: ApiExposed[] = [
  { id: 'a1', method: 'POST', path: '/v1/pix/instructions', version: 'v1', consumers: 12, p99: 142, sla: 200 },
  { id: 'a2', method: 'GET', path: '/v1/pix/instructions/:id', version: 'v1', consumers: 18, p99: 86, sla: 150 },
  { id: 'a3', method: 'POST', path: '/v1/pix/keys/lookup', version: 'v1', consumers: 9, p99: 64, sla: 100 },
  { id: 'a4', method: 'DELETE', path: '/v1/pix/keys/:key', version: 'v1', consumers: 4, p99: 121, sla: 200 },
  { id: 'a5', method: 'GET', path: '/v2/pix/health', version: 'v2-beta', consumers: 2, p99: 22, sla: 50 },
]

type Repo = {
  id: string
  name: string
  branch: string
  lastCommit: string
  openPrs: number
  primary: boolean
}

const repos: Repo[] = [
  { id: 'r1', name: 'itau/pix-core-api', branch: 'main', lastCommit: '34min', openPrs: 4, primary: true },
  { id: 'r2', name: 'itau/pix-core-workers', branch: 'main', lastCommit: '2h', openPrs: 1, primary: false },
  { id: 'r3', name: 'itau/pix-core-infra', branch: 'main', lastCommit: '6h', openPrs: 0, primary: false },
]

type HistoryEvent = {
  id: string
  kind: 'deploy' | 'rollback' | 'infra' | 'incident'
  title: string
  detail: string
  ago: string
  status: 'ok' | 'warn' | 'fail'
}

const history: HistoryEvent[] = [
  { id: 'h1', kind: 'deploy', title: 'Deploy v0.21.4 → prod', detail: 'canário 100% · sem regressões', ago: '34min', status: 'ok' },
  { id: 'h2', kind: 'incident', title: 'p99 acima do baseline', detail: 'ssa-pix-core · pico de 412ms · auto-resolvido', ago: '2h', status: 'warn' },
  { id: 'h3', kind: 'infra', title: 'Kafka pix.events — particionamento ajustado', detail: '8 → 12 partitions · Pantheon', ago: '5h', status: 'ok' },
  { id: 'h4', kind: 'deploy', title: 'Deploy v0.21.3 → prod', detail: 'canário 50% pausado por sensor de erro', ago: '1d', status: 'warn' },
  { id: 'h5', kind: 'rollback', title: 'Rollback automático v0.21.2', detail: 'sensor cve-scan FAIL · CVE-2025-3148', ago: '2d', status: 'fail' },
  { id: 'h6', kind: 'deploy', title: 'Deploy v0.21.1 → prod', detail: 'cleared sensors · success rate 100%', ago: '3d', status: 'ok' },
  { id: 'h7', kind: 'infra', title: 'DDB pix-chaves — switch para on-demand', detail: 'Kaptain · reduziu custo ~32%', ago: '5d', status: 'ok' },
]

const healthChip: Record<AppDetail['health'], string> = {
  healthy: 'border-success/30 bg-success/10 text-success',
  warn: 'border-warning/30 bg-warning/10 text-warning',
  fail: 'border-failure/30 bg-failure/10 text-failure',
}

const infraStatusDot: Record<InfraPiece['status'], string> = {
  ok: 'bg-success',
  degraded: 'bg-warning',
  down: 'bg-failure',
}

const historyIcon: Record<HistoryEvent['kind'], typeof Rocket> = {
  deploy: Rocket,
  rollback: RefreshCw,
  infra: Hammer,
  incident: AlertTriangle,
}

const historyStatusColor: Record<HistoryEvent['status'], string> = {
  ok: 'text-success bg-success/15',
  warn: 'text-warning bg-warning/15',
  fail: 'text-failure bg-failure/15',
}

const methodColor: Record<ApiExposed['method'], string> = {
  GET: 'border-info/30 bg-info/10 text-info',
  POST: 'border-success/30 bg-success/10 text-success',
  PUT: 'border-warning/30 bg-warning/10 text-warning',
  DELETE: 'border-failure/30 bg-failure/10 text-failure',
}

function Sparkline({ values, color = 'success' }: { values: number[]; color?: 'success' | 'warning' | 'failure' | 'info' }) {
  const w = 120
  const h = 32
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const step = w / (values.length - 1)
  const points = values
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(' ')
  const stroke =
    color === 'success'
      ? 'stroke-success'
      : color === 'warning'
      ? 'stroke-warning'
      : color === 'failure'
      ? 'stroke-failure'
      : 'stroke-info'
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline fill="none" strokeWidth="1.5" className={stroke} points={points} />
    </svg>
  )
}

function Overview({ app }: { app: AppDetail }) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-4">
        <section className="rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-text-muted" />
              <h3 className="text-[13.5px] font-semibold tracking-tight">Sobre esta aplicação</h3>
              <span className="inline-flex items-center gap-1 rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-accent">
                <Bot className="h-2.5 w-2.5" />
                sumário · agente
              </span>
            </div>
            <span className="text-[11px] text-text-muted">atualizado há 12min</span>
          </div>

          <div className="space-y-3 px-4 py-4 text-[12.5px] leading-relaxed text-text-secondary">
            <p>
              <span className="font-mono text-text-primary">{app.sa}</span> é o núcleo transacional do
              Pix dentro do Itaú: orquestra entrada e saída de instruções, validação de chaves e
              enriquecimento contextual antes do encaminhamento para o motor de liquidação. Atende
              hoje aproximadamente <span className="text-text-primary">2.4 bilhões</span> de
              instruções/mês com SLA de <span className="text-text-primary">99.95%</span>.
            </p>
            <p>
              Arquitetura em Java 21 (Spring Boot 3) rodando em <span className="text-text-primary">EKS prod-1</span>{' '}
              com 3 nodes <span className="font-mono">m5.xlarge</span>. Depende de DynamoDB
              (<span className="font-mono">pix-chaves</span>, <span className="font-mono">pix-idempotency</span>),
              SQS FIFO para inbound, tópico Kafka <span className="font-mono">pix.events</span> via Pantheon e
              RDS PostgreSQL 15 para auditoria.
            </p>
            <p>
              Migrada para Operação Vanilla em <span className="text-text-primary">2026-01-18</span>;
              {' '}desde então acumula <span className="text-text-primary">47 deploys</span> sem
              rollback manual. Última semana com p99 acima do baseline (auto-mitigação aplicada
              via Kaptain).
            </p>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-border bg-[#101115] px-4 py-3 text-[11.5px]">
            <Fact label="Squad" value={app.squad} />
            <Fact label="Tribo" value={app.tribo} />
            <Fact label="Stack" value="Java 21 · Spring Boot 3" />
            <Fact label="Repo" value="itau/pix-core-api" mono />
            <Fact label="Versão" value="v0.21.4" mono />
            <Fact label="Onboarded" value="2026-01-18" mono />
          </div>
        </section>

        <section className="rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-3.5 w-3.5 text-text-muted" />
              <h3 className="text-[13.5px] font-semibold tracking-tight">Documentos do projeto</h3>
            </div>
            <span className="text-[11px] text-text-muted">2 arquivos</span>
          </div>
          <div className="divide-y divide-border">
            <DocPreview
              icon={Bot}
              title="CLAUDE.md"
              path=".claude/CLAUDE.md"
              size="2.1k"
              modified="há 4d"
              snippet={`# ssa-pix-core

Núcleo transacional do Pix. Orquestra entrada e saída de instruções, validação de
chaves e enriquecimento antes da liquidação.

## Como rodar local
\`\`\`bash
./gradlew bootRun --args='--spring.profiles.active=local'
\`\`\`

## Convenções
- Java 21 + Spring Boot 3 (não usar reactive)
- Camadas: controller → service → port → adapter
- Testes de contrato com Pact obrigatórios em mudanças no /v1/pix/*`}
            />
            <DocPreview
              icon={Sparkles}
              title="skills.md"
              path=".claude/skills/skills.md"
              size="1.4k"
              modified="há 9d"
              snippet={`## Skills disponíveis para esta SA

- review-pr-comments      v0.9.1  · code review automatizado
- scaffold-vanilla-app    v1.2.0  · scaffold de mono-repo Vanilla
- plan-data-migration     v0.3.0  · planejamento de backfill

## Skills bloqueadas
- deploy-to-prod    requer aprovação Komply manual antes do uso`}
            />
          </div>
        </section>

        <section className="rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-text-muted" />
              <h3 className="text-[13.5px] font-semibold tracking-tight">Métricas-chave (7d)</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 px-4 py-4 sm:grid-cols-4">
            <MetricCell
              label="p95"
              value={`${app.p95Ms}ms`}
              spark={[120, 134, 128, 142, 156, 178, 184]}
              color="warning"
            />
            <MetricCell
              label="Erro %"
              value={`${app.errorRate.toFixed(2)}%`}
              spark={[0.21, 0.18, 0.24, 0.31, 0.27, 0.39, 0.42]}
              color="warning"
            />
            <MetricCell
              label="Deploys"
              value={app.deploys7d.toString()}
              spark={[1, 0, 1, 2, 1, 0, 1]}
              color="info"
            />
            <MetricCell
              label="Uptime"
              value={`${app.uptime.toFixed(2)}%`}
              spark={[99.99, 99.99, 99.98, 99.96, 99.93, 99.91, 99.92]}
              color="success"
            />
          </div>
        </section>
      </div>

      <div className="space-y-4">
        <section className="rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Layers className="h-3.5 w-3.5 text-text-muted" />
              <h3 className="text-[13.5px] font-semibold tracking-tight">Infra resumida</h3>
            </div>
            <span className="text-[11px] text-text-muted">{infra.length} recursos</span>
          </div>
          <ul className="divide-y divide-border">
            {infra.slice(0, 5).map((p) => (
              <li key={p.id} className="flex items-center gap-3 px-4 py-2.5">
                <span className={`h-1.5 w-1.5 rounded-full ${infraStatusDot[p.status]}`} />
                <span className="rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[10.5px] text-text-secondary">
                  {p.type}
                </span>
                <span className="flex-1 truncate font-mono text-[12px] text-text-primary">{p.name}</span>
                <span className="text-[11px] text-text-muted">{p.engine}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-border px-4 py-2 text-right">
            <span className="text-[11.5px] text-text-secondary">ver na tab Infra →</span>
          </div>
        </section>

        <section className="rounded-lg border border-info/40 bg-surface ring-1 ring-info/15">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-info" />
              <h3 className="text-[13.5px] font-semibold tracking-tight">Atalhos de observabilidade</h3>
            </div>
          </div>
          <div className="space-y-2 px-4 py-3 text-[12px]">
            <ObsLink label="Dashboard Datadog · pix-core overview" />
            <ObsLink label="Monitor Datadog · p99 latency" />
            <ObsLink label="Logs · pix-core errors (1h)" />
            <ObsLink label="Traces · pix-core slow (1h)" />
          </div>
        </section>
      </div>
    </div>
  )
}

function Fact({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-[10.5px] uppercase tracking-wider text-text-muted">{label}</span>
      <span className={`text-[11.5px] text-text-primary ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  )
}

function DocPreview({
  icon: Icon,
  title,
  path,
  size,
  modified,
  snippet,
}: {
  icon: typeof FileText
  title: string
  path: string
  size: string
  modified: string
  snippet: string
}) {
  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-7 w-7 flex-none items-center justify-center rounded-md bg-[#181A1F] text-text-secondary">
            <Icon className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <div className="truncate font-mono text-[12.5px] text-text-primary">{title}</div>
            <div className="truncate font-mono text-[10.5px] text-text-muted">{path}</div>
          </div>
        </div>
        <div className="flex flex-none items-center gap-2 text-[10.5px] text-text-muted">
          <span className="font-mono">{size}</span>
          <span>·</span>
          <span>{modified}</span>
        </div>
      </div>
      <pre className="mt-2 max-h-[160px] overflow-y-auto rounded border border-border bg-[#0B0C10] p-2.5 font-mono text-[10.5px] leading-relaxed text-text-secondary">
{snippet}
      </pre>
      <div className="mt-2 flex justify-end">
        <a
          href="#"
          className="inline-flex items-center gap-1 text-[11.5px] text-text-secondary hover:text-text-primary"
        >
          Abrir
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}

function MetricCell({
  label,
  value,
  spark,
  color,
}: {
  label: string
  value: string
  spark: number[]
  color: 'success' | 'warning' | 'failure' | 'info'
}) {
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-wider text-text-muted">{label}</div>
      <div className="mt-0.5 font-mono text-[16px] text-text-primary">{value}</div>
      <div className="mt-1">
        <Sparkline values={spark} color={color} />
      </div>
    </div>
  )
}

function ObsLink({ label }: { label: string }) {
  return (
    <a
      href="#"
      className="flex items-center justify-between gap-2 rounded-md border border-border bg-bg px-3 py-2 hover:border-border-strong"
    >
      <span className="truncate text-text-primary">{label}</span>
      <ExternalLink className="h-3.5 w-3.5 flex-none text-text-muted" />
    </a>
  )
}

function InfraTab() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="border-b border-border bg-[#101115] text-left text-[11px] uppercase tracking-wider text-text-muted">
            <th className="px-4 py-2.5 font-medium">Recurso</th>
            <th className="px-4 py-2.5 font-medium">Tipo</th>
            <th className="px-4 py-2.5 font-medium">Motor</th>
            <th className="px-4 py-2.5 font-medium">Status</th>
            <th className="px-4 py-2.5 font-medium">Meta</th>
            <th className="px-4 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {infra.map((p) => (
            <tr key={p.id} className="group border-b border-border last:border-b-0 hover:bg-[#181A1F]">
              <td className="px-4 py-2.5 font-mono text-text-primary">{p.name}</td>
              <td className="px-4 py-2.5">
                <span className="rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[10.5px] text-text-secondary">
                  {p.type}
                </span>
              </td>
              <td className="px-4 py-2.5 text-text-secondary">{p.engine}</td>
              <td className="px-4 py-2.5">
                <span className="inline-flex items-center gap-2 text-[12px]">
                  <span className={`h-1.5 w-1.5 rounded-full ${infraStatusDot[p.status]}`} />
                  {p.status}
                </span>
              </td>
              <td className="px-4 py-2.5 text-text-muted">{p.meta}</td>
              <td className="px-4 py-2.5 text-right opacity-0 transition group-hover:opacity-100">
                <span className="inline-flex items-center gap-1 text-[11.5px] text-text-muted hover:text-text-primary">
                  ver
                  <ArrowRight className="h-3 w-3" />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ApisTab() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="border-b border-border bg-[#101115] text-left text-[11px] uppercase tracking-wider text-text-muted">
            <th className="px-4 py-2.5 font-medium">Endpoint</th>
            <th className="px-4 py-2.5 font-medium">Versão</th>
            <th className="px-4 py-2.5 font-medium text-right">Consumidores</th>
            <th className="px-4 py-2.5 font-medium text-right">p99</th>
            <th className="px-4 py-2.5 font-medium text-right">SLA</th>
          </tr>
        </thead>
        <tbody>
          {apis.map((a) => (
            <tr key={a.id} className="border-b border-border last:border-b-0 hover:bg-[#181A1F]">
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex w-14 justify-center rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${methodColor[a.method]}`}
                  >
                    {a.method}
                  </span>
                  <span className="font-mono text-text-primary">{a.path}</span>
                </div>
              </td>
              <td className="px-4 py-2.5 font-mono text-text-secondary">{a.version}</td>
              <td className="px-4 py-2.5 text-right font-mono text-text-secondary">{a.consumers}</td>
              <td
                className={`px-4 py-2.5 text-right font-mono ${a.p99 > a.sla ? 'text-failure' : 'text-text-primary'}`}
              >
                {a.p99}ms
              </td>
              <td className="px-4 py-2.5 text-right font-mono text-text-muted">{a.sla}ms</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ObservabilityTab() {
  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-info" />
            <h3 className="text-[13.5px] font-semibold tracking-tight">Datadog — dashboards & monitors</h3>
          </div>
          <span className="text-[11px] text-text-muted">link direto</span>
        </div>
        <div className="grid grid-cols-1 gap-2 px-4 py-3 sm:grid-cols-2">
          <ObsLink label="Dashboard · pix-core overview" />
          <ObsLink label="Dashboard · pix-core SLO" />
          <ObsLink label="Monitor · p99 latency" />
          <ObsLink label="Monitor · error rate" />
          <ObsLink label="Monitor · kafka lag" />
          <ObsLink label="Monitor · DDB throttle" />
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <ListOrdered className="h-3.5 w-3.5 text-text-muted" />
            <h3 className="text-[13.5px] font-semibold tracking-tight">Logs & traces</h3>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 px-4 py-3 sm:grid-cols-2">
          <ObsLink label="Logs · pix-core errors (1h)" />
          <ObsLink label="Logs · pix-core all (15m)" />
          <ObsLink label="Traces · pix-core slow (1h)" />
          <ObsLink label="Traces · pix-core errors (1h)" />
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface px-4 py-3 text-[12px] text-text-muted">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
          <span>Instrumentação OK · traces, métricas e logs reportando há 9s.</span>
        </div>
      </section>
    </div>
  )
}

function ReposTab() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="border-b border-border bg-[#101115] text-left text-[11px] uppercase tracking-wider text-text-muted">
            <th className="px-4 py-2.5 font-medium">Repositório</th>
            <th className="px-4 py-2.5 font-medium">Branch principal</th>
            <th className="px-4 py-2.5 font-medium">Último commit</th>
            <th className="px-4 py-2.5 font-medium text-right">PRs abertos</th>
            <th className="px-4 py-2.5 font-medium text-right" />
          </tr>
        </thead>
        <tbody>
          {repos.map((r) => (
            <tr key={r.id} className="border-b border-border last:border-b-0 hover:bg-[#181A1F]">
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-3.5 w-3.5 text-text-muted" />
                  <span className="font-mono text-text-primary">{r.name}</span>
                  {r.primary && (
                    <span className="rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-accent">
                      primary
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-2.5 font-mono text-text-secondary">{r.branch}</td>
              <td className="px-4 py-2.5 text-text-secondary">há {r.lastCommit}</td>
              <td className="px-4 py-2.5 text-right">
                <span className="inline-flex items-center gap-1 font-mono text-text-secondary">
                  <GitPullRequest className="h-3 w-3" />
                  {r.openPrs}
                </span>
              </td>
              <td className="px-4 py-2.5 text-right">
                <a href="#" className="inline-flex items-center gap-1 text-[11.5px] text-text-muted hover:text-text-primary">
                  abrir
                  <ExternalLink className="h-3 w-3" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function HistoryTab() {
  return (
    <ol className="space-y-2">
      {history.map((h) => {
        const Icon = historyIcon[h.kind]
        return (
          <li key={h.id} className="flex items-start gap-3 rounded-lg border border-border bg-surface px-4 py-3">
            <span className={`mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-md ${historyStatusColor[h.status]}`}>
              <Icon className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="rounded border border-border bg-bg px-1.5 py-0.5 text-[9.5px] uppercase tracking-wider text-text-muted">
                  {h.kind}
                </span>
                <span className="text-[12.5px] text-text-primary">{h.title}</span>
              </div>
              <div className="mt-0.5 text-[11.5px] text-text-muted">{h.detail}</div>
            </div>
            <span className="font-mono text-[11px] text-text-muted">há {h.ago}</span>
          </li>
        )
      })}
    </ol>
  )
}

export default function ApplicationHubDetail() {
  const { sa } = useParams<{ sa: string }>()
  const app: AppDetail = { ...mock, sa: sa ?? mock.sa }
  const [tab, setTab] = useState<TabKey>('overview')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1.5 text-[11.5px] text-text-muted">
        <Link to="/application-hub" className="hover:text-text-primary">
          Application Hub
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-mono text-text-secondary">{app.sa}</span>
      </div>

      <header className="rounded-lg border border-border bg-surface px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <Link
              to="/application-hub"
              className="mt-1 flex h-7 w-7 items-center justify-center rounded-md border border-border bg-bg text-text-muted hover:text-text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-mono text-[20px] text-text-primary">{app.sa}</h1>
                {app.onPlat && (
                  <span className="rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent">
                    on-plat
                  </span>
                )}
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide ${healthChip[app.health]}`}
                >
                  {app.health}
                </span>
              </div>
              <p className="mt-1 max-w-[640px] text-[12.5px] text-text-secondary">{app.description}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-text-muted">
                <span>{app.squad}</span>
                <span>·</span>
                <span>{app.tribo}</span>
                <span>·</span>
                <span>último deploy há {app.lastDeploy}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-bg px-3 text-[12px] text-text-secondary hover:text-text-primary">
              <Clock3 className="h-3.5 w-3.5" />
              Pausar alertas
            </button>
            <button className="inline-flex h-8 items-center gap-1.5 rounded-md bg-accent px-3 text-[12px] font-medium text-black hover:bg-accent-hover">
              <Rocket className="h-3.5 w-3.5" />
              Disparar workflow
            </button>
          </div>
        </div>
      </header>

      <nav className="flex flex-wrap items-center gap-1.5 border-b border-border">
        {tabs.map((t) => {
          const active = t.id === tab
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`-mb-px border-b-2 px-3 py-2.5 text-[12.5px] transition ${
                active
                  ? 'border-accent text-text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {t.label}
            </button>
          )
        })}
      </nav>

      {tab === 'overview' && <Overview app={app} />}
      {tab === 'infra' && <InfraTab />}
      {tab === 'apis' && <ApisTab />}
      {tab === 'observability' && <ObservabilityTab />}
      {tab === 'repos' && <ReposTab />}
      {tab === 'history' && <HistoryTab />}
    </div>
  )
}
