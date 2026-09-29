import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { useProfile } from '../hooks/useProfile'
import { useRecommendations } from '../hooks/useRecommendations'
import { fetchRecommendation, ApiError } from '../lib/api'
import { RecommendationForm, type PlanFormValues } from '../features/recommendations/RecommendationForm'
import { RecommendationView } from '../features/recommendations/RecommendationView'
import { Card, CardHeader, CardTitle } from '../components/Card'
import { Alert } from '../components/Alert'
import type { Recommendation, RecommendationInput } from '../types'

export default function PlanPage() {
  const { profile, loading: profileLoading } = useProfile()
  const { saveRecommendation } = useRecommendations()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<Recommendation | null>(null)
  const navigate = useNavigate()

  async function handleGenerate(values: PlanFormValues) {
    setLoading(true)
    setError('')
    setResult(null)
    const input: RecommendationInput = {
      ...values,
      goals: profile?.goals ?? [],
      habits: profile?.habits ?? [],
      mealPlanningFrequency: profile?.mealPlanningFrequency ?? 'weekly',
      wantsMealPlans: profile?.wantsMealPlans ?? false,
      about: profile?.about ?? '',
    }
    try {
      const recommendation = await fetchRecommendation(input)
      setResult(recommendation)
      await saveRecommendation(input, recommendation)
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        navigate('/login', { state: { from: '/plan' } })
        return
      }
      setError(err instanceof Error ? err.message : 'Could not generate your plan. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (profileLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" role="status" aria-label="Loading" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold tracking-wide text-ink-900 dark:text-ink-100">
        Get your plan
      </h1>
      <p className="mt-2 text-ink-500 dark:text-ink-400">
        Generate a personalized AI workout and nutrition plan from your stats.
      </p>

      {error && (
        <div className="mt-6">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Your stats</CardTitle>
        </CardHeader>
        <RecommendationForm initialProfile={profile} loading={loading} onGenerate={handleGenerate} />
        <div className="mt-4 flex items-start gap-2 text-sm text-ink-500 dark:text-ink-400">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden="true" />
          <p>
            The stats you enter are sent to an AI service solely to generate your plan. They are not shared with
            third parties.
          </p>
        </div>
      </Card>

      {loading && (
        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" role="status" aria-label="Generating your plan" />
          <p className="text-ink-500 dark:text-ink-400">Building your plan… this can take a few seconds.</p>
        </div>
      )}

      {result && !loading && (
        <div className="mt-12">
          <RecommendationView recommendation={result} />
        </div>
      )}
    </div>
  )
}
