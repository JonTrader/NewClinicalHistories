import { create } from 'zustand'
import { ax } from '../lib/axios.js'
import toast from 'react-hot-toast'

export const useOdontogramStore = create((set) => ({
    isUpdatingOdontogram: false,

    updateOdontogram: async (id, data) => {
        set({ isUpdatingOdontogram: true })
        try {
            await ax.put(`/api/v1/patients/${id}/odontogram`, data)
            toast.success("Patient's odontogram has been update")
        } catch (error) {
            console.error('Error in updateOdontogram store: ', error)
            toast.error(error.response?.data?.message)
        } finally {
            set({ isUpdatingOdontogram: false})
        }
    }
}))