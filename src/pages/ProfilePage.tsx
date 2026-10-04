import { useProfile } from '../hooks/useProfile'
import { ProfileForm, type ProfileFormValues } from '../features/profile/ProfileForm'
import { Card, CardHeader, CardTitle } from '../components/Card'
import { Alert } from '../components/Alert'
import type { ActivityLevel, Gender, Goal } from '../types'

export default function ProfilePage() {
  const { profile, loading, saving, error, saveProfile } = useProfile()

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" role="status" aria-label="Loading" />
      </div>
    )
  }

  async function handleSave(values: ProfileFormValues) {
    if (!profile) return
    await saveProfile({
      name: profile.name,
      age: Number(values.age),
      heightCm: Number(values.heightCm),
      weightKg: Number(values.weightKg),
      gender: values.gender as Gender,
      activityLevel: values.activityLevel as ActivityLevel,
      goal: values.goal as Goal,
      goals: profile.goals,
      habits: profile.habits,
      mealPlanningFrequency: profile.mealPlanningFrequency,
      wantsMealPlans: profile.wantsMealPlans,
      about: profile.about,
      termsAcceptedAt: profile.termsAcceptedAt,
      privacyAcceptedAt: profile.privacyAcceptedAt,
      legalVersion: profile.legalVersion,
    })
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold tracking-wide text-ink-900 dark:text-ink-100">
        Your profile
      </h1>
      <p className="mt-2 text-ink-500 dark:text-ink-400">
        Update the stats that power your AI plan and dashboard insights.
      </p>

      {error && (
        <div className="mt-6">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{profile ? 'Update your stats' : 'Set up your stats'}</CardTitle>
        </CardHeader>
        <ProfileForm initialProfile={profile} saving={saving} onSave={handleSave} />
      </Card>
    </div>
  )
}
