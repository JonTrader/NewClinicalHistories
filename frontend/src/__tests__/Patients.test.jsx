import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithRouter } from './helpers/renderWithRouter.jsx'
import Patients from '../pages/Patients.jsx'

vi.mock('../store/AuthStore.js', () => ({
  useAuthStore: vi.fn(),
}))

vi.mock('../store/PatientStore.js', () => ({
  usePatientStore: vi.fn(),
}))

vi.mock('../components/PatientSearchDropdown.jsx', () => ({
  PatientSearchDropdown: () => (
    <div data-testid="patient-search-dropdown" />
  ),
}))

import { useAuthStore } from '../store/AuthStore.js'
import { usePatientStore } from '../store/PatientStore.js'

function mockAuth(overrides = {}) {
  useAuthStore.mockReturnValue({
    authUser: { _id: 'u1', email: 'doc@example.com' },
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

describe('Patients', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuth()
  })

  it('shows TableSkeleton while loading', () => {
    mockPatients({ isPatientsLoading: true })

    const { container } = renderWithRouter(<Patients />)

    expect(container.querySelectorAll('.skeleton').length).toBeGreaterThan(0)
    expect(
      screen.queryByText('No hay pacientes registrados')
    ).not.toBeInTheDocument()
  })

  it('shows empty-state create CTA linking to /new', () => {
    mockPatients({ patients: [], isPatientsLoading: false, total: 0 })

    renderWithRouter(<Patients />)

    expect(
      screen.getByText('No hay pacientes registrados')
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Crear primer paciente/i })
    ).toHaveAttribute('href', '/new')
  })

  it('renders patient row links to details, odontogram, and evolution', () => {
    mockPatients({
      patients: [
        {
          _id: 'abc123',
          firstName: 'Ana',
          lastName: 'Lopez',
          idType: 'CC',
          idNumber: '123',
        },
      ],
      isPatientsLoading: false,
      total: 1,
      totalPages: 1,
    })

    renderWithRouter(<Patients />)

    expect(screen.getByText('Ana Lopez')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Ver detalles del paciente' })
    ).toHaveAttribute('href', '/details/abc123')
    expect(
      screen.getByRole('link', { name: 'Modificar odontograma' })
    ).toHaveAttribute('href', '/odontogram/abc123')
    expect(
      screen.getByRole('link', { name: 'Agregar evolución' })
    ).toHaveAttribute('href', '/evolution/abc123')
  })

  it('calls setPage when pagination page is clicked', () => {
    const setPage = vi.fn()
    mockPatients({
      patients: [
        {
          _id: 'p1',
          firstName: 'Ana',
          lastName: 'Lopez',
        },
      ],
      isPatientsLoading: false,
      currentPage: 1,
      totalPages: 3,
      total: 45,
      setPage,
    })

    renderWithRouter(<Patients />)

    fireEvent.click(screen.getByLabelText('Ir a página 2'))
    expect(setPage).toHaveBeenCalledWith(2)
  })

  it('calls getAllPatients on mount', () => {
    const getAllPatients = vi.fn()
    mockPatients({ getAllPatients })

    renderWithRouter(<Patients />)

    expect(getAllPatients).toHaveBeenCalled()
  })
})
