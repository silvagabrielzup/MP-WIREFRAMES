# Spec: Application Hub — Detail

## Resumo

Drill-down de uma aplicação on-platform. Página de detalhe organizada em 6 tabs que cobrem todo o contexto técnico, operacional e organizacional de uma SA: saúde, infra, APIs expostas, observabilidade, repos e histórico. É a tela mais densa do Application Hub — onde dev/SRE entra para entender ou agir sobre uma SA específica.

**Rota:** `/application-hub/:sa`
**Acesso:** usuários autenticados
**Layout base:** Sidebar + Topbar conforme contexto mestre
**Params:** `sa` (slug da SA, ex.: `ssa-pix-core`)
**Esta spec cobre:** a tela de **detalhe**. A listagem (`/application-hub`) é uma spec separada.

## Objetivo e contexto

Esta tela é o substituto de longo prazo dos control planes antigos. Quando alguém pergunta "como está a `ssa-pix-core`?", a resposta inteira deve caber aqui — saúde agregada, sumário de contexto, peças de infra provisionadas, APIs expostas, atalhos para Datadog, repos, e histórico de deploys/incidentes.

O detalhe é organizado em **6 tabs**, cada uma respondendo a uma pergunta diferente:

| Tab | Pergunta que responde |
|-----|----------------------|
| Overview | "Como está a saúde agora e o que tem rolando nessa aplicação?" |
| Peças de infra | "Que recursos provisionados existem para essa SA?" |
| APIs expostas | "Que contratos essa SA serve para outros consumidores?" |
| Observabilidade | "Onde ver dashboards, monitors, logs e traces?" |
| Repos | "Que repositórios compõem essa SA e onde estão?" |
| Histórico | "O que aconteceu com essa SA nos últimos dias?" |

A tela hoje usa **dados mockados estáticos** definidos no componente (`mock`, `infra`, `apis`, `repos`, `history`, `uiclickStories`). O `useParams` lê o slug e injeta apenas em `app.sa` — o restante dos dados não varia entre SAs. Em produção isso viraria um fetch parametrizado, mas o schema definido aqui já é o contrato.

## Layout e elementos visuais

Container `space-y-6` com quatro blocos verticais:

### Bloco 1 — Breadcrumb

`flex items-center gap-1.5 text-[11.5px] text-text-muted`:
- Link "Application Hub" → `/application-hub`
- `ChevronRight` separador
- SA atual em fonte mono secondary

### Bloco 2 — Header card

Card `rounded-lg border border-border bg-surface px-5 py-4` com layout responsivo (`flex-col sm:flex-row`):

**Esquerda** (`flex items-start gap-3`):
- Botão de voltar (`Link → /application-hub`) — quadrado 28px com `ArrowLeft`
- Bloco principal:
  - **Linha de título:** `<h1>` em mono `text-[20px]` com o ID da SA + badge "on-plat" accent (se `app.onPlat`) + `HealthChip` (uppercase, tons por health)
  - **Descrição:** `text-[12.5px] text-text-secondary` máx 640px
  - **Meta:** `text-[11.5px] text-text-muted` com `squad · tribo · último deploy há {lastDeploy}`

**Direita** (`flex flex-wrap items-center gap-2`):
- Botão secundário "Pausar alertas" com ícone `Clock3`
- CTA accent "Disparar workflow" com ícone `Rocket`

### Bloco 3 — Navegação por tabs

`flex flex-wrap items-center gap-1.5 border-b border-border`. Seis `<button>` com:
- `-mb-px border-b-2 px-3 py-2.5 text-[12.5px]`
- Ativo: `border-accent text-text-primary`
- Inativo: `border-transparent text-text-secondary hover:text-text-primary`

Sem badges de count nas tabs (diferente do Assets Catalog).

### Bloco 4 — Conteúdo da tab ativa

Renderização condicional. Cada tab é um componente próprio (`Overview`, `InfraTab`, `ApisTab`, `ObservabilityTab`, `ReposTab`, `HistoryTab`).

## Detalhamento das tabs

### Tab Overview — layout 1.4fr / 1fr

Grid `grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5`. Em mobile, coluna única; em `lg:`, duas colunas com a esquerda maior.

**Coluna esquerda** (`space-y-4`):
1. Card "Sobre esta aplicação"
2. Card "Documentos do projeto"
3. Card "Métricas-chave (7d)"
4. Card "UIClick"

**Coluna direita** (`space-y-4`):
1. Card "Infra resumida"
2. Card "Atalhos de observabilidade"

#### Card "Sobre esta aplicação"

`rounded-lg border border-border bg-surface` com três áreas:

**Header** (`border-b`):
- Ícone `FileText` muted + título "Sobre esta aplicação"
- Badge accent "sumário · agente" com ícone `Bot` (sinaliza que o texto foi gerado por agente)
- Direita: "atualizado há 12min"

**Body** (`text-[12.5px] leading-relaxed text-text-secondary`):
- 3 parágrafos com `space-y-3`
- Spans destacados em `text-text-primary` (números, datas) e `font-mono text-text-primary` (IDs como `ssa-pix-core`, paths como `pix-chaves`)
- Conteúdo cobre: o que a SA faz, métricas de tráfego, arquitetura, dependências (DDB/SQS/Kafka/RDS), data de onboarding, estado recente

**Footer** (`border-t bg-[#101115]`):
- Grid de `Fact` (label uppercase + value, com flag `mono` opcional)
- 6 facts: Squad, Tribo, Stack, Repo, Versão, Onboarded

#### Card "Documentos do projeto"

Mostra arquivos do projeto via `DocPreview`:

- Header: ícone `BookOpen` + título + contador "2 arquivos"
- Body com `divide-y divide-border`
- Cada `DocPreview` renderiza:
  - Ícone (passado por prop) + título em mono + path em mono muted
  - Direita: tamanho + modificado
  - `<pre>` de 160px max-height com snippet do conteúdo
  - Link "Abrir" no rodapé

**Hoje os arquivos visíveis** são `CLAUDE.md` (ícone `Bot`) e `skills.md` (ícone `Sparkles`).

#### Card "Métricas-chave (7d)"

Grid 2 colunas (mobile) / 4 colunas (`sm:`) com `MetricCell`:
- Label uppercase muted
- Value em mono `text-[16px]`
- `Sparkline` SVG 120×32 com 7 pontos

**4 métricas:** p95 (warning), Erro % (warning), Deploys (info), Uptime (success).

#### Card "UIClick"

Card de stories integrado com UIClick (sistema de tracking de tarefas):

**Header:**
- Ícone `Kanban` + título "UIClick"
- Badge mono "projeto · pix-core"
- Direita: "{abertas} abertas · {total} total" + link externo "ver no UIClick"

**Body:** lista de `UIClickStoryRow`. Cada linha:
- Badge quadrado mono com story points
- Linha 1: ID mono + badge de tipo + pílula de status
- Linha 2: título da story
- Linha 3 (meta): círculo accent com iniciais + nome + "atualizado {tempo}"
- `ArrowRight` à direita em `group-hover:opacity-100`

**Estados de story (`UIClickStatus`):**

| Status | Label | Cor |
|--------|-------|-----|
| `todo` | "a fazer" | muted |
| `in-progress` | "em curso" | info |
| `review` | "em review" | warning |
| `done` | "concluído" | success |
| `blocked` | "bloqueado" | failure |

**Tipos de story (`UIClickType`):**

| Tipo | Label | Cor |
|------|-------|-----|
| `feat` | "feat" | accent |
| `bug` | "bug" | failure |
| `chore` | "chore" | muted |
| `spike` | "spike" | info |
| `debt` | "débito" | warning |

#### Card "Infra resumida" (coluna direita)

Card compacto mostrando os 5 primeiros itens de `infra`:

- Header: ícone `Layers` + título + contador "{N} recursos"
- Body com `divide-y`. Cada item: dot colorido por status + badge `type` mono + nome em mono + engine em muted
- Footer: "ver na tab Infra →"

#### Card "Atalhos de observabilidade" (coluna direita)

Card destacado com ring info (`border-info/40 ring-1 ring-info/15`):

- Header: ícone `Activity` info + título
- Body: 4 `ObsLink` (Dashboard pix-core, Monitor p99, Logs errors, Traces slow)

`ObsLink` é um `<a>` com texto + ícone `ExternalLink` à direita.

### Tab "Peças de infra" — `InfraTab`

Tabela densa dentro de `overflow-hidden rounded-lg border border-border bg-surface`:

**Colunas:**

| Col | Header | Conteúdo |
|-----|--------|----------|
| 1 | Recurso | Nome em mono primary |
| 2 | Tipo | Badge mono com `type` (EKS, DynamoDB, SQS, S3, Kafka, RDS) |
| 3 | Motor | `engine` em secondary |
| 4 | Status | Dot + label (ok / degraded / down) |
| 5 | Meta | String descritiva (`3 nodes · m5.xlarge`, `TTL 24h · throttling 0.3%`) |
| 6 | (ação) | "ver" + `ArrowRight` em `group-hover` |

**Mapeamento de dot por status:**
- `ok` → `bg-success`
- `degraded` → `bg-warning`
- `down` → `bg-failure`

### Tab "APIs expostas" — `ApisTab`

Tabela com endpoints HTTP da aplicação:

**Colunas:**

| Col | Header | Align | Conteúdo |
|-----|--------|-------|----------|
| 1 | Endpoint | esquerda | Badge de método (largura fixa `w-14`, centralizado) + path em mono |
| 2 | Versão | esquerda | Versão em mono |
| 3 | Consumidores | direita | Número mono |
| 4 | p99 | direita | `{p99}ms` — vermelho se `p99 > sla`, primary caso contrário |
| 5 | SLA | direita | `{sla}ms` em muted |

**Mapeamento de cor por método HTTP:**

| Método | Cor |
|--------|-----|
| `GET` | info |
| `POST` | success |
| `PUT` | warning |
| `DELETE` | failure |

### Tab "Observabilidade" — `ObservabilityTab`

`space-y-4` com três cards:

**Card 1 — "Datadog — dashboards & monitors":**
- Header com ícone `Activity` info + título + label "link direto"
- Grid 1 col / 2 cols em `sm:` com 6 `ObsLink` (2 dashboards + 4 monitors)

**Card 2 — "Logs & traces":**
- Header com ícone `ListOrdered` + título
- Grid 1 col / 2 cols com 4 `ObsLink` (logs errors/all + traces slow/errors)

**Card 3 — Status de instrumentação:**
- Card neutro com `CheckCircle2` success + "Instrumentação OK · traces, métricas e logs reportando há 9s."

### Tab "Repos" — `ReposTab`

Tabela com repositórios da aplicação:

**Colunas:**

| Col | Header | Conteúdo |
|-----|--------|----------|
| 1 | Repositório | `GitBranch` + nome em mono + badge "primary" accent se `r.primary` |
| 2 | Branch principal | Branch em mono |
| 3 | Último commit | "há {lastCommit}" |
| 4 | PRs abertos | `GitPullRequest` + número mono |
| 5 | (ação) | Link "abrir" externo |

### Tab "Histórico" — `HistoryTab`

Lista vertical (`<ol space-y-2>`) com eventos. Cada `<li>` é `rounded-lg border border-border bg-surface px-4 py-3 flex items-start gap-3`:

- Quadrado 28px com ícone tonado por status (success/warn/fail)
- Linha 1: badge mono do `kind` + título
- Linha 2 (`text-muted`): detalhe
- Direita: "há {ago}" em mono muted

**Mapeamento de ícone por `kind`:**

| kind | Ícone |
|------|-------|
| `deploy` | `Rocket` |
| `rollback` | `RefreshCw` |
| `infra` | `Hammer` |
| `incident` | `AlertTriangle` |

**Mapeamento de cor do quadrado por `status`:**

| status | Cor |
|--------|-----|
| `ok` | `text-success bg-success/15` |
| `warn` | `text-warning bg-warning/15` |
| `fail` | `text-failure bg-failure/15` |

## Schemas dos dados (mockados hoje, contrato definitivo)

### `AppDetail`

```ts
type AppDetail = {
  sa: string
  squad: string
  tribo: string
  onPlat: boolean
  health: 'healthy' | 'warn' | 'fail'
  description: string
  uptime: number       // 0-100
  p95Ms: number
  errorRate: number    // 0-100
  deploys7d: number
  lastDeploy: string   // ex: "34min"
}
```

### `InfraPiece`

```ts
type InfraPiece = {
  id: string
  name: string
  type: 'EKS' | 'DynamoDB' | 'SQS' | 'S3' | 'Kafka' | 'RDS'
  engine: 'Kaptain' | 'Orkestra' | 'Pantheon' | 'Migration'
  status: 'ok' | 'degraded' | 'down'
  meta: string  // string descritiva livre
}
```

### `ApiExposed`

```ts
type ApiExposed = {
  id: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  version: string
  consumers: number
  p99: number      // ms
  sla: number      // ms
}
```

### `Repo`

```ts
type Repo = {
  id: string
  name: string         // ex: "itau/pix-core-api"
  branch: string
  lastCommit: string   // ex: "34min"
  openPrs: number
  primary: boolean
}
```

### `HistoryEvent`

```ts
type HistoryEvent = {
  id: string
  kind: 'deploy' | 'rollback' | 'infra' | 'incident'
  title: string
  detail: string
  ago: string
  status: 'ok' | 'warn' | 'fail'
}
```

### `UIClickStory`

```ts
type UIClickStory = {
  id: string                              // ex: "UIC-1234"
  type: 'feat' | 'bug' | 'chore' | 'spike' | 'debt'
  title: string
  status: 'todo' | 'in-progress' | 'review' | 'done' | 'blocked'
  assignee: { initials: string; name: string }
  updated: string                         // ex: "há 2h"
  points: number
}
```

## Componente `Sparkline`

SVG inline 120×32 sem libs externas:

```ts
function Sparkline({ values, color }) {
  // calcula min, max, range
  // converte em pontos: `${i * step},${h - ((v - min) / range) * h}`
  // renderiza <polyline fill="none" strokeWidth="1.5" />
}
```

**Cores possíveis:** success, warning, failure, info. Cada uma mapeia para uma classe Tailwind `stroke-{color}`.

`overflow-visible` no SVG para que linhas que toquem as bordas não sejam cortadas.

## Estados da página

### Estado inicial

- Tab `overview` ativa
- `app` derivado de `{ ...mock, sa: useParams().sa ?? mock.sa }`

### Troca de tab

- Click em `<button>` atualiza `tab: TabKey`
- Não há transição animada
- Estado não é persistido em URL — reload reseta para `overview`

### SA inexistente

- Hoje a tela **sempre renderiza** com o mock (apenas substitui o `sa` do header)
- Em produção: precisaria 404 ou empty state se SA não for encontrada
- **Gap conhecido:** sem tratamento de SA inválida

## Acessibilidade

- Breadcrumb e botão de voltar têm `<Link>` semântico
- `<h1>` único na tela (ID da SA)
- Cards têm `<h3>` no header de seção
- Tabs são `<button>` semânticos
- Tabela usa `<table>`, `<thead>`, `<tbody>` semânticos
- Status visual sempre acompanhado de texto ou contexto
- `<pre>` em DocPreview tem scroll interno e `font-mono` para preservar formatação de código
- **Gap conhecido:** tabs não usam `role="tablist"`/`role="tab"`/`aria-selected`
- **Gap conhecido:** linhas de tabela não são clicáveis (sem `<Link>`), só células específicas têm ações
- **Gap conhecido:** sparklines decorativos sem `aria-label` ou descrição alternativa

## Comportamento de navegação

| Origem | Destino |
|--------|---------|
| Breadcrumb "Application Hub" | `/application-hub` |
| Botão `ArrowLeft` no header | `/application-hub` |
| Click em tab | troca conteúdo (sem URL update) |
| Click em "Pausar alertas" | sem ação (botão visual) |
| Click em "Disparar workflow" | sem ação (botão visual) |
| Link "Abrir" em DocPreview | `href="#"` (placeholder) |
| Link "abrir" em ReposTab | `href="#"` (placeholder) |
| `ObsLink` | `href="#"` (placeholder) |
| Link "ver no UIClick" | `<span>` sem href real |
| Link em qualquer linha de UIClick story | sem ação real |

**Importante:** quase todos os links externos são placeholders. A tela é navegável internamente (breadcrumb + tabs) mas as integrações externas são visuais.

## Densidade visual e estilo

- Texto base: `text-[12.5px]`
- Headers de card: `text-[13.5px] font-semibold tracking-tight`
- Métricas grandes: mono `text-[16px]` (em `MetricCell`) ou `text-[20px]` (no `<h1>`)
- Labels uppercase: `text-[10.5px] tracking-wider text-text-muted`
- Badges: 9.5–10px uppercase tracking-wider
- Fonte mono usada em: IDs, paths, nomes de recursos, versões, valores numéricos de métricas
- Ícones de `lucide-react` em toda a tela
- Espaçamentos: `space-y-6` entre blocos, `gap-5` entre colunas, `space-y-4` dentro de coluna
- Tabela: `text-[12.5px]` corpo, `text-[11px]` header
- `<pre>` em DocPreview: `bg-[#0B0C10]`, `text-[10.5px]`, `font-mono leading-relaxed`

## Fora de escopo (não implementar nesta tela)

- **Fetch real da SA** — hoje sempre usa o mock estático
- **Tratamento de SA inexistente** — não há 404, sempre renderiza
- **Persistência de tab em URL** — reload reseta para overview
- **Ações reais nos botões "Pausar alertas" e "Disparar workflow"** — visuais
- **Ações reais nos links externos** (Datadog, UIClick, GitHub) — todos `href="#"`
- **Painel de saúde dos control planes** (Kaptain, Komply, Konstructor, Orkestra, Traffik, Pantheon, Migration) — feature da spec original do Hub que vive em outro lugar ou não foi implementada ainda
- **Drill-down de cada peça de infra** — coluna "ver" é placeholder
- **Edição inline** de qualquer dado (squad, descrição, etc.) — read-only
- **Filtro/busca dentro das tabs** — listas curtas, não justifica
- **Paginação** — todas as listas cabem na tela
- **Comparação entre SAs** — uma SA por vez
- **Notificações relacionadas à SA** (`ApplicationHubNotification` do schema) — UI virá em iteração futura
- **Logs/traces inline** — só links para Datadog externo
- **Métricas em tempo real via WebSocket** — sparklines são estáticos
- **Histórico paginado ou com timestamps absolutos** — apenas relativos ("há 5h")

## Critérios de aceite

### Breadcrumb e header
- [ ] Breadcrumb mostra "Application Hub > {sa}" com link funcional
- [ ] Botão `ArrowLeft` leva para `/application-hub`
- [ ] `<h1>` mostra `app.sa` em fonte mono 20px
- [ ] Badge "on-plat" aparece quando `app.onPlat === true`
- [ ] `HealthChip` aplica tons corretos por health
- [ ] Descrição limitada a 640px
- [ ] Meta: `squad · tribo · último deploy há {N}`
- [ ] Botões "Pausar alertas" e "Disparar workflow" renderizam (sem ação)

### Tabs
- [ ] 6 tabs renderizadas na ordem: Overview, Peças de infra, APIs expostas, Observabilidade, Repos, Histórico
- [ ] Tab ativa tem `border-accent` e texto primary
- [ ] Tab inativa tem texto secondary com hover
- [ ] Default: Overview ativa

### Tab Overview
- [ ] Grid `1.4fr / 1fr` em `lg:`, coluna única em mobile
- [ ] Card "Sobre esta aplicação" tem badge "sumário · agente" no header
- [ ] Spans destacados em primary nos parágrafos
- [ ] Footer do card "Sobre" mostra 6 facts
- [ ] Card "Documentos" mostra 2 `DocPreview` com `<pre>` formatado
- [ ] Card "Métricas-chave" tem 4 `MetricCell` com sparklines coloridos
- [ ] Card "UIClick" lista 7 stories com badges de tipo e status
- [ ] Coluna direita: "Infra resumida" mostra 5 itens + footer "ver na tab Infra →"
- [ ] Coluna direita: "Atalhos de observabilidade" tem ring info

### Tab Peças de infra
- [ ] Tabela com 6 colunas (Recurso, Tipo, Motor, Status, Meta, ação)
- [ ] Dot colorido por status (ok/degraded/down)
- [ ] CTA "ver" aparece em hover

### Tab APIs expostas
- [ ] Tabela com 5 colunas
- [ ] Badge de método HTTP com cor correta
- [ ] p99 fica vermelho quando `p99 > sla`

### Tab Observabilidade
- [ ] 3 cards: Datadog, Logs & traces, Status de instrumentação
- [ ] Grids 1 col mobile / 2 cols `sm:`
- [ ] Card de status mostra "Instrumentação OK"

### Tab Repos
- [ ] Tabela com 5 colunas
- [ ] Badge "primary" accent quando `r.primary === true`
- [ ] Ícone `GitPullRequest` na coluna de PRs

### Tab Histórico
- [ ] Lista vertical com `space-y-2`
- [ ] Ícone correto por `kind` (deploy/rollback/infra/incident)
- [ ] Cor do quadrado correta por `status` (ok/warn/fail)
- [ ] Timestamp relativo "há {ago}" em mono à direita

### Sparkline
- [ ] SVG 120×32 com `overflow-visible`
- [ ] `polyline` com `strokeWidth="1.5"` na cor passada
- [ ] Normaliza valores entre min e max do array

## Referências

- Implementação: `src/pages/ApplicationHubDetail.tsx`
- Listagem: `docs/specs/application-hub.md` (`/application-hub`)
- Spec original do Hub: cobre essa tela + listagem + painel de control planes
- Convenções gerais do projeto: `main.md`
- Histórico de iterações: `PROGRESS.md`