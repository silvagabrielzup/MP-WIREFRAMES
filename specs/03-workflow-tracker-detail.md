Gere a tela de detalhe de um workflow (rota: /workflows/\[id]).

Esta é a tela mais importante do produto. Foco em legibilidade da cadeia causal.

Layout:

\- Sidebar + Topbar conforme contexto mestre

\- Header:

&#x20; - Breadcrumb: Workflow Tracker / wf-abc123

&#x20; - Título: ID do workflow + status badge grande

&#x20; - Sub-info: tipo, SA, user (avatar), início, duração

&#x20; - Ações direita: "Replay", "Annotate as failure", "Export trace", botão "..."

&#x20; - Em running: indicador "live · updated 1s ago"

\- Tabs principais:

&#x20; - \*\*Timeline\*\* (default) — fluxo dos steps

&#x20; - \*\*Tool calls\*\* — todas as chamadas de ferramenta cronológicas

&#x20; - \*\*Sensores\*\* — sensores acionados, veredictos, iterações

&#x20; - \*\*Auditoria\*\* — aprovações humanas, políticas Komply

&#x20; - \*\*Replay\*\* — estado capturado pra re-execução

&#x20; - \*\*Custo\*\* — tokens, R$, latência por step

\## Tab Timeline (mais detalhada)

\- Layout em 2 colunas:

&#x20; - Coluna esquerda (60%): timeline vertical

&#x20; - Coluna direita (40%): detalhe do step selecionado

\### Timeline vertical (coluna esquerda)

\- Cada step é um card horizontal compacto

\- Steps agrupados pelos 4 verbos da Vanilla com headers:

&#x20; - "Build" (Konstructor)

&#x20; - "Deploy" (Kaptain + Orkestra)

&#x20; - "Migration" (Migration + Traffik)

&#x20; - "Rollout" (Kaptain)

\- Dentro de cada verbo, sub-steps com:

&#x20; - Ícone de status

&#x20; - Nome do step

&#x20; - Tool name (se aplicável)

&#x20; - Duração

&#x20; - Indicador de sensor acionado (chip pequeno)

&#x20; - Indicador de iteração (se houve auto-correção: "3 iterações")

\- Linha vertical conectando os steps

\- Step atual em running tem indicador pulsante

\- Click no step seleciona, mostra detalhe à direita

\### Detalhe do step (coluna direita, sticky)

\- Header do step

\- 4 sub-seções colapsáveis:

&#x20; - \*\*Input\*\*: o que entrou (tool call params, contexto)

&#x20; - \*\*Output\*\*: o que saiu (tool result, artifacts)

&#x20; - \*\*Sensores\*\*: lista de sensores que rodaram com veredicto

&#x20; - \*\*Decisão do agente\*\*: rationale, alternatives\_considered

\- Botão "Ver raw trace" (abre modal com JSON estruturado)

Estilo:

\- Use cores dos verbos consistentemente

\- Timeline densa mas legível

\- Indicar claramente onde o agente teve que iterar

\- Use mockup realista com pelo menos 8-12 steps através dos 4 verbos

