import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { mapMeasurement } from '../lib/mappers'
import type { Measurement } from '../types'
import { useAuth } from './useAuth'

interface UseMeasurementsResult {
  measurements: Measurement[]
  loading: boolean
  error: string
  addMeasurement: (weightKg: number, measuredAt: string) => Promise<void>
  deleteMeasurement: (id: string) => Promise<void>
  refresh: () => Promise<void>
}

export function useMeasurements(): UseMeasurementsResult {
  const { user } = useAuth()
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    if (!user) return
    const { data, error: fetchError } = await supabase
      .from('measurements')
      .select('*')
      .eq('user_id', user.id)
      .order('measured_at', { ascending: true })

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setMeasurements((data ?? []).map(mapMeasurement))
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    let active = true

    async function load() {
      if (!user) return
      const { data, error: fetchError } = await supabase
        .from('measurements')
        .select('*')
        .eq('user_id', user.id)
        .order('measured_at', { ascending: true })

      if (!active) return
      if (fetchError) {
        setError(fetchError.message)
      } else {
        setMeasurements((data ?? []).map(mapMeasurement))
      }
      setLoading(false)
    }

    void load()
    return () => {
      active = false
    }
  }, [user])

  const addMeasurement = useCallback(
    async (weightKg: number, measuredAt: string) => {
      if (!user) throw new Error('You must be logged in to log weight.')
      const { error: insertError } = await supabase
        .from('measurements')
        .insert({ user_id: user.id, weight_kg: weightKg, measured_at: measuredAt })
      if (insertError) throw insertError
      await refresh()
    },
    [user, refresh],
  )

  const deleteMeasurement = useCallback(async (id: string) => {
    const { error: deleteError } = await supabase.from('measurements').delete().eq('id', id)
    if (deleteError) throw deleteError
    setMeasurements((prev) => prev.filter((m) => m.id !== id))
  }, [])

  return { measurements, loading, error, addMeasurement, deleteMeasurement, refresh }
}
