import { CheckCircle2, Dumbbell, Flame, Info, Utensils } from 'lucide-react'
import type { Recommendation } from '../../types'
import { Disclaimer } from '../../components/Disclaimer'

export function RecommendationView({ recommendation }: { recommendation: Recommendation }) {
  const { summary, dailyCalories, macros, workoutPlan, nutritionTips, notes } = recommendation

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-3xl font-bold tracking-wide text-ink-900 dark:text-ink-100">
          Your plan
        </h2>
        <p className="mt-2 text-lg text-ink-600 dark:text-ink-300">{summary}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl bg-ink-950 p-5 text-center text-white">
          <Flame className="mx-auto mb-2 h-6 w-6 text-brand-400" aria-hidden="true" />
          <p className="font-display text-3xl font-bold">{Math.round(dailyCalories).toLocaleString()}</p>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">kcal / day</p>
        </div>
        <div className="rounded-2xl border border-accent-500/30 bg-accent-50 p-5 text-center dark:border-accent-500/40 dark:bg-accent-950/30">
          <p className="font-display text-3xl font-bold text-ink-900 dark:text-ink-100">{macros.proteinG}g</p>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Protein</p>
        </div>
        <div className="rounded-2xl border border-brand-500/30 bg-brand-50 p-5 text-center dark:border-brand-500/40 dark:bg-brand-950/30">
          <p className="font-display text-3xl font-bold text-ink-900 dark:text-ink-100">{macros.carbsG}g</p>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Carbs</p>
        </div>
        <div className="rounded-2xl border border-amber-500/30 bg-amber-50 p-5 text-center dark:border-amber-500/40 dark:bg-amber-950/30">
          <p className="font-display text-3xl font-bold text-ink-900 dark:text-ink-100">{macros.fatG}g</p>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Fat</p>
        </div>
      </div>

      <div>
        <h3 className="mb-4 flex items-center gap-2 font-display text-2xl font-semibold tracking-wide text-ink-900 dark:text-ink-100">
          <Dumbbell className="h-6 w-6 text-brand-500" aria-hidden="true" />
          Weekly workout plan
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workoutPlan.map((day) => (
            <div
              key={day.day}
              className={`rounded-2xl border p-5 ${
                day.exercises.length === 0
                  ? 'border-ink-200 bg-ink-50 dark:border-ink-800 dark:bg-ink-900'
                  : 'border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-900'
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-display text-lg font-semibold tracking-wide text-ink-900 dark:text-ink-100">
                  {day.day}
                </h4>
                {day.exercises.length === 0 ? (
                  <span className="rounded-full bg-ink-200 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-ink-600 dark:bg-ink-800 dark:text-ink-400">
                    Rest
                  </span>
                ) : (
                  <span className="rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-accent-700 dark:bg-accent-950 dark:text-accent-300">
                    {day.exercises.length} exercises
                  </span>
                )}
              </div>
              <p className="mb-3 text-sm font-medium text-ink-600 dark:text-ink-300">{day.focus}</p>
              {day.exercises.length > 0 && (
                <ul className="flex flex-col gap-2">
                  {day.exercises.map((exercise) => (
                    <li key={exercise.name} className="flex items-center justify-between text-sm">
                      <span className="text-ink-700 dark:text-ink-300">{exercise.name}</span>
                      <span className="font-semibold text-ink-500 dark:text-ink-400">
                        {exercise.sets} × {exercise.reps}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 flex items-center gap-2 font-display text-2xl font-semibold tracking-wide text-ink-900 dark:text-ink-100">
          <Utensils className="h-6 w-6 text-brand-500" aria-hidden="true" />
          Nutrition tips
        </h3>
        <ul className="grid gap-3 sm:grid-cols-2">
          {nutritionTips.map((tip) => (
            <li key={tip} className="flex items-start gap-3 rounded-xl border border-ink-200 bg-white p-4 text-sm text-ink-700 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-300">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-500" aria-hidden="true" />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {notes.length > 0 && (
        <div>
          <h3 className="mb-4 flex items-center gap-2 font-display text-2xl font-semibold tracking-wide text-ink-900 dark:text-ink-100">
            <Info className="h-6 w-6 text-brand-500" aria-hidden="true" />
            Notes
          </h3>
          <ul className="flex flex-col gap-2">
            {notes.map((note) => (
              <li key={note} className="flex items-start gap-3 text-sm text-ink-600 dark:text-ink-400">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Disclaimer />
    </div>
  )
}
