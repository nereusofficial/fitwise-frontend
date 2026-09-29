import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Activity, LogOut, Menu, Moon, Sun, User, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useDarkMode } from '../hooks/useDarkMode'
import { Button } from './Button'

const guestLinks = [{ to: '/', label: 'Home' }]

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
      ? 'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
      : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-ink-100'
  }`
}

export function Navbar() {
  const { user, signOut } = useAuth()
  const { darkMode, toggle } = useDarkMode()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    setMenuOpen(false)
    navigate('/')
  }

  const links = user ? userLinks : guestLinks

  return (
    <header className="sticky top-0 z-50 border-b border-ink-200 bg-white/90 backdrop-blur dark:border-ink-800 dark:bg-ink-950/90">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4" aria-label="Main navigation">
        <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <Activity className="h-7 w-7 text-brand-500" aria-hidden="true" />
          <span className="font-display text-2xl font-bold tracking-wide text-ink-900 dark:text-ink-100">
            FitWise
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={toggle}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="cursor-pointer rounded-lg p-2 text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-brand-500 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-ink-100"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
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
                Log in
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
            onClick={toggle}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="cursor-pointer rounded-lg p-2 text-ink-600 transition-colors hover:bg-ink-100 focus-visible:outline-2 focus-visible:outline-brand-500 dark:text-ink-300 dark:hover:bg-ink-800"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="cursor-pointer rounded-lg p-2 text-ink-700 transition-colors hover:bg-ink-100 focus-visible:outline-2 focus-visible:outline-brand-500 dark:text-ink-200 dark:hover:bg-ink-800"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-ink-200 bg-white px-4 py-3 dark:border-ink-800 dark:bg-ink-950 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={navLinkClass}
                end={link.to === '/'}
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
                  Log in
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
