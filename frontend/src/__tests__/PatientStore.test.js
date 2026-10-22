import { describe, it, expect, vi, beforeEach } from 'vitest'

const mocks = vi.hoisted(() => ({
  ax: null,
  resetAxiosMock: null,
  toast: null,
}))

vi.mock('../lib/axios.js', async () => {
  const { createAxiosMock } = await import('./helpers/axios.js')
  const created = createAxiosMock()
  mocks.ax = created.ax
  mocks.resetAxiosMock = created.resetAxiosMock
  return { ax: created.ax }
})

vi.mock('react-hot-toast', async () => {
  const { createToastMock } = await import('./helpers/toast.js')
  const toast = createToastMock()
  mocks.toast = toast
  return {
    default: toast,
    Toaster: () => null,
  }
})

import { usePatientStore } from '../store/PatientStore.js'

const initialState = {
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
}

const listPayload = {
  patients: [{ _id: 'p1', firstName: 'Ana', lastName: 'Lopez' }],
  pagination: { page: 2, totalPages: 3, total: 45, limit: 20 },
}

describe('PatientStore', () => {
  beforeEach(() => {
    mocks.resetAxiosMock()
    mocks.toast.resetToastMock()
    usePatientStore.setState({ ...initialState })
  })

  describe('getAllPatients', () => {
    it('requests page/limit and omits empty search; sets patients + pagination', async () => {
      mocks.ax.get.mockResolvedValueOnce({ data: listPayload })

      await usePatientStore.getState().getAllPatients({ page: 2, limit: 20 })

      expect(mocks.ax.get).toHaveBeenCalledWith('/api/v1/patients', {
        params: { page: 2, limit: 20 },
      })
      const state = usePatientStore.getState()
      expect(state.patients).toEqual(listPayload.patients)
      expect(state.currentPage).toBe(2)
      expect(state.totalPages).toBe(3)
      expect(state.total).toBe(45)
      expect(state.itemsPerPage).toBe(20)
      expect(state.searchTerm).toBe('')
      expect(state.isPatientsLoading).toBe(false)
    })

    it('includes search only when non-empty', async () => {
      mocks.ax.get.mockResolvedValueOnce({ data: listPayload })

      await usePatientStore.getState().getAllPatients({
        page: 1,
        limit: 20,
        search: 'ana',
      })

      expect(mocks.ax.get).toHaveBeenCalledWith('/api/v1/patients', {
        params: { page: 1, limit: 20, search: 'ana' },
      })
      expect(usePatientStore.getState().searchTerm).toBe('ana')
    })

    it('toasts response message on error', async () => {
      mocks.ax.get.mockRejectedValueOnce({
        response: { data: { message: 'Server down' } },
      })

      await usePatientStore.getState().getAllPatients()

      expect(mocks.toast.error).toHaveBeenCalledWith('Server down')
      expect(usePatientStore.getState().isPatientsLoading).toBe(false)
    })

    it('toasts fallback when response has no message', async () => {
      mocks.ax.get.mockRejectedValueOnce({})

      await usePatientStore.getState().getAllPatients()

      expect(mocks.toast.error).toHaveBeenCalledWith('Problema al cargar pacientes')
    })
  })

  describe('setPage / setSearch', () => {
    it('setPage calls getAllPatients with page, itemsPerPage, and searchTerm', () => {
      const getAllPatients = vi.fn()
      usePatientStore.setState({
        getAllPatients,
        itemsPerPage: 20,
        searchTerm: 'foo',
      })

      usePatientStore.getState().setPage(3)

      expect(getAllPatients).toHaveBeenCalledWith({
        page: 3,
        limit: 20,
        search: 'foo',
      })
    })

    it('setSearch calls getAllPatients with page 1, limit 20, and search', () => {
      const getAllPatients = vi.fn()
      usePatientStore.setState({ getAllPatients })

      usePatientStore.getState().setSearch('bar')

      expect(getAllPatients).toHaveBeenCalledWith({
        page: 1,
        limit: 20,
        search: 'bar',
      })
    })
  })

  describe('createPatient', () => {
    it('sets flag, posts, and toasts success', async () => {
      let resolvePost
      mocks.ax.post.mockReturnValueOnce(
        new Promise((resolve) => {
          resolvePost = resolve
        })
      )
      const body = { firstName: 'Ana', lastName: 'Lopez' }

      const pending = usePatientStore.getState().createPatient(body)
      expect(usePatientStore.getState().isCreatingPatient).toBe(true)

      resolvePost({})
      await pending

      expect(mocks.ax.post).toHaveBeenCalledWith('/api/v1/patients', body)
      expect(mocks.toast.success).toHaveBeenCalledWith('Paciente creado')
      expect(usePatientStore.getState().isCreatingPatient).toBe(false)
    })

    it('toasts error and does not rethrow', async () => {
      mocks.ax.post.mockRejectedValueOnce({
        response: { data: { message: 'Validation failed' } },
      })

      await expect(
        usePatientStore.getState().createPatient({})
      ).resolves.toBeUndefined()

      expect(mocks.toast.error).toHaveBeenCalledWith('Validation failed')
      expect(usePatientStore.getState().isCreatingPatient).toBe(false)
    })

    it('uses fallback toast message when error has no message', async () => {
      mocks.ax.post.mockRejectedValueOnce({})

      await usePatientStore.getState().createPatient({})

      expect(mocks.toast.error).toHaveBeenCalledWith(
        'Problema creando paciente nuevo'
      )
    })
  })

  describe('updatePatient', () => {
    it('sets flag, puts, and toasts success', async () => {
      let resolvePut
      mocks.ax.put.mockReturnValueOnce(
        new Promise((resolve) => {
          resolvePut = resolve
        })
      )
      const body = { firstName: 'Ana' }

      const pending = usePatientStore.getState().updatePatient('p1', body)
      expect(usePatientStore.getState().isEditingPatient).toBe(true)

      resolvePut({})
      await pending

      expect(mocks.ax.put).toHaveBeenCalledWith('/api/v1/patients/p1', body)
      expect(mocks.toast.success).toHaveBeenCalledWith('Paciente actualizado')
      expect(usePatientStore.getState().isEditingPatient).toBe(false)
    })

    it('toasts error and does not rethrow', async () => {
      mocks.ax.put.mockRejectedValueOnce({})

      await expect(
        usePatientStore.getState().updatePatient('p1', {})
      ).resolves.toBeUndefined()

      expect(mocks.toast.error).toHaveBeenCalledWith(
        'Problema al actualizar paciente'
      )
      expect(usePatientStore.getState().isEditingPatient).toBe(false)
    })
  })

  describe('deletePatient', () => {
    it('sets flag, deletes, and toasts success', async () => {
      let resolveDelete
      mocks.ax.delete.mockReturnValueOnce(
        new Promise((resolve) => {
          resolveDelete = resolve
        })
      )

      const pending = usePatientStore.getState().deletePatient('p1')
      expect(usePatientStore.getState().isDeletingPatient).toBe(true)

      resolveDelete({})
      await pending

      expect(mocks.ax.delete).toHaveBeenCalledWith('/api/v1/patients/p1')
      expect(mocks.toast.success).toHaveBeenCalledWith('Paciente borrado')
      expect(usePatientStore.getState().isDeletingPatient).toBe(false)
    })

    it('toasts error and does not rethrow', async () => {
      mocks.ax.delete.mockRejectedValueOnce({
        response: { data: { message: 'Forbidden' } },
      })

      await expect(
        usePatientStore.getState().deletePatient('p1')
      ).resolves.toBeUndefined()

      expect(mocks.toast.error).toHaveBeenCalledWith('Forbidden')
      expect(usePatientStore.getState().isDeletingPatient).toBe(false)
    })

    it('uses fallback toast message when error has no message', async () => {
      mocks.ax.delete.mockRejectedValueOnce({})

      await usePatientStore.getState().deletePatient('p1')

      expect(mocks.toast.error).toHaveBeenCalledWith(
        'Problema al borrar paciente'
      )
    })
  })

  describe('getPatientDetails', () => {
    it('sets flag and returns patient data on success', async () => {
      const patient = { _id: 'p1', firstName: 'Ana' }
      let resolveGet
      mocks.ax.get.mockReturnValueOnce(
        new Promise((resolve) => {
          resolveGet = resolve
        })
      )

      const pending = usePatientStore.getState().getPatientDetails('p1')
      expect(usePatientStore.getState().isDetailsLoading).toBe(true)

      resolveGet({ data: patient })
      const result = await pending

      expect(mocks.ax.get).toHaveBeenCalledWith('/api/v1/patients/p1')
      expect(result).toEqual(patient)
      expect(usePatientStore.getState().isDetailsLoading).toBe(false)
    })

    it('toasts error, does not rethrow, and returns undefined', async () => {
      mocks.ax.get.mockRejectedValueOnce({})

      const result = await usePatientStore.getState().getPatientDetails('p1')

      expect(result).toBeUndefined()
      expect(mocks.toast.error).toHaveBeenCalledWith(
        'Problema al cargar detalles de paciente'
      )
      expect(usePatientStore.getState().isDetailsLoading).toBe(false)
    })
  })
})
