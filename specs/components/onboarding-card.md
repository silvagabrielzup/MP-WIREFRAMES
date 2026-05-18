## Alert de status da migração

Acima do card, mesma largura. Mostra o status atual do workflow de migração (consome `WorkflowsProvider.workflows`, instância primária).

- Layout: 1 linha, ícone à esquerda · título + meta à direita (timestamp ou "atualizado há Ns").
- Variantes por status:
  - `idle` / sem migração ativa — `info` · ícone `Info` · "Nenhuma migração em andamento — comece pelo passo abaixo".
  - `running` — neutra com `live dot` pulsando (`bg-live` + `animate-pulse-live`) · "Migração em curso · step X de N — <stepLabel>".
  - `awaiting_human` — `warning` · ícone `AlertTriangle` · "Aguardando intervenção em <stepLabel>" + CTA inline "Revisar".
  - `failed` — `failure` · ícone `XCircle` · "Migração falhou em <stepLabel>" + CTA inline "Ver logs".
  - `completed` — `success` · ícone `CheckCircle` · "Migração concluída em <timestamp>".
- Tokens: cores de status do design system (`success`, `warning`, `failure`, `info`, `live`), padding compacto, borda 1px da variante.

## Card Principal — Checklist de Onboarding da Migração

Card único renderizando uma **TODO list** com 5 steps do onboarding da Migração Vanilla. Cada step pode ser marcado como concluído manualmente pelo usuário (checkbox interativo) e expandido pra revelar detalhes — comandos da CLI, links, instruções específicas.

Renderiza somente quando o workflow primário ativo é `wf-migration-vanilla`. Caso contrário, mostra placeholder (ver `placeholder.md`).

### Lista de steps (5)

1. **Instalação de CLI** — baixar e instalar a CLI do StackSpot no terminal local.
   - Detalhes expandidos: bloco "Por que CLI?" listando as vantagens de operar a Operação Vanilla via terminal em vez da UI:
     - **Automação** — comandos rodam em scripts, CI/CD e githooks; não dependem de cliques.
     - **Reprodutibilidade** — mesmo comando produz mesmo resultado; idempotente por design.
     - **Versionável** — fluxos viram código (commit no repo, code review, rollback).
     - **Velocidade** — execução direta, sem context-switch pra browser nem load de tela.
     - **Composável** — pipe com `jq`, `grep`, `xargs`; integra com qualquer toolchain existente.
     - **Offline-friendly** — autenticação cacheada localmente; trabalha sem rede pra comandos read-only.
     - **Power-user** — flags como `--watch`, `--json`, `--dry-run` reduzem fricção pra usuários avançados.
   - Comando de instalação: `curl -fsSL https://stackspot.itau/install.sh | sh` com botão de copiar.
   - Badge "Versão recomendada: v1.4.2" + link "Ver release notes".
2. **Login** — autenticar na CLI do StackSpot com SSO Itaú.
   - Detalhes expandidos: comando `stackspot auth login --realm itau` com botão de copiar, link "Abrir SSO" pro fluxo OAuth, badge mostrando estado da sessão atual ("Não autenticado" / "Autenticado como <user>").
3. **Seleção de SA** — escolher o Serviço de Aplicação e os repositórios que vão ser unificados no mono-repo Vanilla.
   - **Contexto**: uma SA traz consigo uma família de repos hoje espalhados (código, ci/cd, infra, db, config). A Migração Vanilla consolida tudo em um único mono-repo. Esse step é onde o usuário escolhe quais repos entram na primeira leva.
   - Detalhes expandidos têm 3 sub-blocos, na ordem:

     a) **Busca + preview da SA**
     - Campo de busca por SA (autocomplete com mock data — `ssa-pix-core`, `ssa-conta-corrente`, etc.).
     - Ao selecionar, preview do SA: squad, org, descrição curta e contagem de repos da família.

     b) **Lista de repositórios da família com checkboxes**
     - Cada SA traz 5 repos por padrão (mock): `<sa>` (código), `<sa>-pipeline` (ci/cd), `<sa>-infra` (infra), `<sa>-db` (banco), `<sa>-config` (config).
     - Cada repo aparece como uma linha com checkbox marcado por default, ícone do tipo (`Code2`, `Wrench`, `Server`, `Database`, `Settings`), nome em `font-mono`, badge do tipo (`código/ci-cd/infra/banco/config`), e mini-metadata (stack, tamanho, último commit).
     - Toggle do checkbox **acresce/remove** o repo da seleção e atualiza o comando CLI logo abaixo em tempo real.

     c) **Comando CLI dinâmico**
     - Bloco `font-mono` com o comando equivalente, **incrementado** conforme a seleção:
       - Sem nenhum repo: `stackspot context use --sa ssa-pix-core`
       - Com repos selecionados: `stackspot context use --sa ssa-pix-core --repo pix-core --repo pix-core-pipeline --repo pix-core-infra ...`
     - Botão de copiar à direita, mesma mecânica copy-to-clipboard (`Copy → Check`, "Copiado!" 1.5s).
     - Texto auxiliar abaixo: contagem "<n> de 5 repos selecionados".

     d) **Diff Antes/Depois — multi-repo → mono-repo**
     - Bloco final destacado, 2 colunas (`grid-cols-2`) com a árvore de cada lado:
       - **Antes · multi-repo** — coluna esquerda mostra os 5 repos como árvores separadas (`pix-core/`, `pix-core-pipeline/`, `pix-core-infra/`, etc.), usando `TreeNodeView` recursivo (chevron + Folder/FolderOpen + nomes em `font-mono`).
       - **Depois · mono-repo Vanilla** — coluna direita mostra o `vanilla-monorepo/apps/ssa-pix-core/` consolidado, com badges `mov` (movido), `novo` (adicionado pela Vanilla) e — se aplicável — `remov` (removido) por nó da árvore.
     - Legenda compacta abaixo das 2 colunas: ícone `ArrowRightLeft` cinza "movido" · ícone `Plus` verde "adicionado" · ícone `Minus` vermelho "removido".
     - Reaproveitar tokens já usados anteriormente: `border-info/25 bg-info/[0.04]` pra "movido", `border-success/25 bg-success/[0.04]` pra "adicionado", `border-failure/25 bg-failure/[0.04]` pra "removido".

   - **Motivação do diff**: o portal é plataforma de leitura/visibilidade. Mostrar antes/depois deixa explícito o que o usuário está aceitando antes de marcar o step como concluído — a transformação não é trivial e merece ser inspecionada visualmente, não escondida atrás de uma flag de CLI.
4. **Checar viabilidade** — rodar o pre-flight check antes de iniciar.
   - Detalhes expandidos: lista de checks com status (Komply ✔, Kaptain ✔, Pantheon ⚠, etc.), summary do diagnóstico, link "Ver relatório completo". Comando: `stackspot migrate check`.
5. **Acompanhar Status da Migration** — disparar e monitorar o workflow em tempo real.
   - Detalhes expandidos: comando `stackspot migrate start` + `stackspot migrate status --watch` com copy, mini-progress dos 4 verbos da Operação Vanilla (build · deploy · migration · rollout), link "Abrir Workflow Tracker".

### Anatomia de cada step (row)

Cada step renderiza uma **row colapsada por padrão**, com a row inteira clicável pra expandir.

Linha colapsada:

- **Checkbox interativo à esquerda** — clique do usuário marca/desmarca o step como concluído (estilo TODO list).
  - Estados visuais:
    - `pendente`: círculo vazio borda `border` + numerador `1, 2, 3, 4, 5` em `font-mono` cor `text-muted`.
    - `concluído`: círculo `success/10` borda `success/40` com ícone `Check` em `text-success`.
  - Estado opcional intermediário `em curso` (quando o workflow estiver realmente rodando aquele step server-side): spinner accent + borda accent na row.
- **Título do step** (`text-primary`, 1 linha, `text-[12.5px] font-medium`).
- **Descrição curta** abaixo (`text-muted`, 1 linha, opcional).
- **Botão de expandir à direita** — ícone `ChevronDown` (lucide-react), gira 180º quando aberto (`rotate-180 transition`).
  - `aria-expanded` reflete o estado.
  - `aria-label="Expandir detalhes"` / "Recolher detalhes" alternando.
  - Tap-target mínimo 32×32px.

Linha expandida (revelada quando o usuário clica em qualquer lugar da row colapsada, exceto no checkbox):

- Bloco `bg-bg` com borda `border` e padding `px-4 py-3`, indentado pra alinhar com o título.
- Conteúdo específico do step (ver lista acima). Pode conter:
  - Blocos de comando em `font-mono` (Geist Mono), `bg-surface-2` borda `border`, com botão `Copy` à direita (mesma mecânica copy-to-clipboard da versão anterior: ícone `Copy → Check`, "Copiado!" por 1.5s).
  - Links externos / internos como text-link `accent`.
  - Mini-listas, badges de status, previews de dados mock.

### Interações

- **Click no checkbox** — toggle persistido. Quando marcado, chama `completeStep(workflowId, stepId)` no `WorkflowsProvider` (mesma API usada hoje pra copy). Desmarcar reverte (idealmente um novo método `uncompleteStep`; alternativa: deixar one-way, ou mexer em `updateWorkflow` diretamente).
- **Click no resto da row colapsada** — expande/recolhe a área de detalhes.
- **Click no `ChevronDown`** — mesmo efeito, mas é o elemento "oficial" pra acessibilidade.
- **Copy dos comandos dentro dos detalhes** — apenas copia, **não** marca o step como concluído (a marcação agora é responsabilidade explícita do checkbox).

### Persistência

- Estado de "concluído" por step vem do `WorkflowsProvider.workflows[primary].steps[].isCompleted` — sobrevive a navegação entre telas.
- Estado de "expandido/colapsado" é local ao componente (não persiste — UX visual apenas).

### Estilo

- Reusar Card/Badge/Button + tokens (`bg`, `surface`, `surface-2`, `border`, `text-primary/secondary/muted`, `accent`, cores de status).
- Densidade alta — rows compactas; detalhes expandem suavemente (`transition` de altura ou simples mount/unmount).
- pt-BR em todo o user-facing copy.
- Done atenua a row (opacity ~0.7) + adiciona faixa `bg-success/[0.025]` para diferenciar dos pendentes, sem fundo verde forte.

### Placeholder

Quando o workflow primário ativo não é Migração Vanilla (ou não há workflow algum): substituir o card por `placeholder.md` com CTA primary pra Assets Catalog.

### Acessibilidade

- Checkbox é `<button role="checkbox" aria-checked="...">` ou `<input type="checkbox">` real, não `<div>` clicável.
- Botão de expand é `<button aria-expanded="..." aria-controls="step-details-<id>">`; área expandida tem `id` correspondente.
- Estado "Copiado!" dentro dos detalhes anunciado via `aria-live="polite"`.
- Suporte a teclado: Tab navega entre checkbox + expand button + conteúdo expandido; Space/Enter ativam.

---

## Histórico

- **2026-05-18 (manhã)** — Redirecionamento: card deixa de ser fluxo multi-step com CTAs/modais e passa a ser uma lista de comandos da CLI com copy-to-clipboard. Alert de status da migração adicionado acima.
- **2026-05-18 (tarde)** — Card vira **TODO list com expandable details**. Os 6 comandos atomic foram agrupados em 4 steps funcionais (Login, Seleção de SA, Checar viabilidade, Acompanhar Status da Migration). Checkbox interativo (marca/desmarca manualmente) + botão de expandir cada step pra revelar comandos e instruções detalhadas. O cabeçalho "Comandos da CLI" + progress "X de N" foi removido em iteração anterior e segue removido. Card só renderiza quando o workflow ativo é `wf-migration-vanilla`.
- **2026-05-18 (fim do dia)** — Adicionado primeiro step **Instalação de CLI** antes de Login. Total agora são 5 steps. Os detalhes expandidos desse step trazem o bloco "Por que CLI?" com as 7 vantagens de operar via terminal (automação, reprodutibilidade, versionável, velocidade, composável, offline-friendly, power-user) — serve como motivacional inicial pra adoção. Comando de instalação + badge de versão recomendada também ficam expostos no expand.
- **2026-05-18 (noite)** — Step **Seleção de SA** ganhou densidade: além da busca de SA, agora expõe lista de repos da família com checkboxes (default todos marcados), comando CLI que **incrementa** `--repo <name>` conforme o toggle, e um **diff Antes/Depois** (multi-repo → mono-repo Vanilla) com `TreeNodeView` recursivo + badges `mov`/`novo`/`remov`. Reusa estrutura de árvores que existia no antigo `RepoPickerModal` (removido), agora inline no expand. Motivação: o portal é leitura/visibilidade — mostrar a transformação visualmente antes do checkbox ser marcado reduz risco de surpresa pós-migração.
