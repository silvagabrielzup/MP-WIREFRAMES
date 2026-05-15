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
