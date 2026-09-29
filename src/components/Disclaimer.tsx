import { AlertTriangle } from 'lucide-react'

export function Disclaimer() {
  return (
    <div
      role="note"
      className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
    >
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <p>
        <strong className="font-semibold">Disclaimer:</strong> FitWise provides general fitness and nutrition
        guidance, not medical advice. Always consult a healthcare professional before starting a new diet or
        exercise program.
      </p>
    </div>
  )
}
