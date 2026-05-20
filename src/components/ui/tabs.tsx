import { forwardRef } from 'react'
import { Tabs as TabsPrimitive } from 'radix-ui'
import { cn } from '../../lib/utils'

export const Tabs = TabsPrimitive.Root

export const TabsList = forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center gap-1 rounded-md border border-border bg-surface p-1 text-text-secondary',
      className,
    )}
    {...props}
  />
))
TabsList.displayName = 'TabsList'

export const TabsTrigger = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded px-3 py-1 text-[12.5px] font-medium',
      'transition-colors',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/60',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:bg-bg data-[state=active]:text-text-primary data-[state=active]:shadow-sm',
      'hover:text-text-primary',
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = 'TabsTrigger'

export const TabsContent = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn('mt-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/60', className)}
    {...props}
  />
))
TabsContent.displayName = 'TabsContent'
