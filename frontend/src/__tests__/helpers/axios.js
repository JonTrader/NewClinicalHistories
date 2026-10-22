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
 * // From `frontend/src/__tests__/AuthStore.test.js` (adjust paths as needed).
 * // Do not call createAxiosMock() inside vi.hoisted via a static import - ESM TDZ.
 * const mocks = vi.hoisted(() => ({
 *   ax: null,
 *   getResponseRejectHandler: null,
 *   resetAxiosMock: null,
 * }))
 *
 * vi.mock('../lib/axios.js', async () => {
 *   const { createAxiosMock } = await import('./helpers/axios.js')
 *   const created = createAxiosMock()
 *   mocks.ax = created.ax
 *   mocks.getResponseRejectHandler = created.getResponseRejectHandler
 *   mocks.resetAxiosMock = created.resetAxiosMock
 *   return { ax: created.ax }
 * })
 *
 * // Import AuthStore after the mock so the interceptor registers on mocks.ax:
 * // await mocks.getResponseRejectHandler()(error)
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
