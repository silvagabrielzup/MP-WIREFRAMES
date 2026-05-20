# Estado global (Context API)

Estado **server-side** já é coberto pelo cache dos clients da
`@stack-spot/portal-network` (ver [comunicacao-backend.md](comunicacao-backend.md))
— **não duplicar em Context**. O Context é só para estado de UI que precisa
ser compartilhado entre componentes sem relação direta de pai/filho.

## Princípios

- **Estado local primeiro** (`useState`/`useReducer`). Sobe para Context só
  quando o mesmo dado é lido/escrito por componentes distantes na árvore.
- **Vários contexts pequenos, por domínio.** Evitar um `AppContext` único —
  cada re-render do provider único derruba a árvore inteira.
- **Sem bibliotecas externas** (Zustand, Jotai, Redux) por padrão. Se aparecer
  necessidade real (perf de re-render em árvore grande, time travel, etc.),
  discutir antes de adotar.
- Cada Context vive em `src/contexts/<nome>Context.tsx`, expõe um `Provider` e
  um hook `useX` que **lança erro** se for usado fora do provider — evita o
  `null check` em todo callsite.

## Esqueleto

```tsx
import { createContext, useContext, useState, type ReactNode } from 'react'

interface ThemeContextValue {
  theme: 'light' | 'dark'
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const toggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'))
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
```

## Quando usar (e quando não)

**Context faz sentido para:** tema (claro/escuro), preferências de usuário,
modais globais, filtros persistentes que cruzam várias views.

**Context NÃO é para:** dados vindos do backend (já estão no cache dos clients
da lib de network), estado de um único formulário (RHF), estado local de uma
view (`useState`).
