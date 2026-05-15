[x] - No AssetsCatalog.tsx , para a tab de Workflows , criei um arquivo 'database.ts' para não trazer dados mockados no código , leve todo o objeto de Migração Vanilla para um arquivo , **não perca nenhum dado que já esteja na tela** migre todos os dados do workflow para o database.ts

[x] - Com o arquivo de database.ts populado , faça todo a tipagem para conseguirmos usar o Migração Vanilla 

[x] - Agora liste o workflows do database.ts 

[x] - Crie um Context com nome de 'WorkflowsProvider' , a responsabilidade desse context vai controlar todos os steps de um Workflow , então deveremos ter metodos para adicionar um workflow , listar todos os workflows , avançar etapas no workflow e avançar status

[x] - Na home.tsx agora a listagem do card de próximos ele devem ser listados atráves do WorkflowsProviders.tsx , trazer o último workflow selecionado 

[x] - No arquivo de WorkflowTrackerList , remova todos os mock do código

[x] - No WorkflowTrackerList.tsx , deve ser listado através do WorkflowProvider.tsx 

[x] - No database.ts , no onboardingSteps o adicione uma nova prop 'completedOnClick' — 2026-05-15T00:00:00Z · adicionado `completedOnClick: boolean` ao tipo OnboardingStep.

[x] - Os items que terão completedOnClick true , serão `step-01-install-cli` e `step-02-permission-cloud` — 2026-05-15T00:00:00Z · só esses dois passos têm completedOnClick=true; demais são false.

[x] - No Card de 'Próximo Passos' , adicione para cada item um botão clicável que será um CTA para iniciar a ação especifica . Também esse texto do botão irá vir do database.ts , então adicione uma nova prop no item com o título do botão e já popule ele com CTA  que faça sentido para cada item — 2026-05-15T00:00:00Z · prop `ctaLabel` adicionada e populada em todos os 8 passos; botão CTA renderizado em cada linha não concluída.

[x] - No Card  de 'Próximo Passos' na home.tsx , faça o cada item clicavél . Porém esse item será marcado como completed no click somente se ele estiver marcado como completedOnClick — 2026-05-15T00:00:00Z · linha + botão chamam `handleStepActivate`, que só dispara `advanceStep` quando o passo em curso tem completedOnClick=true.

[x] - Ajuste para no WorkflowTrackerList.tsx o item ser exibido , após o Step de `step-04-configure-workflow` ser marcado como true , ele também deve ser completado ao clicar no botão . Com isso , gere no database.ts um prop linked para dentro do `migrationWorkflow` para ser esse workflow que irá ser trigado no WorkflowTrackerList.tsx , crie dados mockados para esse Workflow porém que correspondem com a realidade — 2026-05-15T00:00:00Z · `migrationExecutionWorkflow` (4 verbos da Operação Vanilla) adicionado e ligado via `migrationWorkflow.linked`; step-04 vira completedOnClick=true; ao concluir step-04, Home dispara `addWorkflow(template.linked)` e a instância aparece no Workflow Tracker; cada linha do tracker tem botão "Avançar/Concluir" que chama `advanceStep`.

[x] - Ajuste para o step de `step-07-promote-hml` fazer o lançamento de um worflow que ira ser listado no WorkflowTrackerList.tsx . — 2026-05-15T00:00:00Z · trigger lift para `OnboardingStep.triggers`; `hmlPromotionWorkflow` (canário 5/50/100 + smoke) ligado em step-07; step-07 vira completedOnClick=true e dispara a execução ao concluir.

[x] - Limpe todo o `ApplicationHub.tsx` remova todos os mocks datas — 2026-05-15T00:00:00Z · array inline `apps[]` removido; tela passa a importar `applicationHubs` e tipos `ApplicationHub` / `ApplicationHubHealth` de `data/database.ts`.

[x]- Agora faça um novo item dentro do database.ts que será um `ApplicationHubNotification` , esse item deverá tem um icon + title + description + CTA + link + ApplicationHubId + ProjectID. Esse link vai levar para a listagem do ApplicationHub , ou seja , precisa estar linkado com um ApplicationHub existente . — 2026-05-15T00:00:00Z · tipo `ApplicationHubNotification` (icon como string lucide-name pra não acoplar à UI) + FK validável `applicationHubId` apontando pra `ApplicationHub.id`.

[x] - Com o `ApplicationHubNotification` criado , popule item com um notifição que o ApplicationHub de homologação foi provisionado . Com um CTA para ver a saúde da Aplicação em Homolog — 2026-05-15T00:00:00Z · `notif-hml-provisioned-ssa-pix-core` com icon CheckCircle2, CTA "Ver saúde em HML" e link `/application-hub/ssa-pix-core?env=hml`.

[x] - On finish the workflow at `WorkflowsProvider` , create item at `applicaitonHubs` on `database.ts` . Populate with mock datas , but make more realist infos — 2026-05-15T00:00:00Z · `WorkflowsProvider` agora possui `applicationHubs` state (seedado pelo array em `database.ts`); `advanceStep` detecta o frame de transição pra `completed` e gera um `ApplicationHub` plausível a partir dos inputs do template (sa_id → projectId/squad via lookup, métricas de app recém-promovido). Dedupe por `hub.id`. `04-ApplicationHub.tsx` agora consome `useWorkflows().applicationHubs` em vez do import estático.

[ ] - Quando terminar o fluxo de `WorflowProvider` , cria uma noficação para ser listado na Home.tsx `Alertas da Application Hub` , coloque um notificação que algo item da Infra não subiu corretamente 