import { MemoryRouter, Routes } from 'react-router'
import { render } from '@testing-library/react'

/**
 * Render UI inside MemoryRouter (react-router v7 from `react-router`).
 *
 * @param {import('react').ReactElement} ui - element to render when `routes` is omitted
 * @param {{ initialEntries?: string[], routes?: import('react').ReactNode }} [options]
 * @returns {ReturnType<typeof render>}
 *
 * @example
 * renderWithRouter(<Login />)
 * renderWithRouter(null, {
 *   initialEntries: ['/patients/1'],
 *   routes: <Route path="/patients/:id" element={<PatientDetails />} />,
 * })
 */
export function renderWithRouter(ui, options = {}) {
  const { initialEntries = ['/'], routes } = options

  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {routes != null ? <Routes>{routes}</Routes> : ui}
    </MemoryRouter>
  )
}
