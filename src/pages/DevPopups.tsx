import { usePopup } from '../components/Popup'

export default function DevPopups() {
  const { showPopup } = usePopup()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-ink-100">
        Popup Preview
      </h1>
      <p className="text-ink-500 dark:text-ink-400">Click a button to preview each variant.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() =>
            showPopup({
              title: 'Login successful',
              message: "Welcome back! You're all set.",
              variant: 'success',
            })
          }
          className="cursor-pointer rounded-xl bg-accent-500 px-5 py-2.5 font-semibold text-ink-950 transition-colors hover:bg-accent-400"
        >
          Success
        </button>
        <button
          type="button"
          onClick={() =>
            showPopup({
              title: 'Account not found',
              message: 'No account found for this Google account. Click Get started and complete sign-up first.',
              variant: 'error',
              actions: [
                { label: 'Get started', onClick: () => {} },
                { label: 'Close', variant: 'secondary', onClick: () => {} },
              ],
            })
          }
          className="cursor-pointer rounded-xl bg-red-500 px-5 py-2.5 font-semibold text-ink-950 transition-colors hover:bg-red-400"
        >
          Error
        </button>
        <button
          type="button"
          onClick={() =>
            showPopup({
              title: 'Warning',
              message: 'This is a warning message.',
              variant: 'warning',
            })
          }
          className="cursor-pointer rounded-xl bg-amber-500 px-5 py-2.5 font-semibold text-ink-950 transition-colors hover:bg-amber-400"
        >
          Warning
        </button>
        <button
          type="button"
          onClick={() =>
            showPopup({
              title: 'Info',
              message: 'This is an info message.',
              variant: 'info',
            })
          }
          className="cursor-pointer rounded-xl bg-brand-500 px-5 py-2.5 font-semibold text-ink-950 transition-colors hover:bg-brand-400"
        >
          Info
        </button>
      </div>
    </div>
  )
}
