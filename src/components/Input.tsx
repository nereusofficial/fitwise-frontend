import { forwardRef, type InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = '', ...props }, ref) => {
    const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, '-')
    const errorId = `${inputId}-error`
    const hintId = `${inputId}-hint`

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-semibold text-ink-800 dark:text-ink-200">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={`w-full rounded-xl border-2 bg-white px-4 py-2.5 text-ink-900 transition-colors placeholder:text-ink-400 focus:outline-none focus-visible:ring-2 dark:bg-ink-900 dark:text-ink-100 ${
            error
              ? 'border-red-500 focus:border-red-500 focus-visible:ring-red-500/30'
              : 'border-ink-200 focus:border-brand-500 focus-visible:ring-brand-500/30 dark:border-ink-700'
          } ${className}`}
          {...props}
        />
        {error ? (
          <p id={errorId} role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="text-sm text-ink-500 dark:text-ink-400">
            {hint}
          </p>
        ) : null}
      </div>
    )
  },
)

Input.displayName = 'Input'
