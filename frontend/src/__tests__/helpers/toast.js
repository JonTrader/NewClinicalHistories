import { vi } from 'vitest'

/**
 * Factory for mocking `react-hot-toast` (default export with success/error spies).
 *
 * `vi.mock` is hoisted - use `vi.hoisted` in the test file:
 *
 * @example
 * // Do not call createToastMock() inside vi.hoisted via a static import - ESM TDZ.
 * const mocks = vi.hoisted(() => ({ toast: null }))
 *
 * vi.mock('react-hot-toast', async () => {
 *   const { createToastMock } = await import('./helpers/toast.js')
 *   mocks.toast = createToastMock()
 *   return { default: mocks.toast, Toaster: () => null }
 * })
 */
export function createToastMock() {
  const toast = {
    success: vi.fn(),
    error: vi.fn(),
  }
  toast.resetToastMock = () => {
    toast.success.mockReset()
    toast.error.mockReset()
  }
  return toast
}
