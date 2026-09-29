import { useState, type FormEvent } from 'react'
import { Sparkles } from 'lucide-react'
import { ACTIVITY_LABELS, GOAL_LABELS } from '../calculators/formulas'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import type { ActivityLevel, Gender, Goal, UserProfile } from '../../types'

export interface PlanFormValues {
  age: number
  heightCm: number
  weightKg: number
  gender: Gender
  activityLevel: ActivityLevel
  goal: Goal
}

interface RecommendationFormProps {
  initialProfile: UserProfile | null
  loading: boolean
  onGenerate: (input: PlanFormValues) => void
}

const selectClass =
  'w-full rounded-xl border-2 border-ink-200 bg-white px-4 py-2.5 text-ink-900 focus:border-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100'

export function RecommendationForm({ initialProfile, loading, onGenerate }: RecommendationFormProps) {
  const [age, setAge] = useState(initialProfile ? String(initialProfile.age) : '')
  const [heightCm, setHeightCm] = useState(initialProfile ? String(initialProfile.heightCm) : '')
  const [weightKg, setWeightKg] = useState(initialProfile ? String(initialProfile.weightKg) : '')
  const [gender, setGender] = useState<Gender | ''>(initialProfile?.gender ?? '')
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | ''>(initialProfile?.activityLevel ?? '')
  const [goal, setGoal] = useState<Goal | ''>(initialProfile?.goal ?? '')
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const a = Number(age)
    const h = Number(heightCm)
    const w = Number(weightKg)
    if (!a || a < 13 || a > 100) {
      setError('Age must be between 13 and 100.')
      return
    }
    if (!h || h < 100 || h > 250) {
      setError('Height must be between 100 and 250 cm.')
      return
    }
    if (!w || w < 30 || w > 300) {
      setError('Weight must be between 30 and 300 kg.')
      return
    }
    if (!gender || !activityLevel || !goal) {
      setError('Please select your gender, activity level, and goal.')
      return
    }
    onGenerate({ age: a, heightCm: h, weightKg: w, gender, activityLevel, goal })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Input label="Age" name="rec-age" type="number" inputMode="numeric" min={13} max={100} value={age} onChange={(e) => setAge(e.target.value)} required />
        <Input label="Height (cm)" name="rec-height" type="number" inputMode="decimal" min={100} max={250} value={heightCm} onChange={(e) => setHeightCm(e.target.value)} required />
        <Input label="Weight (kg)" name="rec-weight" type="number" inputMode="decimal" min={30} max={300} value={weightKg} onChange={(e) => setWeightKg(e.target.value)} required />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="rec-gender" className="text-sm font-semibold text-ink-800 dark:text-ink-200">
            Gender
          </label>
          <select id="rec-gender" value={gender} onChange={(e) => setGender(e.target.value as Gender | '')} className={selectClass} required>
            <option value="">Select…</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="rec-activity" className="text-sm font-semibold text-ink-800 dark:text-ink-200">
            Activity level
          </label>
          <select id="rec-activity" value={activityLevel} onChange={(e) => setActivityLevel(e.target.value as ActivityLevel | '')} className={selectClass} required>
            <option value="">Select…</option>
            {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((level) => (
              <option key={level} value={level}>
                {ACTIVITY_LABELS[level]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="rec-goal" className="text-sm font-semibold text-ink-800 dark:text-ink-200">
            Goal
          </label>
          <select id="rec-goal" value={goal} onChange={(e) => setGoal(e.target.value as Goal | '')} className={selectClass} required>
            <option value="">Select…</option>
            {(Object.keys(GOAL_LABELS) as Goal[]).map((g) => (
              <option key={g} value={g}>
                {GOAL_LABELS[g]}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error && <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
      <Button type="submit" size="lg" loading={loading} className="sm:self-start">
        <Sparkles className="h-5 w-5" aria-hidden="true" />
        Generate my plan
      </Button>
    </form>
  )
}
