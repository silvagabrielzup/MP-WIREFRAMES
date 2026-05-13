\# Loop: Management Plane wireframes



Você é um agente num loop. Cada execução faz UMA tela e para.



\## Setup inicial (só faz se necessário)



Se `src/App.tsx` ainda tem o template default do Vite (counter, logos do React/Vite), substitua por um shell de react-router-dom com:

\- BrowserRouter + Routes

\- Layout compartilhado: sidebar fixa (240px) à esquerda + topbar

\- Sidebar com navegação: Workflow Tracker, Control Planes, Assets Catalog

\- Topbar com search global, seletor de ambiente, avatar

\- Dark theme, paleta do master context

\- Cada tela gerada será uma <Route>



Use Tailwind puro (sem shadcn). Componentes base você cria à mão com Tailwind — Card, Tabs, Badge, Button, Table, Input, Select. Não tente importar de @/components/ui.



\## Passos desta iteração



1\. Leia `PROGRESS.md`. Pegue a PRIMEIRA linha com `\[ ]`.

&#x20;  - Se não houver nenhuma `\[ ]`, escreva `RALPH\_DONE` no stdout e termine.

2\. Leia `specs/00-master-context.md` (SEMPRE).

3\. Leia `specs/<NN>-<slug>.md` da tela escolhida.

4\. Se `src/screens/01-Home.tsx` já existe e você NÃO está gerando a 01, leia ele antes — use como âncora canônica do design system.

5\. Gere `src/screens/<NN>-<PascalName>.tsx`:

&#x20;  - React functional component, TypeScript

&#x20;  - Tailwind puro (sem shadcn)

&#x20;  - lucide-react pros ícones

&#x20;  - Dados mockados realistas (SAs tipo `ssa-pix-core`, `ssa-conta-corrente`, `ssa-12345`)

&#x20;  - Densidade alta, sem placeholders preguiçosos

6\. Adicione a rota em `src/App.tsx`.

7\. Atualize `PROGRESS.md`: troque `\[ ]` por `\[x]`, adicione timestamp ISO e linha curta do que gerou.

8\. `git add -A \&\& git commit -m "feat(<NN>): <tela>"`



\## Regras



\- UMA tela por iteração. Terminou, parou.

\- NÃO regenere telas `\[x]`.

\- NÃO edite `specs/`.

\- Ambiguidade: decida, gere, anote em `NOTES.md`.

\- Conflito com tela já feita: marque `\[!]` em PROGRESS e pare.

