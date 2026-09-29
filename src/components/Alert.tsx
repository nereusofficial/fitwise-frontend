import type { HTMLAttributes } from 'react'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

type Variant = 'error' | 'success' | 'info'

const variantStyles: Record<Variant, string> = {
  error: 'border-red-300 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200',
  success: 'border-accent-300 bg-accent-50 text-accent-800 dark:border-accent-900 dark:bg-accent-950/50 dark:text-accent-200',
  info: 'border-ink-300 bg-ink-50 text-ink-700 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200',
}

const icons: Record<Variant, typeof Info> = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
}

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant
  title?: string
}

export function Alert({ variant = 'info', title, className = '', children, ...props }: AlertProps) {
  const Icon = icons[variant]
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${variantStyles[variant]} ${className}`}
      {...props}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div>
        {title && <p className="mb-1 font-semibold">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  )
}
