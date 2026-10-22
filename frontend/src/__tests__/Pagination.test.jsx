import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Pagination from '../components/Pagination.jsx'

describe('Pagination', () => {
  it('renders nothing when totalPages <= 1', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />
    )
    expect(container).toBeEmptyDOMElement()

    const { container: zero } = render(
      <Pagination currentPage={1} totalPages={0} onPageChange={vi.fn()} />
    )
    expect(zero).toBeEmptyDOMElement()
  })

  it('shows window with ellipsis when pages exceed maxVisible', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={vi.fn()}
        maxVisible={5}
      />
    )

    expect(screen.getByLabelText('Ir a página 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Ir a página 10')).toBeInTheDocument()
    expect(screen.getAllByText('...').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByLabelText('Ir a página 5')).toHaveAttribute(
      'aria-current',
      'page'
    )
  })

  it('disables prev on page 1 and next on last page', () => {
    const { rerender } = render(
      <Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />
    )
    expect(screen.getByLabelText('Página anterior')).toBeDisabled()
    expect(screen.getByLabelText('Página siguiente')).not.toBeDisabled()

    rerender(
      <Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />
    )
    expect(screen.getByLabelText('Página anterior')).not.toBeDisabled()
    expect(screen.getByLabelText('Página siguiente')).toBeDisabled()
  })

  it('calls onPageChange for prev, next, and page buttons', () => {
    const onPageChange = vi.fn()
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={onPageChange}
      />
    )

    fireEvent.click(screen.getByLabelText('Página anterior'))
    expect(onPageChange).toHaveBeenCalledWith(2)

    fireEvent.click(screen.getByLabelText('Página siguiente'))
    expect(onPageChange).toHaveBeenCalledWith(4)

    fireEvent.click(screen.getByLabelText('Ir a página 1'))
    expect(onPageChange).toHaveBeenCalledWith(1)
  })

  it('shows "Página X de Y (Z pacientes)" when total is provided', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={4}
        total={73}
        onPageChange={vi.fn()}
      />
    )
    expect(
      screen.getByText('Página 2 de 4 (73 pacientes)')
    ).toBeInTheDocument()
  })

  it('omits patient count line when total is not a number', () => {
    render(
      <Pagination currentPage={2} totalPages={4} onPageChange={vi.fn()} />
    )
    expect(screen.queryByText(/pacientes/)).not.toBeInTheDocument()
  })
})
