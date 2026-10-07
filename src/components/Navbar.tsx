import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePageContext } from '../hooks/usePageContext'
import { Activity, LogOut, Menu, User, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Button } from './Button'
import { ConfirmDialog } from './ConfirmDialog'
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
  const { user, performLogout, loggingOut, clearLoggingOut } = useAuth()
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
    if (loggingOut && location.pathname === '/') {
      clearLoggingOut()
    }
  }, [location.pathname, loggingOut, clearLoggingOut])

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
    navigate('/', { replace: true, state: { loggedOut: true } })
    await performLogout()
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

  function handleLogoClick() {
    setMenuOpen(false)
    setIsScrolling(true)
    cancelScrollRef.current?.()
    cancelScrollRef.current = smoothScrollTo(0, {
      onDone: () => {
        setIsScrolling(false)
        cancelScrollRef.current = null
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
          <div className="flex shrink-0 cursor-default select-none items-center gap-2">
            <Activity className="h-7 w-7 text-brand-500" aria-hidden="true" />
            <span className="font-display text-2xl font-bold tracking-wide text-ink-100">
              FitWise
            </span>
          </div>
        ) : (
          <div
            className="flex shrink-0 cursor-pointer items-center gap-2"
            onClick={handleLogoClick}
            role="button"
            aria-label="FitWise home"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleLogoClick()
              }
            }}
          >
            <Activity className="h-7 w-7 text-brand-500" aria-hidden="true" />
            <span className="font-display text-2xl font-bold tracking-wide text-ink-100">
              FitWise
            </span>
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
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Log out
                </Button>
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
            <>
              <a href="/profile" className={navLinkClass(false)}>
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" aria-hidden="true" />
                  Profile
                </span>
              </a>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Log out
              </Button>
            </>
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
                  <Button variant="ghost" size="sm" onClick={handleSignOut} className="mt-1 justify-start">
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Log out
                  </Button>
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
              <>
                <a href="/profile" className={navLinkClass(false)} onClick={() => setMenuOpen(false)}>
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4" aria-hidden="true" />
                    Profile
                  </span>
                </a>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="mt-1 justify-start">
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Log out
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      </header>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Log out?"
        message="Are you sure you want to log out of your account?"
        confirmLabel="Log out"
        onConfirm={confirmSignOut}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  )
}
