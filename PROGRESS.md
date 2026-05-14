[x] - No AssetsCatalog.tsx , para a tab de Workflows , criei um arquivo 'database.ts' para não trazer dados mockados no código , leve todo o objeto de Migração Vanilla para um arquivo , **não perca nenhum dado que já esteja na tela** migre todos os dados do workflow para o database.ts

[x] - Com o arquivo de database.ts populado , faça todo a tipagem para conseguirmos usar o Migração Vanilla 

[x] - Agora liste o workflows do database.ts 

[x] - Crie um Context com nome de 'WorkflowsProvider' , a responsabilidade desse context vai controlar todos os steps de um Workflow , então deveremos ter metodos para adicionar um workflow , listar todos os workflows , avançar etapas no workflow e avançar status

[x] - Na home.tsx agora a listagem do card de próximos ele devem ser listados atráves do WorkflowsProviders.tsx , trazer o último workflow selecionado 

[x] - No arquivo de WorkflowTrackerList , remova todos os mock do código

[x] - No WorkflowTrackerList.tsx , deve ser listado através do WorkflowProvider.tsx 

<!-- [ ] - No WorkflowTrackerDetail ,popule essa tela com os dados do workflow selecionado, busque no database.ts , os steps do diagrama use como referencia  -->