import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { User } from '@/entities/user/index.ts'
import { UsersTabs } from './UsersTabs.tsx'

const users: User[] = [
  { id: 1, name: 'Leanne Graham', email: 'Sincere@april.biz', company: { name: 'Romaguera-Crona' } },
  { id: 2, name: 'Ervin Howell', email: 'Shanna@melissa.tv', company: { name: 'Deckow-Crist' } },
]

describe('UsersTabs', () => {
  it('shows only the users starred in the All tab under Favourite', async () => {
    const user = userEvent.setup()
    render(<UsersTabs users={users} />)

    await user.click(screen.getByRole('button', { name: 'Favorite Ervin Howell' }))
    expect(localStorage.getItem('favoriteUserIds')).toBe('[2]')

    await user.click(screen.getByRole('tab', { name: 'Favourite (1)' }))
    const panel = screen.getByRole('tabpanel')
    expect(within(panel).getByText('Ervin Howell')).toBeInTheDocument()
    expect(within(panel).queryByText('Leanne Graham')).not.toBeInTheDocument()

    await user.click(within(panel).getByRole('button', { name: 'Favorite Ervin Howell' }))
    expect(within(panel).getByText('No favourite users yet')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Favourite (0)' })).toBeInTheDocument()
  })
})
