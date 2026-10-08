import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ArrowRight,
  Calculator,
  ClipboardList,
  Flame,
  Pencil,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { usePopup } from '../components/Popup'
import { useProfile } from '../hooks/useProfile'
import { useRecommendations } from '../hooks/useRecommendations'
import {
  calcBMI,
  bmiCategory,
  calcBMR,
  calcTDEE,
  GOAL_LABELS,
  targetCalories,
} from '../features/calculators/formulas'
import { Button } from '../components/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '../components/Card'
import { Disclaimer } from '../components/Disclaimer'

function StatTile({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-4 text-center dark:border-ink-800 dark:bg-ink-900">
      <p className="font-display text-3xl font-bold text-ink-900 dark:text-ink-100">
        {value}
        {unit && <span className="ml-1 text-base font-semibold text-ink-500">{unit}</span>}
      </p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</p>
    </div>
  )
}

export default function Dashboard() {
  const { profile, loading: profileLoading } = useProfile()
  const { recommendations, loading: recsLoading } = useRecommendations()
  const location = useLocation()
  const { showPopup } = usePopup()

  useEffect(() => {
    if ((location.state as { showSuccess?: boolean } | null)?.showSuccess) {
      showPopup({
        title: 'Login successful',
        message: "Welcome back! You're all set.",
        variant: 'success',
      })
      window.history.replaceState({}, '')
    }

  }, [location.state, showPopup])

  const loading = profileLoading || recsLoading
  const latest = recommendations[0] ?? null

  const bmi = profile ? calcBMI(profile.weightKg, profile.heightCm) : null
  const bmr = profile ? calcBMR(profile.weightKg, profile.heightCm, profile.age, profile.gender) : null
  const tdee = profile && bmr !== null ? calcTDEE(bmr, profile.activityLevel) : null
  const target = profile && tdee !== null ? targetCalories(tdee, profile.goal) : null

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" role="status" aria-label="Loading" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-wide text-ink-900 dark:text-ink-100">
            Dashboard
          </h1>
          <p className="mt-1 text-ink-500 dark:text-ink-400">Your fitness overview at a glance.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/profile">
            <Button variant="outline" size="md">
              <Pencil className="h-4 w-4" aria-hidden="true" />
              Update stats
            </Button>
          </Link>
          <Link to="/plan">
            <Button size="md">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Get a plan
            </Button>
          </Link>
        </div>
      </div>

      {!profile ? (
        <Card>
          <CardHeader>
            <CardTitle>Set up your profile</CardTitle>
            <CardDescription>Add your stats to unlock your dashboard and AI plans.</CardDescription>
          </CardHeader>
          <Link to="/profile">
            <Button>
              Set up profile
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                    <Calculator className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <CardTitle>Your stats</CardTitle>
                    <CardDescription>
                      {profile.age} yrs · {profile.heightCm} cm · {profile.weightKg} kg · {profile.gender} ·{' '}
                      {GOAL_LABELS[profile.goal]}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatTile label="BMI" value={bmi !== null ? bmi.toFixed(1) : '—'} />
                <StatTile label="BMR" value={bmr !== null ? Math.round(bmr).toLocaleString() : '—'} unit="kcal" />
                <StatTile label="TDEE" value={tdee !== null ? Math.round(tdee).toLocaleString() : '—'} unit="kcal" />
                <StatTile label="Target" value={target !== null ? Math.round(target).toLocaleString() : '—'} unit="kcal" />
              </div>
              {bmi !== null && (
                <p className="mt-4 text-sm text-ink-500 dark:text-ink-400">
                  BMI category:{' '}
                  <span className="font-semibold text-ink-800 dark:text-ink-200">{bmiCategory(bmi)}</span>
                </p>
              )}
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-100 text-accent-600 dark:bg-accent-950 dark:text-accent-400">
                    <TrendingUp className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <CardTitle>Quick actions</CardTitle>
                    <CardDescription>Jump back in.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <div className="flex flex-col gap-2">
                <Link to="/plan">
                  <Button variant="secondary" className="w-full justify-start">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    Generate a new plan
                  </Button>
                </Link>
                <Link to="/progress">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4" aria-hidden="true" />
                    Log weight
                  </Button>
                </Link>
                <Link to="/calculators">
                  <Button variant="ghost" className="w-full justify-start">
                    <Calculator className="h-4 w-4" aria-hidden="true" />
                    Open calculators
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                    <ClipboardList className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <CardTitle>Latest plan</CardTitle>
                    <CardDescription>
                      {latest
                        ? `Generated ${new Date(latest.createdAt).toLocaleDateString()}`
                        : 'No plans yet.'}
                    </CardDescription>
                  </div>
                </div>
                {latest && (
                  <Link to="/history">
                    <Button variant="ghost" size="sm">
                      View history
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </Link>
                )}
              </div>
            </CardHeader>
            {latest ? (
              <div>
                <p className="text-ink-700 dark:text-ink-300">{latest.result.summary}</p>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-sm font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    <Flame className="h-4 w-4" aria-hidden="true" />
                    {Math.round(latest.result.dailyCalories).toLocaleString()} kcal/day
                  </span>
                  <span className="text-sm text-ink-500 dark:text-ink-400">
                    {latest.result.macros.proteinG}g protein · {latest.result.macros.carbsG}g carbs ·{' '}
                    {latest.result.macros.fatG}g fat
                  </span>
                </div>
                <div className="mt-6">
                  <Disclaimer />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-start gap-3">
                <p className="text-ink-500 dark:text-ink-400">
                  Generate your first AI workout and nutrition plan.
                </p>
                <Link to="/plan">
                  <Button>
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    Get a plan
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  )
}
