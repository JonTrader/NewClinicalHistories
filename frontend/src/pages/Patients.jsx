import { useEffect } from 'react'
import {Link} from 'react-router'
import { usePatientStore } from '../store/PatientStore.js'
import TableSkeleton from '../components/TableSkeleton.jsx'

function Patients() {
  const { patients, getAllPatients, isPatientsLoading } = usePatientStore()

  useEffect(() => {
    getAllPatients()
  }, [getAllPatients])

  if(isPatientsLoading) return <TableSkeleton />


  return (
    <div className="mt-10">
      <table className="table table-xs text-center">
        <thead>
          <tr >
            <th>Nombre</th>
            <th># Id</th>
            <th>Detalles</th>
            <th className='hidden sm:block'>Odontograma</th>
            <th>Evolucion</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => {
            return (
            <tr key={patient._id}>
              <th>{`${patient.firstName} ${patient.lastName}`}</th>
              <td>{patient?.idNumber || ''}</td>
              <td><Link to={`/details/${patient._id}`}>Ver/Editar</Link></td>
              <td className='hidden sm:block'><Link>Modificar</Link></td>
              <td><Link>Agregar</Link></td>
            </tr>
          )})}
        </tbody>
      </table>
    </div>
  )
}

export default Patients