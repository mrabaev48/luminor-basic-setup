import { useState } from 'react'
import { useUsers } from '@/entities/user/index.ts'
import { UserSearch } from '@/features/search-users/index.ts'
import { useDebounce } from '@/shared/lib/hooks/useDebounce.ts'
import { UsersTabs } from '@/widgets/users-tabs/index.ts'

const SEARCH_DELAY_MS = 300

function App() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search.trim(), SEARCH_DELAY_MS)
  const state = useUsers(debouncedSearch)

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-4 p-4 sm:p-8">
      <UserSearch value={search} onChange={setSearch} />
      <UsersTabs
        users={state.status === 'success' ? state.users : []}
        loading={state.status === 'loading'}
        error={state.status === 'error' ? state.error : undefined}
      />
    </main>
  )
}

export default App
