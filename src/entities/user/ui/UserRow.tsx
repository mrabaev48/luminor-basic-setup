import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils.ts'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar.tsx'
import { TableCell, TableRow } from '@/shared/ui/table.tsx'
import type { User } from '../model/types.ts'

const AVATAR_COLORS = [
  'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
]

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

type UserRowProps = {
  user: User
  action?: ReactNode
}

export function UserRow({ user, action }: UserRowProps) {
  return (
    <TableRow>
      <TableCell className="px-5 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="after:border-transparent">
            {/* Keyed by id, not row index, so a user keeps their color wherever the row is rendered. */}
            <AvatarFallback
              className={cn(
                'text-xs font-semibold',
                AVATAR_COLORS[user.id % AVATAR_COLORS.length],
              )}
            >
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-base text-foreground">{user.name}</span>
        </div>
      </TableCell>
      <TableCell className="px-5 py-4 text-muted-foreground">
        {user.email}
      </TableCell>
      <TableCell className="px-5 py-4 text-foreground/80">
        {user.company.name}
      </TableCell>
      {action && <TableCell className="px-5 py-4 text-right">{action}</TableCell>}
    </TableRow>
  )
}
