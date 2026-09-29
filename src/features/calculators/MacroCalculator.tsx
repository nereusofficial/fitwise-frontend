import { useState, type FormEvent } from 'react'
import { GOAL_LABELS, calcMacros } from './formulas'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import type { Goal } from '../../types'

export function MacroCalculator() {
  const [calories, setCalories] = useState('')
  const [goal, setGoal] = useState<Goal | ''>('')
  const [result, setResult] = useState<{ proteinG: number; carbsG: number; fatG: number } | null>(null)
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const c = Number(calories)
    if (!c || c < 800 || c > 6000) {
      setError('Enter a calorie target between 800 and 6,000.')
      return
    }
    if (!goal) {
      setError('Select a goal.')
      return
    }
    setResult(calcMacros(c, goal))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        label="Daily calories (kcal)"
        name="macro-calories"
        type="number"
        inputMode="numeric"
        min={800}
        max={6000}
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
        hint="Use your TDEE or target calories."
        required
      />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="macro-goal" className="text-sm font-semibold text-ink-800 dark:text-ink-200">
          Goal
        </label>
        <select
          id="macro-goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value as Goal | '')}
          className="w-full rounded-xl border-2 border-ink-200 bg-white px-4 py-2.5 text-ink-900 focus:border-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
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
      <Button type="submit">Calculate macros</Button>
      {result && (
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border-2 border-accent-500/30 bg-accent-50 p-4 text-center dark:border-accent-500/40 dark:bg-accent-950/30">
            <p className="font-display text-3xl font-bold text-ink-900 dark:text-ink-100">{result.proteinG}g</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-500">Protein</p>
          </div>
          <div className="rounded-2xl border-2 border-brand-500/30 bg-brand-50 p-4 text-center dark:border-brand-500/40 dark:bg-brand-950/30">
            <p className="font-display text-3xl font-bold text-ink-900 dark:text-ink-100">{result.carbsG}g</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-500">Carbs</p>
          </div>
          <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-50 p-4 text-center dark:border-amber-500/40 dark:bg-amber-950/30">
            <p className="font-display text-3xl font-bold text-ink-900 dark:text-ink-100">{result.fatG}g</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-500">Fat</p>
          </div>
        </div>
      )}
    </form>
  )
}
