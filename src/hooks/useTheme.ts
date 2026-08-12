import { useState, useEffect, useCallback } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'amoled' | 'system'>('system')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | 'amoled' | 'system' | null
    if (stored) {
      setTheme(stored)
      applyTheme(stored)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const initial = prefersDark ? 'dark' : 'light'
      setTheme(initial)
      applyTheme(initial)
    }
  }, [])

  const applyTheme = (t: 'light' | 'dark' | 'amoled' | 'system') => {
    const root = document.documentElement
    root.classList.remove('light', 'dark', 'amoled')
    if (t === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.add(prefersDark ? 'dark' : 'light')
    } else {
      root.classList.add(t)
    }
  }

  const changeTheme = useCallback((newTheme: 'light' | 'dark' | 'amoled' | 'system') => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }, [])

  return { theme, setTheme: changeTheme }
}