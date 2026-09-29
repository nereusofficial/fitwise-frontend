import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { Button } from '../components/Button'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-8xl font-bold text-brand-500" aria-hidden="true">
        404
      </p>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-wide text-ink-900 dark:text-ink-100">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-ink-500 dark:text-ink-400">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/" className="mt-8">
        <Button>
          <Home className="h-4 w-4" aria-hidden="true" />
          Back to home
        </Button>
      </Link>
    </div>
  )
}
