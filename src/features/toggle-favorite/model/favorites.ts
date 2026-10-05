import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'favoriteUserIds'

const listeners = new Set<() => void>()

function readFavorites(): number[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed)
      ? parsed.filter((id): id is number => typeof id === 'number')
      : []
  } catch {
    return []
  }
}

let favorites = readFavorites()

function emitChange() {
  listeners.forEach((listener) => listener())
}

// Keeps several open tabs in sync: `storage` fires only in the tabs that did not write.
window.addEventListener('storage', (event) => {
  if (event.key !== STORAGE_KEY) return
  favorites = readFavorites()
  emitChange()
})

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function toggleFavorite(userId: number) {
  favorites = favorites.includes(userId)
    ? favorites.filter((id) => id !== userId)
    : [...favorites, userId]
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  } catch {
    // Storage can be unavailable (private mode, quota); the in-memory state still updates for this session.
  }
  emitChange()
}

export function useIsFavorite(userId: number) {
  // A boolean snapshot means a row re-renders only when its own favorite state changes.
  return useSyncExternalStore(subscribe, () => favorites.includes(userId))
}

export function useFavoriteIds() {
  return useSyncExternalStore(subscribe, () => favorites)
}
