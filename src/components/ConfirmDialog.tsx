import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Button } from './Button'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  error?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  error = '',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) cancelRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onCancel()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, loading, onCancel])

  if (!isOpen) return null

  return createPortal(
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-md"
    >
      <div className="w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-ink-800 bg-ink-950 p-6 text-center shadow-2xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20">
          <svg className="h-10 w-10 text-red-400" viewBox="0 0 52 52" fill="none" aria-hidden="true">
            <path d="M26 4L4 46h44L26 4z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" className="popup-triangle-draw" />
            <path d="M26 20v10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="popup-exclaim-draw" />
            <circle cx="26" cy="36" r="1.5" fill="currentColor" className="popup-exclaim-dot" />
          </svg>
        </div>

        <h2 id="confirm-title" className="font-display mt-4 text-2xl font-bold tracking-wide text-ink-100">
          {title}
        </h2>
        <p id="confirm-message" className="mt-2 text-sm text-ink-400">
          {message}
        </p>

      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-red-400">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="ghost" onClick={onCancel} disabled={loading} ref={cancelRef}>
          {cancelLabel}
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
      </div>
    </div>,
    document.body,
  )
}
