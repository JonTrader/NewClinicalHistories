import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { Route } from 'react-router'
import { renderWithRouter } from './helpers/renderWithRouter.jsx'
import Evolution from '../pages/Evolution.jsx'

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

vi.mock('../store/EvolutionStore.js', () => ({
  useEvolutionStore: vi.fn(),
}))

import { useEvolutionStore } from '../store/EvolutionStore.js'

const updateEvolution = vi.fn()

function mockEvolutionStore(overrides = {}) {
  useEvolutionStore.mockReturnValue({
    updateEvolution,
    isUpdatingEvolution: false,
    ...overrides,
  })
}

function renderEvolution() {
  return renderWithRouter(null, {
    initialEntries: ['/evolution/p1'],
    routes: <Route path="/evolution/:id" element={<Evolution />} />,
  })
}

async function loadEvolution(data) {
  mocks.ax.get.mockResolvedValueOnce({ data: [data] })
  renderEvolution()
  await waitFor(() => {
    expect(screen.queryByLabelText('Cargando')).not.toBeInTheDocument()
  })
  expect(mocks.ax.get).toHaveBeenCalledWith('/api/v1/evolutions/p1')
}

describe('Evolution', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.resetAxiosMock()
    mocks.toast.resetToastMock()
    mockEvolutionStore()
  })

  it('toasts and does not update on blank submit', async () => {
    await loadEvolution({ update: [] })

    fireEvent.click(screen.getByRole('button', { name: 'Agregar nota' }))

    expect(mocks.toast.error).toHaveBeenCalledWith(
      'El texto de la evolución es requerido'
    )
    expect(updateEvolution).not.toHaveBeenCalled()
  })

  it('disables Resumir con IA when updates.length <= 1', async () => {
    await loadEvolution({
      update: [{ body: 'Solo una', createdAt: '2026-01-01T00:00:00.000Z' }],
    })

    expect(
      screen.getByRole('button', { name: /Resumir con IA/i })
    ).toBeDisabled()
  })

  it('disables Resumir con IA when summary is up to date (string dates)', async () => {
    const lastAt = '2026-02-01T12:00:00.000Z'
    await loadEvolution({
      update: [
        { body: 'Primera', createdAt: '2026-01-01T00:00:00.000Z' },
        { body: 'Segunda', createdAt: lastAt },
      ],
      summary: {
        summary: 'Ya resumido',
        dateOfLastEvolution: lastAt,
      },
    })

    expect(
      screen.getByRole('button', { name: /Resumir con IA/i })
    ).toBeDisabled()
  })

  it('enables summary with 2+ notes not up-to-date and posts AI summary', async () => {
    mocks.ax.post.mockResolvedValueOnce({ data: 'Resumen IA' })
    await loadEvolution({
      update: [
        { body: 'Nota uno', createdAt: '2026-01-01T00:00:00.000Z' },
        { body: 'Nota dos', createdAt: '2026-02-01T00:00:00.000Z' },
      ],
      summary: {
        summary: 'Viejo',
        dateOfLastEvolution: '2026-01-01T00:00:00.000Z',
      },
    })

    const summaryBtn = screen.getByRole('button', { name: /Resumir con IA/i })
    expect(summaryBtn).toBeEnabled()

    fireEvent.click(summaryBtn)

    await waitFor(() => {
      expect(mocks.ax.post).toHaveBeenCalledWith('/api/v1/ai/summary/p1', {
        text: '1. Nota uno\n2. Nota dos',
      })
    })
  })

  it('Generar con IA posts formData; blank keywords toast', async () => {
    await loadEvolution({ update: [] })

    fireEvent.click(screen.getByRole('button', { name: /Generar con IA/i }))

    expect(mocks.toast.error).toHaveBeenCalledWith(
      'Escribe una nota para generar la evolución'
    )
    expect(mocks.ax.post).not.toHaveBeenCalled()

    mocks.ax.post.mockResolvedValueOnce({ data: 'Texto generado' })
    const note = screen.getByRole('textbox')
    fireEvent.change(note, { target: { value: 'dolor molar' } })

    fireEvent.click(screen.getByRole('button', { name: /Generar con IA/i }))

    await waitFor(() => {
      expect(mocks.ax.post).toHaveBeenCalledWith('/api/v1/ai/evolution', {
        body: 'dolor molar',
      })
    })
  })

  it('shows empty history UI when update is empty', async () => {
    await loadEvolution({ update: [] })

    expect(
      screen.getByText('Sin evoluciones registradas')
    ).toBeInTheDocument()
  })
})
