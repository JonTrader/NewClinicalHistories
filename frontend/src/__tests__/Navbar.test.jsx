import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithRouter } from './helpers/renderWithRouter.jsx'
import Navbar from '../components/Navbar.jsx'

vi.mock('../store/AuthStore.js', () => ({
  useAuthStore: vi.fn(),
}))

import { useAuthStore } from '../store/AuthStore.js'

describe('Navbar', () => {
  const logout = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.mockReturnValue({ logout })
  })

  it('calls logout when Cerrar sesión is clicked', () => {
    renderWithRouter(<Navbar />)

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))

    expect(logout).toHaveBeenCalledTimes(1)
  })

  it('renders Pacientes and profile links', () => {
    renderWithRouter(<Navbar />)

    expect(screen.getByRole('link', { name: 'Pacientes' })).toHaveAttribute(
      'href',
      '/'
    )
    expect(screen.getByTitle('Configuración')).toHaveAttribute(
      'href',
      '/profile'
    )
  })
})
