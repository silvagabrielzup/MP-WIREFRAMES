Gere a tela inicial do Management Plane (rota: /).

Layout:

\- Sidebar + Topbar conforme contexto mestre

\- Conteúdo principal dividido em 3 seções verticais:


\## Seção 1 — Hero compacto (não card)

\- "Bom dia, Luigi" (ou nome do user)

\- Linha resumo: "Você tem 3 workflows ativos em 2 SAs e 1 aprovação pendente"

\- Botão primário: "+ Onboardar nova SA"


\## Seção 2 — Gere um card com base no "./onboarding-card.md"


\## Seção 3 — Resumo de pontos de atenção (2 colunas)

\- Coluna esquerda: "Fluxos agenticos pendentes aprovacao"

&#x20; - Lista de 5 itens com nome do workflow, nome da ação que necessidade de aprovação

\- Coluna direita: "Alertas da Aplication Hub"

&#x20; - Aprovações pendentes (Komply)

&#x20; - Workflows com falha últimas 24h

&#x20; - Violações de policy novas

\## Seção 4 — Resumo da saúde da apliação (2 colunas)

\- Título: "Saúde da Aplication Hub"

\- Cards com títulos , nível da saúde da aplicação e botão com CTA para levar a aplicação


Estilo:

\- Densidade alta mas respirável

\- Use ícones lucide-react para cada motor e cada tipo de evento

\- Estado vazio elegante para cada seção quando não há dados

\- Real-time indicator visível na seção 3

\- Não tenha mais nenhum dado mockado



\## Estado atual — iterações pós-MVP (2026-05-15)



\### Layout final



Três seções verticais:



1. \*\*Hero compacto\*\* — "Bom dia, Luigi" + subtítulo curto. Sem botão "+ Onboardar nova SA" (o onboarding chega via `addWorkflow` no Assets Catalog ou via deeplink).

2. \*\*Linha 50/50 (grid 2 colunas em `lg:`)\*\* — Card "Próximos passos" (esquerda) + Card "Fluxos agênticos pendentes aprovação" (direita). Em telas estreitas empilham.

3. \*\*Linha full-width\*\* sob header "Pontos de atenção" — Card "Alertas da Application Hub". Header NÃO tem mais o badge LIVE (removido).



Seção 4 (saúde da Application Hub) foi consolidada na própria `/application-hub` — não é mais responsabilidade da Home.



\### Card "Próximos passos"



Detalhamento completo em `components/onboarding-card.md` (seção "Estado atual"). Resumo:

\- Render dirigido pelo `WorkflowsProvider`: pega a instância primária (workflow cujo templateId NÃO está em `executionTemplateIds`); fallback pra última instância adicionada.

\- Quando `lastWorkflow.status === 'completed'`, o card é \*\*substituído\*\* pelo componente `CongratsAlert` (gradient success → accent + confete SVG + PartyPopper + CTAs pra Application Hub e Workflow Tracker).

\- Caso contrário, renderiza `OnboardingCard` com a lista sequencial de passos.



\### Card "Fluxos agênticos pendentes aprovação"



\- Header com ícone `Sparkles` accent (substituiu o ícone Workflow neutro original).

\- Lista deriva de `instances.flatMap(wf => wf.pendingAgenticFlow.map(...))`. Cada linha:

  \- Ícone Sparkles em badge accent + pulse `live` no canto direito quando o item é fresh (<60s desde `createdAt`).

  \- Título do step + badge "agêntico" + timing relativo ("agora" / "há Ns" / "há Nmin").

  \- PR title (mono).

  \- Summary multi-linha (clamped a 2 linhas).

  \- Linha de meta: autor · `FileText` arquivos modificados · `+N` adicionadas · `-N` removidas · workflow name.

  \- Linha inteira é `<Link to="/workflows/{wfId}">` — leva pro detail onde está Aprovar/Declinar.

\- Empty state via componente `EmptyState` quando `pendingAgenticItems.length === 0`.



\### Card "Alertas da Application Hub"



\- Header com ícone `AlertTriangle` muted.

\- Lista deriva de `useWorkflows().appHubAlerts` (state da provider). Itens são emitidos pelo `advanceStep` quando o workflow primário conclui.

\- Cada alerta tem `kind: 'approval' | 'failure' | 'policy'` mapeando pra ícone (Clock3 / AlertTriangle / ShieldCheck) e cor (warning / failure / info).



\### Trigger handlers



\- Clique em `OnboardingStepRow` → `handleStepActivate(step)`.

\- `step.stepId === 'step-03-select-repos'` → abre `RepoPickerModal` (modal multi-step, ver seção abaixo).

\- `step.completedOnClick === true` → chama `advanceStep(lastWorkflow.id)` no provider.

\- Após `advanceStep`, se o template-step tinha `triggers`, dispara `addWorkflow(triggers)` (com dedupe por `templateId`).



\### Repo Picker Modal (step-03)



Modal de 3 passos com header (chips 1/2/3), body conforme step, footer (Cancelar / Voltar / Próximo / Confirmar migração):



1. \*\*Buscar Serviço de Aplicação\*\*: input por SA (default `ssa-pix-core`). Resultado mostra metadata do serviço + lista dos repos da família (código, ci/cd, infra, db, config) — cada um com ícone por kind, stack, tamanho, último commit.

2. \*\*Estrutura mono-repo\*\* (DIFF): grid Antes/Depois. Antes empilha N árvores (uma por repo) em caixinhas; Depois mostra a árvore unificada em `apps/<sa-id>/{src,ci,infra,db,config}` + tooling Vanilla (`komply.yaml`, `orkestra.yaml`, `tooling/vanilla.lock`). Componente `TreeNodeView` recursivo com chevron + Folder/FolderOpen + indentação por depth. Ações em cada nó: `mov`/`novo`/`remov` com cores info/success/failure.

3. \*\*Débitos técnicos resolvidos\*\* — lista de débitos infra que a migração fecha (Jenkins free-form, secrets em repo, sem auto-rollback, CVE scan ausente, dashboards ad-hoc, schema manual). Cada item com par "Hoje" / "Pós-migração".



Confirmar migração no step 3 → `advanceStep` no workflow primário.

