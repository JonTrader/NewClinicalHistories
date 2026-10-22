import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithRouter } from './helpers/renderWithRouter.jsx'
import Register from '../pages/Register.jsx'

vi.mock('../store/AuthStore.js', () => ({
  useAuthStore: vi.fn(),
}))

import { useAuthStore } from '../store/AuthStore.js'

describe('Register', () => {
  const register = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.mockReturnValue({
      register,
      isRegistering: false,
    })
  })

  it('submits full form payload to register', () => {
    renderWithRouter(<Register />)

    fireEvent.change(screen.getByPlaceholderText('First Name'), {
      target: { value: 'Ana' },
    })
    fireEvent.change(screen.getByPlaceholderText('Last Name'), {
      target: { value: 'Lopez' },
    })
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'ana@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'secret1' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Register' }))

    expect(register).toHaveBeenCalledWith({
      firstName: 'Ana',
      lastName: 'Lopez',
      email: 'ana@example.com',
      password: 'secret1',
    })
  })

  it('disables the button and drops Register name while loading', () => {
    useAuthStore.mockReturnValue({
      register,
      isRegistering: true,
    })

    renderWithRouter(<Register />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(
      screen.queryByRole('button', { name: 'Register' })
    ).not.toBeInTheDocument()
  })

  it('links to login', () => {
    renderWithRouter(<Register />)

    expect(
      screen.getByRole('link', { name: /Already have an account\? Login/i })
    ).toHaveAttribute('href', '/login')
  })
})
