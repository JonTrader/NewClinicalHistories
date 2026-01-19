import { create } from 'zustand'
import { ax } from '../lib/axios.js'
import toast from 'react-hot-toast'

export const usePatientStore = create((set) => ({
    patients: [],
    isPatientsLoading: false,

    getAllPatients: async () => {
        set({ isPatientsLoading: true })
        try {
            const res = await ax.get('/patient/allPatients')
            console.log(res)
            set({ patients: res.data })
        } catch (error) {
            console.error('Error in getAllPatients store: ', error)
            toast.error(error.response?.data?.message)
        } finally {
            set({ isPatientsLoading: false })
        }
    }
}))