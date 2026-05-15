Gere a tela de lista do Workflow Tracker (rota: /workflows).

Layout:

\- Sidebar + Topbar conforme contexto mestre

\- Header da página:

&#x20; - Breadcrumb: Workflow Tracker

&#x20; - Título: "Workflows"

&#x20; - Subtítulo: "Acompanhe execuções agênticas em tempo real"

&#x20; - Indicador "live · 3 ativos"

\- Barra de filtros (sticky abaixo do header):

&#x20; - Multi-select de status (running, success, failed, awaiting human, cancelled)

\- Tabela densa (não cards):

&#x20; - Colunas: Check verde se o status for success , se o status for de erro um icone de X vermelho , agora para qualquer outro status deixe loading circle spinner amarelo rodando | Nome | Step atual |Duração | Custo (R$) 

&#x20; - Row hover destaca

&#x20; - Status badges com icone e texto:

&#x20;   - Check verde sólido : success 

&#x20;   - Loading Circle Amarelo : awaiting  human

&#x20;   - Icone de X vermelho: failed

&#x20;   - Amarelo: awaiting human

&#x20;   - Azul Loading Circle Rodando: running

&#x20;   - Icon Cinza redondo com um linha cortando ao meio: cancelled

&#x20; - Click no row vai pro detalhe

&#x20; - Paginação ou infinite scroll


\- Painel lateral direito colapsável (default fechado):

&#x20; - Quando aberto, mostra preview do workflow selecionado

&#x20; - Mini timeline dos steps

&#x20; - Botões: "Ver detalhe completo", "Replay"


Dados mockados:

\- 5-10 linhas variadas com diferentes SAs, status, tipos, durações

\- Pelo menos 2 em running visível

\- 1 em awaiting human

\- 1 com failure

\- Mistura de success de diferentes tempos



\## Estado atual — iterações pós-MVP (2026-05-15)



\### Fonte de dados



Lista consome `useWorkflows().workflows` (state runtime) e filtra para mostrar \*\*só execuções ligadas\*\* — instâncias cujo `templateId ∈ executionTemplateIds`. Workflows primários (onboarding na Home) ficam fora da listagem.



Empty state direciona o usuário pra Home (não mais pro Catalog): "Execuções aparecem aqui quando um workflow de onboarding lança seu pipeline ligado".



\### Filtros



\- Multi-select de status `running | success | failed | awaiting | cancelled` mantido.

\- \*\*Default ativo: `running`\*\* — usuário já abre vendo workflows em execução. "Limpar" remove todos os filtros.



\### Tabela — colunas atuais



| Status | Nome | Step atual | Duração | Custo (R$) | \*\*Ação\*\* |

|---|---|---|---|---|---|

| ícone por status | templateName + wfId/templateId | `idx/total` + step.title | `formatDuration(startedAt)` | — | \*\*botão "Avançar/Concluir" por linha\*\* |



Ícones de status:

\- `success` → `CheckCircle2` verde

\- `failed` → `XCircle` vermelho

\- `cancelled` → `CircleSlash` muted

\- `running` → `Loader2` info girando

\- `awaiting` → `Loader2` warning estático



\### Coluna "Ação"



Botão accent com ícone `Check` chamando `advanceStep(w.id)` no clique (com `stopPropagation` pra não disparar a navegação da linha). Label muda pra "Concluir" quando é o último step; senão "Avançar". Workflows em status `completed`/`failed` mostram label "encerrado" sem botão.



\### Navegação



Click na linha (não no botão) navega pra `/workflows/{w.id}`.

