Gere a tela inicial do Management Plane (rota: /).

Layout:

\- Sidebar + Topbar conforme contexto mestre

\- Conteúdo principal dividido em 3 seções verticais:


\## Seção 1 — Hero compacto (não card)

\- "Bom dia, Luigi" (ou nome do user)

\- Linha resumo: "Você tem 3 workflows ativos em 2 SAs e 1 aprovação pendente"

\- Botão primário: "+ Onboardar nova SA"


\## Seção 2 — Gere um card com base no "./onboarding-card.md"


\## Seção 3 — Resumo de pontos de atenção (2 colunas)

\- Coluna esquerda: "Fluxos agenticos pendentes aprovacao"

&#x20; - Lista de 5 itens com nome do workflow, nome da ação que necessidade de aprovação

\- Coluna direita: "Alertas da Aplication Hub"

&#x20; - Aprovações pendentes (Komply)

&#x20; - Workflows com falha últimas 24h

&#x20; - Violações de policy novas

\## Seção 4 — Resumo da saúde da apliação (2 colunas)

\- Título: "Saúde da Aplication Hub"

\- Cards com títulos , nível da saúde da aplicação e botão com CTA para levar a aplicação


Estilo:

\- Densidade alta mas respirável

\- Use ícones lucide-react para cada motor e cada tipo de evento

\- Estado vazio elegante para cada seção quando não há dados

\- Real-time indicator visível na seção 3

\- Não tenha mais nenhum dado mockado
