# Spec: Application Hub (Visão Geral)

## Resumo

Centro de operações pós-migração. Lista todas as aplicações on-platform com saúde agregada, métricas-chave e drill-down por SA. Ambição de longo prazo: substituir os control planes antigos como ponto único de operação da plataforma.

**Rota:** `/application-hub`
**Acesso:** usuários autenticados
**Layout base:** Sidebar + Topbar conforme contexto mestre
**Provider obrigatório:** `WorkflowsProvider`
**Esta spec cobre:** a tela de **listagem/portfolio**. O drill-down por SA (`/application-hub/:sa`) está fora do escopo deste documento — é uma página separada.

## Objetivo e contexto

A Home conduz o onboarding até concluir o pipeline. A partir daí, a SA "aparece" no Application Hub e o ciclo de vida dela passa a ser acompanhado aqui. Esta tela é o **portfolio view**:

- Quais aplicações estão on-platform?
- Como está a saúde agregada delas agora?
- Quais foram **recém-migradas** (precisam atenção especial nas primeiras horas)?
- Quais têm incidente live no momento?

A saúde profunda (sparklines, IUConfia, peças de infra, APIs expostas, integração Datadog, histórico) vive no **drill-down**, não aqui.

A tela consome `useWorkflows().applicationHubs` (state runtime no `WorkflowsProvider`), **não** dados hardcoded. O seed em `database.ts` (`applicationHubs: ApplicationHub[] = []`) é vazio — itens aparecem dinamicamente conforme workflows primários concluem.

## Layout e elementos visuais

Container `space-y-6` com blocos verticais:

### Bloco 1 — Header

Estrutura `space-y-2`:

- **Breadcrumb** (`text-[11.5px]`): "Application Hub" > "Visão geral" com `ChevronRight` separador
- **Linha responsiva** (`flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between`):
  - **Esquerda:** `<h1>` "Application Hub" em `text-[24px] font-semibold tracking-tight` + parágrafo descritivo (`text-[13px]`, máx 680px)
  - **Direita:** input de busca (`max-w-[320px]`, altura 36px, ícone `Search` absoluto à esquerda, placeholder "Buscar SA, owner, tag…")

### Bloco 2 — Conteúdo principal (3 estados mutuamente exclusivos)

A renderização depende de `isLoading` e `displayedHubs.length`. Apenas **um** dos três estados aparece:

**A. Loading** — card centralizado:
- `Loader2` accent em spin
- Texto "Consultando Application Hubs…"
- Linha mono em muted: `GET /api/application-hubs?status=completed`
- Padding generoso (`px-6 py-16`)

**B. Empty** — card pontilhado centralizado:
- Ícone `Boxes` em círculo neutro 48px
- `<h3>` "Nenhuma aplicação on-platform"
- Texto explicativo (máx 460px)

**C. Populated** — renderiza em ordem:
1. Banner "Aplicações migradas" (apenas se há `recentlyMigratedSAs`)
2. `StatRow` (4 stats agregadas)
3. Seção "Aplicações" com tabela

## Detalhamento dos componentes

### Banner "Aplicações migradas para a StackSpot"

Card success `rounded-lg border border-success/30 bg-success/[0.08] px-4 py-3`. Só aparece se `recentlyMigratedSAs.size > 0`:

- Ícone `CheckCircle2` em quadrado success 28px
- Título dinâmico: singular vs plural baseado em `recentlyMigratedSAs.size`
  - 1: "Aplicação migrada para a StackSpot"
  - N>1: "{N} aplicações migradas para a StackSpot"
- Lista de chips success com cada SA: ícone `Sparkles` + nome da SA em mono (`font-mono text-[10.5px]`)
- Sufixo: "· agora visível na lista abaixo."

### `StatRow` — métricas agregadas

Grid responsivo `grid-cols-2 sm:grid-cols-4 gap-3`. Quatro cards `Stat`:

| Label | Value | Hint | Cor |
|-------|-------|------|-----|
| Aplicações | `apps.length` | `{onPlat} on-plat` | neutro |
| Healthy | `count(health==='healthy')` | "último 5min" | success |
| Warn | `count(health==='warn')` | "último 5min" | warning |
| Fail | `count(health==='fail')` | "último 5min" | failure |

**Card `Stat`** (`rounded-lg border border-border bg-surface px-4 py-3`):
- Label uppercase 11px muted
- Value em fonte mono `text-[20px]`, cor pela prop `color`
- Hint 11px muted

### Seção "Aplicações" — tabela

**Header da seção** (`flex items-center justify-between mb-3`):
- Esquerda: `<h2>` "Aplicações" (`text-[15px]`) + contagem `{N} on-platform` em muted
- Direita: botão "ver todas" (link visual, sem ação implementada)

**Tabela** dentro de `rounded-lg border border-border bg-surface overflow-hidden`. Colunas:

| Col | Header | Conteúdo | Align |
|-----|--------|----------|-------|
| 1 | Aplicação | Nome + badges + SA em mono | esquerda |
| 2 | Squad | `a.squad` | esquerda |
| 3 | Saúde | `HealthPill` + pulse live se aplicável | esquerda |
| 4 | Uptime | `{uptime.toFixed(2)}%` mono | direita |
| 5 | p95 | `{p95Ms}ms` mono | direita |
| 6 | Erro % | `{errorRate.toFixed(2)}%` mono na cor do health | direita |
| 7 | Deploys 7d | `{deploys7d}` mono | direita |
| 8 | (ação) | "detalhe" + `ArrowRight` em hover | direita |

**Header da tabela:** `bg-[#101115]` com texto uppercase tracking-wider muted, 11px, `font-medium`.

**Linhas:**
- `border-b border-border last:border-b-0`
- `hover:bg-[#181A1F]`
- `group` para revelar CTA "detalhe" em `group-hover:opacity-100`
- **Toda a célula da Aplicação** é um `<Link to={`/application-hub/${a.sa}`}>` (área clicável ampla)
- Cada linha completa também leva ao drill-down via CTA "detalhe" na última coluna

**Célula "Aplicação":**
- Linha 1: nome (`a.name`) + badges condicionais:
  - Badge "on-plat" accent (`border-accent/30 bg-accent/10 text-accent`) se `a.onPlat`
  - Badge "recém-migrada" success com `Sparkles` se `recentlyMigratedSAs.has(a.sa)`
- Linha 2: `a.sa` em mono muted 10.5px

**Célula "Saúde":**
- `HealthPill` (pílula com dot + label)
- Se `a.liveIncident`, ao lado: `LivePulse` (dot failure pulsante) + texto "live" uppercase failure

### `HealthPill`

Pílula rounded-full com dot + label uppercase:

| Status | Borda + Background + Texto | Dot |
|--------|---------------------------|-----|
| `healthy` | `border-success/30 bg-success/10 text-success` | `bg-success` |
| `warn` | `border-warning/30 bg-warning/10 text-warning` | `bg-warning` |
| `fail` | `border-failure/30 bg-failure/10 text-failure` | `bg-failure` |

### `LivePulse`

Indicador 1.5px (sem tamanho ajustável) com duas camadas:
- Círculo absoluto com `animate-pulse-live bg-failure opacity-80`
- Círculo sólido `bg-failure` em foreground

## Schema — `ApplicationHub`

Vive em `data/database.ts`. Tipo runtime:

```ts
type ApplicationHub = {
  id: string              // `ahub-<sa>` — chave estrangeira em notificações
  sa: string              // ID da SA Itaú, usado como slug em URLs
  name: string            // nome amigável derivado (ssa-pix-core → "Pix Core")
  projectId: string       // projeto agregador
  squad: string
  onPlat: boolean
  health: 'healthy' | 'warn' | 'fail'
  liveIncident: boolean
  uptime: number          // 0-100, formatado com 2 casas
  p95Ms: number
  errorRate: number       // 0-100, formatado com 2 casas
  deploys7d: number
  status: 'completed' | (outros)  // usado pelo filtro de query simulada
}
```

## Schema — `ApplicationHubNotification`

Modelado em `database.ts` para futuras notificações relacionadas a hubs:

```ts
type ApplicationHubNotification = {
  id: string
  icon: string                 // nome de ícone lucide
  title: string
  description: string
  cta: string
  link: string
  applicationHubId: string     // FK para ApplicationHub.id
  projectId: string
}
```

Seed atual: `notif-hml-provisioned-ssa-pix-core` (HML provisionada, CTA "Ver saúde em HML"). **Ainda não renderizado nesta tela** — surfará no sino da topbar ou na Home em iteração futura.

## Lógica de negócio

### Query simulada de hubs

```ts
const [isLoading, setIsLoading] = useState(true)
const [displayedHubs, setDisplayedHubs] = useState<ApplicationHub[]>([])

useEffect(() => {
  setIsLoading(true)
  const timer = window.setTimeout(() => {
    setDisplayedHubs(applicationHubs.filter((h) => h.status === 'completed'))
    setIsLoading(false)
  }, QUERY_LATENCY_MS)  // 600ms
  return () => window.clearTimeout(timer)
}, [applicationHubs])
```

- **Latência fixa de 600ms** simula uma query backend real (constante `QUERY_LATENCY_MS`)
- **Filtro:** apenas hubs com `status === 'completed'`. Não cruza mais com `workflows` — o estado do hub é canônico
- **Reatividade:** o effect re-roda quando `applicationHubs` muda (novo hub é provisionado), e a query é re-executada com loading

### Gating de criação (acontece no Provider, não nesta tela)

`WorkflowsProvider.advanceStep` cria o hub via `buildHubFromTemplate(template)` quando o workflow **primário** atinge o último step. Guarda:

```ts
if (!executionTemplateIds.has(template.id)) {
  // só primários disparam criação de hub
}
```

Isso garante que execuções (`migrationExecutionWorkflow`, `hmlPromotionWorkflow`) NÃO criam hubs novos. Dedupe é feito por `hub.id` no provider.

### Cálculo de `recentlyMigratedSAs`

```ts
const recentlyMigratedSAs = new Set(
  workflows
    .filter((w) => w.status === 'completed')
    .map((w) => {
      const saInput = w.name.match(/ssa-[a-z0-9-]+/i)
      return saInput ? saInput[0] : 'ssa-pix-core'
    }),
)
```

- Pega todos os workflows com `status === 'completed'`
- Extrai o ID da SA via regex `/ssa-[a-z0-9-]+/i` sobre `w.name`
- Fallback: `'ssa-pix-core'` se a regex não bater
- Resulta em `Set<string>` para lookup O(1) no rendering da tabela e do banner

### Decisão de qual estado renderizar

```
if (isLoading)              → Loading state
else if (no hubs)           → Empty state
else                        → Populated (banner + StatRow + tabela)
```

Mutuamente exclusivos. Nunca aparecem dois ao mesmo tempo.

## Estados da página

### Estado inicial (mount)

- `isLoading: true`
- Renderiza skeleton de loading com mensagem mono fake da request
- Após 600ms, transiciona para Empty ou Populated

### Estado vazio

- `applicationHubs.length === 0` OU nenhum com `status === 'completed'`
- Card pontilhado com `Boxes` + mensagem explicativa
- Nenhum stat row, nenhuma tabela

### Estado populado

- Banner verde (se há recém-migradas) → StatRow → tabela
- Tabela ordenada na ordem natural do array (sem sort UI)

### Estado de novo hub adicionado mid-sessão

- O `useEffect` re-roda por mudança em `applicationHubs`
- Loading volta a aparecer por 600ms
- Após latência, novo hub aparece na tabela
- Se foi adicionado por workflow concluído, vira parte de `recentlyMigratedSAs` → banner + badge

### Estado com incidente live

- `a.liveIncident === true`
- Coluna "Saúde" mostra `HealthPill` + `LivePulse` + texto "live" failure ao lado
- Não bloqueia nem destaca a linha além do indicador local

## Acessibilidade

- Breadcrumb usa texto + `ChevronRight` decorativo
- Input de busca tem `placeholder` mas **sem `<label>` visível nem `aria-label`** — gap conhecido a corrigir em iteração futura
- Tabela usa `<table>` semântico com `<thead>` e `<tbody>`
- Linhas clicáveis: célula da SA é `<Link>`, não `<div onClick>`
- Status visual sempre acompanhado de texto (não depende só de cor)
- `LivePulse` é decorativo — informação vem do texto "live" adjacente
- `aria-live` para mudanças de estado de loading não implementado — outro gap conhecido

## Comportamento de navegação

| Origem | Destino |
|--------|---------|
| Click no nome da aplicação (linha 1) | `/application-hub/{a.sa}` |
| Click no CTA "detalhe" (última coluna em hover) | `/application-hub/{a.sa}` |
| Click em "ver todas" no header | sem ação (placeholder) |
| Input de busca | sem ação implementada (placeholder) |
| Click em chip de SA no banner | sem ação (apenas decorativo) |

## Densidade visual e estilo

- Texto da tabela: `text-[12.5px]`
- Header da tabela: `text-[11px] uppercase tracking-wider`
- Métricas numéricas: sempre em fonte mono
- IDs (`ssa-pix-core`): sempre em fonte mono muted (10.5px)
- Badges: 9.5–10.5px uppercase tracking-wider
- Espaçamento entre blocos: `space-y-6`
- Padding interno da tabela: `px-4 py-2.5`
- Ícones de `lucide-react` em toda a tela
- Loading message inclui uma linha simulando a query (`GET /api/application-hubs?status=completed`) para reforçar a sensação de "tela conectada a backend real"

## Fora de escopo (não implementar nesta tela)

- **Drill-down por aplicação** — vive em `/application-hub/:sa`, é tela separada (Overview, Peças de Infra, APIs Expostas, Integração com Observabilidade, Links de Repos, Histórico)
- **Painel de saúde dos control planes** (Kaptain, Komply, Konstructor, Orkestra, Traffik, Pantheon, Migration) — feature documentada na spec original mas ainda não implementada; quando vier, fica em seção separada nesta tela ou em rota própria
- **Renderização de `ApplicationHubNotification`** — tipo já existe no schema mas a UI dele virá em iteração futura (sino da topbar ou Home)
- **Busca funcional** — input visual existe mas não filtra a tabela
- **Filtro por health/squad/onPlat** — fora do escopo do MVP
- **Ordenação clicando em colunas** — ordem é a natural do array
- **Paginação** — vitrine pequena, não justifica
- **CTA "ver todas"** — botão visual sem ação
- **Sparklines inline ou donuts** — só métricas numéricas; gráficos ficam no drill-down
- **Atalhos para observabilidade externa** (Datadog, etc.) — ficam no drill-down
- **Edição de owner/squad/tags** — read-only

## Critérios de aceite

### Header
- [ ] Breadcrumb mostra "Application Hub > Visão geral"
- [ ] `<h1>` "Application Hub" em `text-[24px]`
- [ ] Parágrafo descritivo limitado a 680px
- [ ] Input de busca com ícone `Search` à esquerda, max-width 320px

### Loading state
- [ ] Aparece por exatamente 600ms na primeira renderização
- [ ] Mostra `Loader2` em spin, texto "Consultando Application Hubs…" e linha mono `GET /api/...`
- [ ] Re-aparece sempre que `applicationHubs` muda

### Empty state
- [ ] Aparece quando `displayedHubs.length === 0` (após loading)
- [ ] Card com borda dashed, ícone `Boxes`, título e texto explicativo
- [ ] Nenhum banner, StatRow ou tabela renderizados neste estado

### Banner "recém-migradas"
- [ ] Só aparece quando `recentlyMigratedSAs.size > 0`
- [ ] Singular/plural correto no título
- [ ] Cada SA aparece como chip mono com ícone `Sparkles`
- [ ] Sufixo "· agora visível na lista abaixo."

### StatRow
- [ ] Grid 2x2 em mobile, 4 colunas em `sm:`
- [ ] Valores: total / healthy / warn / fail derivados de `displayedHubs`
- [ ] Hint "Aplicações" mostra `{onPlat} on-plat`
- [ ] Cores: total neutro, healthy success, warn warning, fail failure

### Tabela
- [ ] 8 colunas com headers conforme tabela acima
- [ ] Header `bg-[#101115]`, texto 11px uppercase muted
- [ ] Linhas têm `hover:bg-[#181A1F]` e classe `group`
- [ ] Nome da aplicação é `<Link>` para `/application-hub/{a.sa}`
- [ ] Badge "on-plat" aparece se `a.onPlat === true`
- [ ] Badge "recém-migrada" aparece se `recentlyMigratedSAs.has(a.sa)`
- [ ] SA aparece em mono muted abaixo do nome
- [ ] `HealthPill` renderiza com tons corretos por status
- [ ] `LivePulse` + texto "live" aparece quando `a.liveIncident`
- [ ] Métricas numéricas alinhadas à direita em mono
- [ ] Erro % usa a cor do health (success/warning/failure)
- [ ] CTA "detalhe" aparece em hover (`group-hover:opacity-100`)

### Lógica
- [ ] Query simulada filtra por `status === 'completed'`
- [ ] `recentlyMigratedSAs` extrai ID da SA via regex `/ssa-[a-z0-9-]+/i`
- [ ] Fallback `'ssa-pix-core'` quando regex não bate
- [ ] Provider é fonte canônica — sem array hardcoded

## Referências

- Implementação: `src/pages/ApplicationHub.tsx`
- Dados: `src/data/database.ts` (`ApplicationHub`, `ApplicationHubHealth`, `applicationHubs`, `ApplicationHubNotification`)
- Provider: `src/contexts/WorkflowsProvider.tsx` (`applicationHubs`, `advanceStep`, `buildHubFromTemplate`)
- Tela de drill-down: `/application-hub/:sa` (spec separada)
- Tela que alimenta este hub: `docs/specs/home.md`
- Catálogo que dispara o onboarding: `docs/specs/assets-catalog.md`
- Convenções gerais do projeto: `main.md`
- Histórico de iterações: `PROGRESS.md`