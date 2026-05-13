Gere a tela principal do Assets Catalog focada em SAs (rota: /catalog).



Layout:

\- Sidebar + Topbar

\- Header:

&#x20; - Breadcrumb: Assets Catalog

&#x20; - Título: "Catálogo"

&#x20; - Toggle de tipo (chips): SAs (default selecionado), APIs, Containers, DynamoDB, SQS, MonoRepos, Agentes, Skills, MCP Tools, Sensores, Policies, Workflows, Groups

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



\## Listagem — Workflows



\- Barra de filtros (quando "Workflows" selecionado):

&#x20; - Tipo (chips): onboarding, build, deploy, rollout, migration, custom

&#x20; - Motor envolvido (multi-select): Kaptain, Komply, Konstructor, Orkestra, Traffik, Pantheon, Migration

&#x20; - Status (chips): active, draft, deprecated

&#x20; - SA consumidora (multi-select)

&#x20; - Owner / squad (multi-select)

&#x20; - Frequência de uso (range): execuções nos últimos 30d



\- Grid responsivo de cards de Workflow (ou toggle pra view de tabela):

&#x20; - Cada card:

&#x20;   - Nome do workflow em mono (ex: "onboarding-vanilla-brownfield")

&#x20;   - Badge de tipo (onboarding / rollout / migration / ...)

&#x20;   - Linha de motores envolvidos com ícones lucide-react (Rocket = Kaptain, ShieldCheck = Komply, etc.)

&#x20;   - Mini-stats: execuções 7d, taxa de sucesso, p95 de duração, # de SAs que consomem

&#x20;   - Sparkline SVG inline da frequência de execução 30d

&#x20;   - Owner / squad e última execução com status dot

&#x20;   - Tags

&#x20;   - Click vai pro detalhe do workflow (rota: /workflows/:nome)



\- Dados mockados: 16-22 workflows variados, mistura entre os 4 verbos da Operação Vanilla e custom



\## Listagem — Skills



\- Barra de filtros (quando "Skills" selecionado):

&#x20; - Categoria (chips): codegen, review, security, observability, infra, data, docs

&#x20; - Owner / squad (multi-select)

&#x20; - Versão (chips): stable, beta, deprecated

&#x20; - Agente consumidor (multi-select)

&#x20; - Tags



\- Grid responsivo de cards de Skill (ou toggle pra view de tabela):

&#x20; - Cada card:

&#x20;   - Nome da skill em mono (ex: "review-pr-comments", "scaffold-vanilla-app")

&#x20;   - Badge de categoria

&#x20;   - Descrição curta (1 linha)

&#x20;   - Versão (semver) + status (stable / beta / deprecated)

&#x20;   - Mini-stats: # de agentes que consomem, invocações 7d, taxa de sucesso, p95 de duração

&#x20;   - Owner / squad e última atualização

&#x20;   - Lista compacta de tools/MCP que a skill referencia (até 3, "+N" pro restante)

&#x20;   - Tags

&#x20;   - Click vai pro detalhe da skill (rota: /skills/:nome)



\- Dados mockados: 14-20 skills cobrindo as 7 categorias



\## Listagem — MCP Tools



\- Barra de filtros (quando "MCP Tools" selecionado):

&#x20; - Tipo de operação (chips): read-only, mutating, mixed

&#x20; - Servidor MCP (multi-select): nomes dos servers internos do Itaú

&#x20; - Status (chips): ok, degraded, offline

&#x20; - Escopo de permissão (chips): SA, repo, org

&#x20; - Owner / squad (multi-select)



\- Grid responsivo de cards de MCP Tool (ou toggle pra view de tabela):

&#x20; - Cada card:

&#x20;   - Nome da tool em mono (ex: "kaptain.deploy", "jira.create_issue")

&#x20;   - Badge do server MCP de origem

&#x20;   - Badge de tipo (read-only / mutating) com cor (read = info, mutating = warning)

&#x20;   - Descrição curta (1 linha)

&#x20;   - Status dot (ok / degraded / offline) + última latência p95

&#x20;   - Mini-stats: invocações 7d, taxa de sucesso, # de skills/agentes consumidores

&#x20;   - Escopo de permissão exigido (chips)

&#x20;   - Owner / squad

&#x20;   - Click vai pro detalhe da tool (rota: /mcp-tools/:nome)


\- Dados mockados: 18-24 tools distribuídas em 4-6 servers MCP



\## Listagem — Sensores



\- Barra de filtros (quando "Sensores" selecionado):

&#x20; - Categoria (chips): security, quality, performance, compliance

&#x20; - Severity default (chips): critical, high, medium, low, info

&#x20; - Status (chips): active, muted, deprecated

&#x20; - Motor de execução (multi-select): Komply, Konstructor, Kaptain, custom

&#x20; - SA monitorada (multi-select)

&#x20; - Tags



\- Grid responsivo de cards de Sensor (ou toggle pra view de tabela):

&#x20; - Cada card:

&#x20;   - Nome do sensor em mono (ex: "cve-scan-deps", "p99-latency-api")

&#x20;   - Badge de categoria com cor (security = failure, quality = info, performance = warning, compliance = accent)

&#x20;   - Severity chip default

&#x20;   - Descrição curta (1 linha)

&#x20;   - Mini-stats: # de SAs cobertas, execuções 7d, # de violações 7d, taxa de detecção

&#x20;   - Mini-trend (sparkline SVG) de violações 30d

&#x20;   - Última execução com status dot (success / warn / fail)

&#x20;   - Owner / squad

&#x20;   - Tags

&#x20;   - Click vai pro detalhe do sensor (rota: /sensors/:nome)



\- Dados mockados: 16-22 sensores cobrindo as 4 categorias, mistura de severities



\## Convenções gerais para todas as listagens



\- Sidebar direita "Filtros aplicados" + contagem de resultados aparece em TODAS as listagens

\- Toggle grid/tabela disponível em todas

\- Estado vazio elegante por tipo (ícone + título + hint)

\- Densidade alta, mas escaneável: 3-4 cols no grid em telas largas, 1 col em mobile

\- Ícones lucide-react consistentes por tipo: Workflows = Workflow, Skills = Sparkles, MCP Tools = Plug, Sensores = Radar

\- Real-time evidente quando aplicável (status dot pulsante em workflows running, sensores executando)

