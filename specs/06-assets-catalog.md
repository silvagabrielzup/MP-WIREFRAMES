# 06 — Assets Catalog

Rota: `/catalog` (alias: `/assets`)

## Missão

Catalogar os building blocks agênticos (workflows, skills, MCPs, sensors, APIs) que compõem o harness. Hoje é vitrine pequena — no futuro vira marketplace interno conforme criação de flows abre pra usuários.

## Componentes

- Tab de **Agentic Assets** organizado por tipo:
  - **Workflows** (no MVP, só o de migração + suas partes)
  - **Skills**
  - **MCPs**
  - **Sensors**
  - **APIs**
- Ao selecionar um workflow (hoje apenas o de migration), popular o to-do list do Home com os passos desse workflow.
- Detalhe por asset com:
  - Descrição
  - Owner
  - Status
  - Uso (consumidores / frequência)

## Considerações técnicas — importante

Definir **agora** o schema de metadata dos assets, especialmente de workflows. Fixar esse contrato cedo evita refactor caro depois quando houver 10+ workflows. Mesmo que hoje só preencha pro de migração, o schema fica de pé.

### Schema de Workflow (campos críticos)

- **Identidade**
  - `id` — identificador estável (ex: `wf-migration-vanilla`)
  - `name` — nome legível
  - `version` — semver
  - `owner` — squad / pessoa responsável
- **Descrição e tipo**
  - `description` — o que faz, quando usar
  - `type` — onboarding · build · deploy · rollout · migration · custom
- **Onboarding steps**
  - Lista ordenada de passos que o Home consome para montar o to-do contextual ao usuário.
  - Cada step: `id`, `title`, `description`, `required`, `dependsOn[]`.
- **Dependências**
  - `skills[]` — skills consumidas
  - `mcps[]` — MCP tools consumidas
  - `apis[]` — APIs consumidas
- **Inputs esperados**
  - Lista de parâmetros: `name`, `type`, `required`, `description`, `default?`.
- **Status / maturidade**
  - `status` — draft · beta · stable · deprecated
  - `maturity` — experimental · production-ready

### Schemas dos demais assets

Esqueleto mínimo equivalente (id, nome, versão, owner, descrição, status, uso), com extensões específicas por tipo:

- **Skill** — `category`, `inputs`, `outputs`, `referenced_tools[]`
- **MCP** — `server`, `tools[]`, `permission_scope`, `op_type` (read-only / mutating)
- **Sensor** — `category` (security/quality/perf/compliance), `severity_default`, `engine`
- **API** — `base_url`, `auth_type`, `endpoints[]`

## MVP — escopo concreto

- A única tab com dados reais é **Workflows**, com **1 workflow** (migration) e seus steps preenchidos conforme schema.
- As demais tabs (Skills, MCPs, Sensors, APIs) renderizam a estrutura, com cards mockados leves apenas para mostrar o formato — mas o schema delas já é o definitivo.
- A seleção do workflow de migration no catálogo deve disparar a hidratação do to-do list do Home com os `onboarding steps` do workflow.

## Estado atual — iterações pós-MVP (2026-05-15)

### Implementação

- `database.ts` é o catálogo. `workflows: WorkflowAsset[]` contém apenas `migrationWorkflow` (primário). `migrationExecutionWorkflow` e `hmlPromotionWorkflow` ficam como exports separados, referenciados via `step.triggers` — não aparecem na vitrine, são execuções ligadas.
- Click em "Usar" no card de workflow chama `useWorkflows().addWorkflow(wf.id)` → cria `WorkflowInstance`, navega pra `/`.

### Schema expandido — `OnboardingStep`

Campos adicionados ao MVP original (`id`, `title`, `description`, `required`, `dependsOn[]`):

- `completedOnClick: boolean` — passo é concluído ao clique direto no card "Próximos passos" da Home. True pra `step-01-install-cli`, `step-02-permission-cloud`, `step-04-configure-workflow`, `step-07-promote-hml`. False pra steps que precisam de sinal externo (`step-03-select-repos`, `step-06-validate-dev`).
- `ctaLabel: string` — texto do botão de CTA renderizado no card de passos da Home.
- `triggers?: WorkflowAsset` — workflow disparado automaticamente quando o passo é concluído. step-04 → `migrationExecutionWorkflow`; step-07 → `hmlPromotionWorkflow`. A instância gerada aparece no `WorkflowTrackerList` filtrado por execuções.
- `agentic?: AgenticPropositionMetadata` — proposição agêntica (kind 'pr' + prTitle, prAuthor, prSummary, files com hunks de diff). Quando presente, exige Accept/Decline humano no Workflow Tracker Detail e povoa `pendingAgenticFlow` da instância.
- `finalStep?: boolean` — marca o último passo. Ao entrar nele, o workflow já é considerado `completed` (eager-complete) — hub do Application Hub é provisionado, alerta é emitido, e os `triggers` do próprio finalStep disparam via provider.

### Schema expandido — `WorkflowAsset`

Mantido o schema do MVP. Nenhum campo adicionado no asset em si — todo o controle de fluxo migrou pros steps.

### Steps canônicos do `migrationWorkflow` atual

`step-01-install-cli`, `step-02-permission-cloud`, `step-03-select-repos`, `step-04-configure-workflow` (triggers `migrationExecutionWorkflow`), `step-06-validate-dev`, `step-07-promote-hml` (triggers `hmlPromotionWorkflow`, `finalStep: true`).

Steps `step-05-trigger-first-run` e `step-08-setup-observability` foram **removidos** ao longo das iterações — registrados em PROGRESS pra histórico.

### Workflows de execução

- **`migrationExecutionWorkflow`** (id `wf-onboarding-vanilla-exec`) — pipeline disparado ao concluir step-04. 5 steps: build (Konstructor) → **agentic-java-21-upgrade** (agente propõe PR Java 8 → 21) → deploy (Kaptain) → migration (dual-write) → rollout (Traffik).
- **`hmlPromotionWorkflow`** (id `wf-promote-hml`) — disparado ao entrar/concluir step-07. 4 steps: canário 5% → canário 50% (gate humano) → canário 100% → smoke test.
