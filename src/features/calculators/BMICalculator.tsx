import { useState, type FormEvent } from 'react'
import { calcBMI, bmiCategory } from './formulas'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { ResultCard } from './ResultCard'

const categoryStyles: Record<string, string> = {
  Underweight: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
  Normal: 'bg-accent-100 text-accent-800 dark:bg-accent-950 dark:text-accent-300',
  Overweight: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  Obese: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
}

export function BMICalculator() {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const h = Number(height)
    const w = Number(weight)
    if (!h || h < 100 || h > 250) {
      setError('Enter a height between 100 and 250 cm.')
      return
    }
    if (!w || w < 30 || w > 300) {
      setError('Enter a weight between 30 and 300 kg.')
      return
    }
    setResult(calcBMI(w, h))
  }

  const category = result !== null ? bmiCategory(result) : null

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        label="Height (cm)"
        name="bmi-height"
        type="number"
        inputMode="decimal"
        min={100}
        max={250}
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        error={error && !height ? error : undefined}
        required
      />
      <Input
        label="Weight (kg)"
        name="bmi-weight"
        type="number"
        inputMode="decimal"
        min={30}
        max={300}
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        error={error && height ? error : undefined}
        required
      />
      {error && <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
      <Button type="submit">Calculate BMI</Button>
      {result !== null && category && (
        <ResultCard
          label="Your BMI"
          value={result.toFixed(1)}
          subtext={
            <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${categoryStyles[category]}`}>
              {category}
            </span>
          }
        />
      )}
    </form>
  )
}
