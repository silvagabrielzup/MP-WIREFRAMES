Gere o dashboard do Control Planes Management (rota: /control-planes).



Layout:

\- Sidebar + Topbar

\- Header:

&#x20; - Breadcrumb: Control Planes

&#x20; - Título: "Saúde da plataforma"

&#x20; - Toggle de ambiente: dev / hom / prod (default prod)

&#x20; - Indicador live



\- Linha de status agregado (banner alto):

&#x20; - "6/7 motores saudáveis · 1 degradado · 3 aprovações pendentes · 12 incidentes 24h"

&#x20; - Cor de fundo conforme severidade



\- Grid 4x2 de cards de motor:

&#x20; - Cards: Kaptain, Komply, Konstructor, Orkestra, Traffik, Pantheon, Migration + um vazio ou "ver todos"

&#x20; - Cada card:

&#x20;   - Logo + nome do motor

&#x20;   - Status badge grande (verde/amarelo/vermelho)

&#x20;   - 3-4 métricas chave:

&#x20;     - Throughput atual

&#x20;     - Tamanho da fila

&#x20;     - Taxa de sucesso 1h

&#x20;     - Latência p99

&#x20;   - Mini sparkline 1h (throughput)

&#x20;   - Click vai pro detalhe do motor



\- Seção "Eventos críticos 24h" (tabela densa):

&#x20; - Timestamp, Motor, SA afetada, Tipo de evento, Severity, Status

&#x20; - Linhas hover destacam

&#x20; - Click vai pro detalhe do evento



\- Seção "Aprovações pendentes" (lista):

&#x20; - Cada aprovação: SA, política Komply violada, quem precisa aprovar, tempo aguardando, botão "Revisar"



\- Sidebar direita opcional (default fechado): "Vista por SA"

&#x20; - Search de SA

&#x20; - Quando seleciona uma SA, mostra: o que cada motor está fazendo por essa SA agora



Estilo:

\- Densidade alta de informação

\- Cards de motor com identidade visual sutil mas distinguível

\- Eventos críticos legíveis em scan rápido

\- Real-time markers

\- Dados mockados realistas (uns 15 eventos 24h, 3 aprovações)

