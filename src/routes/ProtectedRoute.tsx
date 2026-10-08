import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'

export function ProtectedRoute() {
  const { user, loading, loggingOut } = useAuth()
  const { profile, loading: profileLoading } = useProfile()
  const location = useLocation()

  if (loading || profileLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"
          role="status"
          aria-label="Loading"
        />
      </div>
    )
  }

  if (!user && !loggingOut) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (user && !profile) {
    return <Navigate to="/signup" state={{ from: location.pathname, notice: 'Finish setting up your account' }} replace />
  }

  return <Outlet />
}
