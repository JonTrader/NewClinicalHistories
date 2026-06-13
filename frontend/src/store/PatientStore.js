import { create } from 'zustand'
import { ax } from '../lib/axios.js'
import toast from 'react-hot-toast'

export const usePatientStore = create((set) => ({
    patients: [],
    isPatientsLoading: true,
    isCreatingPatient: false,
    isDetailsLoading: true,
    isEditingPatient: false,
    isDeletingPatient: false,
    currentPage: 1,
    totalPages: 1,
    total: 0,
    itemsPerPage: 20,
    searchTerm: '',

    getAllPatients: async ({ page = 1, limit = 20, search = '' } = {}) => {
        set({ isPatientsLoading: true })
        try {
            const params = { page, limit }
            if (search) params.search = search
            const res = await ax.get('/api/v1/patients', { params })
            const data = res.data
            if (Array.isArray(data)) {
                set({ patients: data, currentPage: 1, totalPages: 1, total: data.length, itemsPerPage: limit, searchTerm: search })
            } else {
                set({
                    patients: data.patients,
                    currentPage: data.pagination.page,
                    totalPages: data.pagination.totalPages,
                    total: data.pagination.total,
                    itemsPerPage: data.pagination.limit,
                    searchTerm: search,
                })
            }
        } catch (error) {
            console.error('Error in getAllPatients store: ', error)
            toast.error(error.response?.data?.message || 'Problema al cargar pacientes')
        } finally {
            set({ isPatientsLoading: false })
        }
    },

    setPage: (page) => {
        const state = usePatientStore.getState()
        state.getAllPatients({ page, limit: state.itemsPerPage, search: state.searchTerm })
    },

    setSearch: (search) => {
        usePatientStore.getState().getAllPatients({ page: 1, limit: 20, search })
    },

    createPatient: async (data) => {
        set({ isCreatingPatient: true })
        try {
            await ax.post('/api/v1/patients', data)
            toast.success('Paciente creado')
        } catch (error) {
            console.error('Error in create patient in patient store: ', error)
            toast.error(error.response?.data?.message || 'Problema creando paciente nuevo')
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
            toast.error(error.response?.data?.message || 'Problema al cargar detalles de paciente')
        } finally {
            set({ isDetailsLoading: false })
        }
    },

    updatePatient: async (id, data) => {
        set({ isEditingPatient: true })
        try {
            await ax.put(`/api/v1/patients/${id}`, data)
            toast.success('Paciente actualizado')
        } catch (error) {
            console.error('Error in editing patient: ', error)
            toast.error(error.response?.data?.message || 'Problema al actualizar paciente')
        } finally {
            set({ isEditingPatient: false })
        }
    },

    deletePatient: async (id) => {
        set({ isDeletingPatient: true })
        try {
            await ax.delete(`/api/v1/patients/${id}`)
            toast.success('Paciente borrado')
        } catch (error) {
            console.error('Error in deleting patient: ', error)
            toast.error(error.response?.data?.message || 'Problema al borrar paciente')
        } finally {
            set({ isDeletingPatient: false })
        }
    }
}))