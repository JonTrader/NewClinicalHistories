import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { usePatientStore } from '../store/PatientStore.js'
import { Plus, Search, LoaderIcon } from 'lucide-react'
import TableSkeleton from '../components/TableSkeleton.jsx'
import { useAuthStore } from '../store/AuthStore.js'
import { useDebounce } from '../hooks/useDebounce.js'

function Patients() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const debouncedQuery = useDebounce(searchQuery, 300)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  const { patients, getAllPatients, isPatientsLoading, searchResults, isSearchLoading, searchPatients } = usePatientStore()
  const { authUser } = useAuthStore()
  const img = authUser?.logo

  useEffect(() => {
    getAllPatients()
  }, [getAllPatients])

  useEffect(() => {
    if (debouncedQuery.trim().length > 0) {
      searchPatients(debouncedQuery)
    } else {
      searchPatients('')
    }
  }, [debouncedQuery, searchPatients])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setShowDropdown(false)
      document.getElementById('search')?.blur()
    }
  }, [])

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value)
    if (e.target.value.trim().length > 0) {
      setShowDropdown(true)
    } else {
      setShowDropdown(false)
    }
  }

  const handleSelectPatient = (id) => {
    setShowDropdown(false)
    setSearchQuery('')
    navigate(`/details/${id}`)
  }

  if (isPatientsLoading) return <TableSkeleton />

  return (
    <div className="py-5 mt-5 font-sans">
      <div className='gap-2 md:gap-4 justify-items-center items-center grid grid-cols-2 sm:grid-cols-3'>
        <div className="relative" ref={dropdownRef}>
          <label className="input w-45">
            <Search />
            <input
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => { if (searchQuery.trim().length > 0) setShowDropdown(true) }}
              id="search"
              type="search"
              className="grow"
              placeholder="Buscar paciente..."
              value={searchQuery}
              autoComplete="off"
            />
          </label>
          {showDropdown && searchQuery.trim().length > 0 && (
            <ul className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
              {isSearchLoading ? (
                <li className="flex justify-center py-3">
                  <LoaderIcon className="w-5 h-5 animate-spin text-gray-400" />
                </li>
              ) : searchResults.length > 0 ? (
                searchResults.map((patient) => (
                  <li key={patient._id}>
                    <button
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 transition-colors cursor-pointer"
                      onClick={() => handleSelectPatient(patient._id)}
                    >
                      <span className="font-medium text-gray-800">{patient.firstName} {patient.lastName}</span>
                      <span className="ml-2 text-gray-500 text-xs">
                        {patient?.idType || ''} {patient?.idNumber || ''}
                      </span>
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-sm text-gray-400 text-center">Sin resultados</li>
              )}
            </ul>
          )}
        </div>
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
          {patients.map((patient) => {
            return (
              <tr key={patient._id}>
                <th>{`${patient.firstName} ${patient.lastName}`}</th>
                <td>{patient?.idType || ''} {patient?.idNumber || ''}</td>
                <td><Link className='hover:text-lightSand' to={`/details/${patient._id}`}>Ver/Editar</Link></td>
                <td className='hidden sm:block hover:text-lightSand'><Link to={`/odontogram/${patient._id}`}>Modificar</Link></td>
                <td><Link className='hover:text-lightSand' to={`/evolution/${patient._id}`}>Agregar</Link></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Patients