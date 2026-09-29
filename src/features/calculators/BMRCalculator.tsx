import { useState, type FormEvent } from 'react'
import { calcBMR } from './formulas'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { ResultCard } from './ResultCard'
import type { Gender } from '../../types'

export function BMRCalculator() {
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<Gender | ''>('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [result, setResult] = useState<number | null>(null)
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
    setResult(calcBMR(w, h, a, gender))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        label="Age"
        name="bmr-age"
        type="number"
        inputMode="numeric"
        min={13}
        max={100}
        value={age}
        onChange={(e) => setAge(e.target.value)}
        required
      />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="bmr-gender" className="text-sm font-semibold text-ink-800 dark:text-ink-200">
          Gender
        </label>
        <select
          id="bmr-gender"
          value={gender}
          onChange={(e) => setGender(e.target.value as Gender | '')}
          className="w-full rounded-xl border-2 border-ink-200 bg-white px-4 py-2.5 text-ink-900 focus:border-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
          required
        >
          <option value="">Select…</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <Input
        label="Height (cm)"
        name="bmr-height"
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
        name="bmr-weight"
        type="number"
        inputMode="decimal"
        min={30}
        max={300}
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        required
      />
      {error && <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
      <Button type="submit">Calculate BMR</Button>
      {result !== null && (
        <ResultCard
          label="Your BMR"
          value={`${Math.round(result).toLocaleString()} kcal`}
          subtext="Calories your body burns at rest (Mifflin-St Jeor)."
        />
      )}
    </form>
  )
}
