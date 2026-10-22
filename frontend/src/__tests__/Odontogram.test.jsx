import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { Route } from 'react-router'
import { renderWithRouter } from './helpers/renderWithRouter.jsx'
import Odontogram from '../pages/Odontogram.jsx'
import { tejidosBlandos, problemas } from '../lib/patientHelper.js'

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

vi.mock('../store/Odontogram.js', () => ({
  useOdontogramStore: vi.fn(),
}))

import { useOdontogramStore } from '../store/Odontogram.js'

const updateOdontogram = vi.fn()

function mockOdontogramStore(overrides = {}) {
  useOdontogramStore.mockReturnValue({
    updateOdontogram,
    isUpdatingOdontogram: false,
    ...overrides,
  })
}

const odontogramFixture = {
  _id: 'odo1',
  patient: 'p1',
  teeth: [
    { number: 18, description: '' },
    { number: 17, description: 'caries' },
  ],
  tejidosBlandos: Array.from({ length: tejidosBlandos.length }, () => false),
  problemas: Array.from({ length: problemas.length }, () => ''),
}

function renderOdontogram() {
  return renderWithRouter(null, {
    initialEntries: ['/odontogram/p1'],
    routes: <Route path="/odontogram/:id" element={<Odontogram />} />,
  })
}

async function loadOdontogram(data = odontogramFixture) {
  mocks.ax.get.mockResolvedValueOnce({ data: [data] })
  renderOdontogram()
  await waitFor(() => {
    expect(screen.queryByLabelText('Cargando')).not.toBeInTheDocument()
  })
  expect(mocks.ax.get).toHaveBeenCalledWith('/api/v1/odontograms/p1')
}

describe('Odontogram', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.resetAxiosMock()
    mocks.toast.resetToastMock()
    mockOdontogramStore()
  })

  it('edits a tooth description, flips soft-tissue radio, and saves', async () => {
    await loadOdontogram()

    const tooth18 = screen.getByText('18').parentElement.querySelector('input')
    fireEvent.change(tooth18, { target: { value: 'obturacion' } })
    expect(tooth18).toHaveValue('obturacion')

    const firstSi = document.querySelector(
      'input[name="tejido-0"][value="true"]'
    )
    expect(firstSi).not.toBeChecked()
    fireEvent.click(firstSi)
    expect(firstSi).toBeChecked()

    fireEvent.click(screen.getByRole('button', { name: 'Guardar odontograma' }))

    expect(updateOdontogram).toHaveBeenCalledTimes(1)
    const [id, payload] = updateOdontogram.mock.calls[0]
    expect(id).toBe('p1')
    expect(payload.teeth[0].description).toBe('obturacion')
    expect(payload.tejidosBlandos[0]).toBe(true)
  })
})
