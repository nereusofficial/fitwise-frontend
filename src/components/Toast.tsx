import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

type ToastVariant = 'success' | 'error'

interface ToastItem {
  id: number
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

let toastId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }, [])

  const toast = useCallback(
    (message: string, variant: ToastVariant = 'success') => {
      setToasts((prev) => {
        if (prev.some((t) => t.message === message && t.variant === variant)) {
          return prev
        }
        const id = ++toastId
        const timer = setTimeout(() => removeToast(id), 4000)
        timersRef.current.set(id, timer)
        return [...prev, { id, message, variant }]
      })
    },
    [removeToast],
  )

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  )
}

function ToastViewport({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: number) => void }) {
  return createPortal(
    <div
      className="pointer-events-none fixed left-1/2 top-4 z-[9999] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  )
}

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) {
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (paused) {
      if (timerRef.current) clearTimeout(timerRef.current)
      return
    }
    timerRef.current = setTimeout(() => onDismiss(toast.id), 4000)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [paused, toast.id, onDismiss])

  const Icon = toast.variant === 'error' ? AlertCircle : CheckCircle2
  const iconColor = toast.variant === 'error' ? 'text-red-400' : 'text-accent-400'

  return (
    <motion.div
      initial={{ opacity: 0, y: -24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -24, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-ink-700 bg-ink-950/95 px-5 py-3 shadow-2xl backdrop-blur"
      role={toast.variant === 'error' ? 'alert' : 'status'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Icon className={`h-5 w-5 shrink-0 ${iconColor}`} aria-hidden="true" />
      <p className="text-sm font-medium text-ink-100">{toast.message}</p>
    </motion.div>
  )
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
