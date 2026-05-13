Gere a tela de detalhe de uma SA (rota: /catalog/sa/\[id]).



Use "ssa-pix-core" como exemplo.



Layout:

\- Sidebar + Topbar

\- Header:

&#x20; - Breadcrumb: Catalog / SAs / ssa-pix-core

&#x20; - Título: "ssa-pix-core"

&#x20; - Sub-info: descrição curta, badge ON-PLAT, owner (avatar + squad + tribo)

&#x20; - Ações direita: "Disparar workflow", "Edit ownership", "..."



\- Linha de scorecards horizontal (sticky, importante):

&#x20; - IUConfia geral (donut grande)

&#x20; - Segurança, Qualidade, Performance (3 mini-donuts)

&#x20; - Cobertura de testes

&#x20; - Débito técnico residual

&#x20; - Cada scorecard com delta vs. último mês



\- Tabs:

&#x20; - \*\*Overview\*\* (default)

&#x20; - \*\*Workflows recentes\*\*

&#x20; - \*\*Infra\*\*

&#x20; - \*\*APIs expostas\*\*

&#x20; - \*\*Dependências\*\*

&#x20; - \*\*Histórico\*\*



\## Tab Overview



\- 2 colunas:

&#x20; - \*\*Esquerda (60%) — Resumo\*\*:

&#x20;   - "Sobre esta SA": descrição estruturada, repositório (monorepo), branch

&#x20;   - "Atividade últimos 7 dias": gráfico de barras (deploys, workflows, incidentes)

&#x20;   - "Última execução de workflow": card resumido com link pra detalhe



&#x20; - \*\*Direita (40%) — Infra rápida\*\*:

&#x20;   - Lista de assets associados:

&#x20;     - Containers EKS (3): com nome, status

&#x20;     - DynamoDB (2): tabelas

&#x20;     - SQS (1): fila

&#x20;     - APIs expostas (4): com versão

&#x20;   - Cada item clicável vai pro detalhe do asset



\- Seção inferior: "Mapa de dependências (preview)"

&#x20; - Visualização simples mostrando esta SA e suas dependências e dependentes diretos

&#x20; - Placeholder se grafo completo for fora do escopo do MVP



Estilo:

\- Scorecards são protagonistas (puxam olhar)

\- Dados mockados realistas

\- Use ícones lucide-react para cada tipo de asset

