import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AlertCircle } from 'lucide-react'

interface ToastProps {
  message: string
  visible: boolean
  onClose: () => void
  duration?: number
}

export function Toast({ message, visible, onClose, duration = 6000 }: ToastProps) {
  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [visible, duration, onClose])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed left-1/2 top-6 z-[100] w-full max-w-md -translate-x-1/2 px-4"
          role="alert"
        >
          <div className="flex items-start gap-3 rounded-2xl border border-red-800 bg-red-950/95 p-4 shadow-2xl backdrop-blur">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" aria-hidden="true" />
            <p className="flex-1 text-sm leading-relaxed text-red-100">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
