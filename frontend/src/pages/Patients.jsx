import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { usePatientStore } from '../store/PatientStore.js'
import { Plus } from 'lucide-react'
import TableSkeleton from '../components/TableSkeleton.jsx'

function Patients() {
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const { patients, getAllPatients, isPatientsLoading } = usePatientStore()

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
    <div className="mt-10 font-serif">
      <div className='gap-2 md:gap-4 justify-items-center grid grid-cols-2 sm:grid-cols-4'>
        <label className="input w-45">
          <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input onChange={handleSearch} id="search" type="search" className="grow" placeholder="Buscar" />
        </label>
        <div></div>
        <div></div>
        <Link to="/new" className="btn mr-4 bg-blueSteel hover:text-lightOcre"><Plus /></Link>
      </div>
      <table className="mt-10 table table-xs lg:table-md text-center">
        <thead>
          <tr >
            <th>Nombre</th>
            <th># Id</th>
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