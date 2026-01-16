import { create } from 'zustand'
import { ax } from '../lib/axios.js'
import toast from 'react-hot-toast'

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: false,
    isRegistering: false,

    checkAuth: async () => {
        set({ isCheckingAuth: true })
        try {
            const res = await ax.get('/auth/check')
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
            const res = await ax.post('/auth/register', data)
            set({ authUser: res.data })
            toast.success('Cuenta creada exitosamente')
        } catch (error) {
            console.error('Error in registering: ', error)
            toast.error(error.response?.data?.message)
        } finally {
            set({ isRegistering: false })
        }
    }
}))