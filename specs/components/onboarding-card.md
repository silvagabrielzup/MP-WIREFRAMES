## Card Principal

- Heading "Próximos passos"
- Indicador à direita do título: "3 de 8 passos · 38% completo" com mini barra horizontal slim
- Lista vertical de 8 cards de onboarding empilhados, cada card com:
  - Checkbox grande à esquerda (3 estados visuais: not-started vazio, in-progress com spinner, done com check verde)
  - Ícone do passo (lucide-react)
  - Título do passo + descrição de 1 linha logo abaixo
  - Mini-meta à direita: tempo estimado ("~2min"), badge de estado atual quando aplicável (ex: "CLI v1.4.2 instalado")
  - CTA inline "Abrir →" que linka pra tela relevante
  - Botão "..." com opções: dispensar, marcar como feito manualmente, lembrar depois
  - Cards done: colapsados em formato mais compacto, atenuados, sem CTA visível
  - Card in-progress: borda accent (azul), badge pequeno "em curso"
  - Cards pending posteriores ao in-progress: aparência normal mas levemente atenuados

Os 8 passos canônicos:
1. Instalar CLI do StackSpot — ícone Terminal — CTA → /cli/install
2. Permissionar acesso ao Itaú Cloud — ícone ShieldCheck — CTA → /access/request
3. Selecionar repos pra migração — ícone GitBranch — CTA → /migration/repo-picker
4. Configurar workflow de onboarding — ícone Settings — CTA → /workflows/new
5. Disparar primeira execução — ícone Play — CTA → /workflows
6. Validar resultado em dev — ícone CheckCircle2 — CTA → /workflows/wf-7a2b1c
7. Promover pra homologação — ícone Rocket — CTA → /applications/ssa-pix-core
8. Configurar observabilidade — ícone Activity — CTA → /applications/ssa-pix-core?tab=obs

- Placeholder : Quando o usuário não tiver nenhuma tarefa preenchida , mostre um placeholder seguindo essa spec 'placeholder.md' , coloque um botão de primary CTA para Assets Catalog

Dados mockados:
- Não use dados mockados 

Estilo:
- Reusar paleta, tokens, Card/Badge/Button de 01-Home
- Hierarquia visual clara entre estados: not-started (normal) < in-progress (accent border + badge) < done (atenuado + check verde)
- Done NÃO usa verde forte — só o check e texto cinza
- Manter os 3 estados visualmente coerentes — o toggle é decorativo mas tem que renderizar tudo certo
