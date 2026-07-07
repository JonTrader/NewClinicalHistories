import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { usePatientStore } from '../store/PatientStore.js'
import { Plus, Users, User, Smile, FileText } from 'lucide-react'
import TableSkeleton from '../components/TableSkeleton.jsx'
import Pagination from '../components/Pagination.jsx'
import { useAuthStore } from '../store/AuthStore.js'
import { PatientSearchDropdown } from '../components/PatientSearchDropdown.jsx'

function Patients() {
  const { patients, getAllPatients, isPatientsLoading, currentPage, totalPages, total, setPage } = usePatientStore()
  const { authUser } = useAuthStore()
  const navigate = useNavigate()
  const logo = authUser?.logo

  useEffect(() => {
    getAllPatients()
  }, [getAllPatients])

  const handleSelectPatient = (id) => {
    navigate(`/details/${id}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-body text-lightBone">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          {logo && (
            <img
              src={logo}
              alt="Logo de la clínica"
              className="h-10 w-auto object-contain opacity-90"
            />
          )}
          <div>
            <h1 className="font-display text-3xl font-bold text-lightBone">Pacientes</h1>
            {typeof total === 'number' && (
              <p className="text-sm text-lightOcre mt-1">
                {total} {total === 1 ? 'paciente registrado' : 'pacientes registrados'}
              </p>
            )}
          </div>
        </div>
        <Link
          to="/new"
          className="btn bg-lightOcre text-blueDeep hover:bg-lightSand border-none font-body inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo paciente
        </Link>
      </div>

      <div className="mb-6 max-w-md">
        <PatientSearchDropdown onSelect={handleSelectPatient} />
      </div>

      {isPatientsLoading ? (
        <TableSkeleton />
      ) : (
        <>
          {patients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-blueSteel rounded-lg bg-blueDeep/30">
              <Users className="w-12 h-12 text-lightOcre/50 mb-4" />
              <h2 className="font-display text-xl text-lightBone mb-2">No hay pacientes registrados</h2>
              <p className="text-lightOcre/70 mb-6 max-w-sm">
                Comienza creando el primer paciente para verlo aquí.
              </p>
              <Link
                to="/new"
                className="btn bg-lightOcre text-blueDeep hover:bg-lightSand border-none font-body inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Crear primer paciente
              </Link>
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-blueSteel overflow-hidden overflow-x-auto">
                <table className="w-full min-w-[16rem] text-center text-sm">
                  <thead className="bg-blueDeep text-lightBone text-xs uppercase tracking-wide">
                    <tr>
                      <th className="px-2 sm:px-4 py-3 font-medium text-left whitespace-nowrap">Nombre</th>
                      <th className="hidden sm:table-cell px-2 sm:px-4 py-3 font-medium whitespace-nowrap"># ID</th>
                      <th className="px-2 sm:px-4 py-3 font-medium whitespace-nowrap">
                        <User className="w-4 h-4 sm:hidden mx-auto" />
                        <span className="hidden sm:inline">Detalles</span>
                      </th>
                      <th className="px-2 sm:px-4 py-3 font-medium whitespace-nowrap">
                        <Smile className="w-4 h-4 sm:hidden mx-auto" />
                        <span className="hidden sm:inline">Odontograma</span>
                      </th>
                      <th className="px-2 sm:px-4 py-3 font-medium whitespace-nowrap">
                        <FileText className="w-4 h-4 sm:hidden mx-auto" />
                        <span className="hidden sm:inline">Evolución</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blueSteel">
                    {patients.map((patient) => (
                      <tr
                        key={patient._id}
                        className="group bg-blueSteel/20 hover:bg-blueSteel/40 transition-colors duration-150"
                      >
                        <td className="px-2 sm:px-4 py-3 font-medium text-lightBone text-left">
                          {patient.firstName} {patient.lastName}
                        </td>
                        <td className="hidden sm:table-cell px-2 sm:px-4 py-3 font-mono text-lightOcre">
                          {patient?.idType || ''} {patient?.idNumber || ''}
                        </td>
                        <td className="px-2 sm:px-4 py-3">
                          <Link
                            to={`/details/${patient._id}`}
                            aria-label="Ver detalles del paciente"
                            title="Ver detalles"
                            className="text-blueSky hover:text-lightBone transition-colors duration-150 inline-flex items-center justify-center"
                          >
                            <User className="w-4 h-4 sm:hidden" />
                            <span className="hidden sm:inline">Ver / editar</span>
                          </Link>
                        </td>
                        <td className="px-2 sm:px-4 py-3">
                          <Link
                            to={`/odontogram/${patient._id}`}
                            aria-label="Modificar odontograma"
                            title="Modificar odontograma"
                            className="text-blueSky hover:text-lightBone transition-colors duration-150 inline-flex items-center justify-center"
                          >
                            <Smile className="w-4 h-4 sm:hidden" />
                            <span className="hidden sm:inline">Modificar</span>
                          </Link>
                        </td>
                        <td className="px-2 sm:px-4 py-3">
                          <Link
                            to={`/evolution/${patient._id}`}
                            aria-label="Agregar evolución"
                            title="Agregar evolución"
                            className="text-blueSky hover:text-lightBone transition-colors duration-150 inline-flex items-center justify-center"
                          >
                            <FileText className="w-4 h-4 sm:hidden" />
                            <span className="hidden sm:inline">Agregar</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                total={total}
                onPageChange={setPage}
              />
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Patients
