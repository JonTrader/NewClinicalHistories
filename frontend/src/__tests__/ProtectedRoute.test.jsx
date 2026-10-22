import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { Route, useLocation } from 'react-router'
import { renderWithRouter } from './helpers/renderWithRouter.jsx'
import ProtectedRoute from '../components/ProtectedRoute.jsx'

function LoginProbe() {
  const location = useLocation()
  return (
    <div>
      <span>Login page</span>
      <span data-testid="from-pathname">{location.state?.from?.pathname ?? ''}</span>
    </div>
  )
}

function SecretPage() {
  return <div>Secret content</div>
}

describe('ProtectedRoute', () => {
  it('redirects null user to /login and preserves location.state.from', () => {
    renderWithRouter(null, {
      initialEntries: ['/secret'],
      routes: (
        <>
          <Route element={<ProtectedRoute user={null} />}>
            <Route path="/secret" element={<SecretPage />} />
          </Route>
          <Route path="/login" element={<LoginProbe />} />
        </>
      ),
    })

    expect(screen.getByText('Login page')).toBeInTheDocument()
    expect(screen.queryByText('Secret content')).not.toBeInTheDocument()
    expect(screen.getByTestId('from-pathname')).toHaveTextContent('/secret')
  })

  it('renders Outlet child when user is present', () => {
    renderWithRouter(null, {
      initialEntries: ['/secret'],
      routes: (
        <>
          <Route element={<ProtectedRoute user={{ _id: 'u1' }} />}>
            <Route path="/secret" element={<SecretPage />} />
          </Route>
          <Route path="/login" element={<LoginProbe />} />
        </>
      ),
    })

    expect(screen.getByText('Secret content')).toBeInTheDocument()
    expect(screen.queryByText('Login page')).not.toBeInTheDocument()
  })
})
