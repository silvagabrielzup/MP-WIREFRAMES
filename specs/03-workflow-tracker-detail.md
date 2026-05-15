# Tela de detalhe de workflow — visualização em diagrama (rota: /workflows/[id])

Tela principal do produto. Foco: legibilidade da cadeia causal através de um grafo direcionado horizontal, similar a n8n / GitHub Actions, com identificação dos 4 verbos da Vanilla **por cor**, sem agrupamento visual em swimlanes.

## Layout geral

- Sidebar + Topbar conforme contexto mestre
- Header:
  - Breadcrumb: `Workflow Tracker / wf-abc123`
  - Título: ID do workflow + status badge grande
  - Sub-info: tipo, SA, user (avatar), início, duração
  - Ações direita: "Replay", "Annotate as failure", "Export trace", botão "..."
  - Em running: indicador "live · updated 1s ago"

## Tabs principais

- **Fluxo** (default) — diagrama do workflow
- **Tool calls** — todas as chamadas de ferramenta cronológicas
- **Sensores** — sensores acionados, veredictos, iterações
- **Auditoria** — aprovações humanas, políticas Komply
- **Replay** — estado capturado pra re-execução
- **Custo** — tokens, R$, latência por step

## Tab Fluxo (default)

### Estrutura visual

Layout em duas regiões empilhadas verticalmente:
- **Canvas** (topo, full-width; ocupa 100% da altura quando o detalhe está fechado, ~55–60% quando aberto)
- **Painel de detalhe** (bottom sheet, ~40–45% de altura, abre on-click no node)

Vantagem: o canvas mantém largura total para o fluxo horizontal — nada é comprimido lateralmente ao abrir o detalhe.

### Canvas — grafo direcionado horizontal

- Orientação **horizontal, esquerda → direita** (single-axis DAG)
- Steps representados como **nodes** conectados por **edges**, sem containers ou swimlanes
- Auto-layout: `dagre` ou `elk.js` com direção `LR` (left-right), camadas alinhadas horizontalmente
- Zoom + pan livre (scroll-wheel zoom, drag pan)
- Background com grid sutil
- Biblioteca de referência: **React Flow / xyflow**

### Identificação dos verbos por cor (sem swimlanes)

Cada um dos 4 verbos tem uma cor canônica do design system, aplicada diretamente ao node:
- **Build** → cor A
- **Deploy** → cor B
- **Migration** → cor C
- **Rollout** → cor D

Sinalização do verbo no canvas:
- **Phase strip** fino no topo do canvas (sticky): barra horizontal proporcional mostrando onde cada fase começa/termina ao longo do fluxo, com label e cor do verbo. Clicar em um segmento dá fit-to-fase. Funciona como minimapa de fases.
- **Legenda fixa** no canto superior direito (`Build · Deploy · Migration · Rollout`), com os swatches de cor.
- A própria cor do node identifica o verbo a cada caixa.

Ordem fixa esquerda → direita: **Build → Deploy → Migration → Rollout**. Verbos sem steps no workflow atual ficam ausentes do phase strip.

### Nodes (cards de step)

Dimensões fixas (sugestão: 260 × 96 px), totalmente coloridos pelo verbo:
- **Header strip** (topo do card, ~28px): cor saturada do verbo, com label do verbo + ícone (ex: `Build · konstructor`)
- **Body** (fundo): tint claro da cor do verbo (~8–12% opacidade sobre o background) — mantém o pertencimento visível sem prejudicar contraste do texto
- **Border**: 1px na cor do verbo (mais saturada que o tint do body)
- Conteúdo do body:
  - Linha 1: ícone de status + nome do step (truncate)
  - Linha 2: tool name em mono font (ex: `kaptain.deploy`)
  - Linha 3 — chips inline: duração, sensor acionado, iterações (`↻ 3`)
- **Handles** de conexão: input à esquerda, output à direita

Estados visuais (sobrepostos ao esquema de cor do verbo):
- `pending`: card dessaturado (cor do verbo a ~30%)
- `running`: borda pulsante na cor do verbo + spinner no ícone de status
- `success`: cor cheia + check
- `failed`: borda **vermelha** sobrepõe a cor do verbo + ícone de erro (vermelho sempre vence visualmente)
- `skipped`: tracejado, dessaturado
- `selected`: ring/outline destacado (neutro, ex: azul de seleção do design system)
- `hover`: elevação leve (shadow)

### Edges (conexões)

- Estilo único: curva bezier suave **ou** ortogonal (escolher um e manter consistente)
- Edges entre verbos diferentes podem ter **gradient da cor de origem → cor de destino** para reforçar o handoff (sutil; opcional, A/B testar)
- Cor depende do estado do step de destino:
  - normal: cinza neutro (ou gradient se entre verbos)
  - caminho que falhou: vermelho
  - caminho ainda não executado: cinza claro / tracejado
- **Edges de iteração**: loop-back curvo, label `↻ N×`
- **Edges condicionais**: tracejado com label (ex: `if sensor.fail`)
- Animação sutil de fluxo (dashed marching) na edge ativa quando workflow está em running

### Iteração / auto-correção

- Default: **uma única node** com chip `↻ N`
- Click no chip **expande horizontalmente** em N nodes em sequência com edges de loop-back (mantém a tese de fluxo horizontal)
- No painel de detalhe inferior, navegação entre iterações por tabs: `iter 1` | `iter 2` | ...

### Controles do canvas

Toolbar flutuante no canto **superior direito** do canvas (movido para fora da área do bottom sheet):
- Zoom in / out
- Fit to screen (atalho `f`)
- Reset zoom (atalho `0`)
- Toggle minimapa
- Toggle: expandir/colapsar iterações
- Toggle: mostrar/esconder edges condicionais não executadas

Removido o toggle horizontal ↔ vertical: o fluxo é sempre horizontal nessa tela.

### Minimapa (canto **superior esquerdo**, toggleable)

- Movido para o topo já que o rodapé é o bottom sheet
- Versão reduzida do grafo com cores dos verbos preservadas
- Viewport atual destacado
- Click pula para a região

### Search bar (acima do canvas, ao lado do phase strip; atalho `cmd/ctrl + k`)

- Filtra nodes por nome, tool, status, sensor, verbo
- Match anima zoom até o primeiro resultado e destaca todos os matches

### Navegação por teclado

- `← →`: navegar entre nodes sequenciais no fluxo
- `↑ ↓`: redimensionar bottom sheet quando aberto (cresce/diminui altura)
- `Enter` / `Space`: selecionar node, abrir bottom sheet
- `Esc`: fechar bottom sheet
- `/` ou `cmd+k`: focar search
- `f`: fit to screen

## Painel de detalhe (bottom sheet)

Abre on-click em qualquer node. Layout horizontal pra aproveitar a largura da tela:

- **Header sticky** (topo do sheet, full-width):
  - Drag handle (linha central) para resize
  - Ícone de status + nome do step
  - Badge do verbo (cor + label)
  - Duração + breadcrumb (`verbo · step`)
  - Tabs de iteração (se N > 1): `iter 1` | `iter 2` | ...
  - Ações direita: "Ver raw trace", "Pular para Replay", botão X (fecha)
- **Conteúdo em 4 colunas** (aproveita largura, evita scroll vertical excessivo):
  - **Input** — tool call params, contexto (JSON formatado, syntax-highlighted)
  - **Output** — tool result, artifacts (JSON + links)
  - **Sensores** — lista de sensores com veredicto (chip por sensor, hover com detail)
  - **Decisão do agente** — rationale, `alternatives_considered` (markdown render)
- Em viewports estreitos (<1280px), colunas viram **tabs horizontais** (Input | Output | Sensores | Decisão)
- Cada coluna tem scroll interno independente

Comportamento do bottom sheet:
- Altura default: 40% do viewport; resizable via drag handle (mín 240px, máx 70% do viewport)
- Snap points: 25%, 40%, 70%
- Click fora **mantém** a seleção; fecha só via `Esc` ou X
- Trocar seleção (click em outro node) atualiza conteúdo sem fechar/reabrir
- Slide-up 200ms ease-out
- Estado (aberto/fechado, altura, snap) persistido na URL e no localStorage

## Estados especiais do canvas

- **Workflow vazio**: empty state centralizado com link para docs
- **Workflow em running**:
  - Node em execução com borda pulsante
  - Edge ativa com animação de fluxo
  - Auto-follow horizontal: o canvas pan automaticamente para manter o node em execução visível (toggleable)
- **Workflow falhou**:
  - Caminho até a falha em vermelho, demais edges em cinza
  - Banner no topo do canvas: "Falhou em `<step>` · abrir detalhes"
- **Workflow grande (>50 steps)**:
  - Phase strip permite jump rápido por fase
  - Botão "Fit phase" na legenda

## Performance e dados

- Streaming via WebSocket quando `status = running`; diff updates (sem re-render do grafo inteiro a cada tick)
- Virtualização de nodes off-screen para workflows com >100 steps
- Lazy load do conteúdo do bottom sheet: `input`/`output` podem ser grandes — só fetch ao expandir a coluna correspondente
- Estado de seleção, zoom, pan e sheet persistido na URL (`?node=step-id&zoom=1.4&sheet=40`) para deep-link e share

## Estilo

- 4 cores canônicas do design system, uma por verbo — mesma paleta em phase strip, legenda, nodes, edges entre verbos e badge no detail sheet
- Mono font para tool names, IDs, código; sans para nomes e descrições
- Contraste de texto sempre verificado contra o tint do verbo (WCAG AA mínimo)
- Mockup com **8–12 steps através dos 4 verbos**, contendo no mínimo:
  - 1 step com iteração (chip `↻ N`)
  - 1 step com sensor acionado
  - 1 step em running **ou** 1 step falho
  - 1 edge condicional

## Estado atual — iterações pós-MVP (2026-05-15)

### Implementação visual

Não foi adotada a lib React Flow / xyflow — o canvas atual usa SVG custom + nodes posicionados absolutamente (~1042 linhas). O paradigma visual (nodes + edges Bezier + minimap + phase strip + zoom toolbar) mimetiza React Flow mas tudo é à mão. Decisão registrada em `NOTES.md` (2026-05-15).

### 5º verbo: Agente

Foi adicionado um quinto tipo de step além de Build / Deploy / Migration / Rollout:

- **Agente** (cor `accent`, ícone `Sparkles`) — representa proposições agênticas que **exigem aprovação humana** explícita.

O `Verb` type agora é `'build' | 'agentic' | 'deploy' | 'migration' | 'rollout'`. `verbsOrder` inclui agentic; `verbMeta.agentic` define a tonalidade accent. Phase strip e legenda renderizam o verbo Agente quando presente.

### Node agêntico

O step `step-agentic-java-21` (mock injetado entre Build e Deploy) renderiza diferenciado:

- Cabeçalho do node mostra badge `aprovação` quando `approval === 'pending'`.
- Quando pending, o body do node mostra dois pseudo-botões (`role="button"` com `stopPropagation`):
  - **Declinar** (border/bg `failure`)
  - **Aprovar** (border/bg `success`)
- Quando resolvido, o node mostra badge "aprovado" ou "declinado" e o status efetivo vira `success` ou `failed`.
- `ApprovalState = 'pending' | 'accepted' | 'declined'` no state do componente.

### Bottom sheet — variação para nodes agênticos

Quando o node selecionado é agêntico (`step.verb === 'agentic'`), o sheet substitui as 4 colunas (Input/Output/Sensores/Decisão) por um componente dedicado `AgenticPrDiff`:

- **Card de PR no topo**: ícone `GitPullRequest`, título da PR, autor (`agent · konstructor-java-bot`), summary multi-linha e botões Aprovar/Declinar (ou badges Aprovado/Declinado conforme estado).
- **Navegador de arquivos** à esquerda (grid `[200px_1fr]`): lista os arquivos modificados com ícone `FileText`, path, contagem `+N` / `-N`. Click muda o arquivo visível.
- **Diff unified** à direita: header com path + linguagem; corpo mostra hunks com header (`@@ -L,N +L,N @@`) e linhas tonadas verde (add) / vermelho (del) / neutro (context) com prefixo `+` / `-` / espaço.

Dados vêm de `migrationExecutionWorkflow.onboardingSteps[].agentic` em `database.ts`. Diff mock cobre 4 arquivos: `pom.xml` (java.version + maven-compiler-plugin), `Dockerfile` (base image + CMD), `PaymentService.java` (switch expression + var), `PaymentDto.java` (POJO → record).

### Sync com o provider

`handleApprove` / `handleDecline` chamam `resolveAgenticItem(wfId, AGENTIC_TEMPLATE_STEP_ID)` no provider — remove a entrada do `pendingAgenticFlow` da instância correspondente, fechando o loop com o card "Fluxos agênticos pendentes aprovação" da Home.

### Edges

Inseridas `step-3 → agentic` e `agentic → step-4` para encaixar o nó agêntico no fluxo. Mantida a coloração por verbo (gradient quando atravessa verbos).