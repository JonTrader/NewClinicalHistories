import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { PatientSearchDropdown } from '../components/PatientSearchDropdown.jsx'

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

const patients = [
  { _id: 'p1', firstName: 'Ana', lastName: 'Lopez', idType: 'CC', idNumber: '1' },
  { _id: 'p2', firstName: 'Bruno', lastName: 'Diaz', idType: 'CC', idNumber: '2' },
]

async function typeQuery(input, value) {
  fireEvent.change(input, { target: { value } })
}

async function flushDebounceAndRequest(ms = 300) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms)
  })
}

describe('PatientSearchDropdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mocks.resetAxiosMock()
    mocks.toast.resetToastMock()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('does not search when query is under 2 characters', async () => {
    render(<PatientSearchDropdown onSelect={vi.fn()} />)
    const input = screen.getByPlaceholderText('Buscar paciente...')

    await typeQuery(input, 'a')
    await flushDebounceAndRequest(300)

    expect(mocks.ax.get).not.toHaveBeenCalled()
  })

  it('GETs search after debounce when query has 2+ characters', async () => {
    mocks.ax.get.mockResolvedValueOnce({ data: patients })

    render(<PatientSearchDropdown onSelect={vi.fn()} />)
    const input = screen.getByPlaceholderText('Buscar paciente...')

    await typeQuery(input, 'an')
    expect(mocks.ax.get).not.toHaveBeenCalled()

    await flushDebounceAndRequest(300)

    expect(mocks.ax.get).toHaveBeenCalledWith('/api/v1/patients/search', {
      params: { q: 'an' },
      signal: expect.any(AbortSignal),
    })
    expect(screen.getByText('Ana Lopez')).toBeInTheDocument()
  })

  it('calls onSelect with patient id when a result is clicked', async () => {
    const onSelect = vi.fn()
    mocks.ax.get.mockResolvedValueOnce({ data: patients })

    render(<PatientSearchDropdown onSelect={onSelect} />)
    const input = screen.getByPlaceholderText('Buscar paciente...')

    await typeQuery(input, 'an')
    await flushDebounceAndRequest(300)

    fireEvent.click(screen.getByText('Ana Lopez'))

    expect(onSelect).toHaveBeenCalledWith('p1')
    expect(input).toHaveValue('')
  })

  it('selects active result with ArrowDown then Enter', async () => {
    const onSelect = vi.fn()
    mocks.ax.get.mockResolvedValueOnce({ data: patients })

    render(<PatientSearchDropdown onSelect={onSelect} />)
    const input = screen.getByPlaceholderText('Buscar paciente...')

    await typeQuery(input, 'an')
    await flushDebounceAndRequest(300)

    // Results set activeIndex to 0; ArrowDown moves to next item.
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onSelect).toHaveBeenCalledWith('p2')
  })

  it('closes the dropdown on Escape', async () => {
    mocks.ax.get.mockResolvedValueOnce({ data: patients })

    render(<PatientSearchDropdown onSelect={vi.fn()} />)
    const input = screen.getByPlaceholderText('Buscar paciente...')

    await typeQuery(input, 'an')
    await flushDebounceAndRequest(300)

    expect(screen.getByRole('listbox')).toBeInTheDocument()

    fireEvent.keyDown(input, { key: 'Escape' })

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('does not toast on CanceledError', async () => {
    const canceled = new Error('canceled')
    canceled.name = 'CanceledError'
    mocks.ax.get.mockRejectedValueOnce(canceled)

    render(<PatientSearchDropdown onSelect={vi.fn()} />)
    const input = screen.getByPlaceholderText('Buscar paciente...')

    await typeQuery(input, 'an')
    await flushDebounceAndRequest(300)

    expect(mocks.toast.error).not.toHaveBeenCalled()
  })

  it('does not toast on AbortError', async () => {
    const aborted = new Error('aborted')
    aborted.name = 'AbortError'
    mocks.ax.get.mockRejectedValueOnce(aborted)

    render(<PatientSearchDropdown onSelect={vi.fn()} />)
    const input = screen.getByPlaceholderText('Buscar paciente...')

    await typeQuery(input, 'an')
    await flushDebounceAndRequest(300)

    expect(mocks.toast.error).not.toHaveBeenCalled()
  })

  it('toasts and shows empty results on other errors', async () => {
    mocks.ax.get.mockRejectedValueOnce({
      name: 'Error',
      response: { data: { message: 'Search failed' } },
    })

    render(<PatientSearchDropdown onSelect={vi.fn()} />)
    const input = screen.getByPlaceholderText('Buscar paciente...')

    await typeQuery(input, 'an')
    await flushDebounceAndRequest(300)

    expect(mocks.toast.error).toHaveBeenCalledWith('Search failed')
    expect(screen.getByText('Sin resultados')).toBeInTheDocument()
  })

  it('uses fallback toast when error has no message', async () => {
    mocks.ax.get.mockRejectedValueOnce({ name: 'Error' })

    render(<PatientSearchDropdown onSelect={vi.fn()} />)
    const input = screen.getByPlaceholderText('Buscar paciente...')

    await typeQuery(input, 'an')
    await flushDebounceAndRequest(300)

    expect(mocks.toast.error).toHaveBeenCalledWith(
      'Problema al buscar pacientes'
    )
  })
})
