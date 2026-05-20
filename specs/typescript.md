# TypeScript

Project references no padrão do Vite: `tsconfig.json` raiz só aponta para
`tsconfig.app.json` (código em `src/`) e `tsconfig.node.json` (arquivos de
build: `vite.config.ts` etc.). Flags de estricteza ativadas desde o setup —
barato agora, doloroso depois.

## `tsconfig.json`

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

## `tsconfig.app.json`

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "isolatedModules": true,
    "noEmit": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,

    // Strictness
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "forceConsistentCasingInFileNames": true,

    // Paths
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "navigation": ["./src/generated/navigation"]
    }
  },
  "include": ["src"]
}
```

## `tsconfig.node.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true
  },
  "include": ["vite.config.ts"]
}
```

## Notas

- `noUncheckedIndexedAccess` força tratar acessos por índice como `T | undefined` — pega bugs em `array[i]` e `record[key]` sem custo cognitivo alto.
- O alias `@/*` cobre imports internos (`@/components/...`); o alias `navigation` é exigido pelo citron (ver [navegacao.md](navegacao.md)).
- ESLint mantém suas próprias regras de unused vars — o overlap com `noUnusedLocals`/`noUnusedParameters` é intencional: ESLint dá feedback no editor, TS pega no `tsc -b` do build.
