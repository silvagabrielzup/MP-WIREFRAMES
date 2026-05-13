Gere a tela de detalhe de um motor específico (rota: /control-planes/kaptain).



Usar Kaptain como exemplo, mas o layout deve servir pros 7 motores.



Layout:

\- Sidebar + Topbar

\- Header:

&#x20; - Breadcrumb: Control Planes / Kaptain

&#x20; - Título: "Kaptain"

&#x20; - Sub-info: "Orquestração central de CD · Owner: Time Kaptain"

&#x20; - Status badge grande

&#x20; - Botões direita: "Configurações (read-only)", "Logs", "Histórico"



\- Tabs:

&#x20; - \*\*Overview\*\* (default)

&#x20; - \*\*Deploys ativos\*\*

&#x20; - \*\*Infra provisionada\*\*

&#x20; - \*\*Eventos\*\* (cronológico)

&#x20; - \*\*Por SA\*\* (visão filtrada por aplicação)



\## Tab Overview



\- Linha de KPIs (4 cards mini lado a lado):

&#x20; - Throughput atual + delta vs. baseline

&#x20; - Taxa de sucesso 1h + delta

&#x20; - Latência p99 + delta

&#x20; - Custo agregado dia + delta



\- Gráfico de tempo (linha temporal de 24h):

&#x20; - Throughput de deploys

&#x20; - Falhas overlay

&#x20; - Eventos críticos marcados



\- 2 colunas abaixo:

&#x20; - \*\*Esquerda — Deploys recentes\*\* (tabela compacta):

&#x20;   - SA, env, status, duração, quando, quem disparou

&#x20; - \*\*Direita — Eventos do motor 24h\*\* (lista cronológica):

&#x20;   - timestamp, tipo de evento, severity



\- Banner inferior com aprovações pendentes que dependem do Kaptain (se houver)



Estilo:

\- Mantenha layout consistente com o dashboard pra que os 7 motores tenham a mesma estrutura visual

\- Cards de KPI com delta colorido (verde se melhorou, vermelho se piorou)

\- Dados mockados realistas

