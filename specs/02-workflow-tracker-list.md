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


\- Tabela densa (não cards):

&#x20; - Colunas: Status badge | Workflow ID | Tipo | Início | Duração | Custo (R$) | Step atual

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

