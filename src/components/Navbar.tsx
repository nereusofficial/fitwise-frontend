import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Activity, LogOut, Menu, User, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Button } from './Button'

const userLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/plan', label: 'Get a plan' },
  { to: '/history', label: 'History' },
  { to: '/progress', label: 'Progress' },
  { to: '/calculators', label: 'Calculators' },
]

function navLinkClass({ isActive }: { isActive: boolean }) {
  return `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
    isActive
      ? 'bg-brand-950 text-brand-300'
      : 'text-ink-300 hover:bg-ink-800 hover:text-ink-100'
  }`
}

export function Navbar() {
  const { user, signOut, loggingOut, clearLoggingOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (loggingOut && location.pathname === '/') {
      clearLoggingOut()
    }
  }, [location.pathname, loggingOut, clearLoggingOut])

  async function handleSignOut() {
    await signOut()
    setMenuOpen(false)
    navigate('/')
  }

  const links = user ? userLinks : []

  return (
    <header className="sticky top-0 z-50 border-b border-ink-800 bg-ink-950/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4" aria-label="Main navigation">
        <Link
          to="/"
          className="flex cursor-pointer items-center gap-2"
          onClick={() => {
            setMenuOpen(false)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          aria-label="FitWise home"
        >
          <Activity className="h-7 w-7 text-brand-500" aria-hidden="true" />
          <span className="font-display text-2xl font-bold tracking-wide text-ink-100">
            FitWise
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <NavLink to="/profile" className={navLinkClass}>
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" aria-hidden="true" />
                  Profile
                </span>
              </NavLink>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Log out
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Sign in
              </NavLink>
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
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={navLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            {user ? (
              <>
                <NavLink to="/profile" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4" aria-hidden="true" />
                    Profile
                  </span>
                </NavLink>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="mt-1 justify-start">
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Log out
                </Button>
              </>
            ) : (
              <div className="mt-2 flex flex-col gap-2">
                <NavLink to="/login" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                  Sign in
                </NavLink>
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
