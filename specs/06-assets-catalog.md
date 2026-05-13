Gere a tela principal do Assets Catalog focada em SAs (rota: /catalog).



Layout:

\- Sidebar + Topbar

\- Header:

&#x20; - Breadcrumb: Assets Catalog

&#x20; - Título: "Catálogo"

&#x20; - Toggle de tipo (chips): SAs (default selecionado), APIs, Containers, DynamoDB, SQS, MonoRepos, Agentes, Skills, MCP Tools, Policies, Workflows, Groups

&#x20; - Search global



\- Barra de filtros (quando "SAs" selecionado):

&#x20; - Status ON-PLAT (toggle)

&#x20; - Owner (multi-select)

&#x20; - Tribo (multi-select)

&#x20; - Score IUConfia (range slider)

&#x20; - Tags



\- Grid responsivo de cards de SA (ou toggle pra view de tabela):

&#x20; - Cada card:

&#x20;   - Nome da SA (ex: "ssa-pix-core")

&#x20;   - Badge ON-PLAT (se aplicável)

&#x20;   - Owner (avatar + nome do squad)

&#x20;   - Score IUConfia (donut chart pequeno)

&#x20;   - 3 mini-stats: workflows 7d, deploys 7d, último deploy

&#x20;   - Tags

&#x20;   - Click vai pro detalhe da SA



\- Sidebar direita (default aberto): "Filtros aplicados" + contagem de resultados



Estilo:

\- Grid denso mas escaneável

\- Donut chart visualmente forte no IUConfia (atrai olhar)

\- Estado vazio elegante

\- Dados mockados: 18-24 SAs variadas, mistura ON-PLAT e off-plat

