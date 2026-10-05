import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const STORAGE_KEY = 'favoriteUserIds'

// The store reads localStorage once at import, so each test needs a fresh module.
async function loadStore() {
  vi.resetModules()
  return import('./favorites.ts')
}

describe('favorites store', () => {
  describe('happy path', () => {
    it('persists toggled user ids to localStorage', async () => {
      const { toggleFavorite } = await loadStore()

      toggleFavorite(1)
      toggleFavorite(3)

      expect(localStorage.getItem(STORAGE_KEY)).toBe('[1,3]')
    })

    it('removes a user id when it is toggled again', async () => {
      const { toggleFavorite } = await loadStore()

      toggleFavorite(1)
      toggleFavorite(3)
      toggleFavorite(1)

      expect(localStorage.getItem(STORAGE_KEY)).toBe('[3]')
    })

    it('restores favorites saved in a previous session', async () => {
      localStorage.setItem(STORAGE_KEY, '[2]')
      const { useIsFavorite } = await loadStore()

      expect(renderHook(() => useIsFavorite(2)).result.current).toBe(true)
      expect(renderHook(() => useIsFavorite(5)).result.current).toBe(false)
    })

    it('updates only the subscriber whose user was toggled', async () => {
      const { toggleFavorite, useIsFavorite } = await loadStore()
      const first = renderHook(() => useIsFavorite(1))
      const second = renderHook(() => useIsFavorite(2))

      act(() => toggleFavorite(1))
      expect(first.result.current).toBe(true)
      expect(second.result.current).toBe(false)

      act(() => toggleFavorite(1))
      expect(first.result.current).toBe(false)
    })

    it('picks up favorites changed in another tab', async () => {
      const { useIsFavorite } = await loadStore()
      const { result } = renderHook(() => useIsFavorite(4))

      act(() => {
        localStorage.setItem(STORAGE_KEY, '[4]')
        window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }))
      })

      expect(result.current).toBe(true)
    })
  })

  describe('unhappy path', () => {
    it('ignores storage events for other keys', async () => {
      const { useIsFavorite } = await loadStore()
      const { result } = renderHook(() => useIsFavorite(4))

      act(() => {
        localStorage.setItem(STORAGE_KEY, '[4]')
        window.dispatchEvent(new StorageEvent('storage', { key: 'theme' }))
      })

      expect(result.current).toBe(false)
    })

    it('starts empty and overwrites the value when stored JSON is corrupted', async () => {
      localStorage.setItem(STORAGE_KEY, '{not json')
      const { toggleFavorite, useIsFavorite } = await loadStore()

      expect(renderHook(() => useIsFavorite(1)).result.current).toBe(false)

      toggleFavorite(1)
      expect(localStorage.getItem(STORAGE_KEY)).toBe('[1]')
    })

    it.each(['null', '"1"', '{"1":true}'])(
      'starts empty when the stored value %s is not an array',
      async (stored) => {
        localStorage.setItem(STORAGE_KEY, stored)
        const { useIsFavorite } = await loadStore()

        expect(renderHook(() => useIsFavorite(1)).result.current).toBe(false)
      },
    )

    it('drops non-numeric ids from the stored array', async () => {
      localStorage.setItem(STORAGE_KEY, '[1,"2",null]')
      const { toggleFavorite, useIsFavorite } = await loadStore()

      expect(renderHook(() => useIsFavorite(1)).result.current).toBe(true)
      expect(renderHook(() => useIsFavorite(2)).result.current).toBe(false)

      toggleFavorite(3)
      expect(localStorage.getItem(STORAGE_KEY)).toBe('[1,3]')
    })

    it('starts empty when localStorage cannot be read', async () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new DOMException('Access denied', 'SecurityError')
      })
      const { useIsFavorite } = await loadStore()

      expect(renderHook(() => useIsFavorite(1)).result.current).toBe(false)
    })

    it('keeps favorites in memory when localStorage rejects writes', async () => {
      const { toggleFavorite, useIsFavorite } = await loadStore()
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('Quota exceeded', 'QuotaExceededError')
      })
      const { result } = renderHook(() => useIsFavorite(1))

      expect(() => act(() => toggleFavorite(1))).not.toThrow()
      expect(result.current).toBe(true)
    })
  })
})
