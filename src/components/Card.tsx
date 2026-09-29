import type { HTMLAttributes } from 'react'

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-ink-200 bg-white p-6 shadow-sm dark:border-ink-800 dark:bg-ink-900 ${className}`}
      {...props}
    />
  )
}

export function CardHeader({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`mb-4 ${className}`} {...props} />
}

export function CardTitle({ className = '', ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`font-display text-xl font-semibold tracking-wide text-ink-900 dark:text-ink-100 ${className}`} {...props} />
}

export function CardDescription({ className = '', ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-sm text-ink-500 dark:text-ink-400 ${className}`} {...props} />
}
