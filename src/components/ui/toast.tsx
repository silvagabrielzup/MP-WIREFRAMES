import { forwardRef } from 'react'
import { Toast as ToastPrimitive } from 'radix-ui'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

export const ToastProvider = ToastPrimitive.Provider

export const ToastViewport = forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      'fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4',
      'sm:bottom-4 sm:right-4 sm:top-auto sm:flex-col md:max-w-[420px]',
      className,
    )}
    {...props}
  />
))
ToastViewport.displayName = 'ToastViewport'

const toastVariants = cva(
  [
    'group pointer-events-auto relative flex w-full items-center justify-between gap-3 overflow-hidden',
    'rounded-md border p-4 pr-8 shadow-lg transition-all',
    'data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]',
    'data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[swipe=end]:animate-out data-[state=closed]:fade-out-80',
    'data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full',
    'data-[state=open]:sm:slide-in-from-bottom-full',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'border-border bg-surface text-text-primary',
        success: 'border-success/40 bg-success/10 text-text-primary',
        warning: 'border-warning/40 bg-warning/10 text-text-primary',
        danger: 'border-failure/40 bg-failure/10 text-text-primary',
        info: 'border-info/40 bg-info/10 text-text-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>,
    VariantProps<typeof toastVariants> {}

export const Toast = forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  ToastProps
>(({ className, variant, ...props }, ref) => (
  <ToastPrimitive.Root
    ref={ref}
    className={cn(toastVariants({ variant }), className)}
    {...props}
  />
))
Toast.displayName = 'Toast'

export const ToastAction = forwardRef<
  React.ElementRef<typeof ToastPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-border bg-transparent px-3',
      'text-[12.5px] font-medium text-text-primary hover:bg-bg',
      'focus:outline-none focus:ring-1 focus:ring-accent/60',
      'disabled:pointer-events-none disabled:opacity-50',
      className,
    )}
    {...props}
  />
))
ToastAction.displayName = 'ToastAction'

export const ToastClose = forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    toast-close=""
    aria-label="Close"
    className={cn(
      'absolute right-2 top-2 rounded text-text-secondary opacity-0 transition-opacity',
      'hover:text-text-primary focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-accent/60',
      'group-hover:opacity-100',
      className,
    )}
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitive.Close>
))
ToastClose.displayName = 'ToastClose'

export const ToastTitle = forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn('text-[13px] font-semibold', className)}
    {...props}
  />
))
ToastTitle.displayName = 'ToastTitle'

export const ToastDescription = forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn('text-[12.5px] text-text-secondary', className)}
    {...props}
  />
))
ToastDescription.displayName = 'ToastDescription'

export type ToastVariant = NonNullable<VariantProps<typeof toastVariants>['variant']>
