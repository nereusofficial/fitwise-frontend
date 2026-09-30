const EASE_IN_OUT_CUBIC = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

export interface SmoothScrollOptions {
  duration?: number
  onDone?: () => void
}

export function smoothScrollTo(targetY: number, options: SmoothScrollOptions = {}): () => void {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  const clampedTarget = Math.max(0, Math.min(targetY, maxScroll))
  const startY = window.scrollY
  const distance = Math.abs(clampedTarget - startY)

  if (distance < 4 || reduceMotion) {
    window.scrollTo(0, clampedTarget)
    options.onDone?.()
    return () => {}
  }

  const duration = options.duration ?? Math.max(500, Math.min(1100, 350 + distance * 0.35))
  let rafId = 0
  let cancelled = false

  const cancel = () => {
    cancelled = true
    cancelAnimationFrame(rafId)
    window.removeEventListener('wheel', onCancel)
    window.removeEventListener('touchstart', onCancel)
    window.removeEventListener('keydown', onCancel)
  }

  const onCancel = ((_e: Event) => cancel()) as EventListener

  window.addEventListener('wheel', onCancel, { passive: true })
  window.addEventListener('touchstart', onCancel, { passive: true })
  window.addEventListener('keydown', onCancel)

  const startTime = performance.now()

  const step = (now: number) => {
    if (cancelled) return
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = EASE_IN_OUT_CUBIC(progress)
    window.scrollTo(0, startY + (clampedTarget - startY) * eased)
    if (progress < 1) {
      rafId = requestAnimationFrame(step)
    } else {
      window.removeEventListener('wheel', onCancel)
      window.removeEventListener('touchstart', onCancel)
      window.removeEventListener('keydown', onCancel)
      options.onDone?.()
    }
  }

  rafId = requestAnimationFrame(step)

  return cancel
}
