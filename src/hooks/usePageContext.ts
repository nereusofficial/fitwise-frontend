import { useLocation } from 'react-router-dom'

export type PageContext = 'landing' | 'auth' | 'app'

export function usePageContext(): PageContext {
  const location = useLocation()
  const path = location.pathname

  if (path === '/') return 'landing'
  if (path === '/login' || path === '/signup') return 'auth'
  if (path === '/terms' || path === '/privacy') return 'auth'
  return 'app'
}
