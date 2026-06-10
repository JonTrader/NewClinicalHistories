import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router'
import App from '../App.jsx'

vi.mock('../store/AuthStore.js', () => ({
  useAuthStore: vi.fn(() => ({
    authUser: null,
    isCheckingAuth: false,
    checkAuth: vi.fn(),
  })),
}))

describe('App', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })
})
