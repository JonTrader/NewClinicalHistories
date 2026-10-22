import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ConfirmModal from '../components/ConfirmModal.jsx'

describe('ConfirmModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <ConfirmModal
        isOpen={false}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
        isLoading={false}
      />
    )

    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByText('Confirmar eliminación')).not.toBeInTheDocument()
  })

  it('Cancelar and Eliminar call handlers', () => {
    const onCancel = vi.fn()
    const onConfirm = vi.fn()

    render(
      <ConfirmModal
        isOpen
        onCancel={onCancel}
        onConfirm={onConfirm}
        isLoading={false}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onCancel).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('loading replaces Eliminar label with spinner', () => {
    const { container } = render(
      <ConfirmModal
        isOpen
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
        isLoading
      />
    )

    expect(
      screen.queryByRole('button', { name: 'Eliminar' })
    ).not.toBeInTheDocument()
    expect(container.querySelector('.animate-spin')).toBeTruthy()
  })
})
