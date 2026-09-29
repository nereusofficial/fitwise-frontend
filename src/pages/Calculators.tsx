import { Calculator, Flame, Scale, Utensils } from 'lucide-react'
import { BMICalculator } from '../features/calculators/BMICalculator'
import { BMRCalculator } from '../features/calculators/BMRCalculator'
import { TDEECalculator } from '../features/calculators/TDEECalculator'
import { MacroCalculator } from '../features/calculators/MacroCalculator'
import { Card, CardDescription, CardHeader, CardTitle } from '../components/Card'

export default function Calculators() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-10 text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
          <Calculator className="h-4 w-4" aria-hidden="true" />
          Free tools
        </span>
        <h1 className="font-display text-4xl font-bold tracking-wide text-ink-900 dark:text-ink-100 md:text-5xl">
          Fitness calculators
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-500 dark:text-ink-400">
          Instantly calculate your BMI, BMR, TDEE, and macros. No account needed — everything runs in your browser.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                <Scale className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <CardTitle>BMI calculator</CardTitle>
                <CardDescription>Body Mass Index from your height and weight.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <BMICalculator />
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-100 text-accent-600 dark:bg-accent-950 dark:text-accent-400">
                <Flame className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <CardTitle>BMR calculator</CardTitle>
                <CardDescription>Basal Metabolic Rate (Mifflin-St Jeor).</CardDescription>
              </div>
            </div>
          </CardHeader>
          <BMRCalculator />
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <CardTitle>TDEE calculator</CardTitle>
                <CardDescription>Total Daily Energy Expenditure and target calories.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <TDEECalculator />
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-100 text-accent-600 dark:bg-accent-950 dark:text-accent-400">
                <Utensils className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <CardTitle>Macro calculator</CardTitle>
                <CardDescription>Protein, carb, and fat targets in grams.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <MacroCalculator />
        </Card>
      </div>
    </div>
  )
}
