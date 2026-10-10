import { useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import { useBilling } from '../features/billing/BillingContext'
import { demoCancel } from '../lib/api'
import { ProfileForm, type ProfileFormValues } from '../features/profile/ProfileForm'
import { PaywallModal } from '../features/billing/PaywallModal'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Card, CardHeader, CardTitle } from '../components/Card'
import { Alert } from '../components/Alert'
import { usePopup } from '../components/Popup'
import type { ActivityLevel, Gender, Goal } from '../types'

export default function ProfilePage() {
  const { profile, loading, saving, error, saveProfile } = useProfile()
  const { status, refresh } = useBilling()
  const { showPopup } = usePopup()
  const [showPaywall, setShowPaywall] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  async function handleCancel() {
    setShowCancelConfirm(false)
    try {
      await demoCancel()
      refresh()
      showPopup({ title: 'Subscription canceled', message: 'Pro access continues until the end of your billing period.', variant: 'info' })
    } catch {
      showPopup({ title: 'Failed to cancel', message: 'Please try again.', variant: 'error' })
    }
  }

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

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        {status ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-ink-100">{status.isPro ? 'Pro' : 'Free'}</p>
              {status.isPro && status.subscription && (
                <p className="text-sm text-ink-400">
                  {status.subscription.status === 'canceled'
                    ? `Pro until ${new Date(status.subscription.currentPeriodEnd).toLocaleDateString()}`
                    : `Renews ${new Date(status.subscription.currentPeriodEnd).toLocaleDateString()}`}
                </p>
              )}
            </div>
            {status.isPro ? (
              <button
                type="button"
                onClick={() => setShowCancelConfirm(true)}
                className="cursor-pointer rounded-xl border border-ink-600 px-4 py-2 text-sm font-semibold text-ink-300 transition-colors hover:bg-ink-800"
              >
                Cancel subscription
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowPaywall(true)}
                className="cursor-pointer rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-ink-950 transition-colors hover:bg-brand-400"
              >
                Upgrade
              </button>
            )}
          </div>
        ) : null}
      </Card>

      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />

      <ConfirmDialog
        isOpen={showCancelConfirm}
        title="Cancel subscription?"
        message="You'll keep Pro access until the end of your billing period."
        confirmLabel="Cancel subscription"
        onConfirm={handleCancel}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </div>
  )
}
