import { create } from 'zustand'
import { ax } from '../lib/axios.js'
import toast from 'react-hot-toast'

export const useEvolutionStore = create((set) => ({
    isUpdatingEvolution: false,

    updateEvolution: async (id, data) => {
        set({ isUpdatingEvolution: true })
        try {
            await ax.put(`/api/v1/patients/${id}/evolution`, data)
            toast.success('Patient has been updated')
        } catch (error) {
            console.error('Error in updateEvolution store: ', error)
            toast.error(error.response?.data?.message)
        } finally {
            set({ isUpdatingEvolution: false})
        }
    }
}))