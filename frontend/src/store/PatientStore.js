import { create } from 'zustand'
import { ax } from '../lib/axios.js'
import toast from 'react-hot-toast'

export const usePatientStore = create((set) => ({
    patients: [],
    isPatientsLoading: true,
    isCreatingPatient: false,

    getAllPatients: async () => {
        set({ isPatientsLoading: true })
        try {
            const res = await ax.get('/api/v1/patients')
            console.log(res)
            set({ patients: res.data })
        } catch (error) {
            console.error('Error in getAllPatients store: ', error)
            toast.error(error.response?.data?.message)
        } finally {
            set({ isPatientsLoading: false })
        }
    },

    createPatient: async (data) => {
        set({ isCreatingPatient: true })
        try {
            const res = await ax.post('/api/v1/patients', data)
            console.log(res)
            toast.success('Patient created successfully')
        } catch (error) {
            console.error('Error in create patient in patient store: ', error)
            toast.error(error.response?.data?.message)
        } finally {
            set({ isCreatingPatient: false })
        }
    }
}))