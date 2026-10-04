import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { LegalDocument } from './LegalDocument'
import type { LegalDocumentData } from './termsContent'

interface LegalModalProps {
  document: LegalDocumentData
  isOpen: boolean
  onClose: () => void
  onAgree: () => void
}

const SCROLL_TOLERANCE = 24

export function LegalModal({ document, isOpen, onClose, onAgree }: LegalModalProps) {
  const [scrolledToEnd, setScrolledToEnd] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  const checkScrollEnd = useCallback(() => {
    const el = contentRef.current
    if (!el) return
    const isAtEnd = el.scrollHeight - el.scrollTop - el.clientHeight <= SCROLL_TOLERANCE
    setScrolledToEnd(isAtEnd)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    triggerRef.current = window.document.activeElement as HTMLElement
    window.document.body.style.overflow = 'hidden'
    checkScrollEnd()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'Tab') {
        const modal = contentRef.current
        if (!modal) return
        const focusable = modal.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && window.document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && window.document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
      triggerRef.current?.focus()
    }
  }, [isOpen, onClose, checkScrollEnd])

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
        onScroll={checkScrollEnd}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85svh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-ink-800 bg-ink-950 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-ink-800 px-6 py-4">
          <h2 id="legal-modal-title" className="font-display text-xl font-semibold tracking-wide text-ink-100">
            {document.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer rounded-lg p-2 text-ink-400 transition-colors hover:bg-ink-800 hover:text-ink-100 focus-visible:outline-2 focus-visible:outline-brand-500"
          >
            ✕
          </button>
        </div>

        <div className="relative flex-1 overflow-y-auto px-6 py-6">
          <LegalDocument document={document} />
          {!scrolledToEnd && (
            <div
              className="pointer-events-none sticky bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-ink-950 to-transparent"
              aria-hidden="true"
            />
          )}
        </div>

        <div className="border-t border-ink-800 px-6 py-4">
          <button
            type="button"
            onClick={onAgree}
            disabled={!scrolledToEnd}
            className="w-full cursor-pointer rounded-xl bg-brand-500 px-6 py-3 font-semibold text-ink-950 transition-colors hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-brand-500"
          >
            I have read and agree
          </button>
          {!scrolledToEnd && (
            <p className="mt-2 text-center text-xs text-ink-500">Scroll to the end to continue</p>
          )}
        </div>
      </div>
    </div>,
    window.document.body,
  )
}
