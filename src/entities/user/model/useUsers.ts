import { useEffect, useState } from 'react'
import { getUsers } from '../api/getUsers.ts'
import type { User } from './types.ts'

type UsersState =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; users: User[] }

type LoadedState = Exclude<UsersState, { status: 'loading' }> & {
  query: string
}

export function useUsers(query = ''): UsersState {
  const [loaded, setLoaded] = useState<LoadedState | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    getUsers(query, controller.signal)
      .then((users) => setLoaded({ status: 'success', users, query }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setLoaded({
          status: 'error',
          error: error instanceof Error ? error : new Error(String(error)),
          query,
        })
      })

    return () => controller.abort()
  }, [query])

  // Results tagged with an older query are stale: report loading instead of resetting state inside the effect.
  return loaded?.query === query ? loaded : { status: 'loading' }
}
