import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
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

    refresh()

    return () => {}
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
