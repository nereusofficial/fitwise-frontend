import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

import { usePopup } from '../components/Popup'
import { supabase } from '../lib/supabaseClient'

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'
  const [busy, setBusy] = useState(false)
  const [profileVerified, setProfileVerified] = useState(false)
  const { showPopup } = usePopup()

  const oauthError = new URLSearchParams(location.search).get('error')
  const notRegistered = new URLSearchParams(location.search).get('error') === 'not_registered'

  useEffect(() => {
    if (notRegistered) {
      showPopup({
        title: 'Account not found',
        message: 'No account found for this Google account. Click Get started and complete sign-up first.',
        variant: 'error',
      })
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
    }
  }, [notRegistered, showPopup, navigate])

  useEffect(() => {
    if (user || loading) return
    if (oauthError && !notRegistered) {
      showPopup({
        title: 'Account not found',
        message: 'No account found for this Google account. Please sign up first.',
        variant: 'error',
      })
    }
  }, [oauthError, notRegistered, user, loading, showPopup])

  useEffect(() => {
    if (!user || loading) return

    let intent = ''
    try {
      intent = sessionStorage.getItem('authIntent') ?? ''
      sessionStorage.removeItem('authIntent')
    } catch {
      // Ignore.
    }

    supabase
      .from('profiles')
      .select('id, name, age, height_cm, weight_kg, gender, activity_level, goal')
      .eq('id', user.id)
      .maybeSingle()
      .then(async ({ data, error: fetchError }) => {
        if (fetchError) {
          showPopup({
            title: 'Verification failed',
            message: 'Could not verify your account. Please try again.',
            variant: 'error',
          })
          return
        }

        const isComplete =
          data &&
          data.name &&
          data.age > 0 &&
          data.height_cm > 0 &&
          data.weight_kg > 0 &&
          data.gender &&
          data.activity_level &&
          data.goal

        if (intent === 'signin' && !isComplete) {
          if (!data) {
            try {
              const {
                data: { session },
              } = await supabase.auth.getSession()
              if (session) {
                const controller = new AbortController()
                const timeout = setTimeout(() => controller.abort(), 5000)
                try {
                  await fetch(`${import.meta.env.VITE_API_URL}/api/account/discard-incomplete`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${session.access_token}`,
                    },
                    signal: controller.signal,
                  })
                } catch {
                  // Ignore — still sign out below.
                } finally {
                  clearTimeout(timeout)
                }
              }
            } catch {
              // Ignore — still sign out below.
            }
          }
          await supabase.auth.signOut({ scope: 'local' })
          navigate('/login?error=not_registered', { replace: true })
        } else if (isComplete) {
          setProfileVerified(true)
          navigate(from, { replace: true, state: { showSuccess: true } })
        }
      })
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"
          role="status"
          aria-label="Loading"
        />
      </div>
    )
  }

  if (user && profileVerified) {
    return <Navigate to={from} replace />
  }

  async function handleGoogle() {
    setBusy(true)
    try {
      sessionStorage.setItem('authIntent', 'signin')
    } catch {
      // Ignore.
    }
    try {
      await signInWithGoogle()
    } catch {
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(249,115,22,0.15) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(34,197,94,0.12) 0%, transparent 40%)',
        }}
        aria-hidden="true"
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md rounded-3xl border border-ink-800 bg-ink-900/80 px-8 pb-8 pt-16 text-center shadow-xl backdrop-blur"
      >
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="Go back"
          className="absolute left-4 top-4 inline-flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-ink-300 transition-colors hover:bg-ink-800 hover:text-ink-100 focus-visible:outline-2 focus-visible:outline-brand-500"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>
        <div className="mb-4 flex items-center justify-center">
          <img src="/icon.png" alt="FitWise" className="h-[56px] w-auto max-[390px]:h-[56px] sm:h-[96px] sm:w-auto" />
        </div>
        <h1 className="font-display text-3xl font-bold tracking-wide text-ink-100">
          Welcome back to FitWise
        </h1>
        <p className="mt-2 text-ink-400">Sign in with Google to continue.</p>
        <button
          type="button"
          onClick={handleGoogle}
          disabled={busy}
          className="mt-8 inline-flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-ink-700 bg-ink-900 px-6 py-4 text-lg font-semibold text-ink-100 transition-colors hover:border-ink-600 disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" /> : <GoogleIcon />}
          Continue with Google
        </button>
      </motion.div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}
