import { forwardRef } from 'react'
import { Label as LabelPrimitive } from 'radix-ui'
import { cn } from '../../lib/utils'

type LabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>

export const Label = forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'text-[12px] font-medium leading-none text-text-secondary',
      'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
      className,
    )}
    {...props}
  />
))
Label.displayName = 'Label'
