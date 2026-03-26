import { useState, useEffect, useCallback } from 'react'

const FAVS_KEY    = 'devkit-favorites'
const RECENTS_KEY = 'devkit-recents'
const MAX_RECENTS = 5

export function useToolPrefs() {
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem(FAVS_KEY)) || [] } catch { return [] }
  })

  const [recents, setRecents] = useState(() => {
    try { return JSON.parse(localStorage.getItem(RECENTS_KEY)) || [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem(FAVS_KEY, JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(recents))
  }, [recents])

  const toggleFavorite = useCallback((path) => {
    setFavorites(prev =>
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    )
  }, [])

  const trackRecent = useCallback((path) => {
    setRecents(prev => {
      const filtered = prev.filter(p => p !== path)
      return [path, ...filtered].slice(0, MAX_RECENTS)
    })
  }, [])

  return { favorites, recents, toggleFavorite, trackRecent }
}