# Novo Portal — Especificação Principal

## 1. Visão geral

Aplicação web em React responsável por expor o novo portal da StackSpot.
Integra com APIs do backend via `@stack-spot/portal-network` — os clients
específicos serão criados na própria lib conforme os serviços do produto
aparecerem.

Quando aparecerem necessidades específicas, usar as libs já fixadas pela
stack: **React Hook Form** para formulários e **React Flow** (`@xyflow/react`)
para diagramas. Não são o foco do projeto — são as escolhas padrão para
quando esses casos surgirem.

## 2. Stack técnica

| Camada | Tecnologia | Observações |
|---|---|---|
| Build / bundler | **Vite** (React + TypeScript) | Template `react-ts` |
| UI | **React 18+** | Hooks, Suspense quando necessário |
| Design System | **shadcn/ui** + **Base UI** | shadcn como gerador de componentes; Base UI (`@base-ui/react`) como camada de primitives acessíveis no lugar do Radix |
| Diagramas | **React Flow** (`@xyflow/react`) | Nós e edges customizados conforme o domínio |
| Formulários | **React Hook Form** | Validação via regras nativas do RHF (`register` rules / `validate`) |
| Roteamento | **@stack-spot/citron-navigator** | YAML → codegen tipado, sem `<Routes>` |
| Data fetching | **@stack-spot/portal-network** | Clients criados na lib, um por serviço do backend (sem `fetch`/`axios` neste repo) |
| Auth / Sessão | **@stack-spot/auth** + **@stack-spot/auth-react** | `SessionManager` vem de `auth-react` e é injetado no `NetworkClient.setup` (fluxo de auth na UI fica para iteração futura) |
| i18n | **@stack-spot/portal-translate** | Todo texto visível ao usuário passa por dicionário tipado (`satisfies Dictionary`). Erros do backend via `error.translate()`. Ver [i18n.md](i18n.md) |
| Estado global UI | **Context API** | Múltiplos contexts pequenos, sem Zustand/Jotai/Redux |
| Lint / Format | **ESLint 10** (flat config) | Sem Prettier — formatação via `@stylistic/eslint-plugin` |
| Package manager | **pnpm** | Declarado em `packageManager` no `package.json`; lockfile `pnpm-lock.yaml` versionado |

## 3. Estrutura de pastas

```
/
├─ navigation.yaml                # fonte do roteamento (citron)
├─ .env.local                     # VITE_NETWORK_OVERRIDES (dev)
├─ tsconfig.json                  # raiz com project references
├─ tsconfig.app.json              # config TS do código em src/
├─ tsconfig.node.json             # config TS dos arquivos de build (vite.config.ts)
├─ src/
│  ├─ main.tsx                    # bootstrap (importa lib/session e renderiza <App />)
│  ├─ App.tsx                     # useNavigationContext + dispatch de views
│  ├─ generated/
│  │  └─ navigation.ts            # gerado pelo citron (gitignored)
│  ├─ views/                      # views referenciadas pelas chaves do citron
│  ├─ components/
│  │  ├─ ui/                      # componentes shadcn (Base UI por baixo)
│  │  ├─ flow/                    # nós/edges customizados do React Flow
│  │  └─ forms/                   # campos reutilizáveis (RHF + shadcn)
│  ├─ contexts/                   # Contexts globais (theme, preferências, etc.)
│  ├─ features/                   # módulos por domínio (folders, projects, assets)
│  ├─ hooks/
│  ├─ lib/
│  │  ├─ session.ts               # SessionManager.create + NetworkClient.setup
│  │  └─ utils.ts                 # `cn` (clsx + tailwind-merge), helpers
│  └─ styles/
│     └─ globals.css              # tokens do Tailwind / shadcn
└─ package.json
```

`package.json` deve declarar o gerenciador de pacotes para que `corepack` e
ferramentas de CI usem a versão correta:

```json


## 4. Como rodar

### Pré-requisitos

- **Node.js** compatível com Vite 5+ (Node 20+ recomendado).

### Instalação

```sh
npm install
```

### Scripts npm

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```


```bash
npm run dev       # vite dev server
npm run build     # tsc -b && vite build (TS errors fail the build)
npm run lint      # eslint .
npm run preview   # preview production build
```
> ESLint 10 (flat config) descobre arquivos por padrão a partir de
> `eslint.config.js` — `--ext` foi removido. Não há mais script `format`: a
> formatação é parte do `lint:fix`.

## 5. Dependências (resumo)

Runtime:

```
react react-dom
@xyflow/react
react-hook-form
class-variance-authority clsx tailwind-merge lucide-react
```

Dev:

```
vite @vitejs/plugin-react typescript
tailwindcss @tailwindcss/vite
eslint@^10 typescript-eslint @eslint/js
eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh
@stylistic/eslint-plugin globals
```

Instalação sempre via `pnpm` (campo `packageManager` do `package.json` fixa a
versão para o time e para CI).

## 6. Documentos por tema

Cada tema tem sua própria spec dentro desta pasta:

- [typescript.md](typescript.md) — Configuração do TypeScript, project references, flags de estricteza.
- [estado-global.md](estado-global.md) — Context API, princípios e padrão de Provider/hook.
- [padroes.md](padroes.md) — Padrões transversais (reaproveitamento de código, etc.).
- [lint.md](lint.md) — ESLint 10 flat config, regras obrigatórias, substituição do Prettier.
- [design-system.md](design-system.md) — shadcn + Base UI + Tailwind via `@tailwindcss/vite`.
- [formularios.md](formularios.md) — React Hook Form com validação nativa.
- [diagramas.md](diagramas.md) — React Flow (`@xyflow/react`), nodeTypes/edgeTypes estáveis.

## 7. Definition of Done do setup

- [ ] `pnpm dev` sobe a aplicação sem erros e renderiza a rota raiz.
- [ ] `tsc -b` passa com `strict: true` e `noUncheckedIndexedAccess: true` ativos.
- [ ] `pnpm lint` passa com as regras de `no-semi` e `max-len: 140` ativas.
- [ ] shadcn inicializado e ao menos um componente (`Button`) gerado usando Base UI.
- [ ] View de exemplo com um formulário (RHF + shadcn, regras nativas do RHF) submetendo via mutation de um client da lib.
- [ ] View de exemplo com um diagrama React Flow renderizando nós e edges customizados.