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
    <div className="mt-10 font-serif">
      <table className="table table-xs lg:table-md text-center">
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
          {patients.map((patient) => {
            return (
            <tr key={patient._id}>
              <th>{`${patient.firstName} ${patient.lastName}`}</th>
              <td>{patient?.idType || ''} {patient?.idNumber || ''}</td>
              <td><Link className='hover:text-lightSand' to={`/details/${patient._id}`}>Ver/Editar</Link></td>
              <td className='hidden sm:block hover:text-lightSand'><Link to={`/odontogram/${patient._id}`}>Modificar</Link></td>
              <td><Link className='hover:text-lightSand' to={`/evolution/${patient._id}`}>Agregar</Link></td>
            </tr>
          )})}
        </tbody>
      </table>
    </div>
  )
}

export default Patients