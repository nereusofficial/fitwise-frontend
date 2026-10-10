import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePageContext } from '../hooks/usePageContext'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useLogout } from '../features/auth/auth-context'
import { useBilling } from '../features/billing/BillingContext'
import { Button } from './Button'
import { ConfirmDialog } from './ConfirmDialog'
import { AvatarMenu } from './AvatarMenu'
import { smoothScrollTo } from '../lib/smoothScroll'

const guestSections = [
  { id: 'hero', label: 'Home' },
  { id: 'how-it-works', label: 'How it works' },
  { id: 'features', label: 'Features' },
  { id: 'plan-preview', label: 'Plan' },
  { id: 'faq', label: 'FAQ' },
]

const userLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/plan', label: 'Get a plan' },
  { to: '/history', label: 'History' },
  { to: '/progress', label: 'Progress' },
  { to: '/calculators', label: 'Calculators' },
]

function getNavbarHeight(): number {
  const header = document.querySelector('header')
  return header?.offsetHeight ?? 64
}

function getCenteredScrollTop(id: string): number {
  const el = document.getElementById(id)
  if (!el) return 0
  const rect = el.getBoundingClientRect()
  const sectionHeight = rect.height
  const navbarHeight = getNavbarHeight()
  const availableHeight = window.innerHeight - navbarHeight
  let top: number
  if (sectionHeight >= availableHeight) {
    top = window.scrollY + rect.top - navbarHeight
  } else {
    top = window.scrollY + rect.top - navbarHeight + (availableHeight - sectionHeight) / 2
  }
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  return Math.max(0, Math.min(top, maxScroll))
}

export function Navbar() {
  const { user } = useAuth()
  const { logout, loggingOut } = useLogout()
  const { status } = useBilling()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [isScrolling, setIsScrolling] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const navigate = useNavigate()
  const cancelScrollRef = useRef<(() => void) | null>(null)

  const isHome = location.pathname === '/'
  const pageContext = usePageContext()
  const showLandingNav = pageContext === 'landing' || pageContext === 'auth'
  const links = showLandingNav ? guestSections : userLinks

  useEffect(() => {
    if (!isHome || isScrolling) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: '-40% 0px -50% 0px' },
    )
    guestSections.forEach((section) => {
      const el = document.getElementById(section.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [isHome, isScrolling])

  useEffect(() => {
    return () => {
      cancelScrollRef.current?.()
    }
  }, [])

  function handleSignOut() {
    setShowLogoutConfirm(true)
  }

  async function confirmSignOut() {
    setShowLogoutConfirm(false)
    await logout()
  }

  function handleSectionClick(id: string) {
    setMenuOpen(false)
    setActiveSection(id)
    setIsScrolling(true)
    cancelScrollRef.current?.()

    const targetY = getCenteredScrollTop(id)
    cancelScrollRef.current = smoothScrollTo(targetY, {
      onDone: () => {
        setIsScrolling(false)
        cancelScrollRef.current = null
        const heading = document.getElementById(`${id}-heading`)
        if (heading) {
          heading.setAttribute('tabIndex', '-1')
          heading.focus({ preventScroll: true })
        }
      },
    })
  }

  function navLinkClass(isActive: boolean) {
    return `relative cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
      isActive ? 'text-brand-400' : 'text-ink-300 hover:text-ink-100'
    }`
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-ink-800 bg-ink-950/90 backdrop-blur">
        <nav className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-10" aria-label="Main navigation">
          {isHome ? (
            <div className="flex shrink-0 cursor-default select-none items-center">
              <img src="/icon.png" alt="FitWise" className="h-9 w-9" />
            </div>
          ) : (
            <div className="flex shrink-0 cursor-default select-none items-center">
              <img src="/icon.png" alt="FitWise" className="h-9 w-9" />
            </div>
          )}

          <div className="hidden items-center gap-1 md:flex">
            {links.map((link) =>
              !user && 'id' in link ? (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleSectionClick(link.id)}
                  className={navLinkClass(activeSection === link.id)}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-0.5 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-brand-400 transition-all duration-300 ${
                      activeSection === link.id ? 'w-6' : 'w-0'
                    }`}
                    aria-hidden="true"
                  />
                </button>
              ) : user && 'to' in link ? (
                <a key={link.to} href={link.to} className={navLinkClass(false)}>
                  {link.label}
                </a>
              ) : null,
            )}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {showLandingNav ? (
              user ? (
                <>
                  <Button size="sm" onClick={() => navigate('/dashboard')}>
                    Dashboard
                  </Button>
                  <AvatarMenu />
                </>
              ) : (
                <>
                  <button type="button" onClick={() => navigate('/login')} className={navLinkClass(false)}>
                    Sign in
                  </button>
                  <Button size="sm" onClick={() => navigate('/signup')}>
                    Get started
                  </Button>
                </>
              )
            ) : (
              <AvatarMenu />
            )}
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="cursor-pointer rounded-lg p-2 text-ink-200 transition-colors hover:bg-ink-800 focus-visible:outline-2 focus-visible:outline-brand-500"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="border-t border-ink-800 bg-ink-950 px-4 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              {links.map((link) =>
                !user && 'id' in link ? (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => handleSectionClick(link.id)}
                    className={`${navLinkClass(activeSection === link.id)} text-left`}
                  >
                    {link.label}
                  </button>
                ) : user && 'to' in link ? (
                  <a key={link.to} href={link.to} className={navLinkClass(false)} onClick={() => setMenuOpen(false)}>
                    {link.label}
                  </a>
                ) : null,
              )}
              {showLandingNav ? (
                user ? (
                  <>
                    <Button size="sm" onClick={() => { setMenuOpen(false); navigate('/dashboard') }}>
                      Dashboard
                    </Button>
                    <div className="mt-3 flex flex-col gap-1 border-t border-ink-800 pt-3">
                      <div className="flex items-center gap-3 rounded-xl p-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/20 text-xs font-bold text-brand-400">
                          {(user?.user_metadata?.name || user?.email || 'U')[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-ink-100">
                            {user?.user_metadata?.name || 'User'}
                          </p>
                          <p className="truncate text-xs text-ink-400">{user?.email}</p>
                        </div>
                        {status && (
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              status.isPro ? 'bg-brand-500/20 text-brand-400' : 'bg-ink-700 text-ink-400'
                            }`}
                          >
                            {status.isPro ? 'Pro' : 'Free'}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => { setMenuOpen(false); navigate('/profile') }}
                        className={`${navLinkClass(false)} rounded-lg px-3 py-2 text-left text-sm text-ink-300 hover:bg-ink-800 hover:text-ink-100`}
                      >
                        Profile
                      </button>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink-300 hover:bg-ink-800 hover:text-red-400"
                      >
                        Log out
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="mt-2 flex flex-col gap-2">
                    <button type="button" onClick={() => { setMenuOpen(false); navigate('/login') }} className={navLinkClass(false)}>
                      Sign in
                    </button>
                    <Button size="sm" onClick={() => { setMenuOpen(false); navigate('/signup') }}>
                      Get started
                    </Button>
                  </div>
                )
              ) : (
                <div className="mt-3 flex flex-col gap-1 border-t border-ink-800 pt-3">
                  <div className="flex items-center gap-3 rounded-xl p-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/20 text-xs font-bold text-brand-400">
                      {(user?.user_metadata?.name || user?.email || 'U')[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-100">
                        {user?.user_metadata?.name || 'User'}
                      </p>
                      <p className="truncate text-xs text-ink-400">{user?.email}</p>
                    </div>
                    {status && (
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          status.isPro ? 'bg-brand-500/20 text-brand-400' : 'bg-ink-700 text-ink-400'
                        }`}
                      >
                        {status.isPro ? 'Pro' : 'Free'}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => { setMenuOpen(false); navigate('/profile') }}
                    className={`${navLinkClass(false)} rounded-lg px-3 py-2 text-left text-sm text-ink-300 hover:bg-ink-800 hover:text-ink-100`}
                  >
                    Profile
                  </button>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink-300 hover:bg-ink-800 hover:text-red-400"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </header>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Log out?"
        message="Are you sure you want to log out of your account?"
        confirmLabel={loggingOut ? 'Logging out...' : 'Log out'}
        loading={loggingOut}
        onConfirm={confirmSignOut}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  )
}
