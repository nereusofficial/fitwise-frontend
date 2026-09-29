import type { ReactNode } from 'react'

export function ResultCard({ label, value, subtext }: { label: string; value: string; subtext?: ReactNode }) {
  return (
    <div className="mt-6 rounded-2xl border-2 border-brand-500/30 bg-brand-50 p-6 text-center dark:border-brand-500/40 dark:bg-brand-950/30">
      <p className="text-sm font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">{label}</p>
      <p className="mt-1 font-display text-5xl font-bold tracking-wide text-ink-900 dark:text-ink-100">{value}</p>
      {subtext && <div className="mt-2 text-sm text-ink-500 dark:text-ink-400">{subtext}</div>}
    </div>
  )
}
