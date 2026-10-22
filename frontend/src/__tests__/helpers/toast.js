import { vi } from 'vitest'

/**
 * Factory for mocking `react-hot-toast` (default export with success/error spies).
 *
 * `vi.mock` is hoisted - use `vi.hoisted` in the test file:
 *
 * @example
 * import { createToastMock } from './helpers/toast.js'
 *
 * const toast = vi.hoisted(() => createToastMock())
 *
 * vi.mock('react-hot-toast', () => ({
 *   default: toast,
 *   Toaster: () => null,
 * }))
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
