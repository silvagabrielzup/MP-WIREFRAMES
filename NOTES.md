# Notes

## 2026-05-12 — Iteração 01 (Home)

**Setup inicial (baseline scrub corrompido)**
- `tailwind.config.js` tinha `content: [".index.html", ".src***.{js,ts,jsx,tsx}"]` — corrigido para `./index.html` e `./src/**/*.{js,ts,jsx,tsx}`. Adicionei cores nomeadas da paleta do master context, fonte Geist e keyframe `pulse-live`.
- `tsconfig.json` referenciava `.tsconfig.app.json` / `.tsconfig.node.json` (sem `/`) — corrigido para `./tsconfig.app.json` e `./tsconfig.node.json`.
- `tsconfig.app.json` `paths: { "@*": [".src*"] }` — corrigido para `{ "@/*": ["./src/*"] }`. Desliguei `noUncheckedSideEffectImports` (bloqueia `import './index.css'`) e adicionei `ignoreDeprecations: "6.0"` (TS 6 exige por causa de `baseUrl`).
- `vite.config.ts` importava `@vitejsplugin-react` e usava alias `.src` — corrigido para `@vitejs/plugin-react` e `./src`.
- `src/index.css` agora importa `@fontsource-variable/geist`, define scrollbar dark e usa as cores nomeadas.

**Shell**
- `src/components/Layout.tsx`: sidebar 240px (logo StackSpot, nav Home/Workflow Tracker/Control Planes/Assets Catalog, seção "Recentes", footer com live dot) + topbar (search global com ⌘K, seletor de ambiente prod, bell com badge, avatar Luigi).
- Rotas placeholder para 02–07 dentro de `src/App.tsx` até o loop gerar cada tela.

**Decisões 01-Home**
- 4 workflows ativos (espec pedia 3–5). Um em `awaiting human` para mostrar o estado.
- 7 cards de motores em grid responsivo (2/4/7 cols). Pantheon em `fail` com fila 47 pra dar peso ao estado degradado. Komply em `warn` (fila 12).
- "Precisa de atenção" mistura approvals, falhas e violação de policy — 5 itens conforme o espec.

## 2026-05-12 — Iteração 04 (Control Planes Dashboard)

**Decisões**
- "Vista por SA" o spec pedia default fechado; defaultei `sidebarOpen=true` pra que o wireframe demonstre o painel renderizado. Toggle existe (botão na header + X dentro do painel).
- Spec dizia "1 motor degradado" — coloquei **Komply** em `warn` (fila 12, success 94.1%, p99 2.4s). Pantheon volta a `ok` aqui (diferente do Home.tsx, onde estava `fail`); a página é um snapshot mais recente que mostra recuperação. Consistente com a frase do banner "6/7 motores saudáveis".
- 8º card do grid 4×2 = "Visão consolidada" (totals agregados: 607 ops/min, 26 fila, 98.4% succ médio, 142 SAs servidas) em vez de "Adicionar motor" — wireframe fica mais informativo.
- Sparklines inline SVG (92×26) com `polyline` + área de gradiente translúcido. Sem libs.
- 15 eventos críticos 24h, mix de severities (critical/high/medium/low) e status (open/investigating/ack/resolved). Filtro de severity no header da tabela.
- 3 aprovações pendentes, cada uma com policy Komply real (data-classification, network egress, CVE), approver e tempo aguardando. Marca como "vermelho" se > 60min (overdue).
- Painel SA tem 3 SAs mockadas com atividade detalhada (`ssa-pix-core`, `ssa-conta-corrente`, `ssa-12345`); outras SAs caem no fallback "Sem atividade nas últimas 24h".
- IUConfia surge no resumo da SA no painel lateral (94) — encaixa no master context sem ser intrusivo.

## 2026-05-13 — Re-alinhamento Home com `specs/01-home.md`

**Mudanças**
- Removida a seção "Saúde dos motores" (grid de 7 motores): não consta na spec atualizada, que descreve apenas 3 seções verticais (Hero / Atividade recente / Workflows em execução). Visão dos motores permanece em `04-control-planes-dashboard`.
- Reordenação: a seção "Em execução agora" foi movida para o final como Seção 3 (a spec marca essa seção como "mais importante, real-time" e a coloca depois de Atividade recente).
- Seção 2 ("Atividade recente") ganhou um header agregador com live dot + "atualizado há 4s" — atende a "Real-time indicator visível na seção 2" da spec.
- Cada workflow em execução agora tem um ícone lucide (Rocket/Network/Database/Hammer) para reforçar "use ícones lucide-react para cada tipo de evento".
- Rows de workflow viraram `<a href="/workflows/detail">` (eram `<div>`) para tornar explícito "Item clicável vai pro detalhe do workflow".
- Adicionados empty states elegantes para cada uma das 3 seções (componente `EmptyState` interno) — atende ao requisito da spec mesmo que o mock atual nunca dispare a condição.

## 2026-05-15 — Onboarding card clicável (Home)

**Mudanças**
- `OnboardingStep` ganhou duas props no `src/data/database.ts`: `completedOnClick: boolean` (passos manuais que o sistema não consegue detectar concluídos) e `ctaLabel: string` (texto do botão renderizado no card). Apenas `step-01-install-cli` e `step-02-permission-cloud` têm `completedOnClick: true`; demais são `false` (precisam de sinal externo).
- CTAs por passo: `Baixar CLI`, `Solicitar acesso`, `Selecionar repos`, `Configurar workflow`, `Disparar execução`, `Ver checks`, `Promover pra HML`, `Linkar dashboards`.
- `01-Home.tsx`: cada linha do card "Próximos passos" agora é clicável; o botão CTA também dispara o mesmo handler (`handleStepActivate`) com `stopPropagation`. Só chama `advanceStep` se o passo for o `in-progress` E tiver `completedOnClick=true` — clicar em passos futuros ou em passos `completedOnClick=false` é no-op (na UX real esses iriam abrir um wizard/redirect externo). O passo de "opções" (...) também ganhou `stopPropagation` pra não disparar o avanço por engano.
- Visualmente: botão CTA fica laranja (`accent`) quando é o passo atual + auto-completável; cinza neutro nos demais casos. Mantém affordance sem confundir o usuário sobre o que avança o workflow.
- Removidas as props `cta`, `estimate`, `badge` do tipo local `OnboardingStep` em Home — eram código morto (nunca populadas pelo mapping do `WorkflowsProvider`).

## 2026-05-15 — Modal "Selecionar repositório" para step-03 (specs/components/onboarding-card.md)

**Mudanças**
- `01-Home.tsx`: criado componente inline `RepoPickerModal` (overlay fixed, backdrop blur, click-outside fecha). Dois steps:
  - **Step 1 — Buscar repo:** input com a URL pré-preenchida (`git@itau.gitlab.com:apps/pix-core.git`), botão "Buscar" revela um card com metadata mockada (org/name, default branch, linguagem, contribuidores, tamanho, última tag, último commit). `searched=true` gateia o botão "Próximo".
  - **Step 2 — Estrutura mono-repo:** grid 2 colunas. À esquerda "Antes" mostra a árvore atual do repo standalone; à direita "Depois" mostra a árvore prefixada com `apps/ssa-pix-core/` + arquivos novos (`komply.yaml`, `kaptain.yaml`, `orkestra.yaml`, `tooling/vanilla.lock`) e `.gitlab-ci.yml` marcado como removido (substituído pelo Kaptain). Cada linha tem um ícone (Plus/Minus/ArrowRightLeft) e cor (success/failure/info) indicando a ação.
- Mock data dentro do arquivo (`MOCK_REPO`, `CURRENT_TREE`, `MONOREPO_TREE`) — segue a regra da própria spec "DADOS: Para o repositório, traga uns dados mockados". Não puxa do `database.ts` porque é dado específico da preview, não do contrato de workflow.
- `handleStepActivate`: se `stepId === 'step-03-select-repos'` e o passo está em curso, abre o modal **em vez** de aplicar a regra de `completedOnClick`. Outros passos continuam respeitando `completedOnClick` (step-01 e step-02 auto-completam; resto é no-op).
- `handleRepoConfirm`: chama `advanceStep(lastWorkflow.id)` e fecha o modal. Ou seja, "Confirmar migração" é o sinal que conclui step-03 — `completedOnClick` continua `false` na database porque a regra correta é "concluído via fluxo do modal", não via clique direto.
- Componente `TreeRow` reusa as cores nomeadas (`info`/`success`/`failure`) com bg translúcido `/5` para não competir com o conteúdo. Ícones `FolderTree`/`FileCode2` da lucide.
- Footer do modal tem "Voltar" no step 2 e "Cancelar" sempre. Reset do estado interno (`step`, `searched`, `repoUrl`) ao cancelar/confirmar pra próxima abertura começar limpa.

## 2026-05-15 — Linked workflow disparado pelo step-04 + ação no Workflow Tracker

**Mudanças**
- `database.ts`: `WorkflowAsset` ganhou `linked?: WorkflowAsset` (referência recursiva ao próprio tipo). Adicionado `migrationExecutionWorkflow` — pipeline pós-onboarding com os 4 verbos da Operação Vanilla (build · Konstructor / deploy · Kaptain / migration · dual-write / rollout · Traffik), cada um `completedOnClick=true` e com ctaLabel próprio (Marcar build/deploy/migration/rollout). `migrationWorkflow.linked = migrationExecutionWorkflow`.
- `step-04-configure-workflow`: virou `completedOnClick: true`, ctaLabel "Lançar workflow" (alinhado com o título "Lançar workflow de onboarding" que o usuário tinha trocado antes).
- `WorkflowsProvider.addWorkflow` agora aceita `string | WorkflowAsset`. Quando recebe asset, instancia direto sem precisar estar no `workflowTemplates`. Mantém retrocompatível com o caller atual (AssetsCatalog passa string id).
- `01-Home.tsx`:
  - `lastWorkflow` agora prefere a **instância primária** (a que tem `template.linked` definido), em vez de simplesmente pegar a última. Isso evita que, após disparar o linked workflow, o onboarding card mude pra mostrar os verbos da execução — o card continua mostrando step-06/07/08 do onboarding.
  - `handleStepActivate`: depois de `advanceStep` no step-04, verifica se o template tem `linked` e se a instância ainda não foi criada (`alreadyTriggered` por `templateId`). Se não, chama `addWorkflow(template.linked)`. Guard contra duplicação em re-cliques.
- `02-WorkflowTrackerList.tsx`: nova coluna "Ação" no fim da tabela. Quando workflow está `completed`/`failed`, mostra label "encerrado". Caso contrário, botão accent "Avançar" (ou "Concluir" se está no último step) que chama `advanceStep(w.id)` com `stopPropagation` pra não disparar a navegação da linha. `colSpan` do empty state ajustado de 5 → 6.

**Decisão sobre o disparo**: o trigger fica no `handleStepActivate` da Home (acoplado ao stepId `'step-04-configure-workflow'`) em vez de embutido no `advanceStep` do provider. Isso evita que o provider precise saber regras de UX sobre quando um workflow dispara outro — a Home é a camada que orquestra a jornada de onboarding.

## 2026-05-15 — Lift do trigger para `step.triggers` + HML promotion + ApplicationHub data

**Mudanças no `database.ts`**
- `WorkflowAsset.linked` foi removido. A relação "concluir esse passo dispara aquele workflow" agora vive em `OnboardingStep.triggers?: WorkflowAsset`. Motivo: precisamos de **dois** triggers diferentes (step-04 → execução Vanilla, step-07 → promoção HML). Manter um único `linked` por workflow não escalava.
- Novo `hmlPromotionWorkflow`: rollout canário 5% → 50% (gate humano) → 100% + smoke pós-rollout. MCPs `traffik.canary`, `komply.evaluate`, `kaptain.deploy`. Cada passo é `completedOnClick=true` (botão "Avançar/Concluir" do tracker fecha o passo).
- step-04 ganhou `triggers: migrationExecutionWorkflow`. step-07 virou `completedOnClick=true` e ganhou `triggers: hmlPromotionWorkflow`.
- Exportado `executionTemplateIds: Set<string>` — derivado de `workflows[].onboardingSteps[].triggers?.id`. Home filtra primárias (`!has`), WorkflowTrackerList filtra execuções (`has`). Set fica em database porque é a fonte da verdade; ambas as telas só consomem.
- Adicionado tipo `ApplicationHub` + array `applicationHubs` com as 8 SAs que estavam inline em `04-ApplicationHub.tsx`. Campos `id` (chave estrangeira pra notificações) e `projectId` adicionados; `sa` segue sendo o slug de URL.
- Adicionado tipo `ApplicationHubNotification` + `applicationHubNotifications`. Icon é string (`'CheckCircle2' | 'AlertTriangle' | ...`) pra manter `database.ts` desacoplado da camada de renderização. Quando precisar renderizar, mapear string → componente lucide na UI.
- Seed `notif-hml-provisioned-ssa-pix-core`: HML provisionada, CTA "Ver saúde em HML", link `/application-hub/ssa-pix-core?env=hml`. FKs `applicationHubId='ahub-ssa-pix-core'` + `projectId='proj-pix-platform'` ambos batem com a entrada em `applicationHubs`.

**Mudanças nas telas**
- `01-Home.tsx`: `handleStepActivate` ficou genérico — depois de `advanceStep`, busca o step no template; se tiver `triggers`, dispara `addWorkflow(triggers)` com guard de duplicação por `templateId`. Sem mais hardcode pra `step-04-configure-workflow`.
- `01-Home.tsx`: `primaryInstance` agora filtra com `executionTemplateIds`, não com `template.linked`.
- `02-WorkflowTrackerList.tsx`: deletou cálculo local de `executionTemplateIds` e passou a importar de `database.ts`.
- `04-ApplicationHub.tsx`: deletou `apps[]` inline, type `App`, type `HealthStatus`. Importa `applicationHubs`, `ApplicationHub`, `ApplicationHubHealth` de `data/database.ts`. Render passa a usar `applicationHubs` direto.

**Pendência conhecida**: as notificações `applicationHubNotifications` estão definidas em data mas ainda não renderizadas em nenhuma tela. A intenção é surfar quando o usuário concluir step-07 (HML provisionada) — provavelmente na seção "Pontos de atenção" da Home ou no sino da topbar. Item pra próxima iteração.

## 2026-05-15 — Hub gerado on-finish do workflow

**Mudanças**
- `WorkflowsProvider` ganhou `applicationHubs` em state (seedado pelo array exportado em `database.ts`, atualmente `[]`). Exposto no value do contexto + dedupe em todas as alterações.
- Helpers internos `findTemplateById` (resolve templateId percorrendo templates raiz + triggers de cada step) e `buildHubFromTemplate` (deriva `ApplicationHub` a partir dos inputs do template — pega `sa_id`, mapeia projectId/squad via lookup table, métricas refletindo um app recém-promovido pra HML: uptime 99.95%, p95 142ms, erro 0.18%, 1 deploy nos últimos 7 dias).
- `advanceStep` detecta o frame em que o workflow transiciona pra `completed` (`reachedEnd && newStatus === 'completed'`), captura a instância via fechamento, depois do `setWorkflows` chama `setApplicationHubs` com dedupe por `hub.id`. Re-chamar o botão "Avançar/Concluir" depois do término é no-op pro hub.
- `04-ApplicationHub.tsx` deixou de importar `applicationHubs` estaticamente e passou a usar `useWorkflows().applicationHubs`. Empty state segue funcionando (continua mostrando "Nenhuma aplicação on-platform" enquanto nada terminou).

**Decisão de ownership**: hubs runtime ficam no `WorkflowsProvider` em vez de criar um `ApplicationHubsProvider` separado, porque a criação é estritamente reativa a eventos de workflow — separar adicionaria boilerplate sem ganho. Se no futuro um hub puder ser criado fora desse fluxo, vale extrair.

**Decisão sobre lookup tables**: `SA_TO_PROJECT` e `SA_TO_SQUAD` ficam no provider em vez do `database.ts` porque são heurísticas de geração (mock), não dados canônicos. Fallback `proj-${baseName}` / `squad-${baseName}` cobre SAs novas que apareçam nos inputs de futuros workflows.

## 2026-05-15 — Modal multi-repo + stepper agêntico Java 21

**Modal step-03 (`01-Home.tsx`)** — três passos agora:
- **Step 1 — Busca por Serviço de Aplicação**: input pega a SA (`ssa-pix-core`). Resultado mostra metadata do serviço (org/SA, squad, descrição) + lista de 5 repos da família (código, ci/cd, infra, db, config) com ícone por kind, stack, tamanho e último commit. Modelando a arquitetura real onde cada faceta da app vive em um repo separado pré-migração.
- **Step 2 — Estrutura mono-repo**: grid Antes vs Depois. Antes empilha 5 árvores independentes (uma por repo); Depois mostra a estrutura unificada em `apps/ssa-pix-core/{src, ci, infra, db, config}` com tooling Vanilla (`komply.yaml`, `orkestra.yaml`, `tooling/vanilla.lock`) adicionada. `TreeNodeView` reutilizado — chevron + Folder/FolderOpen + indentação por depth. Cada árvore "Antes" fica em sua própria caixinha pra deixar claro que são repos distintos.
- **Step 3 — Débitos técnicos resolvidos**: lista 6 itens plausíveis de infra (Jenkins free-form, secrets em repo, sem auto-rollback, CVE scan ausente, dashboards ad-hoc, schema manual) cada um com par "Hoje (problema)" / "Pós-migração (solução)". Footer do modal navega 1→2→3 com Voltar/Próximo + Confirmar migração no final.

**Stepper agêntico (`03-WorkflowTrackerDetail.tsx`)**:
- `Verb` ganhou `'agentic'` (5º verb, cor accent + ícone `Sparkles`). `verbsOrder` atualizado.
- Novo step `step-agentic-java-21` injetado entre `step-3` (build/scan) e `step-4` (deploy/policies). Edges roteadas: `step-3 → agentic → step-4`. Phase strip mostra "Agente · 1" entre Build e Deploy.
- `ApprovalState = 'pending' | 'accepted' | 'declined'` no estado do componente top-level. `effectiveStatus` no `StepNode` deriva do approval pra o nó agêntico (pending → running, accepted → success, declined → failed).
- Nó agêntico em approval=pending mostra inline botões "Declinar" e "Aprovar" (success/failure tinted) com `stopPropagation` pra não conflitar com o click do nó. Quando resolvido, mostra badge "aprovado"/"declinado".
- Click no nó abre `BottomSheet`. Pra step agêntico, o sheet rende `AgenticPrDiff` em vez das 4 colunas padrão: card de PR (título, autor, summary, botões Aprovar/Declinar no header), navegador de arquivos à esquerda com contagem `+/−` por arquivo, e diff unified-like à direita (hunks com header, linhas tonadas verde/vermelho com prefix `+`/`−`).
- PR mock tem 4 arquivos com diffs realistas: `pom.xml` (`<java.version>1.8</java.version>` → `21`, plugin com `<release>21</release>` + `--enable-preview`), `Dockerfile` (`openjdk:8-jre-slim` → `itau-jdk-21:lts`), `PaymentService.java` (switch tradicional → switch expression + `var`), `PaymentDto.java` (POJO → `record`).

**Decisão sobre React Flow**: usuário pediu "stepper do React Flow". Não instalei a lib `@xyflow/react` — o screen já tem um stepper SVG custom de 1042 linhas e refatorar pra React Flow seria um lift desproporcional pro wireframe. Mantive o visual atual (nodes posicionados + edges Bezier SVG) que já mimetiza React Flow visualmente, e adicionei o nó agêntico no mesmo paradigma. Se for promovido pra produção, vale considerar a lib pra ganhar pan/zoom/minimap nativo (hoje são mock).

**Decisão sobre `agentic` em `OnboardingStep`**: a metadata da PR (título, autor, summary, files, hunks) fica no campo `agentic?` da step em `database.ts`. Tipada como `AgenticPropositionMetadata` exportada — `WorkflowTrackerDetail` importa pra renderizar o diff. Mantém data centralizada e permite ampliar pra outros tipos de proposição agêntica futuramente (não-PR).

## 2026-05-15 — pendingAgenticFlow agregado na Home

**Mudanças**
- `WorkflowsProvider`: `WorkflowInstance` ganhou `pendingAgenticFlow: PendingAgenticFlowItem[]` (stepId, stepTitle, prTitle, prAuthor). `buildInstance` filtra `template.onboardingSteps` por `s.agentic` e popula o array — instâncias do `migrationExecutionWorkflow` nascem com 1 item (Java 8→21 PR); demais templates nascem com `[]`.
- `01-Home.tsx`: card "Fluxos agênticos pendentes aprovação" deixou de usar a const hardcoded `pendingApprovals` (deletada). Agora faz `instances.flatMap((wf) => wf.pendingAgenticFlow.map(item => ({...item, workflowInstanceId, workflowName})))`. Cada linha vira `<Link to="/workflows/<id>">` com ícone Sparkles + badge "agêntico" + PR title + autor; click navega pro detail do workflow onde está o Aprovar/Declinar.
- Header do card trocou o ícone de `WorkflowIcon` (lucide Workflow) pra `Sparkles` accent — alinha com o tema "agêntico" (ícone usado também no nó agêntico do tracker).
- `WorkflowIcon` removido dos imports (era o único caller).

**Gap conhecido**: aprovar/declinar no `WorkflowTrackerDetail` ainda não remove o item do `pendingAgenticFlow` da instância correspondente — o state de approval lá é local. Pra fechar o loop, falta adicionar `resolveAgenticItem(workflowId, stepId)` ao provider e chamar em `handleApprove`/`handleDecline` do detail. Como o detail hoje usa `steps` hardcoded em vez de uma instância real do provider, o vínculo precisaria do `:id` do URL bater com `wf.id` do provider — refator pra próxima iteração.

## 2026-05-15 — Polish: agentic enrichment + congrats alert + hub friendly name

**Mudanças**
- `PendingAgenticFlowItem` enriquecido: `prSummary`, `filesChanged`, `linesAdded`, `linesRemoved` (computados percorrendo `agentic.files[].hunks[].lines` e contando `kind === 'add' | 'del'`), `createdAt: string` ISO. `buildInstance` faz a contagem uma vez na criação da instância.
- Row do card "Fluxos agênticos pendentes aprovação" na Home agora tem: timing relativo (`formatRelativeAgo` → "agora" / "há Ns" / "há Nmin" / "há Nh"), live pulse dot quando `<60s` ("fresh"), prSummary multi-linha (clamped a 2), ícone FileText + count de arquivos, +N/−N de linhas com tons success/failure, autor + workflow name.
- Novo componente `CongratsAlert` em `01-Home.tsx`. Renderiza quando `lastWorkflow?.status === 'completed'` em lugar do `OnboardingCard`. Visual: gradient `from-success/15 via-accent/10 to-bg`, 28 círculos SVG (confete) nas cores success/accent/info/yellow com opacity 0.45, ícone `PartyPopper` em ring success, headline "Parabéns, Luigi! 🎉", 3 badges success ("N passos", "pipeline executado", "canário 100%"), CTAs accent pra `/application-hub/<sa>` e neutral pra `/workflows`.
- `ApplicationHub` ganhou `name: string` (nome amigável). `buildHubFromTemplate` chama `toFriendlyAppName(sa)` — strip `ssa-` + title-case dos word-parts (`ssa-pix-core` → "Pix Core", `ssa-conta-corrente` → "Conta Corrente"). `04-ApplicationHub.tsx` mostra o nome na primeira linha + SA em font-mono muted na linha de baixo; header da coluna virou "Aplicação".

**Decisão sobre CongratsAlert**: ficou inline em Home.tsx por enquanto (componente local). Se outros workflows ganharem celebração no futuro, vale extrair pra `src/components/CongratsAlert.tsx` e parametrizar. Os 3 badges são hardcoded "pipeline executado" e "canário 100%" porque assumem o fluxo Vanilla completo — generalizar quando aparecer outro workflow celebrável.

**Decisão sobre confete SVG**: usei `Array.from({ length: 28 })` com posicionamento determinístico (modular sobre i) em vez de Math.random pra que o padrão seja estável entre renders (não flicker). Cores puxadas do tema (success, accent, info, yellow) com opacity uniforme — sem precisar de pacote de partículas.

## 2026-05-15 — Resolve agentic + gate hub creation

**Mudanças**
- `WorkflowsProvider.resolveAgenticItem(workflowId, stepId)`: novo método que filtra o item correspondente do `pendingAgenticFlow` da instância. Adicionado ao tipo do contexto e exposto no value memo.
- `WorkflowTrackerDetail`: importa `useWorkflows`, deriva `AGENTIC_TEMPLATE_STEP_ID` do `migrationExecutionWorkflow.onboardingSteps.find(s => s.agentic).id` (fallback hardcoded), e `handleApprove`/`handleDecline` agora chamam `resolveAgenticItem(wfId, AGENTIC_TEMPLATE_STEP_ID)` além de mexer no state local. Resultado: a linha some do card "Fluxos agênticos pendentes aprovação" na Home assim que o usuário decide. Fecha o gap documentado na iteração anterior.
- `advanceStep` (provider): bloco de finish agora guarda com `const isPrimary = !executionTemplateIds.has(template.id)`. Só templates primários (não-execução) disparam `setApplicationHubs` + `setAppHubAlerts`. Execuções ligadas (`migrationExecutionWorkflow`, `hmlPromotionWorkflow`) terminam silenciosamente — não criam mais hubs/alertas duplicados nem prematuros. O hub só aparece quando `migrationWorkflow` atinge 100%, alinhado com o CongratsAlert.
- `executionTemplateIds` importado no provider (já existia exportado do `database.ts`).

**Implicação de UX**: agora o hub `ahub-ssa-pix-core` só aparece na tabela do Application Hub depois que o usuário conclui o último step da Migração Vanilla. Antes, podia aparecer mais cedo quando o `migrationExecutionWorkflow` chegava ao fim (que tipicamente ocorre antes do step-07 do primário).

## 2026-05-15 — Feature `finalStep` removida

**Motivação**: depois de várias iterações sobre o comportamento de "último passo" (renderização dedicada, auto-completion na entrada, disparo automático de triggers), decidi remover a feature inteira pra simplificar o modelo.

**Mudanças**
- `OnboardingStep.finalStep?: boolean` removido do tipo em `database.ts`. step-07-promote-hml volta a ser um passo normal (mantém `completedOnClick: true` e `triggers: hmlPromotionWorkflow`).
- `WorkflowsProvider.advanceStep` simplificado: remove `enteringFinal` lookup, `finalStepTrigger` capture e o branch de auto-completion. Hub + alerta são emitidos só na conclusão natural (último step `done`).
- Helper `buildExecutionFromTemplate` removido (era usado só pelo trigger automático do finalStep).
- Tipo local `OnboardingStep` em `01-Home.tsx` perdeu o flag. `OnboardingCard` voltou a renderizar uma única lista sequencial — sem split `regularSteps` vs `finalSteps`, sem seção "último passo".
- Badge `final-step` removido do detalhe do `06-AssetsCatalog.tsx`. Import `Flag` (lucide) limpo.
- Specs atualizadas (`00-master-context.md`, `01-home.md`, `04-aplication-hub.md`, `06-assets-catalog.md`, `components/onboarding-card.md`) — todas as menções a `finalStep` removidas.

**Fluxo atual**: usuário clica step-07 manualmente → `advanceStep` no provider conclui o passo → workflow vira `completed` → `Home.handleStepActivate` dispara `addWorkflow(triggers)` (`hmlPromotionWorkflow`) → hub criado em `infraOnPlat`, alerta criado, `CongratsAlert` substitui o card.

## 2026-05-15 — Refactor WorkflowsProvider per `specs/context/worflow-context.md`

**Mudanças no provider** (`src/contexts/WorkflowsProvider.tsx`)
- Tipos novos alinhados com a spec:
  - `Workflow` (id, slug, name, description, steps, infraOnPlat, workflowsOnPlat) — a forma canônica do workflow do usuário.
  - `WorkflowStep` (id, slug, name, description, `isCompleted: boolean`, `canProgress: boolean`).
  - `ExecutionStep` (`type: 'Inference' | 'Computacional'`, name, slug, `needHumanApproval`, `isApprovedByHuman: boolean | null`).
  - `ExecutionWorkflow` (id, slug, name, description, steps, currentStep).
- CRUD por spec: `createWorkflow`, `getWorkflow`, `updateWorkflow`, `deleteWorkflow`. Todos operam sobre o estado central `workflows: Workflow[]`.
- Estrutura nested: infra provisionada (`infraOnPlat`) e workflows agênticos disparados (`workflowsOnPlat`) ficam DENTRO do workflow primário — antes eram top-level. `applicationHubs` virou um derived getter via `useMemo` flatten de `workflows.flatMap(w => w.infraOnPlat)` + seed estático.
- Façade-pattern pra back-compat: `addWorkflow` é alias de `createWorkflow`; `advanceStep` agora opera em `WorkflowStep.isCompleted` (em vez de `StepInstance.status`); `resolveAgenticItem` atualiza dois caminhos — o legacy `pendingAgenticFlow` (filter out) e o novo `workflowsOnPlat[].steps[].isApprovedByHuman`.
- Cada `Workflow` carrega ambas as representações: campos novos (spec-aligned) E campos legacy (`templateId`, `templateName`, `status`, `currentStepIndex`, `legacySteps`, `pendingAgenticFlow`, `startedAt`). `reconcileLegacyFields` mantém os legacy fields consistentes a cada update — derivando `status`/`currentStepIndex`/`legacySteps` a partir de `steps[].isCompleted`.

**workflowsExposed (compat shim pro WorkflowTrackerList)**
- O contexto expõe `workflows` como um array "achatado" que junta o workflow primário + as execuções nested (`workflowsOnPlat`). Isso preserva o filtro existente `executionTemplateIds.has(w.templateId)` no WorkflowTrackerList sem precisar refatorar a tela. Tradeoff: a relação parent-child fica perdida nessa visão, mas os campos legacy bastam pro render atual.

**Decisão**: não refatorei imediatamente os consumidores (Home/WorkflowTrackerList/ApplicationHub) pra usarem só os campos da spec (`slug`, `name`, `isCompleted`). A migração foi feita preservando os legacy aliases dentro do objeto `Workflow`, então:
- A nova API canônica (CRUD + tipos spec) está disponível pra qualquer código novo.
- A API legacy (`templateId`, `status === 'completed'`, `currentStepIndex`, `step.status === 'done'`) continua funcionando.
- Consumidores podem migrar passo-a-passo no futuro.

**Tipo de compatibilidade**: `WorkflowInstance` ficou como alias do `Workflow` novo (`export type WorkflowInstance = Workflow`).

## 2026-05-19 — Banco de dados local em JSON (`src/data/database.json`)

**Migração**
- Toda a *data* literal (`workflows`, `applicationHubs`, `applicationHubNotifications`) saiu de `database.ts` e foi pra `src/data/database.json`. `database.ts` virou camada tipada de leitura: declara os types, importa o JSON e re-exporta com as mesmas chaves que os consumidores já usavam.
- API pública preservada: `migrationWorkflow`, `migrationExecutionWorkflow`, `hmlPromotionWorkflow`, `workflows`, `executionTemplateIds`, `applicationHubs`, `applicationHubNotifications`. Todos os imports em `WorkflowsProvider`, `01-Home`, `02-WorkflowTrackerList`, `03-WorkflowTrackerDetail`, `04-ApplicationHub` e `06-AssetsCatalog` continuam funcionando sem alteração.
- `migrationExecutionWorkflow` e `hmlPromotionWorkflow` são derivados via `requireWorkflow(id)` percorrendo `workflows[].onboardingSteps[].triggers`. JSON não tem referências, então cada trigger é o objeto inline dentro do step — single source of truth no JSON, sem duplicação top-level.

**Tradeoff aceito**
- JSON não permite referências cruzadas. Se algum dia houver dois workflows com o mesmo trigger, vira duplicação literal de dados — aceitável enquanto o catálogo for pequeno.

**Config**
- `tsconfig.app.json` ganhou `"resolveJsonModule": true` (TS 5 com `moduleResolution: bundler` ainda não liga isso por default).

## 2026-05-19 — Schema relacional em `database.json` (assetsCatalog + workflowTrackers + applicationHubs)

**Mudança estrutural**
- `database.json` foi rachado em 3 entidades relacionais top-level: `assetsCatalog`, `workflowTrackers`, `applicationHubs` (+ `applicationHubNotifications`). Cada workflow virou 2 registros — uma linha em `assetsCatalog` (metadata + steps de alto nível) e uma em `workflowTrackers` (definição detalhada com os steppers React Flow inner). FK: `workflowTrackers.assets_catalog_id → assetsCatalog.id`.
- Os 3 workflows existentes (Migração Vanilla / Execução Vanilla / Promoção HML) viraram catalog entries + trackers separados. Antes Execução Vanilla e Promoção HML viviam embedded como `triggers` em outer steps; agora são trackers independentes referenciados via `triggers_workflow_tracker_id` (extensão sobre o spec).
- Skills/MCPs/APIs antes só apareciam como string refs em `dependencies` — agora cada um é uma linha em `assetsCatalog` com category=`Skills`/`MCP`/`Apis`. `Sensors` ficou vazio (nenhum existente). `dependencies` em workflows passou a apontar pros ids do catálogo (`cat-skill-…`, `cat-mcp-…`, `cat-api-…`) em vez de strings soltas.

**Extensões sobre o spec do `PROGRESS.md`**
- `AssetCatalogItem` (category=workflows) tem campos extras opcionais: `owner`, `type`, `status`, `maturity`, `dependencies`, `inputs`, `usage`. Necessário pra preservar a metadata que `06-AssetsCatalog` já renderiza e pra reconstruir `WorkflowAsset` legacy sem perder informação.
- `WorkflowTrackerStep` (outer step) tem extras: `required`, `dependsOn`, `completedOnClick`, `ctaLabel`, `triggers_workflow_tracker_id`. Espelham `OnboardingStep` antigo + a relação parent→child entre trackers.
- `WorkflowTrackerInnerStep` (stepper React Flow) tem `agentic` opcional — metadata de PR proposto pelo agente, antes em `OnboardingStep.agentic`.

**Spelling: `needHumamAproval` e `isAprovadedByHumam`**
- Os nomes seguem literalmente o spec do `PROGRESS.md` (typos no PT-BR). Os types em `database.ts` (`WorkflowTrackerInnerStep`) reproduzem os mesmos nomes — não renomeie sem alinhar com o autor. Note que `WorkflowsProvider.tsx` ainda usa as variantes corretas (`needHumanApproval`, `isApprovedByHuman`) no tipo `ExecutionStep` interno; as duas grafias coexistem por enquanto.

**Compat layer em `database.ts`**
- API legacy preservada por mapeamento new→old no module load: `workflows`, `migrationWorkflow`, `migrationExecutionWorkflow`, `hmlPromotionWorkflow`, `executionTemplateIds`, `applicationHubs`, `applicationHubNotifications`. `WorkflowsProvider`, `01-Home`, `02-WorkflowTrackerList`, `03-WorkflowTrackerDetail`, `04-ApplicationHub` e `06-AssetsCatalog` seguem funcionando sem mudança.
- "Top-level workflows" calculado dinamicamente: tracker é top-level se nenhum outro tracker tem outer step com `triggers_workflow_tracker_id` apontando pra ele. Hoje só `wfk-migration-vanilla` é top-level.
- Novos exports disponíveis pra código novo: `assetsCatalog`, `workflowTrackers`, `AssetCatalogItem`, `WorkflowTracker`, `WorkflowTrackerStep`, `WorkflowTrackerInnerStep`, `AssetCategory`.

**Tradeoff aceito**
- `dependencies` em catalog items agora guarda *ids* do catálogo (FKs), mas a API legacy precisa de *slugs* (`scaffold-vanilla-app`, `kaptain.deploy`). O compat layer resolve via `catalogById.get(id)?.slug ?? id` — funciona mesmo se algum legacy data ainda tiver slug solto, sem migração forçada.

## 2026-05-19 — Steps novos do `wf-migration-vanilla` + clipboard rápido por step

**Steps redesenhados (substituem os 6 antigos)**
- `step-01-setup-cli` (Setup Inicial e Instalação de CLI) — pré-requisito Claude Code + CLI advantages.
- `step-02-login` — SSO Itaú; explica realm/validade/token storage.
- `step-03-select-sa` — agora carrega argumentação "por que monorepo vs multi-repo" + por-repo `platStatus` (`OFF-PLAT`/`ON-PLAT`) + `techDebtCount` com summary inline. Multi-repo é colocado explicitamente como incompatível com desenvolvimento agêntico (PRs não-atômicos).
- `step-04-migration-overview` — explica as 4 fases (Descoberta ~12min, Consolidação ~22min, Compliance ~4min, Deploy Produção ~4min) com bullets do PROGRESS.md.
- `step-05-watch-tracker` — ensina o usuário a acompanhar o WorkflowTracker; é o step que **dispara** `wfk-onboarding-vanilla-exec` (antes era o step-06 antigo).
- `step-06-watch-apphub` — pós-deploy; explica Application Hub com 4 cards de métricas (p95/erro/uptime/deploys 7d) batendo com `ahub-ssa-pix-core`.

**Extensão de schema: `clipboardCommand`**
- Novo campo opcional em `WorkflowTrackerStep` (extensão sobre o spec original do PROGRESS). Cada step do `wfk-migration-vanilla` carrega um comando CLI consumido pelo card "Clipboard rápido" no Home — renderizado no header da expansão antes do contexto rico. Definido como string única; quando a UI precisa de comandos dinâmicos (Seleção SA com flags `--repo`), eles ficam dentro do componente de detalhe e o clipboard top-level é o template-canônico.

**Tracker trigger movido**
- `triggers_workflow_tracker_id: wfk-onboarding-vanilla-exec` saiu de `step-04-configure-workflow` (deletado) e foi pra `step-05-watch-tracker`. O usuário "dispara o deploy" exatamente quando começa a acompanhar o tracker — modela melhor o fluxo mental.
- `wfk-promote-hml` continua na base mas **não é mais triggerado** pelo fluxo principal de onboarding. Fica disponível pra futuros consumidores que queiram usá-lo standalone.

**Limpezas no `01-Home.tsx`**
- Removidos: `TECH_DEBT` + `TechDebtItem` (info migrada pra `techDebtSummary` por-repo em `MOCK_SA_REPOS`), `VIABILITY_CHECKS` (não há mais step de viability), componentes `ViabilityCheckDetails` e `TrackStatusDetails`, icons `Download`/`ListChecks`/`Lock`.
- Renomeado: `Workflow` (lucide-react icon) → `WorkflowIcon` no import — colidia com o type `Workflow` re-exportado pelo `WorkflowsProvider`.
- Estrutura nova de expansão da ChecklistRow: "Clipboard rápido" (CommandBlock fixo) → `renderStepDetails(step.id)` (contexto rico). Componentes de detalhe não chamam mais `CommandBlock` pro comando-canônico — só renderizam contexto.

## 2026-05-19 — Pipeline server-side: 7 steps, auto-advance e gates humanos

**Steps redesenhados do `wfk-onboarding-vanilla-exec`** (substituem os 5 verbos antigos)
1. `exec-01-vuln-scan` — Varredura de Vulnerabilidades (Komply SAST/DAST/SBOM); auto-advance
2. `exec-02-auto-fix` — Correção de débitos técnicos (CVE patches, base image upgrade, Vault SecretProviderClass); auto-advance
3. `exec-03-build` — Build (Konstructor empacota OCI assinada); auto-advance
4. `exec-04-provision-infra` — Provisionamento (Kaptain provisiona EKS/RDS/networking); auto-advance
5. `exec-05-pr-approval` — Aprovação do PR (gate humano com diffs + GitHub link); `completedOnClick=false`, `agentic` com 4 arquivos de diff
6. `exec-06-deploy-approval` — Aprovação do Deploy on Prod (gate humano final); `completedOnClick=false`
7. `exec-07-deploy` — Deploy (Traffik canary 1% → 10% → 50% → 100%); auto-advance, provisiona o hub ao concluir

**Trigger movido pra step-04**
- `triggers_workflow_tracker_id: "wfk-onboarding-vanilla-exec"` saiu do `step-05-watch-tracker` e foi pro `step-04-migration-overview`. `step-05-watch-tracker` agora é só ensinar o usuário a abrir o tracker; o pipeline já está rodando.

**Auto-advance machinery (no `01-Home.tsx`)**
- `useEffect` em `Home` observa `executionWorkflow` + `execCurrentStep`. Se `step.canProgress === true` (i.e. `completedOnClick=true` no template), agenda `advanceStep(workflowId)` via `setTimeout(2500ms)`. Cleanup com `clearTimeout` no return.
- Steps com `canProgress=false` (`exec-05-pr-approval`, `exec-06-deploy-approval`) **pausam** o auto-advance. UI renderiza o card de aprovação correspondente; clicar em Aprovar chama `completeStep` que avança e o useEffect re-arma o timer pro próximo step.
- Constantes guard: `EXEC_AUTO_ADVANCE_MS=2500`, `EXEC_PR_STEP_ID`, `EXEC_DEPLOY_GATE_STEP_ID`.

**ExecutionStepper (componente novo)**
- Horizontal, 7 nós com label curto + ícone + status. Step atual ganha `border-accent`, `shadow-[0_0_0_4px_rgba(255,107,44,0.12)]` e um pulse-live no canto. Conectores entre nós ficam verdes se o step anterior tá done, gradient accent→border se é o ativo, e cinza caso pendente. `EXEC_STEP_META` mapeia step.id → `{ shortLabel, icon }`.

**Cards de aprovação inline**
- `ExecPrApprovalCard` lê `agentic` do template (4 arquivos: pom.xml, Dockerfile, PaymentService.java, k8s/secrets.yaml). Mostra PR title/author/summary, totais `+adds`/`-dels`, preview do 1º arquivo, link "Ver no GitHub" (URL stub `github.itau.com.br/pix-platform/pix-core/pull/4287`). Aprovar chama `resolveAgenticItem` + `completeStep` — a primeira fecha o agentic item da `pendingAgenticFlow`, a segunda avança o step.
- `ExecDeployApprovalCard` é mais leve: 3 KPIs (PR aprovado / Infra provisionada / Canário 1% → 100%) + Aprovar/Recusar. Aprovar chama só `completeStep`.

**Provisionamento de hub: só Deploy**
- `HUB_PROVISIONING_TEMPLATE_IDS` em `WorkflowsProvider` reduzido a `{ 'wf-onboarding-vanilla-exec' }`. `wf-migration-vanilla` saiu — não provisiona mais hub na sua trajetória final. Resultado: o hub `ahub-ssa-pix-core` só existe depois que o user aprovou o Deploy e o `exec-07-deploy` terminou.
- `applicationHubs` em `database.json` agora começa vazio (`[]`). Antes tinha o hub seed do ssa-pix-core; isso conflitava com o requisito "Somente ao chegar na etapa de Deploy e essa etapa ter sido aprovado gere um applicationHub".

## 2026-05-19 — Stepper compartilhado + auto-advance no provider + query simulada no ApplicationHub

**Auto-advance migrado pro provider**
- O `useEffect` que agendava `setTimeout` pra avançar steps com `canProgress=true` saiu de `01-Home.tsx` e foi pra `WorkflowsProvider`. Pra cada workflow em `running`, o provider observa o step atual e agenda um avanço único após `AUTO_ADVANCE_INTERVAL_MS` (2500ms). Cleanup limpa todos os timers. Re-arma a cada mudança de `workflows`.
- Por que: antes, sair da Home interrompia o pipeline. Agora ele progride mesmo se o user estiver na `WorkflowTrackerList` ou no `WorkflowTrackerDetail` — comportamento esperado de "trabalho server-side" rodando em background.

**`ExecutionTrackerView` compartilhado**
- Criado `src/components/ExecutionTrackerView.tsx` contendo `ExecutionStepper`, `ExecPrApprovalCard`, `ExecDeployApprovalCard` + composite `ExecutionTrackerView` que encapsula a derivação de step corrente e os handlers de approval (chamam `completeStep` / `resolveAgenticItem` do contexto).
- `01-Home.tsx` removeu ~330 linhas de inline (stepper + cards + constantes `EXEC_STEP_META`/`EXEC_PR_STEP_ID`/etc.) e agora usa só `<ExecutionTrackerView workflow={executionWorkflow} />`. Mesmo componente é usado em `03-WorkflowTrackerDetail` quando a URL bate com uma instância real do exec.

**Query simulada em `04-ApplicationHub`**
- `useEffect` reagindo a `applicationHubs` + `workflows` faz a "consulta": calcula os hubs cuja workflow de origem tem `status === 'completed'`, depois aplica `setTimeout(600ms)` antes de popular `displayedHubs`. Loading state mostra spinner + URL stub `GET /api/application-hubs?status=completed`. `displayedHubs` substitui `applicationHubs` em todo o render — empty state, `StatRow apps={...}`, contador, table — mantendo o filtro de `completed` em todos os lugares.
