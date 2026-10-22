import { describe, it, expect, vi, beforeEach } from 'vitest'

// Hoisted bag filled by async vi.mock factories (vi.hoisted cannot call ESM imports).
const mocks = vi.hoisted(() => ({
  ax: null,
  getResponseRejectHandler: null,
  resetAxiosMock: null,
  toast: null,
}))

vi.mock('../lib/axios.js', async () => {
  const { createAxiosMock } = await import('./helpers/axios.js')
  const created = createAxiosMock()
  mocks.ax = created.ax
  mocks.getResponseRejectHandler = created.getResponseRejectHandler
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

// Import after axios mock so AuthStore attaches its 401 interceptor to the mock.
import { useAuthStore } from '../store/AuthStore.js'

const initialState = {
  authUser: null,
  isCheckingAuth: true,
  isRegistering: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isUpdatingProfile: false,
}

describe('AuthStore', () => {
  beforeEach(() => {
    mocks.resetAxiosMock()
    mocks.toast.resetToastMock()
    useAuthStore.setState({ ...initialState })
  })

  describe('checkAuth', () => {
    it('sets authUser and clears isCheckingAuth on success', async () => {
      const user = { _id: 'u1', email: 'doc@example.com' }
      mocks.ax.get.mockResolvedValueOnce({ data: user })

      await useAuthStore.getState().checkAuth()

      expect(mocks.ax.get).toHaveBeenCalledWith('/api/v1/auth/check')
      expect(useAuthStore.getState().authUser).toEqual(user)
      expect(useAuthStore.getState().isCheckingAuth).toBe(false)
    })

    it('sets authUser null and clears isCheckingAuth on failure', async () => {
      mocks.ax.get.mockRejectedValueOnce(new Error('network'))

      await useAuthStore.getState().checkAuth()

      expect(useAuthStore.getState().authUser).toBeNull()
      expect(useAuthStore.getState().isCheckingAuth).toBe(false)
    })
  })

  describe('login', () => {
    it('sets loading, authUser, and toast.success on success', async () => {
      const user = { _id: 'u1', email: 'doc@example.com' }
      let resolveLogin
      mocks.ax.post.mockReturnValueOnce(
        new Promise((resolve) => {
          resolveLogin = resolve
        })
      )

      const pending = useAuthStore.getState().login({
        email: 'doc@example.com',
        password: 'secret1',
      })

      expect(useAuthStore.getState().isLoggingIn).toBe(true)

      resolveLogin({ data: user })
      await pending

      expect(mocks.ax.post).toHaveBeenCalledWith('/api/v1/auth/login', {
        email: 'doc@example.com',
        password: 'secret1',
      })
      expect(useAuthStore.getState().authUser).toEqual(user)
      expect(useAuthStore.getState().isLoggingIn).toBe(false)
      expect(mocks.toast.success).toHaveBeenCalledWith('Logged In')
    })

    it('uses toast.error with response message on failure', async () => {
      mocks.ax.post.mockRejectedValueOnce({
        response: { data: { message: 'Invalid credentials' } },
      })

      await useAuthStore.getState().login({ email: 'a@b.com', password: 'x' })

      expect(useAuthStore.getState().authUser).toBeNull()
      expect(useAuthStore.getState().isLoggingIn).toBe(false)
      expect(mocks.toast.error).toHaveBeenCalledWith('Invalid credentials')
    })

    it('uses toast.error fallback when response has no message', async () => {
      mocks.ax.post.mockRejectedValueOnce({})

      await useAuthStore.getState().login({ email: 'a@b.com', password: 'x' })

      expect(mocks.toast.error).toHaveBeenCalledWith('Problema al ingresar')
      expect(useAuthStore.getState().isLoggingIn).toBe(false)
    })
  })

  describe('register', () => {
    it('sets loading, authUser, and toast.success on success', async () => {
      const user = { _id: 'u2', email: 'new@example.com' }
      let resolveRegister
      mocks.ax.post.mockReturnValueOnce(
        new Promise((resolve) => {
          resolveRegister = resolve
        })
      )

      const data = {
        firstName: 'A',
        lastName: 'B',
        email: 'new@example.com',
        password: 'secret1',
      }
      const pending = useAuthStore.getState().register(data)

      expect(useAuthStore.getState().isRegistering).toBe(true)

      resolveRegister({ data: user })
      await pending

      expect(mocks.ax.post).toHaveBeenCalledWith('/api/v1/auth/register', data)
      expect(useAuthStore.getState().authUser).toEqual(user)
      expect(useAuthStore.getState().isRegistering).toBe(false)
      expect(mocks.toast.success).toHaveBeenCalledWith('Cuenta creada')
    })

    it('uses toast.error with response message on failure', async () => {
      mocks.ax.post.mockRejectedValueOnce({
        response: { data: { message: 'Email already exists' } },
      })

      await useAuthStore.getState().register({
        firstName: 'A',
        lastName: 'B',
        email: 'a@b.com',
        password: 'secret1',
      })

      expect(mocks.toast.error).toHaveBeenCalledWith('Email already exists')
      expect(useAuthStore.getState().isRegistering).toBe(false)
    })

    it('uses toast.error fallback when response has no message', async () => {
      mocks.ax.post.mockRejectedValueOnce({})

      await useAuthStore.getState().register({
        firstName: 'A',
        lastName: 'B',
        email: 'a@b.com',
        password: 'secret1',
      })

      expect(mocks.toast.error).toHaveBeenCalledWith('Problema registrando usuario')
      expect(useAuthStore.getState().isRegistering).toBe(false)
    })
  })

  describe('logout', () => {
    it('nulls authUser on success', async () => {
      useAuthStore.setState({
        authUser: { _id: 'u1' },
        isCheckingAuth: false,
      })
      mocks.ax.post.mockResolvedValueOnce({})

      await useAuthStore.getState().logout()

      expect(mocks.ax.post).toHaveBeenCalledWith('/api/v1/auth/logout')
      expect(useAuthStore.getState().authUser).toBeNull()
      expect(useAuthStore.getState().isLoggingOut).toBe(false)
      expect(mocks.toast.success).toHaveBeenCalledWith('Logged Out')
    })

    it('leaves authUser set when logout fails (current behavior)', async () => {
      const user = { _id: 'u1' }
      useAuthStore.setState({ authUser: user, isCheckingAuth: false })
      mocks.ax.post.mockRejectedValueOnce({
        response: { data: { message: 'Server error' } },
      })

      await useAuthStore.getState().logout()

      expect(useAuthStore.getState().authUser).toEqual(user)
      expect(useAuthStore.getState().isLoggingOut).toBe(false)
      expect(mocks.toast.error).toHaveBeenCalledWith('Server error')
    })
  })

  describe('401 interceptor', () => {
    it('clears authUser for non-auth URL when authUser is set', async () => {
      useAuthStore.setState({
        authUser: { _id: 'u1' },
        isCheckingAuth: false,
      })

      const onRejected = mocks.getResponseRejectHandler()
      const error = {
        response: { status: 401 },
        config: { url: '/api/v1/patients' },
      }

      await expect(onRejected(error)).rejects.toBe(error)
      expect(useAuthStore.getState().authUser).toBeNull()
    })

    it('does not clear authUser for URLs containing /api/v1/auth/', async () => {
      const user = { _id: 'u1' }
      useAuthStore.setState({ authUser: user, isCheckingAuth: false })

      const onRejected = mocks.getResponseRejectHandler()
      const error = {
        response: { status: 401 },
        config: { url: '/api/v1/auth/login' },
      }

      await expect(onRejected(error)).rejects.toBe(error)
      expect(useAuthStore.getState().authUser).toEqual(user)
    })

    it('leaves authUser unchanged for non-401 errors', async () => {
      const user = { _id: 'u1' }
      useAuthStore.setState({ authUser: user, isCheckingAuth: false })

      const onRejected = mocks.getResponseRejectHandler()
      const error = {
        response: { status: 500 },
        config: { url: '/api/v1/patients' },
      }

      await expect(onRejected(error)).rejects.toBe(error)
      expect(useAuthStore.getState().authUser).toEqual(user)
    })
  })
})
