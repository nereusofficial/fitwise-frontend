import { createContext, type MutableRefObject } from 'react'
import type { Session, User } from '@supabase/supabase-js'

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

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
