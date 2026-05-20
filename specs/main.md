# Management Plane — Especificação Principal

## 1. Visão geral

Este é um projeto de **prova de conceito (POC) / MVP** focado em validar a interface e o fluxo do usuário antes de qualquer integração com backend real. Todo o consumo de dados que popula as telas vem de um único arquivo: `database.json`. Não existe API real, não existe autenticação real, não existe persistência server-side. O foco é **velocidade de iteração visual e validação de UX**.

O Management Plane é a interface humana sobre uma plataforma agêntica composta por:

7 motores deterministas (Kaptain = CD/AWS, Komply = policies, Konstructor = build, Orkestra = K8s, Traffik = routing/DNS, Pantheon = Kafka, Migration = data migration)

Workflows agênticos que orquestram esses motores via Claude Code + CLI

Sensores que validam código e infra (security, quality, performance)


A missão do Management Plane: habilitar confiança progressiva no harness agêntico, expondo a operação dos motores e workflows de forma visível, governável e consumível por humanos e agentes.


## Regra fundamental

> **Toda tela que exibe dados deve buscar esses dados de `database.json`. Sempre. Sem exceção.**

Nada de dados hardcoded dentro de componentes, nada de arrays inline em JSX, nada de mock espalhado em vários lugares. Existe uma única fonte de verdade para os dados desta POC: o `database.json`.

## 2. Stack técnica

| Camada | Tecnologia | Observações |
|---|---|---|
| Build / bundler | **Vite** (React + TypeScript) | Template `react-ts` |
| UI | **React 19+** | Hooks, Suspense quando necessário |
| Design System | **shadcn/ui**
| Diagramas | **React Flow** (`@xyflow/react`) | Nós e edges customizados conforme o domínio |
| Estado global UI | **Context API** | Múltiplos contexts pequenos, sem Zustand/Jotai/Redux |

## 3. Estrutura de pastas

projeto/
├── database.json              ← fonte única de dados mockados
├── src/
│   ├── services/
│   │   └── database.ts        ← camada de acesso ao database.json
│   ├── hooks/
│   │   └── useData.ts         ← hooks de consumo (useUsers, useProducts, etc.)
│   ├── types/
│   │   └── models.ts          ← tipos derivados do schema do database.json
│   ├── components/
│   └── views/
└── ...
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

Instalação sempre via `npm` 

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


## 8.Como o `database.json` deve ser estruturado

Pense nele como um banco relacional simplificado: cada chave de topo é uma "tabela", contendo um array de registros. Relacionamentos são feitos por ID.

```json
{
  "users": [
    { "id": "u1", "name": "Ana Silva", "email": "ana@example.com", "role": "admin" },
    { "id": "u2", "name": "Bruno Costa", "email": "bruno@example.com", "role": "user" }
  ],
  "products": [
    { "id": "p1", "name": "Notebook Pro", "price": 4500, "stock": 12, "categoryId": "c1" },
    { "id": "p2", "name": "Mouse Wireless", "price": 120, "stock": 45, "categoryId": "c2" }
  ],
  "categories": [
    { "id": "c1", "name": "Computadores" },
    { "id": "c2", "name": "Acessórios" }
  ],
  "orders": [
    {
      "id": "o1",
      "userId": "u1",
      "items": [{ "productId": "p1", "quantity": 1 }],
      "total": 4500,
      "status": "completed",
      "createdAt": "2025-03-15T10:30:00Z"
    }
  ]
}
```

**Convenções:**

- IDs são strings com prefixo curto identificando o tipo (`u1`, `p1`, `o1`)
- Relacionamentos sempre por ID (`categoryId`, `userId`)
- Datas em formato ISO 8601
- Valores monetários em número (centavos opcionais, mas consistente em todo o arquivo)
- Status e enums em strings minúsculas