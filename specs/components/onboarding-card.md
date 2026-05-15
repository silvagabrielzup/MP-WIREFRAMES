## Card Principal

- Heading "Próximos passos"
- Indicador à direita do título: "3 de 8 passos · 38% completo" com mini barra horizontal slim
- Lista vertical de 8 cards de onboarding empilhados, cada card com:
  - Checkbox grande à esquerda (3 estados visuais: not-started vazio, in-progress com spinner, done com check verde)
  - Ícone do passo (lucide-react)
  - Título do passo + descrição de 1 linha logo abaixo
  - Mini-meta à direita: tempo estimado ("~2min"), badge de estado atual quando aplicável (ex: "CLI v1.4.2 instalado")
  - CTA inline "Abrir →" que linka pra tela relevante
  - Botão "..." com opções: dispensar, marcar como feito manualmente, lembrar depois
  - Cards done: colapsados em formato mais compacto, atenuados, sem CTA visível
  - Card in-progress: borda accent (azul), badge pequeno "em curso"
  - Cards pending posteriores ao in-progress: aparência normal mas levemente atenuados

Os 8 passos canônicos:
1. Instalar CLI do StackSpot — ícone Terminal — CTA → /cli/install
2. Permissionar acesso ao Itaú Cloud — ícone ShieldCheck — CTA → /access/request
3. Selecionar repos pra migração — ícone GitBranch — CTA → /migration/repo-picker
4. Configurar workflow de onboarding — ícone Settings — CTA → /workflows/new
5. Disparar primeira execução — ícone Play — CTA → /workflows
6. Validar resultado em dev — ícone CheckCircle2 — CTA → /workflows/wf-7a2b1c
7. Promover pra homologação — ícone Rocket — CTA → /applications/ssa-pix-core
8. Configurar observabilidade — ícone Activity — CTA → /applications/ssa-pix-core?tab=obs

- Placeholder : Quando o usuário não tiver nenhuma tarefa preenchida , mostre um placeholder seguindo essa spec 'placeholder.md' , coloque um botão de primary CTA para Assets Catalog

Dados mockados:
- Não use dados mockados 

Estilo:
- Reusar paleta, tokens, Card/Badge/Button de 01-Home
- Hierarquia visual clara entre estados: not-started (normal) < in-progress (accent border + badge) < done (atenuado + check verde)
- Done NÃO usa verde forte — só o check e texto cinza
- Manter os 3 estados visualmente coerentes — o toggle é decorativo mas tem que renderizar tudo certo

Requisitos de steps : 

3. Selecionar repos pra migração :
 - CONTEXT : este step se baseia transferir o projeto que está em um repo X para um estrutura de mono-repo do projeto . 
 - REQUIREMENT : 
    - Abrir um modal , para colocar o link do repositório . Será um modal com múltiplos steps , o primeiro step será para buscar o repositório , o segundo step será para mostrar um diff de estava o repo e uma estrutura para como o repo irá ficar .
  - DADOS : 
    - Para o repositório , traga uns dados mockados

## Estado atual — iterações pós-MVP (2026-05-15)

### Fonte de dados

O card consome `WorkflowsProvider.workflows`. Pega a instância primária (`templateId` ∉ `executionTemplateIds`) e renderiza seus steps. Quando `lastWorkflow.status === 'completed'`, o card é substituído pelo componente `CongratsAlert` (gradient success → accent, confete SVG, PartyPopper, CTAs pra Application Hub + Workflow Tracker).

### Steps canônicos atuais — 6 passos

Os 8 originais foram reduzidos pra 6 ao longo das iterações (`step-05-trigger-first-run` e `step-08-setup-observability` removidos):

1. `step-01-install-cli` — Instalar CLI do StackSpot — `completedOnClick: true` — CTA "Baixar CLI"
2. `step-02-permission-cloud` — Permissionar acesso ao Itaú Cloud — `completedOnClick: true` — CTA "Solicitar acesso"
3. `step-03-select-repos` — Selecionar repos pra migração — `completedOnClick: false` — CTA "Selecionar repos" → abre `RepoPickerModal`
4. `step-04-configure-workflow` — Lançar workflow de onboarding — `completedOnClick: true` — CTA "Lançar workflow" — `triggers: migrationExecutionWorkflow`
5. `step-06-validate-dev` — Validar resultado em dev — `completedOnClick: false` — CTA "Ver checks"
6. `step-07-promote-hml` — Promover pra homologação — `completedOnClick: true` — CTA "Promover pra HML" — `triggers: hmlPromotionWorkflow`

### Props adicionadas em `OnboardingStep`

- `completedOnClick: boolean` — controla se o clique direto na linha conclui o passo.
- `ctaLabel: string` — texto do botão CTA (em vez de "Abrir →" genérico).
- `triggers?: WorkflowAsset` — dispara workflow ligado ao concluir.
- `agentic?: AgenticPropositionMetadata` — passo agêntico com Accept/Decline.

### Render

- Lista vertical de `OnboardingStepRow` com checkbox (3 estados), título, descrição e botão CTA com `ctaLabel`.
- Botão CTA é accent quando o step é o atual + `completedOnClick=true`; cinza neutro caso contrário.
- Linha e botão CTA compartilham `onActivate(step)`.
- Progresso (`X de N · pct%`) calcula sobre todos os passos do workflow.

### Modal de step-03 — 3 passos

Documentado em detalhe em `01-home.md` (seção "Repo Picker Modal"). Resumo:

1. **Buscar Serviço de Aplicação** — search por SA, retorna 5 repos da família (código, ci/cd, infra, db, config).
2. **Estrutura mono-repo** — Antes (multi-repo) vs Depois (mono-repo unificado) com `TreeNodeView` recursivo (Folder/FolderOpen + chevron, ações mov/novo/remov).
3. **Débitos técnicos resolvidos** — 6 débitos infra com par "Hoje" / "Pós-migração".  