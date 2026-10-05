import { UsersTable, type User } from '@/entities/user/index.ts'
import {
  FavoriteButton,
  useFavoriteIds,
} from '@/features/toggle-favorite/index.ts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs.tsx'

type UsersTabsProps = {
  users: User[]
  loading?: boolean
  error?: Error
}

const TRIGGER_CLASS =
  'h-11 flex-none px-6 text-sm font-semibold tracking-wide uppercase data-active:text-emerald-800 after:bg-emerald-800 dark:data-active:text-emerald-400 dark:after:bg-emerald-400'

const favoriteAction = {
  label: 'Favorite',
  render: (user: User) => <FavoriteButton user={user} />,
}

export function UsersTabs({ users, loading = false, error }: UsersTabsProps) {
  const favoriteIds = useFavoriteIds()
  const favoriteUsers = users.filter((user) => favoriteIds.includes(user.id))
  const showCounts = !loading && !error

  return (
    <Tabs defaultValue="all" className="gap-4">
      <TabsList variant="line" className="h-auto">
        <TabsTrigger value="all" className={TRIGGER_CLASS}>
          All{showCounts && ` (${users.length})`}
        </TabsTrigger>
        <TabsTrigger value="favorite" className={TRIGGER_CLASS}>
          Favourite{showCounts && ` (${favoriteUsers.length})`}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <UsersTable
          title="All users"
          description="User list"
          users={users}
          loading={loading}
          error={error}
          action={favoriteAction}
        />
      </TabsContent>
      <TabsContent value="favorite">
        <UsersTable
          title="Favourites"
          description="Saved users"
          users={favoriteUsers}
          loading={loading}
          error={error}
          emptyMessage="No favourite users yet"
          action={favoriteAction}
        />
      </TabsContent>
    </Tabs>
  )
}
