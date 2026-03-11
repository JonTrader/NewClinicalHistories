import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { usePatientStore } from '../store/PatientStore.js'
import { LoaderIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { ax } from '../lib/axios.js'
import { antecedentesMedicos } from '../lib/patientHelper.js'
import FieldsetInput from '../components/FieldsetInput.jsx'
import SelectInput from '../components/SelectInput.jsx'
import FieldsetTextarea from '../components/FieldsetTextarea.jsx'
import PageLoader from '../components/PageLoader.jsx'

function PatientDetails() {
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const { updatePatient, isEditingPatient, isDeletingPatient, deletePatient } = usePatientStore()

  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPatient = async (id) => {
      try {
        const res = await ax.get(`/api/v1/patients/${id}`)
        setFormData(res.data)
      } catch (error) {
        console.error('Error in fetching patient: ', error)
        toast.error(error.response?.data?.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPatient(id)
  }, [id])

  // helper function to update array
  const updateArray = (keyName, index, value) => {
    setFormData(prev => ({
      ...prev,
      [keyName]: prev[keyName].map((item, i) => i === index ? value : item)
    }))
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    updatePatient(id, formData)
    navigate('/')
  }

  const handleDelete = (e) => {
    e.preventDefault()
    deletePatient(id)
    navigate('/')
  }

  if (isLoading) return <PageLoader />

  return (
    <>
      <div className='py-4 gap-2 md:gap-6 justify-items-center grid grid-cols-1 sm:grid-cols-4'>
        <button onClick={() => setIsEditing(wasEditing => !wasEditing)} className='btn btn-md w-35 text-xs'>{isEditing ? 'Ver' : 'Modifica'} Paciente</button>
        <div></div>
        <div></div>
        <button onClick={handleDelete} className='btn btn-md w-35 text-xs'>{isDeletingPatient ? <LoaderIcon className='w-full h-5 animate-spin text-center' /> : 'Borrar Paciente'}</button>
      </div>
      <form action="" onSubmit={handleSubmit} className='font-serif text-lightOcre'>
        <div className='p-6 md:p-24'>
          <div className='text-center'>
            <h2 className='text-3xl'>Informacion Basica</h2>
            <div className='mt-8 gap-2 md:gap-6 justify-items-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              <FieldsetInput disabled={!isEditing} required onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} label={'Nombre(s) *'} value={formData.firstName} />
              <FieldsetInput disabled={!isEditing} required onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} label={'Apellido(s) *'} value={formData.lastName} />
              <FieldsetInput disabled={!isEditing} type={'email'} onChange={(e) => setFormData({ ...formData, email: e.target.value })} label={'Correo Electronico'} value={formData.email} />
              <FieldsetInput disabled={!isEditing} type={'tel'} onChange={(e) => setFormData({ ...formData, contactNumber: parseInt(e.target.value) })} label={'# de Telefono'} value={formData.contactNumber} />
              <FieldsetInput disabled={!isEditing} type="date" onChange={(e) => setFormData({ ...formData, dob: e.target.value })} label={'Fecha de Nacimiento'} value={formData.dob} />
              <SelectInput value={formData.gender} disabled={!isEditing} label={'Sexo'} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                <option value="Hombre">Hombre</option>
                <option value="Mujer">Mujer</option>
              </SelectInput>
              <SelectInput value={formData.idType} disabled={!isEditing} label={'Tipo de Identificacion'} onChange={(e) => setFormData({ ...formData, idType: e.target.value })}>
                <option value="C.C">C.C</option>
                <option value="C.I">C.I</option>
                <option value="C.I">C.E</option>
                <option value="Pasaporte">Pasaporte</option>
              </SelectInput>
              <FieldsetInput disabled={!isEditing} type="tel" onChange={(e) => setFormData({ ...formData, idNumber: parseInt(e.target.value) })} label={'# de Identificacion'} value={formData.idNumber} />
              <SelectInput disabled={!isEditing} value={formData.civilStatus} label={'Estado Civil'} onChange={(e) => setFormData({ ...formData, civilStatus: e.target.value })}>
                <option value="Soltero">Soltero</option>
                <option value="Casado">Casado</option>
                <option value="Viudo">Viudo</option>
                <option value="Divorciado">Divorciado</option>
                <option value="Union Libre">Union Libre</option>
              </SelectInput>
              <FieldsetInput disabled={!isEditing} type="text" onChange={(e) => setFormData({ ...formData, address: e.target.value })} label={'Direccion'} value={formData.address} />
              <FieldsetInput disabled={!isEditing} type="text" onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })} label={'Lugar de Nacimiento'} value={formData.birthPlace} />
              <FieldsetInput disabled={!isEditing} type="text" onChange={(e) => setFormData({ ...formData, epsName: e.target.value })} label={'EPS'} value={formData.epsName} />
              <SelectInput value={formData.epsType} disabled={!isEditing} label={'Tipo EPS:'} onChange={(e) => setFormData({ ...formData, epsType: e.target.value })}>
                <option value="Contributivo">Contributivo</option>
                <option value="Subsidiado">Subsidiado</option>
                <option value="Beneficiario">Beneficiario</option>
              </SelectInput>
              <SelectInput value={formData.bloodType} disabled={!isEditing} label={'Tipo de Sangre'} onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </SelectInput>
            </div>
          </div>
          <div className='mt-16 text-center '>
            <h2 className='text-3xl'>Contacto de Emergencia</h2>
            <div className='mt-8 gap-2 md:gap-6 justify-items-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
              <FieldsetInput disabled={!isEditing} type="text" onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })} label={'Nombre Completo'} value={formData.emergencyContactName} />
              <FieldsetInput disabled={!isEditing} type="tel" onChange={(e) => setFormData({ ...formData, emergencyContactNumber: parseInt(e.target.value) })} label={'# de Telefono'} value={formData.emergencyContactNumber} />
              <FieldsetInput disabled={!isEditing} type="text" onChange={(e) => setFormData({ ...formData, emergencyContactRelationship: e.target.value })} label={'Parentesco'} value={formData.emergencyContactRelationship} />
            </div>
          </div>
          <div className='mt-16 text-center '>
            <h2 className='text-3xl'>Motivo de consulta</h2>
            <div className='mt-8 justify-items-center grid grid-cols-1'>
              <FieldsetTextarea disabled={!isEditing} size={"lg:w-200 w-80 sm:w-96 md:w-156"} label={'Motivo'} onChange={(e) => setFormData({ ...formData, motive: e.target.value })} />
            </div>
          </div>
          <div className='mt-16 text-center'>
            <h2 className='text-3xl'>Antecedentes Medicos</h2>
            <div className=' mt-8 justify-items-center grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
              {antecedentesMedicos.map((question, index) => (
                <FieldsetTextarea key={index} disabled={!isEditing} size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={`${index + 1} ${question}`} text={formData.medicalHistoryQuestions[index]} onChange={(e) => updateArray('medicalHistoryQuestions', index, e.target.value)} />
              ))}
            </div>
          </div>
          <div className='mt-16 text-center'>
            <h2 className='text-3xl'>Antecedentes Odontologicos</h2>
            <div className=' mt-8 justify-items-center grid grid-cols-1 md:grid-cols-2'>
              <FieldsetTextarea disabled={!isEditing} size={"lg:w-80 xl:w-125 w-80 sm:w-96 md:w-65"} label={'1. Anestesia local? Reaccion?'} text={formData.dentalHistoryQuestions[0]} onChange={(e) => updateArray('dentalHistoryQuestions', 0, e.target.value)} />
              <FieldsetTextarea disabled={!isEditing} size={"lg:w-80 xl:w-125 w-80 sm:w-96 md:w-65"} label={'2. Ultima visita al Odontologo? Tratamiento?'} text={formData.dentalHistoryQuestions[1]} onChange={(e) => updateArray('dentalHistoryQuestions', 1, e.target.value)} />
            </div>
          </div>
          <div className='py-10 text-center'>
            <div className=' mt-4 justify-items-center sm:justify-items-center grid grid-cols-1'>
              <button className='btn btn-md w-40 text-xs text-lightSand bg-blueDeep hover:text-lightOcre transition-colors'>{isEditingPatient ? <LoaderIcon className='w-full h-5 animate-spin text-center' /> : 'Modificar Paciente'}</button>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}

export default PatientDetails