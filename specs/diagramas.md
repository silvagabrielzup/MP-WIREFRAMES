# Diagramas (React Flow)

- Pacote: `@xyflow/react` (+ CSS `@xyflow/react/dist/style.css`).
- Wrapper `<ReactFlowProvider>` por view que usa diagrama.
- `nodeTypes` e `edgeTypes` declarados **fora do componente** (referência
  estável) e mantidos em `src/components/flow/`.
- Estado controlado via `useNodesState` / `useEdgesState`; persistência dos
  diagramas via mutations de clients da `@stack-spot/portal-network` quando
  aplicável (ver [comunicacao-backend.md](comunicacao-backend.md)).
- Tema do React Flow alinhado às variáveis CSS do shadcn para coerência visual
  (background, controles, minimap).
