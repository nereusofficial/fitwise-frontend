import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Onboarding } from '../features/auth/onboarding/Onboarding'
import { ChatWidget } from '../features/chat/ChatWidget'

const STORAGE_KEY = 'fitwise-onboarding'

function hasPendingOnboarding(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) !== null
  } catch {
    return false
  }
}

export default function SignupPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"
          role="status"
          aria-label="Loading"
        />
      </div>
    )
  }

  if (user && !hasPendingOnboarding()) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <>
      <Onboarding />
      <ChatWidget mode="public" />
    </>
  )
}
