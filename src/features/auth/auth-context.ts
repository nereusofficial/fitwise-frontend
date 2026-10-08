import { createContext, useCallback, type MutableRefObject } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Session, User } from '@supabase/supabase-js'
import { useAuth } from '../../hooks/useAuth'
import { usePopup } from '../../components/Popup'

export interface AuthContextValue {
  session: Session | null
  user: User | null
  loading: boolean
  loggingOut: boolean
  isLoggingOutRef: MutableRefObject<boolean>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  performLogout: () => Promise<void>
  clearLoggingOut: () => void
}

export function useLogout() {
  const { performLogout, clearLoggingOut, loggingOut } = useAuth()
  const { showPopup } = usePopup()
  const navigate = useNavigate()

  const logout = useCallback(async () => {
    try {
      await performLogout()
      showPopup({
        title: 'Logged out',
        message: "You've been logged out. See you soon!",
        variant: 'success',
        onClose: () => {
          clearLoggingOut()
          navigate('/', { replace: true })
        },
      })
    } catch {
      clearLoggingOut()
      showPopup({
        title: "Couldn't log out",
        message: 'Something went wrong. Please try again.',
        variant: 'error',
        actions: [
          {
            label: 'Try again',
            onClick: () => logout(),
          },
        ],
      })
    }
  }, [performLogout, clearLoggingOut, showPopup, navigate])

  return { logout, loggingOut }
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
