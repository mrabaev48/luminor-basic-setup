import { url } from '@/shared/lib/constatnts.ts'
import type { User } from '../model/types.ts'

// json-server treats `_like` values as a case-insensitive RegExp, so user input must be escaped.
function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export async function getUsers(
  query: string,
  signal?: AbortSignal,
): Promise<User[]> {
  const requestUrl = new URL(url)
  if (query) {
    requestUrl.searchParams.set('name_like', escapeRegExp(query))
  }

  const response = await fetch(requestUrl, { signal })
  if (!response.ok) {
    throw new Error(`Failed to load users: ${response.status}`)
  }
  return response.json()
}
