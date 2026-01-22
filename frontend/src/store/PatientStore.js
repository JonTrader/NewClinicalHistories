import { create } from 'zustand'
import { ax } from '../lib/axios.js'
import toast from 'react-hot-toast'

export const usePatientStore = create((set) => ({
    patients: [],
    isPatientsLoading: true,
    isCreatingPatient: false,
    isDetailsLoading: true,
    isEditingPatient: false,

    getAllPatients: async () => {
        set({ isPatientsLoading: true })
        try {
            const res = await ax.get('/api/v1/patients')
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
            await ax.post('/api/v1/patients', data)
            toast.success('Patient created successfully')
        } catch (error) {
            console.error('Error in create patient in patient store: ', error)
            toast.error(error.response?.data?.message)
        } finally {
            set({ isCreatingPatient: false })
        }
    },

    getPatientDetails: async (id) => {
        set({ isDetailsLoading: true })
        try {
            const res = await ax.get(`/api/v1/patients/${id}`)
            return res.data
        } catch (error) {
            console.error('Error in getDetails store: ', error)
            toast.error(error.response?.data?.message)
        } finally {
            set({ isDetailsLoading: false })
        }
    },

    updatePatient: async (id, data) => {
        set({ isEditingPatient: true })
        try {
            await ax.put(`/api/v1/patients/${id}`, data)
            toast.success('Patient updated')
        } catch (error) {
            console.error('Error in editing patient: ', error)
            toast.error(error.response?.data?.message)
        } finally {
            set({ isEditingPatient: false })
        }
    }
}))