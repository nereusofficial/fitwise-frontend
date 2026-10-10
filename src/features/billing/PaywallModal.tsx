import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronLeft, Crown, X } from 'lucide-react'
import { demoSubscribe } from '../../lib/api'
import { usePopup } from '../../components/Popup'
import { PRICING, type BillingInterval } from './pricing'

interface PaywallModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  const [step, setStep] = useState<'intro' | 'checkout'>('intro')
  const [interval, setInterval] = useState<BillingInterval>('month')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const { showPopup } = usePopup()
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return
    previousFocusRef.current = document.activeElement as HTMLElement
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
      previousFocusRef.current?.focus()
    }
  }, [isOpen, busy, onClose])

  if (!isOpen) return null

  async function handleActivate() {
    setBusy(true)
    setError('')
    try {
      await demoSubscribe(interval)
      onClose()
      showPopup({
        title: "You're now Pro",
        message: 'Unlimited plans unlocked.',
        variant: 'success',
      })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/40 backdrop-blur-md sm:items-center"
      onClick={() => !busy && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="paywall-title"
    >
      <div
        className="w-full max-w-md rounded-t-3xl border border-ink-700 bg-ink-950 p-6 text-center shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => !busy && onClose()}
          aria-label="Close"
          className="absolute right-4 top-4 cursor-pointer rounded-lg p-2 text-ink-400 transition-colors hover:bg-ink-800 hover:text-ink-100 focus-visible:outline-2 focus-visible:outline-brand-500"
        >
          <X className="h-5 w-5" />
        </button>

        {step === 'intro' && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 shadow-[0_0_30px_rgba(249,115,22,0.4)]">
              <Crown className="h-8 w-8 text-ink-950" />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-brand-400">FitWise Pro</p>
            <h2 id="paywall-title" className="font-display mt-1 text-2xl font-bold tracking-wide text-ink-100">
              Unlock unlimited plans
            </h2>
            <p className="mt-2 text-sm text-ink-400">
              You've used your free plan. Upgrade to keep generating personalized workout and nutrition plans.
            </p>

            <ul className="mt-5 flex flex-col gap-3 text-left">
              {[
                'Unlimited AI workout & nutrition plans',
                'Regenerate anytime your stats or goals change',
              ].map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-500/20">
                    <Check className="h-3 w-3 text-accent-400" />
                  </span>
                  <span className="text-sm text-ink-200">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {(Object.keys(PRICING) as BillingInterval[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setInterval(key)}
                  className={`relative cursor-pointer rounded-xl border-2 p-3 text-left transition-colors ${
                    interval === key
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40'
                      : 'border-ink-700 bg-ink-900 hover:border-ink-600'
                  }`}
                >
                  {key === 'year' && (
                    <span className="absolute -top-2 right-2 rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold text-ink-950">
                      Save 20%
                    </span>
                  )}
                  <span className="block text-xs font-semibold uppercase tracking-wide text-ink-400">
                    {key === 'month' ? 'month' : 'year'}
                  </span>
                  <span className="mt-1 block text-sm font-bold text-ink-100">{PRICING[key].label}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setStep('checkout')}
              className="mt-6 w-full cursor-pointer rounded-xl bg-brand-500 px-6 py-3.5 font-semibold text-ink-950 transition-colors hover:bg-brand-400 focus-visible:outline-2 focus-visible:outline-brand-500"
            >
              Upgrade to Pro
            </button>
            <button
              type="button"
              onClick={() => !busy && onClose()}
              className="mt-3 w-full cursor-pointer rounded-xl px-6 py-3 text-sm font-semibold text-ink-400 transition-colors hover:text-ink-200"
            >
              Maybe later
            </button>
            <p className="mt-3 text-xs text-ink-500">
              Cancel anytime. Demo mode: no real payment is taken.
            </p>
          </>
        )}

        {step === 'checkout' && (
          <>
            <button
              type="button"
              onClick={() => setStep('intro')}
              className="absolute left-4 top-4 inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-sm text-ink-400 transition-colors hover:text-ink-100"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            <h2 className="font-display text-xl font-bold tracking-wide text-ink-100">Order summary</h2>
            <div className="mt-4 rounded-xl border border-ink-700 bg-ink-900 p-4 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-ink-400">Plan</span>
                <span className="font-semibold text-ink-100">FitWise Pro ({interval === 'month' ? 'month' : 'year'})</span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-ink-400">Total</span>
                <span className="font-bold text-brand-400">{PRICING[interval].label}</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-ink-500">This is a demo checkout. No payment details are collected.</p>

            {error && <p className="mt-3 text-sm font-medium text-red-400">{error}</p>}

            <button
              type="button"
              onClick={handleActivate}
              disabled={busy}
              className="mt-5 w-full cursor-pointer rounded-xl bg-brand-500 px-6 py-3.5 font-semibold text-ink-950 transition-colors hover:bg-brand-400 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-brand-500"
            >
              {busy ? 'Activating...' : 'Activate Pro (demo)'}
            </button>
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}
