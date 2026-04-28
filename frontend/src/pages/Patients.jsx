import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { usePatientStore } from '../store/PatientStore.js'
import { Plus, Search } from 'lucide-react'
import TableSkeleton from '../components/TableSkeleton.jsx'
import { useAuthStore } from '../store/AuthStore.js'

function Patients() {
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const { patients, getAllPatients, isPatientsLoading } = usePatientStore()
  const { authUser } = useAuthStore()
  const img = authUser?.logo

  useEffect(() => {
    getAllPatients()
  }, [getAllPatients])

  const handleSearch = (e) => {
    e.preventDefault()
    if (e.target.value === '') {
      setIsSearching(false)
    } else {
      setIsSearching(true)
    }
    setSearchResults(patients.filter((element) => {
      const str = element.idNumber !== undefined ? String(element.idNumber) : ''
      return str.includes(e.target.value)
    }))
  }

  if (isPatientsLoading) return <TableSkeleton />


  return (
    <div className="py-5 mt-5 font-sans">
      <div className='gap-2 md:gap-4 justify-items-center items-center grid grid-cols-2 sm:grid-cols-3'>
        <label className="input w-45">
          <Search />
          <input onChange={handleSearch} id="search" type="search" className="grow" placeholder="Buscar #ID" />
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
          {!isSearching ? (patients.map((patient) => {
            return (
              <tr key={patient._id}>
                <th>{`${patient.firstName} ${patient.lastName}`}</th>
                <td>{patient?.idType || ''} {patient?.idNumber || ''}</td>
                <td><Link className='hover:text-lightSand' to={`/details/${patient._id}`}>Ver/Editar</Link></td>
                <td className='hidden sm:block hover:text-lightSand'><Link to={`/odontogram/${patient._id}`}>Modificar</Link></td>
                <td><Link className='hover:text-lightSand' to={`/evolution/${patient._id}`}>Agregar</Link></td>
              </tr>
            )
          })) : (searchResults.map((patient) => {
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
    </div>
  )
}

export default Patients