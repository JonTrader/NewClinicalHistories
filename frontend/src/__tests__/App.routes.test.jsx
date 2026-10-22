import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithRouter } from './helpers/renderWithRouter.jsx'
import App from '../App.jsx'

vi.mock('../store/AuthStore.js', () => ({
  useAuthStore: vi.fn(),
}))

vi.mock('../store/PatientStore.js', () => ({
  usePatientStore: vi.fn(),
}))

import { useAuthStore } from '../store/AuthStore.js'
import { usePatientStore } from '../store/PatientStore.js'

function mockAuth(overrides = {}) {
  useAuthStore.mockReturnValue({
    authUser: null,
    isCheckingAuth: false,
    checkAuth: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    isLoggingIn: false,
    isRegistering: false,
    isLoggingOut: false,
    ...overrides,
  })
}

function mockPatients(overrides = {}) {
  usePatientStore.mockReturnValue({
    patients: [],
    getAllPatients: vi.fn(),
    isPatientsLoading: false,
    currentPage: 1,
    totalPages: 1,
    total: 0,
    setPage: vi.fn(),
    ...overrides,
  })
}

describe('App routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPatients()
  })

  it('shows PageLoader while checking auth', () => {
    mockAuth({ isCheckingAuth: true, authUser: null })

    renderWithRouter(<App />, { initialEntries: ['/'] })

    expect(screen.getByLabelText('Cargando')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Login' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Pacientes' })).not.toBeInTheDocument()
  })

  it('anonymous user at / ends on Login', async () => {
    mockAuth({ authUser: null, isCheckingAuth: false })

    renderWithRouter(<App />, { initialEntries: ['/'] })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
    })
  })

  it('anonymous user at /register stays on Register', () => {
    mockAuth({ authUser: null, isCheckingAuth: false })

    renderWithRouter(<App />, { initialEntries: ['/register'] })

    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Login' })).not.toBeInTheDocument()
  })

  it('anonymous user at protected path ends on Login', async () => {
    mockAuth({ authUser: null, isCheckingAuth: false })

    renderWithRouter(<App />, { initialEntries: ['/odontogram/1'] })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
    })
  })

  it('authenticated user at /login redirects to Patients', async () => {
    mockAuth({
      authUser: { _id: 'u1', email: 'doc@example.com' },
      isCheckingAuth: false,
    })

    renderWithRouter(<App />, { initialEntries: ['/login'] })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument()
    })
    expect(screen.queryByRole('button', { name: 'Login' })).not.toBeInTheDocument()
  })

  it('authenticated user at /register redirects to Patients', async () => {
    mockAuth({
      authUser: { _id: 'u1', email: 'doc@example.com' },
      isCheckingAuth: false,
    })

    renderWithRouter(<App />, { initialEntries: ['/register'] })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument()
    })
    expect(screen.queryByRole('button', { name: 'Register' })).not.toBeInTheDocument()
  })

  it('authenticated user at / shows Patients area', () => {
    mockAuth({
      authUser: { _id: 'u1', email: 'doc@example.com' },
      isCheckingAuth: false,
    })

    renderWithRouter(<App />, { initialEntries: ['/'] })

    expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Crear primer paciente/i })).toBeInTheDocument()
  })

  it('wildcard with authenticated user lands on Patients', async () => {
    mockAuth({
      authUser: { _id: 'u1', email: 'doc@example.com' },
      isCheckingAuth: false,
    })

    renderWithRouter(<App />, { initialEntries: ['/unknown-path'] })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument()
    })
  })

  it('wildcard without user lands on Login', async () => {
    mockAuth({ authUser: null, isCheckingAuth: false })

    renderWithRouter(<App />, { initialEntries: ['/unknown-path'] })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
    })
  })
})
