import { useState, type FormEvent } from 'react'
import {
  ACTIVITY_LABELS,
  GOAL_LABELS,
  calcBMR,
  calcTDEE,
  targetCalories,
} from './formulas'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { ResultCard } from './ResultCard'
import type { ActivityLevel, Gender, Goal } from '../../types'

export function TDEECalculator() {
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<Gender | ''>('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [activity, setActivity] = useState<ActivityLevel | ''>('')
  const [goal, setGoal] = useState<Goal | ''>('')
  const [tdee, setTdee] = useState<number | null>(null)
  const [target, setTarget] = useState<number | null>(null)
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const a = Number(age)
    const h = Number(height)
    const w = Number(weight)
    if (!a || a < 13 || a > 100) {
      setError('Enter an age between 13 and 100.')
      return
    }
    if (!gender) {
      setError('Select a gender.')
      return
    }
    if (!h || h < 100 || h > 250) {
      setError('Enter a height between 100 and 250 cm.')
      return
    }
    if (!w || w < 30 || w > 300) {
      setError('Enter a weight between 30 and 300 kg.')
      return
    }
    if (!activity) {
      setError('Select an activity level.')
      return
    }
    if (!goal) {
      setError('Select a goal.')
      return
    }
    const bmr = calcBMR(w, h, a, gender)
    const tdeeValue = calcTDEE(bmr, activity)
    setTdee(tdeeValue)
    setTarget(targetCalories(tdeeValue, goal))
  }

  const selectClass =
    'w-full rounded-xl border-2 border-ink-200 bg-white px-4 py-2.5 text-ink-900 focus:border-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Age"
          name="tdee-age"
          type="number"
          inputMode="numeric"
          min={13}
          max={100}
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="tdee-gender" className="text-sm font-semibold text-ink-800 dark:text-ink-200">
            Gender
          </label>
          <select
            id="tdee-gender"
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender | '')}
            className={selectClass}
            required
          >
            <option value="">Select…</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Height (cm)"
          name="tdee-height"
          type="number"
          inputMode="decimal"
          min={100}
          max={250}
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          required
        />
        <Input
          label="Weight (kg)"
          name="tdee-weight"
          type="number"
          inputMode="decimal"
          min={30}
          max={300}
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="tdee-activity" className="text-sm font-semibold text-ink-800 dark:text-ink-200">
          Activity level
        </label>
        <select
          id="tdee-activity"
          value={activity}
          onChange={(e) => setActivity(e.target.value as ActivityLevel | '')}
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
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="tdee-goal" className="text-sm font-semibold text-ink-800 dark:text-ink-200">
          Goal
        </label>
        <select
          id="tdee-goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value as Goal | '')}
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
      </div>
      {error && <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
      <Button type="submit">Calculate TDEE</Button>
      {tdee !== null && target !== null && (
        <>
          <ResultCard
            label="Your TDEE"
            value={`${Math.round(tdee).toLocaleString()} kcal`}
            subtext="Total daily energy expenditure."
          />
          <ResultCard
            label="Target calories"
            value={`${Math.round(target).toLocaleString()} kcal`}
            subtext={
              goal === 'lose_weight'
                ? 'TDEE − 500 for weight loss.'
                : goal === 'build_muscle'
                  ? 'TDEE + 300 for muscle gain.'
                  : 'Your TDEE for maintenance.'
            }
          />
        </>
      )}
    </form>
  )
}
