import { useCallback, useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import { getBillingStatus } from '../lib/api'
import type { BillingStatus } from '../types'

export function useBilling() {
  const { user } = useAuth()
  const [status, setStatus] = useState<BillingStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!user) {
      setStatus(null)
      setLoading(false)
      return
    }
    try {
      const s = await getBillingStatus()
      setStatus(s)
    } catch {
      setStatus(null)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!user) {
      setStatus(null)
      setLoading(false)
      return
    }
    setLoading(true)
    refresh()
  }, [user, refresh])

  return { status, loading, refresh }
}
