import { describe, expect, it, vi } from 'vitest'
import { getUsers } from './getUsers.ts'

function stubFetch() {
  const fetchMock = vi.fn(async () => Response.json([]))
  vi.stubGlobal('fetch', fetchMock)
  return () => String((fetchMock.mock.calls[0] as unknown[])[0])
}

describe('getUsers', () => {
  it('requests all users when the query is empty', async () => {
    const requestedUrl = stubFetch()
    await getUsers('')
    expect(requestedUrl()).toBe('https://jsonplaceholder.typicode.com/users')
  })

  it('filters by name with regex characters escaped', async () => {
    const requestedUrl = stubFetch()
    await getUsers('Mrs. (')
    expect(new URL(requestedUrl()).searchParams.get('name_like')).toBe('Mrs\\. \\(')
  })
})
