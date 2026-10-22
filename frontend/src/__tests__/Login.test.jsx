import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithRouter } from './helpers/renderWithRouter.jsx'
import Login from '../pages/Login.jsx'

vi.mock('../store/AuthStore.js', () => ({
  useAuthStore: vi.fn(),
}))

import { useAuthStore } from '../store/AuthStore.js'

describe('Login', () => {
  const login = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.mockReturnValue({
      login,
      isLoggingIn: false,
    })
  })

  it('submits email and password to login', () => {
    renderWithRouter(<Login />)

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'doc@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'secret1' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Login' }))

    expect(login).toHaveBeenCalledWith({
      email: 'doc@example.com',
      password: 'secret1',
    })
  })

  it('disables the button and drops Login name while loading', () => {
    useAuthStore.mockReturnValue({
      login,
      isLoggingIn: true,
    })

    renderWithRouter(<Login />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(
      screen.queryByRole('button', { name: 'Login' })
    ).not.toBeInTheDocument()
  })

  it('links to register', () => {
    renderWithRouter(<Login />)

    expect(
      screen.getByRole('link', { name: /Don't have an account\? Register/i })
    ).toHaveAttribute('href', '/register')
  })
})
