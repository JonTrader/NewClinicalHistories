import { create } from 'zustand'
import { ax } from '../lib/axios.js'
import toast from 'react-hot-toast'

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: false,
    isRegistering: false,
    isLoggingIn: false,
    isLoggingOut: false,

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
            toast.success('Cuenta creada exitosamente')
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
            toast.success('Login exitoso')
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
            toast.success('Log out exitoso')
        } catch (error) {
            console.error('Error in logging out: ', error)
            toast.error(error.response?.data?.message)
        } finally {
            set({ isLoggingOut: false })
        }
    }
}))