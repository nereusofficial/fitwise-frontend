import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand-500 text-ink-950 hover:bg-brand-400 focus-visible:outline-brand-500 font-semibold',
  secondary:
    'bg-accent-500 text-ink-950 hover:bg-accent-400 focus-visible:outline-accent-500 font-semibold',
  outline:
    'border-2 border-ink-300 text-ink-900 hover:border-brand-500 hover:text-brand-600 focus-visible:outline-brand-500 dark:border-ink-700 dark:text-ink-100 dark:hover:border-brand-400 dark:hover:text-brand-400',
  ghost:
    'text-ink-700 hover:bg-ink-100 hover:text-ink-900 focus-visible:outline-brand-500 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-ink-100',
  danger:
    'bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-500 font-semibold',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, className = '', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {loading && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
