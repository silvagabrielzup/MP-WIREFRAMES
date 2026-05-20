import { Activity, BookOpen, Bot, ExternalLink, FileText, Kanban, Layers, Sparkles, TrendingUp } from 'lucide-react'
import { Card } from '../ui/card'
import { DocPreview } from './DocPreview'
import { Fact } from './Fact'
import { MetricCell } from './MetricCell'
import { ObsLink } from './ObsLink'
import { UIClickStoryRow } from './UIClickStoryRow'
import { infra, infraStatusDot, uiclickStories, type AppDetail } from './utils'

export function Overview({ app }: { app: AppDetail }) {
  const openStoriesCount = uiclickStories.filter((s) => s.status !== 'done').length
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-4">
        <Card className="block p-0">
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
              <span className="font-mono text-text-primary">{app.sa}</span> é o núcleo transacional do Pix dentro do Itaú:
              orquestra entrada e saída de instruções, validação de chaves e enriquecimento contextual antes do encaminhamento
              para o motor de liquidação. Atende hoje aproximadamente{' '}
              <span className="text-text-primary">2.4 bilhões</span> de instruções/mês com SLA de{' '}
              <span className="text-text-primary">99.95%</span>.
            </p>
            <p>
              Arquitetura em Java 21 (Spring Boot 3) rodando em <span className="text-text-primary">EKS prod-1</span> com 3
              nodes <span className="font-mono">m5.xlarge</span>. Depende de DynamoDB (
              <span className="font-mono">pix-chaves</span>, <span className="font-mono">pix-idempotency</span>), SQS FIFO
              para inbound, tópico Kafka <span className="font-mono">pix.events</span> via Pantheon e RDS PostgreSQL 15 para
              auditoria.
            </p>
            <p>
              Migrada para Operação Vanilla em <span className="text-text-primary">2026-01-18</span>; desde então acumula{' '}
              <span className="text-text-primary">47 deploys</span> sem rollback manual. Última semana com p99 acima do
              baseline (auto-mitigação aplicada via Kaptain).
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
        </Card>

        <Card className="block p-0">
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
        </Card>

        <Card className="block p-0">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-text-muted" />
              <h3 className="text-[13.5px] font-semibold tracking-tight">Métricas-chave (7d)</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 px-4 py-4 sm:grid-cols-4">
            <MetricCell label="p95" value={`${app.p95Ms}ms`} spark={[120, 134, 128, 142, 156, 178, 184]} color="warning" />
            <MetricCell
              label="Erro %"
              value={`${app.errorRate.toFixed(2)}%`}
              spark={[0.21, 0.18, 0.24, 0.31, 0.27, 0.39, 0.42]}
              color="warning"
            />
            <MetricCell label="Deploys" value={app.deploys7d.toString()} spark={[1, 0, 1, 2, 1, 0, 1]} color="info" />
            <MetricCell
              label="Uptime"
              value={`${app.uptime.toFixed(2)}%`}
              spark={[99.99, 99.99, 99.98, 99.96, 99.93, 99.91, 99.92]}
              color="success"
            />
          </div>
        </Card>

        <Card className="block p-0">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Kanban className="h-3.5 w-3.5 text-text-muted" />
              <h3 className="text-[13.5px] font-semibold tracking-tight">UIClick</h3>
              <span className="rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[10.5px] text-text-secondary">
                projeto · pix-core
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-text-muted">
              <span className="font-mono text-text-primary">{openStoriesCount}</span> abertas ·{' '}
              <span className="font-mono">{uiclickStories.length}</span> total
              <span className="ml-1 inline-flex items-center gap-1 text-text-secondary hover:text-text-primary">
                ver no UIClick
                <ExternalLink className="h-3 w-3" />
              </span>
            </div>
          </div>
          <ul>
            {uiclickStories.map((s) => (
              <UIClickStoryRow key={s.id} story={s} />
            ))}
          </ul>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="block p-0">
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
        </Card>

        <Card className="border-info/40 p-0 ring-1 ring-info/15">
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
        </Card>
      </div>
    </div>
  )
}
