import { Star } from 'lucide-react'
import type { User } from '@/entities/user/index.ts'
import { cn } from '@/shared/lib/utils.ts'
import { toggleFavorite, useIsFavorite } from '../model/favorites.ts'

type FavoriteButtonProps = {
  user: User
}

export function FavoriteButton({ user }: FavoriteButtonProps) {
  const isFavorite = useIsFavorite(user.id)

  return (
    <button
      type="button"
      aria-label={`Favorite ${user.name}`}
      aria-pressed={isFavorite}
      onClick={() => toggleFavorite(user.id)}
      className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <Star
        className={cn('size-5', isFavorite && 'fill-amber-400 text-amber-400')}
      />
    </button>
  )
}
