import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { mapRecommendation } from '../lib/mappers'
import type { RecommendationInput, RecommendationRecord } from '../types'
import { useAuth } from './useAuth'

interface UseRecommendationsResult {
  recommendations: RecommendationRecord[]
  loading: boolean
  error: string
  saveRecommendation: (input: RecommendationInput, result: RecommendationRecord['result']) => Promise<RecommendationRecord>
  deleteRecommendation: (id: string) => Promise<void>
  refresh: () => Promise<void>
}

export function useRecommendations(): UseRecommendationsResult {
  const { user } = useAuth()
  const [recommendations, setRecommendations] = useState<RecommendationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    if (!user) return
    const { data, error: fetchError } = await supabase
      .from('recommendations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setRecommendations((data ?? []).map(mapRecommendation))
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    let active = true

    async function load() {
      if (!user) return
      const { data, error: fetchError } = await supabase
        .from('recommendations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!active) return
      if (fetchError) {
        setError(fetchError.message)
      } else {
        setRecommendations((data ?? []).map(mapRecommendation))
      }
      setLoading(false)
    }

    void load()
    return () => {
      active = false
    }
  }, [user])

  const saveRecommendation = useCallback(
    async (input: RecommendationInput, result: RecommendationRecord['result']) => {
      if (!user) throw new Error('You must be logged in to save a recommendation.')
      const { data, error: insertError } = await supabase
        .from('recommendations')
        .insert({ user_id: user.id, input_stats: input, result })
        .select()
        .single()
      if (insertError) throw insertError
      const record = mapRecommendation(data)
      setRecommendations((prev) => [record, ...prev])
      return record
    },
    [user],
  )

  const deleteRecommendation = useCallback(async (id: string) => {
    const { error: deleteError } = await supabase.from('recommendations').delete().eq('id', id)
    if (deleteError) throw deleteError
    setRecommendations((prev) => prev.filter((r) => r.id !== id))
  }, [])

  return { recommendations, loading, error, saveRecommendation, deleteRecommendation, refresh }
}
