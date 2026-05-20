# CLAUDE.md

Guia para o agente Claude navegar e contribuir neste repositório.

## O que é este projeto

Frontend do **Novo Portal da StackSpot** — SPA em React + TypeScript + Vite que
consome APIs do backend via `@stack-spot/portal-network`. Os clients
específicos vão sendo criados dentro da própria lib conforme os serviços do
produto aparecem.

Quando surgirem necessidades de formulários ou diagramas, usar as libs já
fixadas pela stack (React Hook Form e `@xyflow/react`). Não são o foco do
projeto — são as escolhas padrão para esses casos.

A especificação completa vive em [specs/main.md](specs/main.md) — sempre que
houver dúvida sobre stack, padrões ou setup, **comece por lá**.

## Mapa rápido das specs

A pasta [specs/](specs/) é a fonte da verdade do projeto. Antes de
implementar qualquer coisa, leia o documento do tema correspondente:

| Tarefa | Spec |
|---|---|
| Adicionar/alterar rotas, links, `navigation.yaml` | [specs/navegacao.md](specs/navegacao.md) |
| Consumir endpoints, mutations, tratar erros | [specs/comunicacao-backend.md](specs/comunicacao-backend.md) |
| Adicionar/usar texto visível ao usuário, trocar idioma | [specs/i18n.md](specs/i18n.md) |
| Criar/usar Context (theme, prefs, modais globais) | [specs/estado-global.md](specs/estado-global.md) |
| Extrair componente/hook/helper compartilhado | [specs/padroes.md](specs/padroes.md) §1 |
| Adicionar componente de UI (shadcn / Base UI / Tailwind) | [specs/design-system.md](specs/design-system.md) + [specs/padroes.md](specs/padroes.md) §2 (estilo React-like) |
| Criar formulário | [specs/formularios.md](specs/formularios.md) |
| Mexer em diagrama (React Flow) | [specs/diagramas.md](specs/diagramas.md) |
| Ajustar regras de lint / formatação | [specs/lint.md](specs/lint.md) |
| Ajustar `tsconfig` / paths / strictness | [specs/typescript.md](specs/typescript.md) |
| Variáveis de ambiente, scripts npm, dependências | [specs/main.md](specs/main.md) |

## Estrutura atual do repositório

```
/
├─ vite.config.ts
├─ eslint.config.js           # flat config (ESLint 10)
├─ tsconfig.json              # project references → app + node
├─ tsconfig.app.json          # TS de src/ (strict + noUncheckedIndexedAccess)
├─ tsconfig.node.json         # TS dos arquivos de build
├─ index.html
├─ package.json               # packageManager: npm@9.0.0
├─ specs/                     # especificações (ler antes de implementar)
└─ src/
   ├─ main.tsx                
   ├─ App.tsx                  
   ├─ vite-env.d.ts
   ├─ screens/                  # HomeView, DetailView, ...
   ├─ components/
   │  └─ ui/                  # componentes shadcn (Base UI por baixo)
   ├─ lib/
   │  └─ utils.ts             # cn() = clsx + tailwind-merge
   └─ styles/                 # globals.css (Tailwind via @theme)
```

Pastas previstas pela spec que ainda **não** existem (criar quando necessário):
`src/components/flow/`, `src/components/forms/`, `src/contexts/`,
`src/features/`, `src/hooks/`.

## Comandos

| Comando | O que faz |
|---|---|
| `npm install` | Instala dependências 
| `npm dev` |
| `npm build` | `citron` + `tsc -b` + `vite build` |
| `npm preview` | Serve o bundle de produção localmente |
| `npm lint` | ESLint (descobre arquivos via flat config — sem `--ext`) |

> Se mexer em `navigation.yaml`, rode `npm citron` para atualizar
> `src/generated/navigation.ts` antes de importar a rota nova.

## Regras inegociáveis (leia antes de gerar código)

1. **Sem ponto-e-vírgula**, aspas simples, vírgula final em multilinhas,
   `max-len: 140`. Tudo aplicado pelo ESLint (ver [specs/lint.md](specs/lint.md)).
2. **Toda chamada HTTP** passa pela `@stack-spot/portal-network`. **Nunca**
   introduzir `fetch`/`axios`/`useQuery` manual neste repositório. Os clients
   reais serão criados na própria lib conforme os serviços do backend
   aparecerem — `accountAssetManagerClient` aparece nos exemplos das specs
   apenas como ilustração da API da lib, **não é** o client que o portal
   consome (ver [specs/comunicacao-backend.md](specs/comunicacao-backend.md)).
3. **Erros** sempre via `error.translate()` — nunca `error.message`.
3.1. **Todo texto visível ao usuário** (títulos, labels, botões, mensagens,
   colunas de tabela, placeholders) vem de dicionário tipado consumido via
   `useTranslate` do `@stack-spot/portal-translate`. Zero strings hard-coded
   em PT ou EN na UI. Variáveis via `interpolate(t.key, ...)`, não template
   literal. Sem i18next/react-intl/formatjs — quebra `error.translate()`
   (ver [specs/i18n.md](specs/i18n.md)).
4. **Não criar `QueryClientProvider`** — os clients da lib já trazem
   `QueryClient` interno.
5. **Roteamento**: usar `<Link>` do `@stack-spot/citron-navigator`, nunca `<a href>`
   (URLs limpas = full reload). Props das views tipadas com `ViewPropsOf<'key'>`.
6. **Estado server-side já está no cache dos clients da lib** — não duplicar
   em Context. Context é só para UI (tema, prefs, modais globais).
7. **Sem libs de estado global** (Redux/Zustand/Jotai) por padrão.
8. **Formulários**: só `react-hook-form` com regras nativas — **sem Zod**, **sem
   `@hookform/resolvers`**.
9. **Sem Prettier**, sem `.prettierrc`, sem script `format` — formatação é
   `npm lint:fix`.
10. **Bootstrap**: `NetworkClient.setup` precisa rodar **antes** de qualquer
    hook do client. Já garantido pelo `import './lib/session'` em `main.tsx` —
    não reordenar.
11. **Reaproveitamento**: código usado em 2+ lugares vira componente/hook/helper
    compartilhado (ver [specs/padroes.md](specs/padroes.md) §1). Antes de criar
    algo novo, procurar em `src/components/`, `src/hooks/` e `src/lib/`. Sem
    extrair no primeiro uso — abstração especulativa atrapalha.

## Como contribuir com uma nova feature (checklist mental)

1. Leia o doc inteiro antes de codar.
2. Se for nova rota: edita `navigation.yaml` → `npm citron` → cria view em
   `src/views/` → registra em `App.tsx`.
3. Componentes novos de UI: rodar `npm dlx shadcn@latest add <componente>`
4. Antes de declarar pronto: `npm lint` e `npm build` (que inclui `tsc -b`)
   precisam passar.
