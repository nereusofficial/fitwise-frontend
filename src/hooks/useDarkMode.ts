import { useCallback, useEffect, useState } from 'react'

type DarkMode = boolean

function getInitialDarkMode(): DarkMode {
  if (typeof window === 'undefined') return false
  const stored = window.localStorage.getItem('fitwise-theme')
  if (stored) return stored === 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState<DarkMode>(getInitialDarkMode)

  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
      window.localStorage.setItem('fitwise-theme', 'dark')
    } else {
      root.classList.remove('dark')
      window.localStorage.setItem('fitwise-theme', 'light')
    }
  }, [darkMode])

  const toggle = useCallback(() => setDarkMode((prev) => !prev), [])

  return { darkMode, toggle }
}
