import { useState, type FormEvent } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Plus, Trash2, TrendingUp } from 'lucide-react'
import { useMeasurements } from '../hooks/useMeasurements'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Card, CardDescription, CardHeader, CardTitle } from '../components/Card'
import { Alert } from '../components/Alert'

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

export default function ProgressPage() {
  const { measurements, loading, error, addMeasurement, deleteMeasurement } = useMeasurements()
  const [weight, setWeight] = useState('')
  const [date, setDate] = useState(today())
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const chartData = measurements.map((m) => ({
    date: new Date(m.measuredAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    weight: m.weightKg,
  }))

  const first = measurements[0]
  const last = measurements[measurements.length - 1]
  const change = first && last ? Math.round((last.weightKg - first.weightKg) * 10) / 10 : null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError('')
    const w = Number(weight)
    if (!w || w < 30 || w > 300) {
      setFormError('Enter a weight between 30 and 300 kg.')
      return
    }
    if (!date) {
      setFormError('Select a date.')
      return
    }
    setSaving(true)
    try {
      await addMeasurement(w, date)
      setWeight('')
      setDate(today())
    } catch {
      setFormError('Could not log your weight. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await deleteMeasurement(id)
    } catch {
      setFormError('Could not delete that entry. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" role="status" aria-label="Loading" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold tracking-wide text-ink-900 dark:text-ink-100">
        Progress
      </h1>
      <p className="mt-2 text-ink-500 dark:text-ink-400">
        Log your weight and watch your progress over time.
      </p>

      {error && (
        <div className="mt-6">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Log weight</CardTitle>
            <CardDescription>Track your weight over time.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <Input
              label="Weight (kg)"
              name="progress-weight"
              type="number"
              inputMode="decimal"
              min={30}
              max={300}
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
            <Input
              label="Date"
              name="progress-date"
              type="date"
              value={date}
              max={today()}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            {formError && <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-400">{formError}</p>}
            <Button type="submit" loading={saving}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Log weight
            </Button>
          </form>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Weight over time</CardTitle>
                <CardDescription>
                  {change !== null
                    ? `${change > 0 ? '+' : ''}${change} kg since your first log`
                    : 'Log your weight to see your trend.'}
                </CardDescription>
              </div>
              <TrendingUp className="h-6 w-6 text-brand-500" aria-hidden="true" />
            </div>
          </CardHeader>
          {chartData.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-ink-400">
              No entries yet — log your first weight above.
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-ink-200 dark:text-ink-700" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="currentColor" className="text-ink-400" />
                  <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} stroke="currentColor" className="text-ink-400" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '0.75rem',
                      border: '1px solid var(--color-ink-200)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="var(--color-brand-500)"
                    strokeWidth={3}
                    dot={{ r: 4, fill: 'var(--color-brand-500)' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      {measurements.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Entries</CardTitle>
            <CardDescription>Your logged weight measurements.</CardDescription>
          </CardHeader>
          <ul className="divide-y divide-ink-100 dark:divide-ink-800">
            {[...measurements].reverse().map((m) => (
              <li key={m.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-semibold text-ink-900 dark:text-ink-100">{m.weightKg} kg</p>
                  <p className="text-sm text-ink-500 dark:text-ink-400">
                    {new Date(m.measuredAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  loading={deletingId === m.id}
                  onClick={() => handleDelete(m.id)}
                  aria-label={`Delete entry from ${new Date(m.measuredAt).toLocaleDateString()}`}
                >
                  <Trash2 className="h-4 w-4 text-red-500" aria-hidden="true" />
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
