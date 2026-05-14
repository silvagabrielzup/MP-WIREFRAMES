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
