import { Search } from 'lucide-react'
import { Input } from '@/shared/ui/input.tsx'

type UserSearchProps = {
  value: string
  onChange: (value: string) => void
}

export function UserSearch({ value, onChange }: UserSearchProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        aria-label="Search users"
        placeholder="Search by name..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 pl-9"
      />
    </div>
  )
}
