import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        'flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1.5',
        'text-[13px] text-text-primary placeholder:text-text-muted',
        'transition-colors',
        'hover:border-border-strong',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:border-accent/60',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'file:border-0 file:bg-transparent file:text-[13px] file:font-medium',
        className,
      )}
      {...props}
    />
  ),
)
Input.displayName = 'Input'
