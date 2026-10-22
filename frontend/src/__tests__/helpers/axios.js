import { vi } from 'vitest'

/**
 * Factory for mocking `ax` from `src/lib/axios.js`.
 *
 * Captures the rejection handler passed to `interceptors.response.use` so AuthStore
 * 401 tests can invoke it later (AuthStore registers the interceptor at import time).
 *
 * `vi.mock` is hoisted and cannot live only in this helper - use `vi.hoisted` in the
 * test file, then point the mock at the shared `ax` instance:
 *
 * @example
 * // From `frontend/src/__tests__/AuthStore.test.js` (adjust relative path as needed):
 * import { createAxiosMock } from './helpers/axios.js'
 *
 * const { ax, getResponseRejectHandler, resetAxiosMock } = vi.hoisted(() =>
 *   createAxiosMock()
 * )
 *
 * vi.mock('../lib/axios.js', () => ({ ax }))
 * // or from a nested folder: vi.mock('../../lib/axios.js', () => ({ ax }))
 *
 * // After importing AuthStore (so the interceptor is registered):
 * // await getResponseRejectHandler()(error)
 */
export function createAxiosMock() {
  const state = { responseRejectHandler: null }

  const ax = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      response: {
        use: vi.fn((onFulfilled, onRejected) => {
          state.responseRejectHandler = onRejected
          return 0
        }),
      },
    },
  }

  return {
    ax,
    getResponseRejectHandler: () => state.responseRejectHandler,
    resetAxiosMock() {
      // Reset HTTP spies only. Keep the captured rejection handler - AuthStore
      // registers interceptors.response.use once at import time.
      ax.get.mockReset()
      ax.post.mockReset()
      ax.put.mockReset()
      ax.delete.mockReset()
    },
  }
}
