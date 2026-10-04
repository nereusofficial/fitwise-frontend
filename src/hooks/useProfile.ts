import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { mapProfile } from '../lib/mappers'
import type { UserProfile } from '../types'
import { useAuth } from './useAuth'

interface UseProfileResult {
  profile: UserProfile | null
  loading: boolean
  saving: boolean
  error: string
  saveProfile: (data: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  refresh: () => Promise<void>
}

export function useProfile(): UseProfileResult {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    if (!user) return
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (fetchError) {
      setError(fetchError.message)
    } else if (data) {
      setProfile(mapProfile(data))
    } else {
      setProfile(null)
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    let active = true

    async function load() {
      if (!user) return
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (!active) return
      if (fetchError) {
        setError(fetchError.message)
      } else if (data) {
        setProfile(mapProfile(data))
      } else {
        setProfile(null)
      }
      setLoading(false)
    }

    void load()
    return () => {
      active = false
    }
  }, [user])

  const saveProfile = useCallback(
    async (data: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!user) {
        setError('You must be logged in to save a profile.')
        return
      }
      setSaving(true)
      setError('')
      const { error: upsertError } = await supabase.from('profiles').upsert({
        id: user.id,
        name: data.name,
        age: data.age,
        height_cm: data.heightCm,
        weight_kg: data.weightKg,
        gender: data.gender,
        activity_level: data.activityLevel,
        goal: data.goal,
        goals: data.goals,
        habits: data.habits,
        meal_planning_frequency: data.mealPlanningFrequency,
        wants_meal_plans: data.wantsMealPlans,
        about: data.about,
        terms_accepted_at: data.termsAcceptedAt,
        privacy_accepted_at: data.privacyAcceptedAt,
        legal_version: data.legalVersion,
      })
      setSaving(false)
      if (upsertError) {
        setError(upsertError.message)
        throw upsertError
      }
      await refresh()
    },
    [user, refresh],
  )

  return { profile, loading, saving, error, saveProfile, refresh }
}
