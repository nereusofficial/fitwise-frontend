import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabaseClient'
import { setLoggingOut as setGlobalLoggingOut } from '../../lib/logoutFlag'
import { AuthContext, type AuthContextValue } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [loggingOut] = useState(false)
  const isLoggingOutRef = useRef(false)

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!active) return
      setSession(newSession)
      setUser(newSession?.user ?? null)
      setLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href },
    })
    if (error) throw error
  }, [])

  const signOut = useCallback(async () => {
    setGlobalLoggingOut(true)
    const { error } = await supabase.auth.signOut()
    if (error) {
      setGlobalLoggingOut(false)
      throw error
    }
    setSession(null)
    setUser(null)
  }, [])

  const performLogout = useCallback(async () => {
    isLoggingOutRef.current = true
    setGlobalLoggingOut(true)
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      if (error) {
        isLoggingOutRef.current = false
        setGlobalLoggingOut(false)
        throw error
      }
    } catch (error) {
      isLoggingOutRef.current = false
      setGlobalLoggingOut(false)
      throw error
    }
  }, [])

  const clearLoggingOut = useCallback(() => {
    isLoggingOutRef.current = false
    setGlobalLoggingOut(false)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      loading,
      loggingOut,
      isLoggingOutRef,
      signInWithGoogle,
      signOut,
      performLogout,
      clearLoggingOut,
    }),
    [session, user, loading, loggingOut, signInWithGoogle, signOut, performLogout, clearLoggingOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
