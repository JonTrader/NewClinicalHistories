import { create } from 'zustand'
import { ax } from '../lib/axios.js'
import toast from 'react-hot-toast'

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isRegistering: false,
    isLoggingIn: false,
    isLoggingOut: false,
    isUpdatingProfile: false,

    checkAuth: async () => {
        set({ isCheckingAuth: true })
        try {
            const res = await ax.get('/api/v1/auth/check')
            set({ authUser: res.data })
        } catch (error) {
            console.error('Error in authcheck: ', error)
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    register: async (data) => {
        set({ isRegistering: true })
        try {
            const res = await ax.post('/api/v1/auth/register', data)
            set({ authUser: res.data })
            toast.success('Cuenta creada')
        } catch (error) {
            console.error('Error in registering: ', error)
            toast.error(error.response?.data?.message)
        } finally {
            set({ isRegistering: false })
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const res = await ax.post('/api/v1/auth/login', data)
            set({ authUser: res.data })
            toast.success('Logged In')
        } catch (error) {
            console.error('Error in logging in: ', error)
            toast.error(error.response?.data?.message)
        } finally {
            set({ isLoggingIn: false })
        }
    },

    logout: async () => {
        set({ isLoggingOut: true })
        try {
            await ax.post('/api/v1/auth/logout')
            set({ authUser: null })
            toast.success('Logged Out')
        } catch (error) {
            console.error('Error in logging out: ', error)
            toast.error(error.response?.data?.message)
        } finally {
            set({ isLoggingOut: false })
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const res = await ax.put('/api/v1/auth/update-profile', data)
            set({ authUser: res.data })
            toast.success('Profile updated successfully')
        } catch (error) {
            console.error('Error updating profile: ', error)
            toast.error(error.response?.data?.message || 'Failed to update profile')
        } finally {
            set({ isUpdatingProfile: false })
        }
    }
}))


// Set up axios interceptor to handle 401 errors globally
// This ensures auth state is cleared when token is invalid/missing
ax.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only handle 401 errors for non-auth endpoints
        // Auth endpoints (login, register, logout, check) handle their own errors
        if (error.response?.status === 401) {
            const url = error.config?.url || ''
            const isAuthEndpoint = url.includes('/api/v1/auth/')
            
            if (!isAuthEndpoint) {
                // Clear auth state to trigger redirect
                const currentAuthUser = useAuthStore.getState().authUser
                if (currentAuthUser) {
                    useAuthStore.setState({ authUser: null })
                }
            }
        }
        return Promise.reject(error)
    }
)