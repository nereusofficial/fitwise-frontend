import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Sparkles, User } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useLogout } from '../features/auth/auth-context'
import { useBilling } from '../features/billing/BillingContext'
import { ConfirmDialog } from './ConfirmDialog'

function getInitials(email: string, name?: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return parts[0][0]?.toUpperCase() ?? ''
  }
  return email[0]?.toUpperCase() ?? ''
}

export function AvatarMenu() {
  const { user } = useAuth()
  const { logout, loggingOut } = useLogout()
  const { status } = useBilling()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const navigate = useNavigate()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const avatarBtnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const isProfile = location.pathname === '/profile'

  const photoUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture
  const displayName = user?.user_metadata?.name || user?.user_metadata?.full_name || ''
  const email = user?.email ?? ''
  const initials = getInitials(email, displayName)

  useEffect(() => {
    if (!menuOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setMenuOpen(false)
        avatarBtnRef.current?.focus()
        return
      }

      if (e.key === 'Tab') {
        const items = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]')
        if (!items || items.length === 0) return
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          avatarBtnRef.current?.focus()
          setMenuOpen(false)
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          avatarBtnRef.current?.focus()
          setMenuOpen(false)
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown, true)
    return () => document.removeEventListener('keydown', handleKeyDown, true)
  }, [menuOpen])

  function toggleMenu() {
    setMenuOpen((prev) => !prev)
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  function handleAvatarKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault()
      setMenuOpen(true)
      requestAnimationFrame(() => {
        menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
      })
    }
  }

  function handleProfile() {
    closeMenu()
    navigate('/profile')
  }

  function handleUpgrade() {
    closeMenu()
    const event = new CustomEvent('open-paywall')
    window.dispatchEvent(event)
  }

  function handleLogoutClick() {
    closeMenu()
    setShowLogoutConfirm(true)
  }

  async function confirmLogout() {
    setShowLogoutConfirm(false)
    await logout()
  }

  function handleMenuItemKeyDown(e: React.KeyboardEvent, index: number, total: number) {
    const items = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]')
    if (!items || items.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = (index + 1) % total
      items[next]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = (index - 1 + total) % total
      items[prev]?.focus()
    } else if (e.key === 'Home') {
      e.preventDefault()
      items[0]?.focus()
    } else if (e.key === 'End') {
      e.preventDefault()
      items[total - 1]?.focus()
    }
  }

  return (
    <div ref={wrapperRef} className="relative flex items-center">
      <button
        ref={avatarBtnRef}
        type="button"
        onClick={toggleMenu}
        onKeyDown={handleAvatarKeyDown}
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls="avatar-menu"
        className={`flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full ring-2 ring-ink-700 transition-all focus-visible:outline-2 focus-visible:outline-brand-500 ${
          menuOpen || isProfile ? 'ring-brand-500' : 'hover:ring-brand-500'
        }`}
      >
        {photoUrl ? (
          <AvatarImage src={photoUrl} initials={initials} />
        ) : initials ? (
          <span className="flex h-full w-full items-center justify-center rounded-full bg-brand-500/20 text-xs font-bold text-brand-400">
            {initials}
          </span>
        ) : (
          <User className="h-5 w-5 text-ink-400" />
        )}
      </button>

      {menuOpen && (
        <div
          ref={menuRef}
          role="menu"
          aria-labelledby="avatar-menu-label"
          className="absolute right-0 top-full z-[100] mt-2 w-64 origin-top-right rounded-2xl border border-ink-800 bg-ink-900 p-2 shadow-2xl backdrop-blur"
          style={{ animation: 'avatarMenuIn 150ms ease-out' }}
        >
          <div className="flex items-center gap-3 rounded-xl p-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-2 ring-ink-700">
              {photoUrl ? (
                <AvatarImage src={photoUrl} initials={initials} size="md" />
              ) : initials ? (
                <span className="flex h-full w-full items-center justify-center rounded-full bg-brand-500/20 text-sm font-bold text-brand-400">
                  {initials}
                </span>
              ) : (
                <User className="h-5 w-5 text-ink-400" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span id="avatar-menu-label" className="truncate text-sm font-semibold text-ink-100">
                  {displayName || 'User'}
                </span>
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
              <p className="truncate text-xs text-ink-400">{email}</p>
            </div>
          </div>

          <div className="my-2 h-px bg-ink-800" role="separator" />

          <div
            role="menuitem"
            tabIndex={0}
            onClick={handleProfile}
            onKeyDown={(e) => handleMenuItemKeyDown(e, 0, status && !status.isPro ? 3 : 2)}
            className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
              isProfile ? 'bg-ink-800 text-brand-400' : 'text-ink-200 hover:bg-ink-800 hover:text-ink-100'
            }`}
          >
            <User className="h-4 w-4 shrink-0" />
            Profile
          </div>

          {status && !status.isPro && (
            <div
              role="menuitem"
              tabIndex={0}
              onClick={handleUpgrade}
              onKeyDown={(e) => handleMenuItemKeyDown(e, 1, 3)}
              className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-200 transition-colors hover:bg-ink-800 hover:text-ink-100"
            >
              <Sparkles className="h-4 w-4 shrink-0 text-brand-400" />
              Upgrade to Pro
            </div>
          )}

          <div
            role="menuitem"
            tabIndex={0}
            onClick={handleLogoutClick}
            onKeyDown={(e) =>
              handleMenuItemKeyDown(e, status && !status.isPro ? 2 : 1, status && !status.isPro ? 3 : 2)
            }
            className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-200 transition-colors hover:bg-ink-800 hover:text-red-400"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Log out
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Log out?"
        message="Are you sure you want to log out of your account?"
        confirmLabel={loggingOut ? 'Logging out...' : 'Log out'}
        loading={loggingOut}
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  )
}

function AvatarImage({
  src,
  initials,
  size = 'sm',
}: {
  src: string
  initials: string
  size?: 'sm' | 'md'
}) {
  const [error, setError] = useState(false)

  if (error || !initials) {
    return (
      <span
        className={`flex items-center justify-center rounded-full bg-brand-500/20 font-bold text-brand-400 ${
          size === 'sm' ? 'h-full w-full text-xs' : 'h-full w-full text-sm'
        }`}
      >
        {initials}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt=""
      referrerPolicy="no-referrer"
      loading="eager"
      onError={() => setError(true)}
      className={`rounded-full object-cover ${size === 'sm' ? 'h-full w-full' : 'h-full w-full'}`}
    />
  )
}
