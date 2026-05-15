# 04 — Application Hub

Rota: `/application-hub`

## Missão

Ser o **centro de operações pós-migração** — onde dev/SRE entende saúde, dependências e contexto técnico das aplicações. Ambição de longo prazo: **substituir os control planes antigos**.

## Componentes

### 1. Lista de aplicações

Visão de portfólio com status high-level e métricas-chave por aplicação. Cada item mostra:

- Identidade da SA (nome em mono, badge ON-PLAT)
- Status agregado de saúde (success / warn / fail) com dot pulsante quando há incidente live
- Métricas-chave: uptime, p95 latência, taxa de erro, deploys 7d
- Owner / squad
- Atalhos: ir para detalhe, abrir observabilidade, abrir repo

### 2. Drill-down por aplicação

Página de detalhe organizada em abas/seções:

- **Overview** — resumo de saúde, donut de IUConfia, sparklines das métricas-chave, últimos eventos.
- **Peças de infra** — recursos provisionados (clusters EKS, filas SQS, tópicos Kafka, buckets, DynamoDB, etc.) com status individual e motor responsável (Kaptain, Pantheon, Orkestra…).
- **APIs expostas** — endpoints públicos/internos da aplicação, contratos, versão, consumidores conhecidos.
- **Integração com observabilidade** — links diretos para Datadog (dashboards, monitors), logs e traces; status de instrumentação.
- **Links dos repos** — repositórios associados (mono/multi), branch principal, último commit, PRs abertos.
- **Histórico** — timeline de deploys, rollbacks, mudanças de infra, incidentes.

### 3. Saúde dos control planes

Painel transversal mostrando o estado dos 7 motores deterministas (Kaptain, Komply, Konstructor, Orkestra, Traffik, Pantheon, Migration). Para cada motor:

- Status (ok / degraded / down)
- Última verificação (timestamp)
- Mini-stat de uso (execuções 7d, taxa de sucesso)
- Link para detalhe operacional do motor

Esse painel é o ponto de entrada para a ambição de "substituir os control planes antigos" — o Application Hub passa a ser o único lugar pra ver se a plataforma está saudável.

## Convenções

- Real-time evidente: dots pulsantes nos status, "atualizado há Ns".
- Densidade alta — listas e tabelas com 10–25 linhas de dados realistas.
- Portuguese (pt-BR) para toda copy.
- Charts inline (sparklines, donuts) sem libs externas.

## Estado atual — iterações pós-MVP (2026-05-15)

### Fonte de dados

A tela consome `useWorkflows().applicationHubs` (state runtime no `WorkflowsProvider`), **não mais** um array hardcoded. O seed em `database.ts` (`applicationHubs: ApplicationHub[] = []`) é vazio — itens aparecem dinamicamente quando um workflow primário conclui.

### Tipo `ApplicationHub`

Campos atuais:

- `id` (`ahub-<sa>`) — chave estrangeira em notificações
- `sa` — SA Itaú, usada como slug
- `name` — nome amigável derivado da SA (`ssa-pix-core` → "Pix Core")
- `projectId` — projeto agregador
- `squad`
- `onPlat: boolean`
- `health: 'healthy' | 'warn' | 'fail'`
- `liveIncident: boolean`
- `uptime`, `p95Ms`, `errorRate`, `deploys7d`

### Gating de criação

`WorkflowsProvider.advanceStep` cria o hub via `buildHubFromTemplate(template)` quando o workflow primário atinge o último step. Guard `!executionTemplateIds.has(template.id)` garante que só primários (não execuções como `migrationExecutionWorkflow` / `hmlPromotionWorkflow`) disparam.

Dedupe por `hub.id` impede entrada duplicada.

### Tabela

- Header: "Aplicação" (substituiu "SA"), Squad, Saúde, Uptime, p95, Erro %, Deploys 7d.
- Primeira coluna: nome amigável (`hub.name`) na linha de cima + `hub.sa` em mono muted na linha de baixo. Badge "on-plat" quando `hub.onPlat`.

### Empty state

Quando `applicationHubs.length === 0`, render `<section>` com ícone Boxes + título "Nenhuma aplicação on-platform" + texto explicando que hubs aparecem após o onboarding Vanilla concluir. Stat row + tabela só renderizam quando há dados.

### `ApplicationHubNotification` (database.ts)

Tipo adicionado pra modelar notificações que linkam pra um hub existente:

- `id`, `icon` (string lucide-name), `title`, `description`, `cta`, `link`
- `applicationHubId` (FK pra `ApplicationHub.id`)
- `projectId`

Seed atual: `notif-hml-provisioned-ssa-pix-core` (HML provisionada, CTA "Ver saúde em HML"). Ainda não renderizado em tela — surfará na Home ou no sino da topbar em iteração futura.
