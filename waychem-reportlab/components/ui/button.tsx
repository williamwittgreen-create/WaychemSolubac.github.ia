import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-way-petroleo text-white shadow hover:bg-way-petroleo/90',
        destructive: 'bg-red-500 text-white shadow-sm hover:bg-red-500/90',
        outline: 'border border-way-gris bg-white shadow-sm hover:bg-gray-50',
        secondary: 'bg-way-gris text-gray-900 shadow-sm hover:bg-way-gris/80',
        ghost: 'hover:bg-gray-100',
        link: 'text-way-petroleo underline-offset-4 hover:underline',
        verde: 'bg-way-verde text-white shadow hover:bg-way-verde/90',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  )
)
Button.displayName = 'Button'

export { Button, buttonVariants }
