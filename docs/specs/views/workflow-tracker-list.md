# Spec: Workflow Tracker — Lista

## Resumo

Lista de execuções agênticas em andamento. Mostra apenas **execuções ligadas** (pipelines disparados por workflows primários), permitindo filtro por status, paginação e ação direta para avançar/concluir steps inline.

**Rota:** `/workflows`
**Acesso:** usuários autenticados
**Layout base:** Sidebar + Topbar conforme contexto mestre
**Provider obrigatório:** `WorkflowsProvider` (para `workflows` e `advanceStep`)
**Esta spec cobre:** a tela de **listagem**. O detalhe (`/workflows/:id`) é uma spec separada.

## Objetivo e contexto

O Workflow Tracker é onde o usuário acompanha o que **está acontecendo agora** na plataforma. Diferente do `/catalog` (vitrine de definições) e da `/` (sua jornada de onboarding pessoal), o tracker mostra **execuções concretas** de pipelines que foram disparados.

A regra arquitetural mais importante: **só execuções ligadas aparecem aqui**. Workflows primários de onboarding (como `wf-migration-vanilla`) NÃO entram na listagem — eles vivem na Home como checklist. As execuções que aparecem aqui são as que foram disparadas por triggers de step (ex.: `migrationExecutionWorkflow`, `hmlPromotionWorkflow`).

Por que: a Home conduz o usuário; o Tracker observa o pipeline. Misturar os dois confunde o "o que devo fazer" com "o que está rodando".

## Layout e elementos visuais

Container `space-y-5` com três blocos verticais:

### Bloco 1 — Header

Estrutura `space-y-2`:

- **Breadcrumb** (`text-[11.5px]`): "Workflow Tracker" > "Workflows" com `ChevronRight` separador
- **Linha responsiva** (`flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between`):
  - **Esquerda:** `<h1>` "Workflows" em `text-[24px] font-semibold tracking-tight` + subtítulo "Acompanhe execuções agênticas em tempo real" (`text-[13px] text-text-secondary`)
  - **Direita:** indicador `live · {N} ativos` em pílula `border-live/30 bg-live/10 text-live` com dot pulsante (`animate-pulse-live`)

`{N}` é `activeCount` = soma de execuções com status `running` ou `awaiting`.

### Bloco 2 — Barra de filtros sticky

Container `sticky top-14 z-10 -mx-8 border-b border-border bg-bg/85 px-8 py-2.5 backdrop-blur`. **Importante:** usa `-mx-8 px-8` para que o background ocupe a largura total quando a coluna principal tem padding lateral, sem quebrar a sensação visual da sidebar.

Conteúdo: `flex flex-wrap items-center gap-1.5`:

- Label "STATUS" uppercase 10.5px muted
- Chips de status (5, ver tabela abaixo) toggláveis
- Botão "limpar" com ícone `X` (apenas se há filtro ativo)
- Contador à direita (`ml-auto`): `"{filtrado} de {total}"`

### Bloco 3 — Conteúdo principal

Renderização condicional:

**A. Empty state** quando `rows.length === 0` (nenhuma execução existe ainda)
**B. Tabela** quando há execuções (mesmo que filtro deixe 0 visíveis — nesse caso, a tabela aparece com linha "nenhum corresponde aos filtros")

## Detalhamento dos componentes

### Chips de filtro de status

Cada chip é um `<button>` togglável. Cinco chips na ordem fixa:

| Status | Label | Cor (ativo) | Ícone (estático) |
|--------|-------|-------------|------------------|
| `running` | "running" | `border-info/30 bg-info/10 text-info` | `Loader2` info |
| `success` | "success" | `border-success/30 bg-success/10 text-success` | `CheckCircle2` success |
| `failed` | "failed" | `border-failure/30 bg-failure/10 text-failure` | `XCircle` failure |
| `awaiting` | "awaiting human" | `border-warning/30 bg-warning/10 text-warning` | `Loader2` warning |
| `cancelled` | "cancelled" | `border-border bg-bg text-text-muted` | `CircleSlash` muted |

**Estado inativo:** `border-border bg-surface text-text-secondary`. Em hover: texto vira `text-text-primary`.

**Importante:** o ícone aparece **estático mesmo em `running` e `awaiting`** (prop `staticIcon={true}` no `StatusIcon`). Animação de spin fica reservada para os ícones na linha da tabela.

**Default ativo:** `Set(['running'])`. Usuário já abre vendo execuções em curso.

**Botão "limpar":** `inline-flex` com ícone `X`. Aparece apenas se `statusFilter.size > 0`. Click reseta o set para vazio.

**Toggle:** click adiciona/remove do `Set<Status>`. Reset de página para 0 após cada toggle.

### Filtro vazio (set vazio)

Quando `statusFilter.size === 0`, **todas as linhas aparecem** (sem filtro). Não é "esconder tudo". O contador mostra `total de total`.

### Tabela

Wrapper `overflow-hidden rounded-lg border border-border bg-surface`.

**Header** `bg-[#101115]`, texto `text-[11px] uppercase tracking-wider text-text-muted`. Colunas:

| Col | Header | Width | Align |
|-----|--------|-------|-------|
| 1 | (vazio — ícone de status) | `w-10` | esquerda |
| 2 | Nome | flex | esquerda |
| 3 | Step atual | flex | esquerda |
| 4 | Duração | — | direita |
| 5 | Custo (R$) | — | direita |
| 6 | Ação | — | direita |

**Linhas:**
- `cursor-pointer border-b border-border last:border-b-0`
- `hover:bg-[#181A1F]`
- `onClick={() => navigate('/workflows/{w.id}')}`

**Célula 1 — Ícone de status (size=5, h-5 w-5):**
- `success` → `CheckCircle2` success
- `failed` → `XCircle` failure
- `cancelled` → `CircleSlash` muted
- `running` → `Loader2` info **com `animate-spin`**
- `awaiting` → `Loader2` warning **sem spin** (estático)

**Célula 2 — Nome:**
- Linha 1: `w.templateName` em fonte mono (`font-mono text-text-primary`)
- Linha 2 (`text-[11px] text-text-muted`): `w.id` mono · `w.templateId` mono

**Célula 3 — Step atual:**
- Badge mono `{stepIdx}/{w.steps.length}` em muted
- Texto `currentStepLabel(w)` em secondary

Lógica do `stepIdx`:
```ts
const stepIdx =
  w.status === 'completed'
    ? w.steps.length
    : Math.min(w.currentStepIndex + 1, w.steps.length)
```

Lógica do `currentStepLabel`:
- `status === 'completed'` → "completed"
- `status === 'failed'` → "falhou"
- senão → `w.steps[w.currentStepIndex].title` ou "—"

**Célula 4 — Duração:**
- `formatDuration(w.startedAt)` em mono
- Faixas:
  - `< 60s` → `"{N}s"`
  - `< 1h` → `"{M}m {SS}s"`
  - `≥ 1h` → `"{H}h {MM}m"`
  - inválido/negativo → `"—"`

**Célula 5 — Custo (R$):**
- Sempre `"—"` em mono muted (não implementado, placeholder visual)

**Célula 6 — Ação:**
- Se `status === 'completed' || 'failed'`: texto "encerrado" uppercase muted
- Senão: botão accent com ícone `Check`:
  - Label "Concluir" se `currentStepIndex >= steps.length - 1`
  - Label "Avançar" caso contrário
  - `onClick`: `e.stopPropagation()` + `advanceStep(w.id)`
  - **Crítico:** sem `stopPropagation`, click dispara navegação da linha

### Linha "nenhum corresponde aos filtros"

Quando `pageRows.length === 0` mas `rows.length > 0`:

```jsx
<tr>
  <td colSpan={6} className="px-4 py-12 text-center text-[12px] text-text-muted">
    Nenhum workflow corresponde aos filtros aplicados.
  </td>
</tr>
```

Mantém a tabela visível com o footer de paginação para evitar layout shift.

### Paginação

Footer da tabela em `border-t border-border px-3 py-2.5 text-[11.5px]`. Layout `flex items-center justify-between`:

- **Esquerda:** "Página {page+1} de {totalPages}" com números em mono
- **Direita:** botões "anterior" e "próxima" com chevrons (`ChevronsLeft`, `ChevronsRight`)

**Cálculos:**
```ts
const PAGE_SIZE = 6
const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
const pageRows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
```

**Comportamento:**
- "anterior" desabilitado quando `page === 0` (opacidade 40%)
- "próxima" desabilitado quando `page >= totalPages - 1`
- Toggle de filtro **reseta página para 0** (evita ficar numa página que não existe mais)

### Empty state (sem nenhuma execução)

Card pontilhado centralizado quando `rows.length === 0`:

- Ícone `Boxes` em círculo neutro 48px
- `<h3>` "Nenhuma execução em andamento"
- Texto explicativo (máx 420px): "Execuções aparecem aqui quando um workflow de onboarding lança seu pipeline ligado (ex.: ao concluir o step "Lançar workflow de onboarding" na Home)."
- CTA accent "Voltar para a Home" → `/`

**Decisão importante:** o empty state direciona para **Home, não Catalog**. Execuções nascem na Home (via trigger de step), não no Catalog (que é vitrine).

## Schema — `WorkflowInstance` (relevantes para a lista)

Vive em `WorkflowsProvider`:

```ts
type WorkflowStatus = 'draft' | 'running' | 'awaiting' | 'completed' | 'failed'

type WorkflowInstance = {
  id: string
  templateId: string
  templateName: string
  status: WorkflowStatus
  steps: Array<{ id, title, status, ... }>
  currentStepIndex: number
  startedAt: string  // ISO datetime
  // ...outros campos
}
```

## Mapeamento `WorkflowStatus → Status` (local)

O tipo `Status` da tela tem 5 valores; o `WorkflowStatus` do provider tem 5 valores ligeiramente diferentes. Função `mapStatus`:

```ts
function mapStatus(s: WorkflowStatus): Status {
  if (s === 'completed') return 'success'
  if (s === 'failed') return 'failed'
  if (s === 'awaiting') return 'awaiting'
  return 'running'  // 'draft' e 'running' viram 'running'
}
```

Note que `cancelled` é um valor de `Status` que **nunca é produzido pelo `mapStatus`** — existe como filtro UI (preparado para o futuro) mas hoje nenhuma execução chega nesse estado.

## Lógica de negócio

### Filtragem das execuções ligadas

```ts
const rows = useMemo(
  () =>
    workflows
      .filter((w) => executionTemplateIds.has(w.templateId))
      .map((w) => ({
        instance: w,
        status: mapStatus(w.status),
      })),
  [workflows],
)
```

**`executionTemplateIds`** é um `Set<string>` em `data/database.ts` contendo os IDs de templates considerados "execução ligada" (`wf-onboarding-vanilla-exec`, `wf-promote-hml`, etc.). Workflows primários (`wf-migration-vanilla`) ficam fora.

### Filtragem por status

```ts
const filtered = useMemo(() => {
  if (statusFilter.size === 0) return rows
  return rows.filter((r) => statusFilter.has(r.status))
}, [rows, statusFilter])
```

Set vazio = sem filtro (mostra tudo). Set com itens = mostra só os matches.

### Avanço de step inline

```ts
<button
  onClick={(e) => {
    e.stopPropagation()
    advanceStep(w.id)
  }}
>
  {w.currentStepIndex >= w.steps.length - 1 ? 'Concluir' : 'Avançar'}
</button>
```

O `advanceStep` no provider é a mesma função usada pela Home. Aqui ela é exposta inline para que SREs/devs possam destravar pipelines sem precisar entrar no detalhe de cada um.

**`stopPropagation` é obrigatório** — sem ele, o click no botão também dispara a navegação da linha, levando o usuário para o detalhe em vez de avançar o step.

## Estados da página

### Estado inicial (mount)

- `statusFilter: Set(['running'])` — filtro running ativo
- `page: 0`
- Tabela já filtrada por running

### Estado "nenhuma execução existe"

- `rows.length === 0`
- Empty state com CTA para Home
- Barra de filtros e header continuam visíveis (sem desaparecer)

### Estado "execuções existem mas nada visível por filtro"

- `rows.length > 0` mas `pageRows.length === 0`
- Tabela visível com linha "Nenhum workflow corresponde aos filtros aplicados"
- Footer de paginação visível mas com `Página 1 de 1`

### Estado "limpar filtros"

- Click em "limpar" → `statusFilter = new Set()`
- Todas as execuções aparecem
- Botão "limpar" some
- Filtros ficam todos em estado inativo

### Estado "execução conclui mid-sessão"

- Provider atualiza `workflows`
- `useMemo` recalcula `rows`
- Indicador "live · N ativos" decrementa
- Linha pode sair da view se filtro `running` estava ativo e ela virou `success`

## Acessibilidade

- Breadcrumb usa texto + `ChevronRight` decorativo
- Chips de filtro são `<button>` semânticos
- Linha da tabela é `<tr onClick>` — pragmático mas **não ideal**; trade-off para preservar área clicável ampla
- Botão "Avançar/Concluir" tem `type="button"` explícito (evita comportamento de submit dentro de form)
- Ícones de status sempre acompanhados de texto ou contexto da linha (não dependem só de cor)
- Loading spinner em `running` tem `animate-spin` — pode causar fadiga visual se houver muitas execuções; aceito no MVP
- `aria-label` em chips de filtro não implementado — gap conhecido

## Comportamento de navegação

| Origem | Destino |
|--------|---------|
| Click em qualquer área da linha (exceto botão Ação) | `/workflows/{w.id}` |
| Click no botão "Avançar"/"Concluir" | `advanceStep(w.id)` — sem navegação |
| CTA "Voltar para a Home" no empty state | `/` |
| Chip de filtro | toggle local + reset de página |
| Botão "limpar" | reset filtros + reset página |
| Botão "anterior" / "próxima" | troca de página |

## Densidade visual e estilo

- Tabela é densa: `text-[12.5px]` no corpo, `text-[11px]` no header
- Padding das células: `px-3 py-3` no body, `px-3 py-2.5` no header
- IDs, identificadores e métricas numéricas em fonte mono
- Labels de status em `uppercase tracking-wide`
- Chips de filtro com `gap-1.5` entre si
- Filtros sticky com `backdrop-blur` para preservar legibilidade ao rolar
- Ícones de `lucide-react` em toda a tela

## Fora de escopo (não implementar nesta tela)

- **Painel lateral direito colapsável** com preview e mini-timeline (mencionado na spec original mas não implementado — viraria duplicação do drill-down)
- **Botões "Replay" e "Ver detalhe completo"** no painel lateral
- **Coluna Custo (R$)** com valores reais — hoje é placeholder `"—"`
- **Infinite scroll** — paginação clássica de 6 por página
- **Sort por coluna** — ordem natural do array
- **Filtro por template ou owner** — só status
- **Busca textual** — fora do escopo
- **Cancelar execução inline** — só avançar/concluir
- **Bulk actions** (avançar múltiplos de uma vez) — uma execução por vez
- **Workflows primários na listagem** — separação arquitetural deliberada
- **Notificações push de conclusão** — não há toast/sino integrado aqui
- **Filtros persistidos em URL** — estado só na memória; reload reseta para `Set(['running'])`

## Critérios de aceite

### Header
- [ ] Breadcrumb mostra "Workflow Tracker > Workflows"
- [ ] `<h1>` "Workflows" em `text-[24px]`
- [ ] Subtítulo "Acompanhe execuções agênticas em tempo real"
- [ ] Indicador "live · N ativos" com `N = running + awaiting`
- [ ] Dot pulsante com `animate-pulse-live` no indicador

### Barra de filtros
- [ ] 5 chips renderizados em ordem: running, success, failed, awaiting, cancelled
- [ ] Ícones corretos por status (sempre estáticos)
- [ ] Default: `running` ativo
- [ ] Toggle adiciona/remove do Set e reseta página para 0
- [ ] Botão "limpar" aparece apenas se há filtro ativo
- [ ] Contador "{filtrado} de {total}" à direita
- [ ] Sticky no topo com `backdrop-blur`

### Tabela — header e linhas
- [ ] 6 colunas com headers conforme tabela
- [ ] Header em `bg-[#101115]` uppercase muted
- [ ] Cada linha é `cursor-pointer` com hover
- [ ] Click na linha navega para `/workflows/{w.id}`

### Tabela — célula de status
- [ ] Ícone correto por status mapeado
- [ ] `running` tem `animate-spin`
- [ ] `awaiting` não tem spin
- [ ] Tamanho `h-5 w-5` (size=5)

### Tabela — célula Nome
- [ ] `templateName` em mono primary
- [ ] `id` + `templateId` em mono muted abaixo
- [ ] Separador `·` entre id e templateId

### Tabela — célula Step atual
- [ ] Badge `stepIdx/total` mono muted
- [ ] `stepIdx = steps.length` quando `completed`
- [ ] `stepIdx = min(currentStepIndex+1, steps.length)` caso contrário
- [ ] Label correto via `currentStepLabel`: "completed", "falhou", ou título do step

### Tabela — célula Duração
- [ ] `formatDuration(startedAt)` em mono
- [ ] Formato correto por faixa (s / m s / h m)
- [ ] `"—"` para timestamps inválidos ou negativos

### Tabela — célula Custo
- [ ] Sempre `"—"` em mono muted

### Tabela — célula Ação
- [ ] "encerrado" muted quando status `completed` ou `failed`
- [ ] Botão "Avançar" quando há mais steps
- [ ] Botão "Concluir" quando é o último step
- [ ] `stopPropagation` no click do botão
- [ ] Botão chama `advanceStep(w.id)`

### Filtragem e listagem
- [ ] Apenas execuções com `templateId ∈ executionTemplateIds` aparecem
- [ ] Set vazio = mostra tudo (não esconde tudo)
- [ ] Linha "nenhum corresponde" aparece quando filtro filtra tudo

### Paginação
- [ ] `PAGE_SIZE = 6`
- [ ] Footer mostra "Página N de M" com números em mono
- [ ] Botão "anterior" desabilitado em página 0
- [ ] Botão "próxima" desabilitado na última página

### Empty state
- [ ] Aparece quando `rows.length === 0` (não quando filtro vazia tudo)
- [ ] Ícone `Boxes`, título "Nenhuma execução em andamento"
- [ ] Texto menciona explicitamente a Home como origem
- [ ] CTA "Voltar para a Home" leva para `/`

## Referências

- Implementação: `src/pages/WorkflowTrackerList.tsx`
- Detalhe: `/workflows/:id` — `src/pages/WorkflowTrackerDetail.tsx` (spec separada)
- Provider: `src/contexts/WorkflowsProvider.tsx` (`workflows`, `advanceStep`, `WorkflowStatus`, `WorkflowInstance`)
- Dados: `src/data/database.ts` (`executionTemplateIds`, `migrationExecutionWorkflow`, `hmlPromotionWorkflow`)
- Tela que origina as execuções: `docs/specs/home.md`
- Vitrine de templates: `docs/specs/assets-catalog.md`
- Convenções gerais do projeto: `main.md`