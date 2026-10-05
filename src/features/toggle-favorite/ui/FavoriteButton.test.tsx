import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { User } from '@/entities/user/index.ts'
import { FavoriteButton } from './FavoriteButton.tsx'

function makeUser(id: number, name: string): User {
  return { id, name, email: `${id}@example.com`, company: { name: 'Acme' } }
}

describe('FavoriteButton', () => {
  it('toggles its own user on click and leaves other users untouched', async () => {
    const user = userEvent.setup()
    render(
      <>
        <FavoriteButton user={makeUser(1, 'Leanne Graham')} />
        <FavoriteButton user={makeUser(2, 'Ervin Howell')} />
      </>,
    )
    const leanne = screen.getByRole('button', { name: 'Favorite Leanne Graham' })
    const ervin = screen.getByRole('button', { name: 'Favorite Ervin Howell' })
    expect(leanne).toHaveAttribute('aria-pressed', 'false')

    await user.click(leanne)
    expect(leanne).toHaveAttribute('aria-pressed', 'true')
    expect(ervin).toHaveAttribute('aria-pressed', 'false')

    await user.click(leanne)
    expect(leanne).toHaveAttribute('aria-pressed', 'false')
  })
})
