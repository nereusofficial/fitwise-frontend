import { Link } from 'react-router-dom'
import { Activity } from 'lucide-react'
import { Disclaimer } from './Disclaimer'

export function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-ink-50 dark:border-ink-800 dark:bg-ink-900">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Activity className="h-6 w-6 text-brand-500" aria-hidden="true" />
              <span className="font-display text-xl font-bold tracking-wide text-ink-900 dark:text-ink-100">
                FitWise
              </span>
            </div>
            <p className="text-sm text-ink-500 dark:text-ink-400">
              Your AI-powered fitness companion. Build workout and nutrition plans tailored to your body and goals.
            </p>
          </div>
          <nav aria-label="Footer">
            <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-ink-700 dark:text-ink-300">
              Product
            </h2>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link to="/dashboard" className="text-ink-500 hover:text-brand-600 dark:text-ink-400 dark:hover:text-brand-400">Dashboard</Link></li>
              <li><Link to="/plan" className="text-ink-500 hover:text-brand-600 dark:text-ink-400 dark:hover:text-brand-400">Get a plan</Link></li>
              <li><Link to="/progress" className="text-ink-500 hover:text-brand-600 dark:text-ink-400 dark:hover:text-brand-400">Progress</Link></li>
            </ul>
          </nav>
          <div>
            <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-ink-700 dark:text-ink-300">
              Legal
            </h2>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link to="/privacy" className="text-ink-500 hover:text-brand-600 dark:text-ink-400 dark:hover:text-brand-400">Privacy &amp; Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8">
          <Disclaimer />
        </div>
        <p className="mt-6 text-center text-xs text-ink-400 dark:text-ink-500">
          &copy; {new Date().getFullYear()} FitWise. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
