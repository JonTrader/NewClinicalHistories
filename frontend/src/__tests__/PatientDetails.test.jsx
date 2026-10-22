import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { Route } from 'react-router'
import { renderWithRouter } from './helpers/renderWithRouter.jsx'
import PatientDetails from '../pages/PatientDetails.jsx'

const mocks = vi.hoisted(() => ({
  ax: null,
  resetAxiosMock: null,
  toast: null,
}))

vi.mock('../lib/axios.js', async () => {
  const { createAxiosMock } = await import('./helpers/axios.js')
  const created = createAxiosMock()
  mocks.ax = created.ax
  mocks.resetAxiosMock = created.resetAxiosMock
  return { ax: created.ax }
})

vi.mock('react-hot-toast', async () => {
  const { createToastMock } = await import('./helpers/toast.js')
  const toast = createToastMock()
  mocks.toast = toast
  return {
    default: toast,
    Toaster: () => null,
  }
})

vi.mock('../store/PatientStore.js', () => ({
  usePatientStore: vi.fn(),
}))

import { usePatientStore } from '../store/PatientStore.js'

const updatePatient = vi.fn()
const deletePatient = vi.fn()

function mockPatientStore(overrides = {}) {
  usePatientStore.mockReturnValue({
    updatePatient,
    deletePatient,
    isEditingPatient: false,
    isDeletingPatient: false,
    ...overrides,
  })
}

const patientFixture = {
  _id: 'p1',
  firstName: 'Ana',
  lastName: 'Lopez',
  email: 'ana@example.com',
  contactNumber: 3001234567,
  dob: '1990-01-15',
  gender: 'Mujer',
  idType: 'C.C',
  idNumber: 123456,
  civilStatus: 'Soltero',
  address: 'Calle 1',
  birthPlace: 'Bogota',
  epsName: 'Sura',
  epsType: 'Contributivo',
  bloodType: 'O+',
  emergencyContactName: 'Luis',
  emergencyContactNumber: 3007654321,
  emergencyContactRelationship: 'Padre',
  motive: 'Control',
  medicalHistoryQuestions: Array.from({ length: 22 }, () => ''),
  dentalHistoryQuestions: ['', ''],
}

function renderDetails() {
  return renderWithRouter(null, {
    initialEntries: ['/details/p1'],
    routes: <Route path="/details/:id" element={<PatientDetails />} />,
  })
}

async function loadPatient(data = patientFixture) {
  mocks.ax.get.mockResolvedValueOnce({ data })
  renderDetails()
  await waitFor(() => {
    expect(screen.queryByLabelText('Cargando')).not.toBeInTheDocument()
  })
  expect(mocks.ax.get).toHaveBeenCalledWith('/api/v1/patients/p1')
}

describe('PatientDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.resetAxiosMock()
    mocks.toast.resetToastMock()
    mockPatientStore()
  })

  it('shows patient name and age badge', async () => {
    await loadPatient()

    expect(screen.getByText('Ana Lopez')).toBeInTheDocument()
    expect(screen.getByText(/años/)).toBeInTheDocument()
  })

  it('edit toggles disabled fields', async () => {
    await loadPatient()

    const firstName = screen.getByDisplayValue('Ana')
    expect(firstName).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: 'Editar paciente' }))

    expect(firstName).not.toBeDisabled()
    expect(
      screen.getByRole('button', { name: 'Dejar de editar' })
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Dejar de editar' }))
    expect(firstName).toBeDisabled()
  })

  it('delete opens ConfirmModal', async () => {
    await loadPatient()

    expect(screen.queryByText('Confirmar eliminación')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar paciente' }))

    expect(screen.getByText('Confirmar eliminación')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
  })
})
