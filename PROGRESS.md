[x] 2026-05-19 — Agora crie um database.json , isso será uma banco de dados local , migrei tudo que está no database.ts — `src/data/database.json` é a fonte de dados local; `database.ts` agora só hospeda types e leitura tipada.

[x] 2026-05-19 — Agora eu preciso que você quebre o database.json em lógica de banco de dados relacional , para facilar a leitura . Então quebre em entidades de : Worflows ( WorkflowTrackers ) , Application Hub , Assets Catalog . — JSON agora tem `assetsCatalog`, `workflowTrackers`, `applicationHubs` como entidades top-level com FKs.

[x] 2026-05-19 — Para a entidade de Assets Catalog , vamos ter : 
 {
  name : string,
  category : workflows | Skills | MCP | Sensors | Apis,
  id : string,
  slug : string,
  description : string,
  version : string ( x.x.x ),
  create_at: Date,
  updated_at : Date,
  steps ( only for workflows category ) : [{
    id : string,
    name : string,
    description : string,
  }]
 }

[x] 2026-05-19 — Para a Entidade de Workflow ( WorkflowTracker ), vamos ter : 
{
  name : string,
  id : string,
  slug : string,
  description : string,
  version : string ( x.x.x ),
  create_at: Date,
  updated_at : Date,
  steps ( only for workflows category ) : [{ id : string , slug : string , name : string , description : string , 
        steps ( steps serão os steeper do react flow na tela de  ): [ type : Inference | Computacional , name : string , slug : string , 
        needHumamAproval : ( aqui se o type for de Inference , vir sempre true ) , 
        isAprovadedByHumam : boolean | null ,null vai ser se o usuário ainda não fez nenhuma ação ] 
    }],
  assets_catalog_id : string ( id para linkar com assets catalog que vai disparar esse workflow),
  sa: string (/** SA Itaú (Sigla App) — também usado como slug de URL. */)
 }

 [x] 2026-05-19 — Para a entidade  de Application Hub : 
 {
  /** Identificador interno do hub (chave estrangeira em notificações). */
  id: string
  /** SA Itaú (Sigla App) — também usado como slug de URL. */
  sa: string
  /** Nome amigável da aplicação (ex.: "Pix Core"). */
  name: string
  /** Projeto/programa ao qual a SA pertence. */
  projectId: string
  squad: string
  /** App migrado pra plataforma StackSpot. */
  onPlat: boolean
  health: ApplicationHubHealth
  liveIncident: boolean
  /** Uptime últimas 24h (%). */
  uptime: number
  /** Latência p95 em ms. */
  p95Ms: number
  /** Taxa de erro últimas 24h (%). */
  errorRate: number
  /** Deploys nos últimos 7 dias. */
  deploys7d: number
}

[x] 2026-05-19 — Com as entidades criadas , faça o refactor do database.json . Reaproveite os dados que já existente do Migração Vanilla — refactor concluído; `database.ts` deriva a API legacy (`workflows`, `migrationWorkflow`, etc.) das entidades novas.

[x] 2026-05-19 — Alterar Step do `wf-migration-vanilla` , agora serão esses steps : ( Estrutura básica para UI , Tenha um título , um campo para um clipboard rápido e sempre gere um contexto muito rico sobre o título que le for dado) — 6 steps novos no tracker + catalog (Setup CLI, Login, Seleção SA, Explicação Migração, Watch WorkflowTracker, Watch Application Hub); cada step com `clipboardCommand` + painel rico de contexto no Home.
  1 - Title : Setup Inicial e Instalação de CLI 
     Contexto : Para ultilizar o CLI da Stackspot , você ira precisar ter o Claude Code instalado na sua máquina , preciso também que você gere as vantagens de se usar a CLI
  2 - Title : Login
  3 - Title : Seleção de SA 
      Context : gere um descrição melhor sobre as vatangens de se usar monorepo ao invés de multi-repo . E como o multirepo não é uma boa estrutura para desenvolvimento agêntico , para cada repositório mostre os seguintes status ( OFF-PLAT , ON-PLAT ) e se aquele repo possuí algo débito técnico que será resolvido ao fazer a migração 
  4 - Title : Explicação sobre a Migração e Sobre os processos
      Context : 
        Fase 1 — Descoberta & Análise (~12 min)
          • Identificar repositórios da SA
          • Rodar sensors de pré-análise (security, quality, performance)
          • Gerar relatório baseline do IUConfia
      
        Fase 2 — Consolidação & Correções (~22 min)
          • Consolidar 4 repos em um único monorepo     
          • Rodar validação shift-left de policies      
          • Auto-corrigir violações + aplicar blueprints
          • Build segmentado + testes locais   
        
        Fase 3 — Compliance & Aprovação (~4 min)
          • SAST / DAST / license audit                 
          • Abrir PR + gate de aprovação humana

        Fase 4 — Deploy em Produção (~4 min)
          • Provisionar infra + deploy em staging       
          • Smoke tests + validação do blueprint
          • Cutover via DNS cotovelo  1% → 10% → 50% → 100%
  5 - Title : Acompanhamento do WorkflowTracker para o Processo de Deploy : 
      Contexto : Ensinar o usuário acessar o WorkflowTracker para mostrar com esta sendo o processo de deploy para produção dele 
  6 - Title : Acompanhamento do Application Hub
      Contexto : Ensinar o usuaário olhar para a aplicação dele ON-PLAT no WorkflowTracker

[x] 2026-05-19 — **Importante** Agora irei explicar como funcionar o fluxo da plataforma para o lançamentod o WorkflowTracker e ApplicationHub. (...) — trigger movido pra `step-04-migration-overview`; `wfk-onboarding-vanilla-exec` agora tem 7 steps (Varredura → Correção → Build → Provisionamento → Aprovar PR → Aprovar Deploy → Deploy); auto-advance via setTimeout 2.5s nos steps Computacional sem approval; `ExecutionStepper` horizontal com step atual em destaque (pulse + ring accent); cards de aprovação inline com diffs + GitHub link + Approve/Decline (PR) e gate humano + Approve/Decline (Deploy).

[x] 2026-05-19 — **Importante** Somente ao chegar na etapa de `Deploy` e essa etapa ter sido aprovado gere um applicatioHub para `ssa-pix-core` — `wf-migration-vanilla` removido de `HUB_PROVISIONING_TEMPLATE_IDS`; só `wf-onboarding-vanilla-exec` provisiona; `applicationHubs` em `database.json` esvaziado pra refletir estado inicial (sem hub). Hub só nasce quando `exec-07-deploy` finaliza, que só acontece após o gate humano de Deploy ser aprovado.

[x] 2026-05-19 — Na tela ApplicationHub.tsx simule uma query usando o `UseEffect` para conseguir exibir as applicationHubs , exiba somente as que tem status de `completed` — `useEffect` com `setTimeout(600ms)` simula `GET /api/application-hubs?status=completed`; filtra hubs cuja workflow de origem está `completed`; loading state com spinner + URL stub mostrada.

[x] 2026-05-19 — Faça na tela de WorkflowTrackerDetails.tsx fazer o acompanhamento do fluxo igual fizemos para o `ExecutionStepper` — `ExecutionStepper` + cards de aprovação foram extraídos pra `src/components/ExecutionTrackerView.tsx` e usados tanto no Home quanto no WorkflowTrackerDetail; auto-advance migrado pra `WorkflowsProvider` (continua progredindo entre páginas); detail renderiza o stepper live no topo quando a URL bate com uma instância real do `wf-onboarding-vanilla-exec`.

[x] 2026-05-19 — Na tela ApplicationHubs só faça o filtro apenas com a Entidade de ApplicationHub . — Adicionado `status: 'pending' | 'completed' | 'failed'` no tipo `ApplicationHub`; `buildHubFromTemplate` no provider já cria os hubs com `status: 'completed'`; o filtro em `04-ApplicationHub.tsx` agora é `applicationHubs.filter(h => h.status === 'completed')` — sem cruzar mais com `workflows`.