import { CircleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils.ts'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert.tsx'
import { Badge } from '@/shared/ui/badge.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card.tsx'
import { Skeleton } from '@/shared/ui/skeleton.tsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table.tsx'
import type { User } from '../model/types.ts'
import { UserRow } from './UserRow.tsx'

const SKELETON_ROWS = 5
const COLUMNS = ['Name', 'Email', 'Company']

function UserRowSkeleton({ withAction }: { withAction: boolean }) {
  return (
    <TableRow>
      <TableCell className="px-5 py-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-4 w-36" />
        </div>
      </TableCell>
      <TableCell className="px-5 py-4">
        <Skeleton className="h-4 w-40" />
      </TableCell>
      <TableCell className="px-5 py-4">
        <Skeleton className="h-4 w-32" />
      </TableCell>
      {withAction && (
        <TableCell className="px-5 py-4">
          <Skeleton className="ml-auto size-5" />
        </TableCell>
      )}
    </TableRow>
  )
}

type UsersTableProps = {
  title: string
  description: string
  users: User[]
  loading?: boolean
  error?: Error
  emptyMessage?: string
  action?: {
    label: string
    render: (user: User) => ReactNode
  }
}

const HEAD_CLASS =
  'h-12 px-5 text-xs font-medium tracking-wider text-muted-foreground uppercase'

export function UsersTable({
  title,
  description,
  users,
  loading = false,
  error,
  emptyMessage = 'No users',
  action,
}: UsersTableProps) {
  const columnCount = COLUMNS.length + (action ? 1 : 0)

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex items-center gap-2 border-b py-4">
        <CardTitle className="text-lg font-normal">{title}</CardTitle>
        {!loading && !error && (
          <Badge variant="secondary">{users.length}</Badge>
        )}
        <CardDescription className="text-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {error ? (
          <div className="p-4">
            <Alert variant="destructive">
              <CircleAlert />
              <AlertTitle>Could not load users</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                {COLUMNS.map((column) => (
                  <TableHead key={column} className={HEAD_CLASS}>
                    {column}
                  </TableHead>
                ))}
                {action && (
                  <TableHead className={cn(HEAD_CLASS, 'text-right')}>
                    {action.label}
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: SKELETON_ROWS }, (_, row) => (
                  <UserRowSkeleton key={row} withAction={!!action} />
                ))
              ) : users.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={columnCount}
                    className="px-5 py-10 text-center text-muted-foreground"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    action={action?.render(user)}
                  />
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
