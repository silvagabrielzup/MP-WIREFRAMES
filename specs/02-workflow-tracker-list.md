Gere a tela de lista do Workflow Tracker (rota: /workflows).

Layout:

\- Sidebar + Topbar conforme contexto mestre

\- Header da página:

&#x20; - Breadcrumb: Workflow Tracker

&#x20; - Título: "Workflows"

&#x20; - Subtítulo: "Acompanhe execuções agênticas em tempo real"

&#x20; - Indicador "live · 3 ativos"

\- Barra de filtros (sticky abaixo do header):

&#x20; - Search por workflow\_id, user

&#x20; - Multi-select de status (running, success, failed, awaiting human, cancelled)

\- Tabela densa (não cards):

&#x20; - Colunas: Status badge | Nome | Step atual |Duração | Custo (R$) 

&#x20; - Row hover destaca

&#x20; - Status badges com cores:

&#x20;   - Verde sólido: success

&#x20;   - Azul pulsante: running

&#x20;   - Vermelho: failed

&#x20;   - Amarelo: awaiting human

&#x20;   - Cinza: cancelled

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

