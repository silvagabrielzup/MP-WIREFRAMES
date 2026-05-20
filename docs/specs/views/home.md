# Spec: Home

## Resumo

Tela inicial do Management Plane. É a porta de entrada do usuário no portal e
concentra três responsabilidades, nesta ordem de prioridade visual:

1. **Onboarding da Migração Vanilla** — checklist sequencial que conduz o
   desenvolvedor do "nunca usei a plataforma" até "tenho uma SA rodando ON-PLAT".
2. **Status da migração em curso** — quando o workflow primário está ativo,
   um alerta no topo reflete o estado server-side (idle / running / awaiting /
   failed / completed).
3. **Pontos de atenção** — fluxos agênticos pendentes de aprovação humana
   listados em card lateral, com link direto para o Workflow Tracker.

A Home **não é dashboard**. Não há métricas agregadas, nem gráficos, nem
contadores de saúde. Toda informação vem do estado do `WorkflowsProvider` —
não há dado mockado dentro de componentes (ver [main.md](../../../specs/main.md)
§1: tudo passa por `database.json`).

**Rota:** `/`
**Layout base:** Sidebar fixa (240px) + Topbar conforme [master context](../../../specs/views/00-master-context.md)
**Provider obrigatório:** `WorkflowsProvider` (ver [worflow-context.md](../context/worflow-context.md))

## Layout

Coluna única dentro do conteúdo principal (max-width ~1400px), três seções
verticais com `space-y-10` entre elas:

```
┌────────────────────────────────────────────────────┐
│ Hero — saudação + subtítulo dinâmico               │
├────────────────────────────────────────────────────┤
│ Seção 2 — Onboarding (3 estados mutuamente excl.)  │
│   A) Placeholder · sem workflow ativo              │
│   B) Em progresso · alert + checklist              │
│   C) Concluído · CongratsAlert                     │
├────────────────────────────────────────────────────┤
│ Seção 3 — Fluxos agênticos pendentes               │
└────────────────────────────────────────────────────┘
```

### Seção 1 — Hero

Bloco simples, **sem card**, sem borda, sem fundo:

- `<h1>` com saudação: "Bom dia, Luigi" (fixa nesta versão da POC)
- Subtítulo `text-text-secondary` em texto secundário:
  - Sem workflow ativo: "Sem workflows ativos no momento — escolha um workflow no Assets Catalog para começar."
  - Com workflow ativo: "Onboarding da Migração Vanilla em curso · passo {idx+1} de {total}."
  - Concluído: "Migração concluída. Sua SA está ON-PLAT."

### Seção 2 — Onboarding

Renderiza **um de três estados**, derivados do `WorkflowsProvider`:

**A. Placeholder** — quando não existe instância ativa de Migração Vanilla.
Conteúdo definido em [placeholder.md](../placeholder/placeholder.md): título,
descrição e ícone centralizados, com CTA primário "Ir para o Assets Catalog"
linkando para `/assets-catalogs`.

**B. Em progresso** — quando `workflow.slug === 'wf-migration-vanilla'` e
algum step ainda não está concluído. Renderiza, em coluna vertical com
`gap-3`:

1. **Alert de status da migração** — faixa horizontal acima do card, conforme
   variantes em [onboarding-card.md](../components/onboarding-card.md) §"Alert de status".
2. **Card de Checklist de Onboarding** — TODO list de 5 steps com expand/copy/check.
   Estrutura completa, anatomia de row, sub-conteúdos de cada step e regras de
   acessibilidade vivem em [onboarding-card.md](../components/onboarding-card.md)
   §"Card Principal — Checklist de Onboarding da Migração".

**C. Concluído** — quando todos os steps do workflow primário têm
`isCompleted === true`. Substitui o checklist por um `CongratsAlert`:

- Card `rounded-lg border border-success/40 bg-gradient-to-br from-success/15 via-accent/10 to-bg`
- Ícone `PartyPopper` centralizado em círculo `bg-success/15`
- Título "Parabéns, Luigi!" + texto referenciando o `saName` selecionado
- Badges: `{totalSteps} passos`, `migração concluída`, `SA ON-PLAT`
- CTA primário "Ver Workflow Tracker" → `/workflows-trackers`
- CTA secundário "Ver Assets Catalog" → `/assets-catalogs`

### Seção 3 — Fluxos agênticos pendentes

Card único `rounded-lg border border-border bg-surface` com header e lista.
A Home **não** mostra mais "Alertas da Application Hub" — esse conceito saiu
do escopo do MVP (sidebar atual tem apenas Home, Workflow Tracker e Assets
Catalog, conforme [README](../README.md)).

**Header** (`border-b border-border`):

- Esquerda: ícone `Sparkles` em `text-accent` + título "Fluxos agênticos pendentes aprovação"
  em `text-[13.5px] font-semibold`.
- Direita: badge `{N} aguardando` em tom warning, **apenas quando há itens**.

**Linha** — cada item é um `<Link to={'/workflows-trackers/{workflowInstanceId}'}>` com
hover sutil (`hover:bg-bg/40`):

- Badge `Sparkles` em círculo accent (28px). Quando `Date.now() - createdAt < 60_000ms`,
  um `live dot` cyan pulsante (`bg-live animate-pulse-live`) aparece no canto superior direito.
- Linha 1: título do step + badge "agêntico" (uppercase, accent) + timing relativo (`formatRelativeAgo`).
- Linha 2: `prTitle` em `font-mono`.
- Linha 3: `prSummary` em `line-clamp-2`.
- Linha 4 (meta): `prAuthor` · `FileText` `{filesChanged}` arquivos · `+{linesAdded}` success ·
  `−{linesRemoved}` failure · `workflowName`.
- Ícone `ArrowRight` à direita aparece em `group-hover`.

**Timing relativo** — helper puro `formatRelativeAgo(ms)`:

- `< 5s` → `"agora"`
- `< 60s` → `"há Ns"`
- `< 60min` → `"há Nmin"`
- `≥ 1h` → `"há Nh"`

**Empty state** — quando não há itens, renderiza placeholder centralizado com
ícone `CheckCircle2`, título "Nenhuma aprovação pendente" e hint "Quando um
workflow agêntico precisar de input humano, ele aparece aqui." (segue o
padrão definido em [placeholder.md](../placeholder/placeholder.md)).

## Origem dos dados

| Bloco | Fonte |
|---|---|
| Saudação fixa | hardcoded na view (constante de copy) |
| Subtítulo dinâmico | derivado do workflow primário no `WorkflowsProvider` |
| Estado A/B/C da Seção 2 | `WorkflowsProvider.workflows[primary]` |
| Alert de status | `workflow.status` (idle / running / awaiting / failed / completed) |
| Itens do checklist | `workflow.steps[]` — schema em [worflow-context.md](../context/worflow-context.md) |
| Lista de fluxos pendentes | `flatMap(workflows, w => w.pendingAgenticFlow)` ordenado por `createdAt desc` |

A view **não** acessa `database.json` diretamente — toda leitura passa pelo
`WorkflowsProvider`, que faz o seed inicial a partir do JSON. Ver
[main.md](../../../specs/main.md) §1.

## Lógica de negócio

### Workflow primário

Procura, em `workflows[]`, a instância cujo `slug === 'wf-migration-vanilla'`,
priorizando a mais recente (último adicionado). Se não existir, a Seção 2
renderiza o estado **A — Placeholder**.

### Trigger do pipeline server-side

Os steps do checklist têm `canProgress` (ver [worflow-context.md](../context/worflow-context.md)).
Quando o usuário marca como concluído um step com `triggers` definido (em
particular o passo "Acompanhar Status da Migration"), o handler chama
`addWorkflow(step.triggers)` no provider, com **dedupe por templateId** para
evitar disparos múltiplos em revert/re-check.

### Auto-advance

Não acontece nesta view. Pipeline server-side (`workflowsOnPlat`) progride
dentro do `WorkflowsProvider` mesmo se o usuário sair da Home — a view
apenas reflete o estado.

## Estados visuais e tokens

Tudo via Tailwind + tokens do design system ([design-system.md](../../../specs/design-system.md)).

| Token | Uso |
|---|---|
| `bg-bg` | fundo da página |
| `bg-surface` / `border-border` | superfície dos cards |
| `text-text-primary` / `text-text-secondary` | hierarquia tipográfica |
| `text-accent` (`#FF6B2C`) | ícones agênticos, CTAs primários |
| `text-success` / `text-warning` / `text-failure` / `text-info` | alertas e badges |
| `bg-live` + `animate-pulse-live` | indicador real-time (cyan `#22D3EE`) |
| `font-mono` | comandos CLI, IDs (`ssa-pix-core`), `prTitle`, timestamps |

Tipografia compacta — `text-[26px]` (hero h1), `text-[15px]` (section h2),
`text-[13.5px]` (card h3), `text-[12.5px]` (item title), `text-[11.5px]`
(description), `text-[10.5px]` (meta).

## Acessibilidade

- Hero é `<h1>`; títulos de seção são `<h2>`; títulos de card são `<h3>`.
- Checkboxes do checklist usam `<button role="checkbox" aria-checked>` real
  (ver [onboarding-card.md](../components/onboarding-card.md) §Acessibilidade).
- Botão de expand do step tem `aria-expanded` + `aria-controls`.
- `live dot` é decorativo — informação real vem do texto "agora" / "há Ns".
- Pulse e gradientes respeitam `prefers-reduced-motion` (desabilitar `animate-pulse-live`).
- Foco visível em todos os `<Link>` e `<button>` via tokens padrão do shadcn.

## Navegação

| Origem | Destino |
|---|---|
| CTA do Placeholder | `/assets-catalogs` |
| CTA "Ver Workflow Tracker" (CongratsAlert) | `/workflows-trackers` |
| CTA "Ver Assets Catalog" (CongratsAlert) | `/assets-catalogs` |
| Linha de fluxo agêntico pendente | `/workflows-trackers/{workflowInstanceId}` |
| Sidebar Home | `/` (rota desta view) |

Não há links externos nesta versão (a POC não autentica em SSO real nem baixa
CLI de fora). Todos os comandos de terminal exibidos pelo checklist são
copiados via clipboard, **não** abrem aba externa.

## Fora de escopo

- Métricas, gráficos, contadores agregados — Home não é dashboard.
- "Saúde da Application Hub" — conceito removido do MVP (sidebar atual só tem
  Home, Workflow Tracker e Assets Catalog).
- Notificações push / toast — vivem na Topbar do layout compartilhado.
- Aprovação/decline inline de PRs agênticos — só linkam para o Workflow
  Tracker; a interação acontece lá.
- Re-execução granular de passos do pipeline — fica no Workflow Tracker Detail.
- Modais separados para seleção de SA — toda a UX vive expandida inline
  dentro do step "Seleção de SA" do checklist (ver [onboarding-card.md](../components/onboarding-card.md)).

## Critérios de aceite

### Hero
- [ ] Renderiza `<h1>` com saudação fixa "Bom dia, Luigi".
- [ ] Subtítulo muda conforme estado do workflow primário (vazio / em curso / concluído).

### Seção 2 — Estado A (Placeholder)
- [ ] Renderiza quando não há workflow `wf-migration-vanilla` ativo.
- [ ] Segue layout de [placeholder.md](../placeholder/placeholder.md): título + descrição + ícone centralizados.
- [ ] CTA linka para `/assets-catalogs`.

### Seção 2 — Estado B (Em progresso)
- [ ] Alert de status é renderizado acima do card, variante correta por `workflow.status`.
- [ ] Card do checklist segue inteiramente a estrutura de [onboarding-card.md](../components/onboarding-card.md).
- [ ] Marcar step com `triggers` definido dispara `addWorkflow(step.triggers)` com dedupe por templateId.
- [ ] Cada row é expansível de forma independente via chevron (ver [onboarding-card.md](../components/onboarding-card.md) §Interações); steps concluídos seguem clicáveis para revisão, com atenuação visual (`opacity-70` + faixa `bg-success/[0.025]`).

### Seção 2 — Estado C (Concluído)
- [ ] Quando todos os steps têm `isCompleted === true`, `CongratsAlert` substitui o conteúdo da seção.
- [ ] Dois CTAs presentes: "Ver Workflow Tracker" → `/workflows-trackers`; "Ver Assets Catalog" → `/assets-catalogs`.

### Seção 3 — Fluxos agênticos pendentes
- [ ] Lista derivada de `flatMap` sobre `workflows[].pendingAgenticFlow`.
- [ ] Badge "{N} aguardando" aparece apenas quando `N > 0`.
- [ ] Itens com `createdAt` < 60s mostram `live dot` pulsante.
- [ ] `formatRelativeAgo` retorna "agora" / "há Ns" / "há Nmin" / "há Nh" corretamente.
- [ ] Linha inteira é `<Link>` para `/workflows-trackers/{workflowInstanceId}`.
- [ ] Empty state renderizado quando lista vazia.

### Geral
- [ ] Nenhum dado runtime mockado dentro de componentes — tudo vem do `WorkflowsProvider`.
- [ ] Cores e tokens consumidos pelo Tailwind via tema (`@theme`) — sem hex hardcoded em JSX.
- [ ] `npm lint` e `npm build` passam (regras de [lint.md](../../../specs/lint.md) e [typescript.md](../../../specs/typescript.md)).

## Referências

- Master context: [`specs/views/00-master-context.md`](../../../specs/views/00-master-context.md)
- Provider de workflows: [`docs/specs/context/worflow-context.md`](../context/worflow-context.md)
- Card de onboarding (composição interna da Seção 2.B): [`docs/specs/components/onboarding-card.md`](../components/onboarding-card.md)
- Placeholder padrão (Seção 2.A e empty states): [`docs/specs/placeholder/placeholder.md`](../placeholder/placeholder.md)
- Convenções de projeto: [`specs/main.md`](../../../specs/main.md)
- Design system: [`specs/design-system.md`](../../../specs/design-system.md)
- Estado global (padrão de Context): [`specs/estado-global.md`](../../../specs/estado-global.md)
