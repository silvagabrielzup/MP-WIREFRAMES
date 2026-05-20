# Padrões

Padrões transversais. Complementam as specs por tema.

## 1. Reaproveitamento de código

**Duplicou duas vezes, extrai.** Não criar abstração no primeiro uso. Antes de
criar, procurar em `src/components/`, `src/hooks/` e `src/lib/`.

### Onde mora o quê

| Tipo | Local |
|---|---|
| UI genérico (shadcn) | `src/components/ui/` |
| Componente compartilhado | `src/components/<area>/` |
| Nó/edge do React Flow | `src/components/flow/` |
| Campo de formulário reutilizável | `src/components/forms/` |
| Hook compartilhado | `src/hooks/` |
| Helper puro | `src/lib/` |
| Domínio específico | `src/features/<dominio>/` |


### Não extrair quando

- Existe só um callsite (abstração especulativa).
- Os dois usos divergem em mais coisas do que compartilham — manter duplicado
  é mais barato que uma prop booleana para cada diferença.


## 2. Wrappers de shadcn com API de props

Os primitives do shadcn ficam em `src/components/ui/` como vêm
(aceitam `className`, `asChild`, etc.). Quando o app cria um wrapper em cima
deles (`src/components/<area>/`), o wrapper expõe uma **API de props
semântica** — variações visuais e de comportamento são props nomeadas, não
classes de CSS passadas pelo callsite.

### Regras

- A superfície pública do wrapper são props nomeadas (`variant="danger"`,
  `size="lg"`, `loading`, `icon`), não `className`.
- Mapeamento prop → classe é detalhe interno (pode usar `cva`); o consumidor
  não vê `cva` nem Tailwind.
- Variação visual nova → vira prop nova no wrapper, não Tailwind no callsite.
- Conteúdo entra por `children` ou props nomeadas (`icon`, `title`,
  `description`). Subcomponentes (`Card.Header`) só quando há partes nomeadas
  reais — não como fuga de criar uma prop.
- Polimorfia (botão vs. link) → componente dedicado (`<ButtonLink>`), não
  `asChild` exposto no wrapper.
- `forwardRef` quando necessário.

### Exemplo — Button wrapper

```tsx
import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { Button as ShadcnButton } from '@/components/ui/button'

const styles = cva('', {
  variants: {
    variant: {
      primary: 'bg-primary text-primary-foreground',
      danger: 'bg-destructive text-destructive-foreground',
      ghost: 'bg-transparent',
    },
    size: { sm: 'h-8 px-3 text-sm', md: 'h-9 px-4', lg: 'h-10 px-6 text-base' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})

export interface ButtonProps
  extends Omit<React.ComponentProps<typeof ShadcnButton>, 'className' | 'asChild'>,
    VariantProps<typeof styles> {
  loading?: boolean
  icon?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, loading, icon, children, disabled, ...props }, ref) => (
    <ShadcnButton
      ref={ref}
      className={styles({ variant, size })}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" /> : icon}
      {children}
    </ShadcnButton>
  ),
)
```

Callsite:

```tsx
<Button variant="danger" size="lg" loading={isPending} onClick={onDelete}>Excluir</Button>
```

Não:

```tsx
// callsite mexendo no styling do wrapper — não fazer
<Button className="bg-red-500 h-10 px-6">Excluir</Button>
```
