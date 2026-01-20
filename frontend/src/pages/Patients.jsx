import { useEffect } from 'react'
import { usePatientStore } from '../store/PatientStore.js'
import TableSkeleton from '../components/TableSkeleton.jsx'

function Patients() {
  const { patients, getAllPatients, isPatientsLoading } = usePatientStore()

  useEffect(() => {
    getAllPatients()
  }, [getAllPatients])

  if(isPatientsLoading) return <TableSkeleton />


  return (
    <div className="overflow-x-auto">
      <table className="table sm:table-lg table-xs">
        <thead>
          <tr>
            <th>Nombre</th>
            <th># Id</th>
            <th>Detalles</th>
            <th>Odontograma</th>
            <th>Evolucion</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => {
            return (
            <tr>
              <th>{`${patient.firstName} ${patient.lastName}`}</th>
              <td>{patient.identification?.idNumber || ''}</td>
              <td>Ver/Editar</td>
              <td>Modificar</td>
              <td>Agregar</td>
            </tr>
          )})}
        </tbody>
      </table>
    </div>
  )
}

export default Patients