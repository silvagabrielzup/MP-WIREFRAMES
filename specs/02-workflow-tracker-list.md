Gere a tela de lista do Workflow Tracker (rota: /workflows).



Layout:

\- Sidebar + Topbar conforme contexto mestre

\- Header da página:

&#x20; - Breadcrumb: Workflow Tracker

&#x20; - Título: "Workflows"

&#x20; - Subtítulo: "Acompanhe execuções agênticas em tempo real"

&#x20; - Indicador "live · 23 ativos"



\- Barra de filtros (sticky abaixo do header):

&#x20; - Search por workflow\_id, SA, user

&#x20; - Multi-select de SA

&#x20; - Multi-select de status (running, success, failed, awaiting human, cancelled)

&#x20; - Select de tipo (onboarding-vanilla-brownfield e outros)

&#x20; - Select de tempo (last 1h, 24h, 7d, 30d)

&#x20; - Toggle: "Só meus workflows"



\- Tabela densa (não cards):

&#x20; - Colunas: Status badge | Workflow ID | Tipo | SA | Usuário (avatar+nome) | Início | Duração | Custo (R$) | Step atual

&#x20; - Row hover destaca

&#x20; - Status badges com cores:

&#x20;   - Verde sólido: success

&#x20;   - Azul pulsante: running

&#x20;   - Vermelho: failed

&#x20;   - Amarelo: awaiting human

&#x20;   - Cinza: cancelled

&#x20; - Em running, mostre mini progress bar embaixo do row

&#x20; - Coluna "Step atual" mostra ícone do verbo Vanilla atual (build/deploy/migration/rollout)

&#x20; - Click no row vai pro detalhe

&#x20; - Paginação ou infinite scroll



\- Painel lateral direito colapsável (default fechado):

&#x20; - Quando aberto, mostra preview do workflow selecionado

&#x20; - Mini timeline dos steps

&#x20; - Botões: "Ver detalhe completo", "Replay"



Dados mockados:

\- 20-30 linhas variadas com diferentes SAs, status, tipos, durações

\- Pelo menos 3 em running visível

\- 2 em awaiting human

\- 2 com failure

\- Mistura de success de diferentes tempos

