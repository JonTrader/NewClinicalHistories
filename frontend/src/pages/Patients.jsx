import { useEffect } from 'react'
import { Link } from 'react-router'
import { usePatientStore } from '../store/PatientStore.js'
import { Plus, Search } from 'lucide-react'
import TableSkeleton from '../components/TableSkeleton.jsx'
import Pagination from '../components/Pagination.jsx'
import { useAuthStore } from '../store/AuthStore.js'

function Patients() {
  const { patients, getAllPatients, isPatientsLoading, currentPage, totalPages, total, searchTerm, setPage, setSearch } = usePatientStore()
  const { authUser } = useAuthStore()
  const img = authUser?.logo

  useEffect(() => {
    getAllPatients({})
  }, [getAllPatients])

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  if (isPatientsLoading) return <TableSkeleton />

  return (
    <div className="py-5 mt-5 font-sans">
      <div className='gap-2 md:gap-4 justify-items-center items-center grid grid-cols-2 sm:grid-cols-3'>
        <label className="input w-45">
          <Search />
          <input onChange={handleSearch} id="search" type="search" className="grow" placeholder="Buscar #ID" value={searchTerm} />
        </label>
        <div>
          {img &&
            <div className="w-30">
              <img src={img || '/avatar.png'} alt="Logo" />
            </div>
          }
        </div>
        <Link to="/new" className="btn mr-4 bg-blueSteel hover:text-lightOcre col-start-3"><Plus /></Link>
      </div>
      <table className="my-10 table table-xs lg:table-md text-center">
        <thead>
          <tr >
            <th>Nombre</th>
            <th># ID</th>
            <th>Detalles</th>
            <th className='hidden sm:block'>Odontograma</th>
            <th>Evolucion</th>
          </tr>
        </thead>
        <tbody className='text-lightBone'>
          {patients.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-8 text-center text-gray-400">No se encontraron pacientes</td>
            </tr>
          ) : (patients.map((patient) => {
            return (
              <tr key={patient._id}>
                <th>{`${patient.firstName} ${patient.lastName}`}</th>
                <td>{patient?.idType || ''} {patient?.idNumber || ''}</td>
                <td><Link className='hover:text-lightSand' to={`/details/${patient._id}`}>Ver/Editar</Link></td>
                <td className='hidden sm:block hover:text-lightSand'><Link to={`/odontogram/${patient._id}`}>Modificar</Link></td>
                <td><Link className='hover:text-lightSand' to={`/evolution/${patient._id}`}>Agregar</Link></td>
              </tr>
            )
          }))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
      />
    </div>
  )
}

export default Patients