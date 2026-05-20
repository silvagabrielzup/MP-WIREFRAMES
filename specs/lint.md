# ESLint

- **ESLint 10** (flat config — `eslint.config.js` na raiz). Sem Prettier; as
  regras de formatação vêm do `@stylistic/eslint-plugin` (substituto oficial
  das regras de estilo que foram removidas do core do ESLint).
- O lint é a única fonte da verdade para estilo: **não há `.prettierrc`,
  `eslint-config-prettier` nem script `format`**. Quem quiser auto-formatar usa
  `pnpm lint:fix`.

## Regras obrigatórias

- `@stylistic/semi: ['error', 'never']` — **sem ponto-e-vírgula**.
- `@stylistic/max-len: ['error', { code: 140, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true }]`.
- `@stylistic/quotes: ['error', 'single']`.
- `@stylistic/comma-dangle: ['error', 'all']`.
- `@typescript-eslint/no-unused-vars` com `argsIgnorePattern: '^_'`.
- `react-hooks/rules-of-hooks` + `react-hooks/exhaustive-deps`.

## Pacotes mínimos

```sh
pnpm add -D eslint@^10 typescript-eslint @eslint/js \
  eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh \
  @stylistic/eslint-plugin globals
```

## `eslint.config.js`

```js
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'

export default tseslint.config(
  { ignores: ['dist', 'src/generated'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: { project: './tsconfig.app.json' },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@stylistic': stylistic,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/max-len': ['error', { code: 140, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true }],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/comma-dangle': ['error', 'all'],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'react/react-in-jsx-scope': 'off',
      'react-refresh/only-export-components': 'warn',
    },
  },
)
```

## Notas

- ESLint 10 só aceita flat config (`eslint.config.js`); o legado
  `.eslintrc.*` não é mais suportado.
- `typescript-eslint` (sem `@`) é o pacote umbrella moderno que substitui
  `@typescript-eslint/parser` + `@typescript-eslint/eslint-plugin`.
- `src/generated` está em `ignores` para evitar lintar o output do citron.
