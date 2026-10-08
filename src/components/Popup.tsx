import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

export type PopupVariant = 'success' | 'error' | 'warning' | 'info'

export interface PopupAction {
  label: string
  variant?: 'primary' | 'secondary'
  onClick: () => void
}

export interface PopupConfig {
  title: string
  message?: string
  variant?: PopupVariant
  actions?: PopupAction[]
  onClose?: () => void
}

interface PopupItem extends PopupConfig {
  id: number
}

interface PopupContextValue {
  showPopup: (config: PopupConfig) => void
}

const PopupContext = createContext<PopupContextValue | undefined>(undefined)

let popupId = 0
const MAX_QUEUE = 3
const AUTO_DISMISS_MS = 2200

export function PopupProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<PopupItem | null>(null)
  const [queue, setQueue] = useState<PopupItem[]>([])
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const dismiss = useCallback(() => {
    clearTimer()
    const item = current
    setCurrent(null)
    item?.onClose?.()
  }, [clearTimer, current])

  const processQueue = useCallback(() => {
    setQueue((prev) => {
      if (prev.length === 0) return prev
      const [next, ...rest] = prev
      setCurrent(next)
      return rest
    })
  }, [])

  const showPopup = useCallback(
    (config: PopupConfig) => {
      const item: PopupItem = { ...config, id: ++popupId }
      setQueue((prev) => {
        if (prev.some((p) => p.title === config.title && p.message === config.message)) {
          return prev
        }
        if (prev.length >= MAX_QUEUE) {
          return [...prev.slice(1), item]
        }
        return [...prev, item]
      })
    },
    [],
  )

  useEffect(() => {
    if (!current && queue.length > 0) {
      processQueue()
    }
  }, [current, queue, processQueue])

  useEffect(() => {
    if (!current) return

    timerRef.current = setTimeout(() => {
      dismiss()
    }, AUTO_DISMISS_MS)

    return () => {
      clearTimer()
    }
  }, [current, dismiss, clearTimer])

  useEffect(() => {
    if (!current) return

    const isModal = current.variant === 'error' || current.variant === 'warning'

    if (isModal) {
      previousFocusRef.current = document.activeElement as HTMLElement
      const primaryBtn = document.querySelector<HTMLElement>('[data-popup-primary]')
      primaryBtn?.focus()

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          dismiss()
          return
        }
        if (e.key === 'Tab') {
          const focusable = document.querySelectorAll<HTMLElement>(
            '[data-popup-primary], [data-popup-secondary], [data-popup-close]',
          )
          if (focusable.length === 0) return
          const first = focusable[0]
          const last = focusable[focusable.length - 1]
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault()
            last.focus()
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        previousFocusRef.current?.focus()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismiss()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [current, dismiss])

  return (
    <PopupContext.Provider value={{ showPopup }}>
      {children}
      {current && (
        <PopupBackdrop item={current} onDismiss={dismiss} />
      )}
    </PopupContext.Provider>
  )
}

function PopupBackdrop({
  item,
  onDismiss,
}: {
  item: PopupItem
  onDismiss: () => void
}) {
  const isModal = item.variant === 'error' || item.variant === 'warning'

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md"
      onClick={isModal ? undefined : onDismiss}
      role={isModal ? 'alertdialog' : 'status'}
      aria-modal={isModal ? 'true' : undefined}
      aria-labelledby={isModal ? 'popup-title' : undefined}
      aria-describedby={isModal && item.message ? 'popup-message' : undefined}
    >
      <div
        className="relative w-[calc(100%-2rem)] max-w-sm rounded-3xl border border-ink-700 bg-ink-950 p-8 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <PopupIcon variant={item.variant ?? 'info'} />

        <h2
          id="popup-title"
          className="font-display mt-4 text-2xl font-bold tracking-wide text-ink-100"
        >
          {item.title}
        </h2>

        {item.message && (
          <p id="popup-message" className="mt-2 text-sm text-ink-400">
            {item.message}
          </p>
        )}

        {isModal && (
          <div className="mt-6 flex flex-col gap-3">
            {item.actions?.map((action, i) => (
              <button
                key={i}
                type="button"
                data-popup-primary={action.variant !== 'secondary' ? true : undefined}
                data-popup-secondary={action.variant === 'secondary' ? true : undefined}
                onClick={() => {
                  action.onClick()
                  onDismiss()
                }}
                className={`w-full cursor-pointer rounded-xl px-6 py-3 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-brand-500 ${
                  action.variant === 'secondary'
                    ? 'border border-ink-600 text-ink-300 hover:bg-ink-800'
                    : 'bg-brand-500 text-ink-950 hover:bg-brand-400'
                }`}
              >
                {action.label}
              </button>
            ))}

          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}

function PopupIcon({ variant }: { variant: PopupVariant }) {
  const colorClass =
    variant === 'success'
      ? 'text-accent-400'
      : variant === 'error'
        ? 'text-red-400'
        : variant === 'warning'
          ? 'text-amber-400'
          : 'text-brand-400'

  const glowClass =
    variant === 'success'
      ? 'shadow-[0_0_40px_rgba(74,222,128,0.3)]'
      : variant === 'error'
        ? 'shadow-[0_0_40px_rgba(248,113,113,0.3)]'
        : variant === 'warning'
          ? 'shadow-[0_0_40px_rgba(251,191,36,0.3)]'
          : 'shadow-[0_0_40px_rgba(249,115,22,0.3)]'

  return (
    <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-ink-900 ${glowClass}`}>
      {variant === 'success' && <SuccessIcon className={colorClass} />}
      {variant === 'error' && <ErrorIcon className={colorClass} />}
      {variant === 'warning' && <WarningIcon className={colorClass} />}
      {variant === 'info' && <InfoIcon className={colorClass} />}
    </div>
  )
}

function SuccessIcon({ className }: { className?: string }) {
  return (
    <svg className={`h-10 w-10 ${className}`} viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <circle cx="26" cy="26" r="24" stroke="currentColor" strokeWidth="2.5" className="popup-circle-draw" />
      <path d="M15 27l7 7 15-16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="popup-check-draw" />
    </svg>
  )
}

function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg className={`h-10 w-10 ${className}`} viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <circle cx="26" cy="26" r="24" stroke="currentColor" strokeWidth="2.5" className="popup-circle-draw" />
      <path d="M18 18l16 16M34 18L18 34" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="popup-x-draw" />
    </svg>
  )
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg className={`h-10 w-10 ${className}`} viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <path d="M26 4L4 46h44L26 4z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" className="popup-triangle-draw" />
      <path d="M26 20v10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="popup-exclaim-draw" />
      <circle cx="26" cy="36" r="1.5" fill="currentColor" className="popup-exclaim-dot" />
    </svg>
  )
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={`h-10 w-10 ${className}`} viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <circle cx="26" cy="26" r="24" stroke="currentColor" strokeWidth="2.5" className="popup-circle-draw" />
      <path d="M26 24v12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="popup-info-line" />
      <circle cx="26" cy="17" r="1.5" fill="currentColor" className="popup-info-dot" />
    </svg>
  )
}

export function usePopup(): PopupContextValue {
  const context = useContext(PopupContext)
  if (!context) {
    throw new Error('usePopup must be used within PopupProvider')
  }
  return context
}
