import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { LegalDocument } from '../features/legal/LegalDocument'
import { termsContent } from '../features/legal/termsContent'

export default function TermsPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-ink-950">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-ink-300 transition-colors hover:bg-ink-800 hover:text-ink-100 focus-visible:outline-2 focus-visible:outline-brand-500"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>
        <LegalDocument document={termsContent} />
      </div>
    </div>
  )
}
