Você vai me ajudar a criar wireframes em baixa fidelidade do "Management Plane", o portal interno do Itaú para a plataforma de engenharia agêntica StackSpot.



\# Contexto do produto



O Management Plane é a interface humana sobre uma plataforma agêntica composta por:

\- 7 motores deterministas (Kaptain = CD/AWS, Komply = policies, Konstructor = build, Orkestra = K8s, Traffik = routing/DNS, Pantheon = Kafka, Migration = data migration)

\- Workflows agênticos que orquestram esses motores via Claude Code + CLI

\- Sensores que validam código e infra (security, quality, performance)



A missão do Management Plane: habilitar confiança progressiva no harness agêntico, expondo a operação dos motores e workflows de forma visível, governável e consumível por humanos e agentes.



\# 2 produtos integrados (mesma navegação, design system unificado)



1\. \*\*Workflow Tracker\*\* — observabilidade dos workflows agênticos em tempo real. Pergunta-chave: "o workflow X está em que estado, fez o quê, e por quê?"



2\. \*\*Assets Catalog\*\* — inventário descobrível das aplicações, agentes, APIs. Pergunta-chave: "o que existe? de quem é? em que estado está?"



\# Conceitos centrais



\- \*\*SA (Sigla App)\*\*: identificador padrão de aplicação no Itaú. Espinha dorsal do modelo de dados. Todo workflow, asset, evento se conecta a uma ou mais SAs.

\- \*\*ON-PLAT\*\*: aplicação migrada para a StackSpot, com infra gerenciada pelos motores.

\- \*\*4 verbos da Operação Vanilla\*\* (escopo do MVP): build, deploy, migration, rollout.

\- \*\*IUConfia\*\*: score interno do Itaú que mede segurança, qualidade e performance.



\# Personas (em ordem de prioridade no MVP)



1\. \*\*Desenvolvedor\*\* que migrou uma SA e quer acompanhar/debugar

2\. \*\*Tech Lead\*\* que precisa revisar PR e entender o que o agente fez

3\. \*\*SRE\*\* que monitora saúde dos motores

4\. \*\*Compliance\*\* que audita execuções

5\. \*\*Agentes de IA\*\* que consomem o portal via MCP



\# Princípios de design



\- \*\*Densidade informacional sem ruído\*\*: público-alvo é técnico, sabe ler densidade. Evite simplificação artificial.

\- \*\*Tempo real é default, batch é exceção\*\*: status atualizado, indicador de "live".

\- \*\*A interface é uma experiência\*\*: bonita, mas funcional. Cinza não, contraste sim. Tipografia limpa.

\- \*\*Modelo de entidades unificado\*\*: SA conecta tudo. Sempre mostre contexto de SA no breadcrumb e nos cards.

\- \*\*Real-time visível\*\*: quando algo está executando, mostre indicação visual sutil (dot pulsante, contagem live, "updated 2s ago").



\# Stack técnico



\- React functional components, TypeScript

\- Tailwind CSS puro para componentes base (Card, Table, Tabs, Badge, Button, Input, Select feitos à mão com classes Tailwind, sem shadcn)

\- lucide-react para ícones

\- Dados mockados realistas (use SAs como "ssa-12345", "ssa-pix-core", "ssa-conta-corrente")



\# Fidelidade



Protótipo 0 = baixa fidelidade funcional. Precisa: hierarquia visual clara, densidade adequada, estados (success, in-progress, failure, awaiting human), real-time evident, navegação consistente.



\# Layout geral compartilhado



\- Sidebar esquerda fixa (240px): logo StackSpot, navegação (Workflow Tracker, Assets Catalog)

\- Topbar: search global, seletor de ambiente (dev/hom/prod), notificações, avatar

\- Conteúdo principal: scrollável, max-width \~1400px, padding consistente



\# Paleta (dark default)



\- Background: #0A0A0B

\- Surface (cards): #141518

\- Border: #2A2B30

\- Text primary: #F5F5F7

\- Text secondary: #9B9CA3

\- Accent (StackSpot): #FF6B2C

\- Success: #22C55E

\- Warning: #EAB308

\- Failure: #EF4444

\- Info: #3B82F6

\- Live indicator: #22D3EE (com pulse)

