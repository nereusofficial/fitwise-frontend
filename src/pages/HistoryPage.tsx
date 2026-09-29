import { useState } from 'react'
import { Calendar, Eye, Flame, Trash2, X } from 'lucide-react'
import { useRecommendations } from '../hooks/useRecommendations'
import { RecommendationView } from '../features/recommendations/RecommendationView'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Alert } from '../components/Alert'
import type { RecommendationRecord } from '../types'

export default function HistoryPage() {
  const { recommendations, loading, error, deleteRecommendation } = useRecommendations()
  const [selected, setSelected] = useState<RecommendationRecord | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState('')

  async function handleDelete(id: string) {
    setDeleting(id)
    setDeleteError('')
    try {
      await deleteRecommendation(id)
      if (selected?.id === id) setSelected(null)
    } catch {
      setDeleteError('Could not delete that plan. Please try again.')
    } finally {
      setDeleting(null)
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
        Plan history
      </h1>
      <p className="mt-2 text-ink-500 dark:text-ink-400">
        Every plan you&apos;ve generated, saved to your account.
      </p>

      {error && (
        <div className="mt-6">
          <Alert variant="error">{error}</Alert>
        </div>
      )}
      {deleteError && (
        <div className="mt-6">
          <Alert variant="error">{deleteError}</Alert>
        </div>
      )}

      {recommendations.length === 0 ? (
        <Card className="mt-8">
          <div className="py-8 text-center">
            <Flame className="mx-auto mb-4 h-12 w-12 text-ink-300 dark:text-ink-600" aria-hidden="true" />
            <p className="text-lg font-semibold text-ink-700 dark:text-ink-300">No plans yet</p>
            <p className="mt-1 text-ink-500 dark:text-ink-400">
              Generate your first AI plan and it will show up here.
            </p>
          </div>
        </Card>
      ) : (
        <ul className="mt-8 flex flex-col gap-3">
          {recommendations.map((rec) => (
            <li key={rec.id}>
              <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                    <Flame className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900 dark:text-ink-100">
                      {Math.round(rec.result.dailyCalories).toLocaleString()} kcal ·{' '}
                      {rec.result.macros.proteinG}g protein
                    </p>
                    <p className="flex items-center gap-1.5 text-sm text-ink-500 dark:text-ink-400">
                      <Calendar className="h-4 w-4" aria-hidden="true" />
                      {new Date(rec.createdAt).toLocaleString()} · {rec.inputStats.goal.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelected(rec)}>
                    <Eye className="h-4 w-4" aria-hidden="true" />
                    View
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    loading={deleting === rec.id}
                    onClick={() => handleDelete(rec.id)}
                    aria-label="Delete plan"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Delete
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-950/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Plan details"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative my-8 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl dark:bg-ink-900 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Close"
              className="absolute right-4 top-4 cursor-pointer rounded-lg p-2 text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-brand-500 dark:hover:bg-ink-800 dark:hover:text-ink-100"
            >
              <X className="h-5 w-5" />
            </button>
            <RecommendationView recommendation={selected.result} />
          </div>
        </div>
      )}
    </div>
  )
}
