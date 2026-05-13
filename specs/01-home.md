Gere a tela inicial do Management Plane (rota: /).



Layout:

\- Sidebar + Topbar conforme contexto mestre

\- Conteúdo principal dividido em 4 seções verticais:



\## Seção 1 — Hero compacto (não card)

\- "Bom dia, Luigi" (ou nome do user)

\- Linha resumo: "Você tem 3 workflows ativos em 2 SAs e 1 aprovação pendente"

\- Botão primário: "+ Onboardar nova SA"


\## Seção 2 — Atividade recente (2 colunas)

\- Coluna esquerda: "SAs ON-PLAT recentemente atualizadas"

&#x20; - Lista de 5 SAs com último deploy, owner, último workflow

\- Coluna direita: "Precisa de atenção"

&#x20; - Aprovações pendentes (Komply)

&#x20; - Workflows com falha últimas 24h

&#x20; - Violações de policy novas

\## Seção 3 — Workflows em andamento (mais importante, real-time)

\- Título: "Em execução agora"

\- Indicador live (dot pulsante ciano)

\- Lista compacta de 3-5 workflows ativos, cada um com:

&#x20; - Nome do workflow (ex: "onboarding-vanilla-brownfield")

&#x20; - SA (ex: "ssa-pix-core")

&#x20; - Step atual com progresso (ex: "deploy (3/5)")

&#x20; - Tempo decorrido (ex: "2m 13s")

&#x20; - Quem disparou (avatar)

&#x20; - Status badge

\- Item clicável vai pro detalhe do workflow


Estilo:

\- Densidade alta mas respirável

\- Use ícones lucide-react para cada motor e cada tipo de evento

\- Estado vazio elegante para cada seção quando não há dados

\- Real-time indicator visível na seção 2

\- Dados mockados realistas

