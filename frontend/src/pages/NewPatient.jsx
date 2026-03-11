import { useState } from 'react'
import { useNavigate } from 'react-router'
import { usePatientStore } from '../store/PatientStore.js'
import { LoaderIcon } from 'lucide-react'
import { antecedentesMedicos } from '../lib/patientHelper.js'
import FieldsetInput from '../components/FieldsetInput.jsx'
import SelectInput from '../components/SelectInput.jsx'
import FieldsetTextarea from '../components/FieldsetTextarea.jsx'

function NewPatient() {
  const [formData, setFormData] = useState({
    medicalHistoryQuestions: Array(22).fill('No refiere'),
    dentalHistoryQuestions: Array(2).fill('No refiere')
  })
  const { isCreatingPatient, createPatient } = usePatientStore()
  const navigate = useNavigate()

  // helper function to update array
  const updateArray = (keyName, index, value) => {
    setFormData(prev => ({
      ...prev,
      [keyName]: prev[keyName].map((item, i) => i === index ? value : item)
    }))
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    createPatient(formData)
    navigate('/')
  }

  return (
    <form action="" onSubmit={handleSubmit}>
      <div className='p-6 md:p-24 font-serif text-lightOcre'>
        <div className='text-center'>
          <h2 className='text-3xl'>Informacion Basica</h2>
          <div className='mt-8 gap-2 md:gap-6 justify-items-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            <FieldsetInput id="firstName" required onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} label={'Nombre(s) *'} />
            <FieldsetInput id="lastName" required onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} label={'Apellido(s) *'} />
            <FieldsetInput id="email" type={'email'} onChange={(e) => setFormData({ ...formData, email: e.target.value })} label={'Correo Electronico'} />
            <FieldsetInput id="contactNumber" type={'tel'} onChange={(e) => setFormData({ ...formData, contactNumber: parseInt(e.target.value) })} label={'# de Telefono'} />
            <FieldsetInput id="dob" type="date" onChange={(e) => setFormData({ ...formData, dob: e.target.value })} label={'Fecha de Nacimiento'} />
            <SelectInput id="gender" value={formData.gender} label={'Sexo'} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
            </SelectInput>
            <SelectInput id="idType" value={formData.idType} label={'Tipo de Identificacion'} onChange={(e) => setFormData({ ...formData, idType: e.target.value })}>
              <option value="C.C">C.C</option>
              <option value="C.I">C.I</option>
              <option value="C.I">C.E</option>
              <option value="Pasaporte">Pasaporte</option>
            </SelectInput>
            <FieldsetInput id="idNumber" type="tel" onChange={(e) => setFormData({ ...formData, idNumber: parseInt(e.target.value) })} label={'# de Identificacion'} />
            <SelectInput id="civilStatus" value={formData.civilStatus} label={'Estado Civil'} onChange={(e) => setFormData({ ...formData, civilStatus: e.target.value })}>
              <option value="Soltero">Soltero</option>
              <option value="Casado">Casado</option>
              <option value="Viudo">Viudo</option>
              <option value="Divorciado">Divorciado</option>
              <option value="Union Libre">Union Libre</option>
            </SelectInput>
            <FieldsetInput id="address" type="text" onChange={(e) => setFormData({ ...formData, address: e.target.value })} label={'Direccion'} />
            <FieldsetInput id="birthPlace" type="text" onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })} label={'Lugar de Nacimiento'} />
            <FieldsetInput id="epsName" type="text" onChange={(e) => setFormData({ ...formData, epsName: e.target.value })} label={'EPS'} />
            <SelectInput id="epsType" value={formData.epsType} label={'Tipo EPS:'} onChange={(e) => setFormData({ ...formData, epsType: e.target.value })}>
              <option>Contributivo</option>
              <option>Subsidiado</option>
              <option>Beneficiario</option>
            </SelectInput>
            <SelectInput id="bloodType" value={formData.bloodType} label={'Tipo de Sangre'} onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>
            </SelectInput>
          </div>
        </div>
        <div className='mt-16 text-center '>
          <h2 className='text-3xl'>Contacto de Emergencia</h2>
          <div className='mt-8 gap-2 md:gap-6 justify-items-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
            <FieldsetInput id="emergencyContactName" type="text" onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })} label={'Nombre Completo'} />
            <FieldsetInput id="emergencyContactNumber" type="tel" onChange={(e) => setFormData({ ...formData, emergencyContactNumber: parseInt(e.target.value) })} label={'# de Telefono'} />
            <FieldsetInput id="emergencyContactRelationship" type="text" onChange={(e) => setFormData({ ...formData, emergencyContactRelationship: e.target.value })} label={'Parentesco'} />
          </div>
        </div>
        <div className='mt-16 text-center '>
          <h2 className='text-3xl'>Motivo de consulta</h2>
          <div className='mt-8 justify-items-center grid grid-cols-1'>
            <FieldsetTextarea id="motive" size={"lg:w-200 w-80 sm:w-96 md:w-156"} label={'Motivo'} onChange={(e) => setFormData({ ...formData, motive: e.target.value })} />
          </div>
        </div>
        <div className='mt-16 text-center'>
          <h2 className='text-3xl'>Antecedentes Medicos</h2>
          <div className=' mt-8 justify-items-center grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
            {antecedentesMedicos.map((question, index) => (
              <FieldsetTextarea key={index} id={`question${index}`} size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={`${index + 1}. ${question}`} text={formData.medicalHistoryQuestions[index]} onChange={(e) => updateArray('medicalHistoryQuestions', index, e.target.value)} />
            ))}
          </div>
        </div>
        <div className='mt-16 text-center'>
          <h2 className='text-3xl'>Antecedentes Odontologicos</h2>
          <div className=' mt-8 justify-items-center grid grid-cols-1 md:grid-cols-2'>
            <FieldsetTextarea id="history1" size={"lg:w-80 xl:w-125 w-80 sm:w-96 md:w-65"} label={'1. Anestesia local? Reaccion?'} text={formData.dentalHistoryQuestions[0]} onChange={(e) => updateArray('dentalHistoryQuestions', 0, e.target.value)} />
            <FieldsetTextarea id="history2" size={"lg:w-80 xl:w-125 w-80 sm:w-96 md:w-65"} label={'2. Ultima visita al Odontologo? Tratamiento?'} text={formData.dentalHistoryQuestions[1]} onChange={(e) => updateArray('dentalHistoryQuestions', 1, e.target.value)} />
          </div>
        </div>
        <div className='py-10 text-center'>
          <div className=' mt-4 justify-items-center sm:justify-items-center grid grid-cols-1'>
            <button className='btn btn-md w-35 text-xs text-lightSand bg-blueDeep hover:text-lightOcre transition-colors'>{isCreatingPatient ? <LoaderIcon className='w-full h-5 animate-spin text-center' /> : 'Crear Paciente'}</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default NewPatient