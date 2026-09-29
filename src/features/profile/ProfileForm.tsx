import { useState, type FormEvent } from 'react'
import { ACTIVITY_LABELS, GOAL_LABELS } from '../calculators/formulas'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { Alert } from '../../components/Alert'
import type { ActivityLevel, Gender, Goal, UserProfile } from '../../types'

interface ProfileFormErrors {
  age?: string
  heightCm?: string
  weightKg?: string
  gender?: string
  activityLevel?: string
  goal?: string
}

export interface ProfileFormValues {
  age: number
  heightCm: number
  weightKg: number
  gender: Gender
  activityLevel: ActivityLevel
  goal: Goal
}

interface ProfileFormProps {
  initialProfile?: UserProfile | null
  saving: boolean
  onSave: (values: ProfileFormValues) => Promise<void>
}

const selectClass =
  'w-full rounded-xl border-2 border-ink-200 bg-white px-4 py-2.5 text-ink-900 focus:border-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100'

export function ProfileForm({ initialProfile, saving, onSave }: ProfileFormProps) {
  const [age, setAge] = useState(initialProfile ? String(initialProfile.age) : '')
  const [heightCm, setHeightCm] = useState(initialProfile ? String(initialProfile.heightCm) : '')
  const [weightKg, setWeightKg] = useState(initialProfile ? String(initialProfile.weightKg) : '')
  const [gender, setGender] = useState<Gender | ''>(initialProfile?.gender ?? '')
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | ''>(initialProfile?.activityLevel ?? '')
  const [goal, setGoal] = useState<Goal | ''>(initialProfile?.goal ?? '')
  const [errors, setErrors] = useState<ProfileFormErrors>({})
  const [formError, setFormError] = useState('')

  function validate(): boolean {
    const next: ProfileFormErrors = {}
    const a = Number(age)
    const h = Number(heightCm)
    const w = Number(weightKg)
    if (!age || !Number.isFinite(a) || a < 13 || a > 100) next.age = 'Age must be between 13 and 100.'
    if (!heightCm || !Number.isFinite(h) || h < 100 || h > 250) next.heightCm = 'Height must be between 100 and 250 cm.'
    if (!weightKg || !Number.isFinite(w) || w < 30 || w > 300) next.weightKg = 'Weight must be between 30 and 300 kg.'
    if (!gender) next.gender = 'Select a gender.'
    if (!activityLevel) next.activityLevel = 'Select an activity level.'
    if (!goal) next.goal = 'Select a goal.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError('')
    if (!validate()) return
    try {
      await onSave({
        age: Number(age),
        heightCm: Number(heightCm),
        weightKg: Number(weightKg),
        gender: gender as Gender,
        activityLevel: activityLevel as ActivityLevel,
        goal: goal as Goal,
      })
    } catch {
      setFormError('Could not save your profile. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {formError && <Alert variant="error">{formError}</Alert>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          label="Age"
          name="profile-age"
          type="number"
          inputMode="numeric"
          min={13}
          max={100}
          value={age}
          onChange={(e) => setAge(e.target.value)}
          error={errors.age}
          required
        />
        <Input
          label="Height (cm)"
          name="profile-height"
          type="number"
          inputMode="decimal"
          min={100}
          max={250}
          value={heightCm}
          onChange={(e) => setHeightCm(e.target.value)}
          error={errors.heightCm}
          required
        />
        <Input
          label="Weight (kg)"
          name="profile-weight"
          type="number"
          inputMode="decimal"
          min={30}
          max={300}
          value={weightKg}
          onChange={(e) => setWeightKg(e.target.value)}
          error={errors.weightKg}
          required
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="profile-gender" className="text-sm font-semibold text-ink-800 dark:text-ink-200">
            Gender
          </label>
          <select
            id="profile-gender"
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender | '')}
            aria-invalid={errors.gender ? true : undefined}
            className={selectClass}
            required
          >
            <option value="">Select…</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">{errors.gender}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="profile-activity" className="text-sm font-semibold text-ink-800 dark:text-ink-200">
            Activity level
          </label>
          <select
            id="profile-activity"
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value as ActivityLevel | '')}
            aria-invalid={errors.activityLevel ? true : undefined}
            className={selectClass}
            required
          >
            <option value="">Select…</option>
            {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((level) => (
              <option key={level} value={level}>
                {ACTIVITY_LABELS[level]}
              </option>
            ))}
          </select>
          {errors.activityLevel && <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">{errors.activityLevel}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="profile-goal" className="text-sm font-semibold text-ink-800 dark:text-ink-200">
            Goal
          </label>
          <select
            id="profile-goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value as Goal | '')}
            aria-invalid={errors.goal ? true : undefined}
            className={selectClass}
            required
          >
            <option value="">Select…</option>
            {(Object.keys(GOAL_LABELS) as Goal[]).map((g) => (
              <option key={g} value={g}>
                {GOAL_LABELS[g]}
              </option>
            ))}
          </select>
          {errors.goal && <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">{errors.goal}</p>}
        </div>
      </div>
      <Button type="submit" size="lg" loading={saving} className="sm:self-end">
        Save profile
      </Button>
    </form>
  )
}
