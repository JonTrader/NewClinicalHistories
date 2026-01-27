import { create } from 'zustand'
import { ax } from '../lib/axios.js'
import toast from 'react-hot-toast'

export const useOdontogramStore = create((set) => ({
    isUpdatingOdontogram: false,

    updateOdontogram: async (id, data) => {
        set({ isUpdatingOdontogram: true })
        try {
            await ax.put(`/api/v1/odontograms/${id}`, data)
            toast.success("Paciente ha sido actualizado")
        } catch (error) {
            console.error('Error in updateOdontogram store: ', error)
            toast.error(error.response?.data?.message)
        } finally {
            set({ isUpdatingOdontogram: false})
        }
    }
}))