import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { supabase } from '../../lib/supabaseClient'
import { getBillingStatus, demoSubscribe, demoCancel } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import type { BillingStatus } from '../../types'

interface BillingContextValue {
  status: BillingStatus | null
  loading: boolean
  refresh: () => Promise<void>
  subscribe: (interval: 'month' | 'year') => Promise<BillingStatus>
  cancel: () => Promise<BillingStatus>
}

const BillingContext = createContext<BillingContextValue | undefined>(undefined)

let requestCounter = 0

export function BillingProvider({ children }: { children: ReactNode }) {
  const { user, loggingOut } = useAuth()
  const [status, setStatus] = useState<BillingStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const lastFocusRefreshRef = useRef(0)

  const refresh = useCallback(async () => {
    if (!user || loggingOut) {
      setStatus(null)
      setLoading(false)
      return
    }
    const myRequest = ++requestCounter
    try {
      const s = await getBillingStatus()
      if (myRequest === requestCounter) {
        setStatus(s)
      }
    } catch {
      if (myRequest === requestCounter) {
        setStatus(null)
      }
    } finally {
      setLoading(false)
    }
  }, [user, loggingOut])

  const subscribe = useCallback(
    async (interval: 'month' | 'year'): Promise<BillingStatus> => {
      const s = await demoSubscribe(interval)
      setStatus(s)
      return s
    },
    [],
  )

  const cancel = useCallback(async (): Promise<BillingStatus> => {
    const s = await demoCancel()
    setStatus(s)
    return s
  }, [])

  useEffect(() => {
    setStatus(null)
    setLoading(true)

    if (!user || loggingOut) {
      setLoading(false)
      return
    }

    const channel = supabase
      .channel(`billing-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'entitlements',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          refresh()
        },
      )
      .subscribe(() => {})

    refresh()

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        const now = Date.now()
        if (now - lastFocusRefreshRef.current > 10000) {
          lastFocusRefreshRef.current = now
          refresh()
        }
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('focus', handleVisibility)

    return () => {
      supabase.removeChannel(channel)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('focus', handleVisibility)
    }
  }, [user, loggingOut, refresh])

  return (
    <BillingContext.Provider value={{ status, loading, refresh, subscribe, cancel }}>
      {children}
    </BillingContext.Provider>
  )
}

export function useBilling(): BillingContextValue {
  const context = useContext(BillingContext)
  if (!context) {
    throw new Error('useBilling must be used within BillingProvider')
  }
  return context
}
