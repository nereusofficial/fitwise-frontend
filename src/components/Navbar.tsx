import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Activity, LogOut, Menu, User, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Button } from './Button'

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

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

export function Navbar() {
  const { user, signOut, loggingOut, clearLoggingOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const navigate = useNavigate()
  const location = useLocation()

  const isHome = location.pathname === '/'
  const links = user ? userLinks : guestSections

  useEffect(() => {
    if (loggingOut && location.pathname === '/') {
      clearLoggingOut()
    }
  }, [location.pathname, loggingOut, clearLoggingOut])

  useEffect(() => {
    if (!isHome) return

    function onScroll() {
      const scrollPos = window.scrollY + window.innerHeight / 3
      let current = guestSections[0].id
      for (const section of guestSections) {
        const el = document.getElementById(section.id)
        if (el && el.offsetTop <= scrollPos) {
          current = section.id
        }
      }
      setActiveSection(current)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  async function handleSignOut() {
    await signOut()
    setMenuOpen(false)
    navigate('/')
  }

  function handleSectionClick(id: string) {
    setMenuOpen(false)
    if (isHome) {
      scrollToSection(id)
    } else {
      navigate('/')
      setTimeout(() => scrollToSection(id), 100)
    }
  }

  function navLinkClass(isActive: boolean) {
    return `relative rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
      isActive ? 'text-brand-400' : 'text-ink-300 hover:text-ink-100'
    }`
  }

  return (
    <header className="sticky top-0 z-50 border-b border-ink-800 bg-ink-950/90 backdrop-blur">
      <nav className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-10" aria-label="Main navigation">
        <Link
          to="/"
          className="flex shrink-0 cursor-pointer items-center gap-2"
          onClick={() => {
            setMenuOpen(false)
            if (isHome) {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }}
          aria-label="FitWise home"
        >
          <Activity className="h-7 w-7 text-brand-500" aria-hidden="true" />
          <span className="font-display text-2xl font-bold tracking-wide text-ink-100">
            FitWise
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) =>
            user && 'to' in link ? (
              <a key={link.to} href={link.to} className={navLinkClass(false)}>
                {link.label}
              </a>
            ) : !user && 'id' in link ? (
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
            ) : null,
          )}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
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
          ) : (
            <>
              <button type="button" onClick={() => navigate('/login')} className={navLinkClass(false)}>
                Sign in
              </button>
              <Button size="sm" onClick={() => navigate('/signup')}>
                Get started
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
              user && 'to' in link ? (
                <a key={link.to} href={link.to} className={navLinkClass(false)} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              ) : !user && 'id' in link ? (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleSectionClick(link.id)}
                  className={`${navLinkClass(activeSection === link.id)} text-left`}
                >
                  {link.label}
                </button>
              ) : null,
            )}
            {user ? (
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
            ) : (
              <div className="mt-2 flex flex-col gap-2">
                <button type="button" onClick={() => { setMenuOpen(false); navigate('/login') }} className={navLinkClass(false)}>
                  Sign in
                </button>
                <Button size="sm" onClick={() => { setMenuOpen(false); navigate('/signup') }}>
                  Get started
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
