import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react'
import { useAuth } from '../../../hooks/useAuth'
import { useProfile } from '../../../hooks/useProfile'
import { onboardingStep } from '../../../lib/animations'
import { OptionGrid } from './steps'
import {
  ACTIVITY_OPTIONS,
  GOAL_OPTIONS,
  HABIT_OPTIONS,
  MEAL_PLANNING_OPTIONS,
  PRIMARY_GOAL_MAP,
} from './options'
import { Alert } from '../../../components/Alert'
import type { ActivityLevel, Gender, Goal, MealPlanningFrequency, OnboardingData } from '../../../types'

const STORAGE_KEY = 'fitwise-onboarding'

const emptyData: OnboardingData = {
  name: '',
  goals: [],
  habits: [],
  mealPlanningFrequency: '',
  wantsMealPlans: null,
  activityLevel: '',
  goal: '',
  about: '',
  age: '',
  heightCm: '',
  weightKg: '',
  gender: '',
}

function loadStored(): OnboardingData | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? { ...emptyData, ...(JSON.parse(raw) as OnboardingData) } : null
  } catch {
    return null
  }
}

export function Onboarding() {
  const { user, signInWithGoogle } = useAuth()
  const { saveProfile } = useProfile()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [data, setData] = useState<OnboardingData>(() => loadStored() ?? emptyData)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [consent, setConsent] = useState({ terms: false, privacy: false })

  const totalSteps = 9
  const isConsentStep = user !== null

  useEffect(() => {
    const visualViewport = window.visualViewport
    if (!visualViewport) return

    const onViewportResize = () => {
      const activeElement = document.activeElement
      if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) {
        setTimeout(() => {
          activeElement.scrollIntoView({ block: 'center', behavior: 'smooth' })
        }, 100)
      }
    }

    visualViewport.addEventListener('resize', onViewportResize)
    return () => visualViewport.removeEventListener('resize', onViewportResize)
  }, [])

  if (isConsentStep && !loadStored()) {
    return <Navigate to="/dashboard" replace />
  }

  function update<K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) {
    setData((prev) => {
      const next = { ...prev, [key]: value }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  function toggleArray(key: 'goals' | 'habits', value: string) {
    setData((prev) => {
      const arr = prev[key]
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
      const updated = { ...prev, [key]: next }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  function canContinue(): boolean {
    switch (step) {
      case 0:
        return data.name.trim().length >= 2
      case 1:
        return data.goals.length > 0
      case 2:
        return data.habits.length > 0
      case 3:
        return data.mealPlanningFrequency !== ''
      case 4:
        return data.wantsMealPlans !== null
      case 5:
        return data.activityLevel !== ''
      case 6:
        return true
      case 7:
        return (
          data.age !== '' &&
          data.heightCm !== '' &&
          data.weightKg !== '' &&
          data.gender !== ''
        )
      default:
        return true
    }
  }

  function next() {
    if (!canContinue()) return
    setDirection(1)
    setStep((s) => Math.min(s + 1, totalSteps - 1))
  }

  function back() {
    setDirection(-1)
    setStep((s) => Math.max(s - 1, 0))
  }

  async function handleGoogleSignIn() {
    setBusy(true)
    setError('')
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed. Please try again.')
      setBusy(false)
    }
  }

  async function handleConsent() {
    if (!consent.terms || !consent.privacy) {
      setError('Please accept the Terms and Privacy Policy to continue.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const goal: Goal = data.goal !== '' ? data.goal : PRIMARY_GOAL_MAP[data.goals[0] ?? 'maintain'] ?? 'maintain'
      await saveProfile({
        name: data.name.trim(),
        age: Number(data.age),
        heightCm: Number(data.heightCm),
        weightKg: Number(data.weightKg),
        gender: data.gender as Gender,
        activityLevel: (data.activityLevel || 'moderate') as ActivityLevel,
        goal,
        goals: data.goals,
        habits: data.habits,
        mealPlanningFrequency: (data.mealPlanningFrequency || 'weekly') as MealPlanningFrequency,
        wantsMealPlans: data.wantsMealPlans ?? false,
        about: data.about.trim(),
      })
      sessionStorage.removeItem(STORAGE_KEY)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not set up your account. Please try again.')
      setBusy(false)
    }
  }

  if (isConsentStep) {
    return <ConsentStep consent={consent} setConsent={setConsent} onContinue={handleConsent} busy={busy} error={error} />
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 20%, rgba(249,115,22,0.15) 0%, transparent 40%), radial-gradient(circle at 85% 80%, rgba(34,197,94,0.12) 0%, transparent 40%)',
        }}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/')}
            aria-label="Exit to home"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-ink-400 transition-colors hover:bg-ink-800 hover:text-ink-100 focus-visible:outline-2 focus-visible:outline-brand-500"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </button>
          <p className="text-sm font-medium text-ink-400 dark:text-ink-500">
            Step {step + 1} of {totalSteps}
          </p>
        </div>
        <div className="mb-8 text-center">
          <p className="font-display text-4xl font-bold tracking-wide text-ink-900 dark:text-ink-100">
            Let&apos;s build your plan
          </p>
          <p className="mt-2 text-ink-500 dark:text-ink-400">
            {step + 1 === totalSteps ? 'almost there' : 'a few quick questions'}
          </p>
        </div>

        <div className="mb-8 h-2 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
            initial={false}
            animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <div className="rounded-3xl border border-ink-200 bg-white/80 p-8 shadow-xl backdrop-blur dark:border-ink-800 dark:bg-ink-900/80">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={onboardingStep}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {step === 0 && <NameStep value={data.name} onChange={(v) => update('name', v)} />}
              {step === 1 && (
                <GoalsStep selected={data.goals} onToggle={(v) => toggleArray('goals', v)} />
              )}
              {step === 2 && (
                <HabitsStep selected={data.habits} onToggle={(v) => toggleArray('habits', v)} />
              )}
              {step === 3 && (
                <MealPlanningStep
                  selected={data.mealPlanningFrequency}
                  onSelect={(v) => update('mealPlanningFrequency', v as MealPlanningFrequency)}
                />
              )}
              {step === 4 && (
                <MealPlansStep value={data.wantsMealPlans} onSelect={(v) => update('wantsMealPlans', v)} />
              )}
              {step === 5 && (
                <ActivityStep
                  selected={data.activityLevel}
                  onSelect={(v) => update('activityLevel', v as ActivityLevel)}
                />
              )}
              {step === 6 && <AboutStep value={data.about} onChange={(v) => update('about', v)} />}
              {step === 7 && <StatsStep data={data} update={update} />}
              {step === 8 && <SignInStep onGoogle={handleGoogleSignIn} busy={busy} />}
            </motion.div>
          </AnimatePresence>

          {error && !isConsentStep && (
            <div className="mt-4">
              <Alert variant="error">{error}</Alert>
            </div>
          )}

          {step < 8 && (
            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={back}
                disabled={step === 0}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 font-semibold text-ink-600 transition-colors hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-ink-300 dark:hover:bg-ink-800"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Previous
              </button>
              <button
                type="button"
                onClick={next}
                disabled={!canContinue()}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand-500 px-6 py-2.5 font-semibold text-ink-950 transition-colors hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-3xl font-bold tracking-wide text-ink-900 dark:text-ink-100">{title}</h2>
      <p className="mt-1 text-ink-500 dark:text-ink-400">{subtitle}</p>
    </div>
  )
}

function NameStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <StepHeader title="What should we call you?" subtitle="Your name personalizes your plan." />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => {
          setTimeout(() => {
            e.target.scrollIntoView({ block: 'center', behavior: 'smooth' })
          }, 300)
        }}
        placeholder="Your first name"
        autoFocus
        className="w-full rounded-2xl border-2 border-ink-200 bg-white px-5 py-4 text-lg text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
      />
    </div>
  )
}

function GoalsStep({ selected, onToggle }: { selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div>
      <StepHeader title="What are your goals?" subtitle="Pick all that apply — we'll tailor everything to these." />
      <OptionGrid options={GOAL_OPTIONS} selected={selected} onToggle={onToggle} />
    </div>
  )
}

function HabitsStep({ selected, onToggle }: { selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div>
      <StepHeader title="Which healthy habits matter most?" subtitle="Choose the habits you want to focus on." />
      <OptionGrid options={HABIT_OPTIONS} selected={selected} onToggle={onToggle} />
    </div>
  )
}

function MealPlanningStep({
  selected,
  onSelect,
}: {
  selected: string
  onSelect: (v: string) => void
}) {
  return (
    <div>
      <StepHeader title="How often do you plan meals ahead?" subtitle="This helps us match your meal planning style." />
      <OptionGrid options={MEAL_PLANNING_OPTIONS} selected={selected ? [selected] : []} onToggle={onSelect} multi={false} />
    </div>
  )
}

function MealPlansStep({ value, onSelect }: { value: boolean | null; onSelect: (v: boolean) => void }) {
  return (
    <div>
      <StepHeader title="Want weekly meal plans?" subtitle="We can build a full weekly meal plan for you." />
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { v: true, label: 'Yes, please', description: 'Build weekly meal plans' },
          { v: false, label: 'No thanks', description: 'Just workouts and tips' },
        ].map((opt) => (
          <button
            key={String(opt.v)}
            type="button"
            onClick={() => onSelect(opt.v)}
            aria-pressed={value === opt.v}
            className={`cursor-pointer rounded-2xl border-2 p-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-brand-500 ${
              value === opt.v
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40'
                : 'border-ink-200 bg-white hover:border-ink-300 dark:border-ink-700 dark:bg-ink-900'
            }`}
          >
            <span className="block font-semibold text-ink-900 dark:text-ink-100">{opt.label}</span>
            <span className="block text-sm text-ink-500 dark:text-ink-400">{opt.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function ActivityStep({ selected, onSelect }: { selected: string; onSelect: (v: string) => void }) {
  return (
    <div>
      <StepHeader title="Your baseline activity level" subtitle="Be honest — this calibrates your calorie targets." />
      <OptionGrid options={ACTIVITY_OPTIONS} selected={selected ? [selected] : []} onToggle={onSelect} multi={false} />
    </div>
  )
}

function AboutStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <StepHeader title="Tell us a little about yourself" subtitle="Anything that helps us personalize your plan (optional)." />
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. I sit at a desk all day, I love running, I have a knee injury…"
        rows={4}
        className="w-full resize-none rounded-2xl border-2 border-ink-200 bg-white px-5 py-4 text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
      />
    </div>
  )
}

function StatsStep({
  data,
  update,
}: {
  data: OnboardingData
  update: <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => void
}) {
  const field =
    'w-full rounded-2xl border-2 border-ink-200 bg-white px-5 py-3.5 text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100'
  return (
    <div>
      <StepHeader title="Just a few more questions" subtitle="The basics your plan is built on." />
      <div className="grid grid-cols-2 gap-4">
        <input type="number" placeholder="Age" min={13} max={100} value={data.age} onChange={(e) => update('age', e.target.value)} className={field} aria-label="Age" />
        <input type="number" placeholder="Height (cm)" min={100} max={250} value={data.heightCm} onChange={(e) => update('heightCm', e.target.value)} className={field} aria-label="Height in cm" />
        <input type="number" placeholder="Weight (kg)" min={30} max={300} value={data.weightKg} onChange={(e) => update('weightKg', e.target.value)} className={field} aria-label="Weight in kg" />
        <select
          value={data.gender}
          onChange={(e) => update('gender', e.target.value as Gender)}
          className={field}
          aria-label="Gender"
        >
          <option value="">Gender…</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
    </div>
  )
}

function SignInStep({ onGoogle, busy }: { onGoogle: () => void; busy: boolean }) {
  return (
    <div className="text-center">
      <StepHeader title="Create your account" subtitle="One tap with Google and you're in." />
      <button
        type="button"
        onClick={onGoogle}
        disabled={busy}
        className="inline-flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-ink-200 bg-white px-6 py-4 text-lg font-semibold text-ink-900 transition-colors hover:border-ink-300 hover:bg-ink-50 disabled:opacity-60 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100 dark:hover:border-ink-600"
      >
        {busy ? (
          <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
        ) : (
          <GoogleIcon />
        )}
        Continue with Google
      </button>
      <p className="mt-4 text-sm text-ink-500 dark:text-ink-400">
        We&apos;ll save your answers and set up your plan.
      </p>
    </div>
  )
}

function ConsentStep({
  consent,
  setConsent,
  onContinue,
  busy,
  error,
}: {
  consent: { terms: boolean; privacy: boolean }
  setConsent: (c: { terms: boolean; privacy: boolean }) => void
  onContinue: () => void
  busy: boolean
  error: string
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(249,115,22,0.15) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(34,197,94,0.12) 0%, transparent 40%)',
        }}
        aria-hidden="true"
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-lg rounded-3xl border border-ink-200 bg-white/80 p-8 shadow-xl backdrop-blur dark:border-ink-800 dark:bg-ink-900/80"
      >
        <h2 className="font-display text-3xl font-bold tracking-wide text-ink-900 dark:text-ink-100">
          Almost done
        </h2>
        <p className="mt-2 text-ink-500 dark:text-ink-400">
          Review and accept to finish setting up your account.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <ConsentCheckbox
            checked={consent.terms}
            onChange={(v) => setConsent({ ...consent, terms: v })}
            label="I agree to the Terms of Service"
          />
          <ConsentCheckbox
            checked={consent.privacy}
            onChange={(v) => setConsent({ ...consent, privacy: v })}
            label="I agree to the Privacy Policy"
          />
        </div>

        {error && (
          <div className="mt-4">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        <button
          type="button"
          onClick={onContinue}
          disabled={busy}
          className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-brand-500 px-6 py-3.5 font-semibold text-ink-950 transition-colors hover:bg-brand-400 disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Check className="h-5 w-5" aria-hidden="true" />}
          Finish setup
        </button>
      </motion.div>
    </div>
  )
}

function ConsentCheckbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-ink-200 p-4 transition-colors hover:border-ink-300 dark:border-ink-700 dark:hover:border-ink-600">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 rounded border-ink-300 text-brand-500 focus:ring-brand-500"
      />
      <span className="text-sm font-medium text-ink-800 dark:text-ink-200">{label}</span>
    </label>
  )
}

function GoogleIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}
