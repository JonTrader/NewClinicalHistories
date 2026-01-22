import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { usePatientStore } from '../store/PatientStore.js'
import { LoaderIcon } from 'lucide-react'
import InputFieldset from '../components/InputFieldset.jsx'
import InputSelect from '../components/InputSelect.jsx'
import InputTextarea from '../components/InputTextarea.jsx'
import PageLoader from '../components/PageLoader.jsx'

function PatientDetails() {
  const [formData, setFormData] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const { updatePatient, isEditingPatient, getPatientDetails, isDetailsLoading } = usePatientStore()

  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPatient = async () => {
      const patientData = await getPatientDetails(id)
      if (patientData) {
        setFormData(patientData)
      }
    }
    fetchPatient()
  }, [id, getPatientDetails])

  // helper function to update array
  const updateArray = (keyName, index, value) => {
    setFormData(prev => ({
      ...prev,
      [keyName]: (prev[keyName] || []).map((item, i) => i === index ? value : item)
    }))
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    updatePatient(id, formData)
    navigate('/')
  }

  if (isDetailsLoading) return <PageLoader />

  return (
    <>
      <div className='py-4 gap-2 md:gap-6 justify-items-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        <button onClick={() => setIsEditing( wasEditing => !wasEditing)} className='btn btn-md'>{isEditing ? 'Ver' : 'Modifica'} Paciente</button>
      </div>
      <form action="" onSubmit={handleSubmit} className='font-serif text-[#E0C6AB]'>
        <div className='p-6 md:p-20'>
          <div className='text-center'>
            <h2 className='text-2xl'>Informacion Basica</h2>
            <div className='mt-2 gap-2 md:gap-6 justify-items-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              <InputFieldset disabled={!isEditing} required onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} label={'Nombre(s) *'} value={formData.firstName ?? ''} />
              <InputFieldset disabled={!isEditing} required onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} label={'Apellido(s) *'} value={formData.lastName ?? ''} />
              <InputFieldset disabled={!isEditing} type={'email'} onChange={(e) => setFormData({ ...formData, email: e.target.value })} label={'Correo Electronico'} value={formData.email ?? ''} />
              <InputFieldset disabled={!isEditing} type={'tel'} onChange={(e) => setFormData({ ...formData, contactNumber: parseInt(e.target.value) })} label={'# de Telefono'} value={formData.contactNumber ?? ''} />
              <InputFieldset disabled={!isEditing} type="date" onChange={(e) => setFormData({ ...formData, dob: e.target.value })} label={'Fecha de Nacimiento'} value={formData.dob ?? ''} />
              <InputSelect value={formData.gender ?? ''} disabled={!isEditing} label={'Sexo'} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                <option value="Hombre">Hombre</option>
                <option value="Mujer">Mujer</option>
              </InputSelect>
              <InputSelect value={formData.idType ?? ''} disabled={!isEditing} label={'Tipo de Identificacion'} onChange={(e) => setFormData({ ...formData, idType: e.target.value })}>
                <option value="C.C">C.C</option>
                <option value="C.I">C.I</option>
                <option value="C.I">C.E</option>
                <option value="Pasaporte">Pasaporte</option>
              </InputSelect>
              <InputFieldset disabled={!isEditing} type="tel" onChange={(e) => setFormData({ ...formData, idNumber: parseInt(e.target.value) })} label={'# de Identificacion'} value={formData.idNumber ?? ''} />
              <InputSelect disabled={!isEditing} value={formData.civilStatus ?? ''} label={'Estado Civil'} onChange={(e) => setFormData({ ...formData, civilStatus: e.target.value })}>
                <option value="Soltero">Soltero</option>
                <option value="Casado">Casado</option>
                <option value="Viudo">Viudo</option>
                <option value="Divorciado">Divorciado</option>
                <option value="Union Libre">Union Libre</option>
              </InputSelect>
              <InputFieldset disabled={!isEditing} type="text" onChange={(e) => setFormData({ ...formData, address: e.target.value })} label={'Direccion'} value={formData.address ?? ''} />
              <InputFieldset disabled={!isEditing} type="text" onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })} label={'Lugar de Nacimiento'} value={formData.birthPlace ?? ''} />
              <InputFieldset disabled={!isEditing} type="text" onChange={(e) => setFormData({ ...formData, epsName: e.target.value })} label={'EPS'} value={formData.epsName ?? ''} />
              <InputSelect value={formData.epsType ?? ''} disabled={!isEditing} label={'Tipo EPS:'} onChange={(e) => setFormData({ ...formData, epsType: e.target.value })}>
                <option value="Contributivo">Contributivo</option>
                <option value="Subsidiado">Subsidiado</option>
                <option value="Beneficiario">Beneficiario</option>
              </InputSelect>
              <InputSelect value={formData.bloodType ?? ''} disabled={!isEditing} label={'Tipo de Sangre'} onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </InputSelect>
            </div>
          </div>
          <div className='mt-16 text-center '>
            <h2 className='text-2xl'>Contacto de Emergencia</h2>
            <div className='mt-2 gap-2 md:gap-6 justify-items-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
              <InputFieldset disabled={!isEditing} type="text" onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })} label={'Nombre Completo'} value={formData.emergencyContactName ?? ''} />
              <InputFieldset disabled={!isEditing} type="tel" onChange={(e) => setFormData({ ...formData, emergencyContactNumber: parseInt(e.target.value) })} label={'# de Telefono'} value={formData.emergencyContactNumber ?? ''} />
              <InputFieldset disabled={!isEditing} type="text" onChange={(e) => setFormData({ ...formData, emergencyContactRelationship: e.target.value })} label={'Parentesco'} value={formData.emergencyContactRelationship ?? ''} />
            </div>
          </div>
          <div className='mt-16 text-center '>
            <h2 className='text-2xl'>Motivo de consulta</h2>
            <div className='mt-2 justify-items-center grid grid-cols-1'>
              <InputTextarea disabled={!isEditing} size={"lg:w-200 w-80 sm:w-96 md:w-156"} label={'Motivo'} text={formData.motive ?? ''} onChange={(e) => setFormData({ ...formData, motive: e.target.value })} />
            </div>
          </div>
          <div className='mt-16 text-center'>
            <h2 className='text-2xl'>Antecedentes Medicos</h2>
            <div className=' mt-2 justify-items-center grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
              <InputTextarea disabled={!isEditing} size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'1. Antecedentes alregicos?'} text={formData.medicalHistoryQuestions?.[0] ?? ''} onChange={(e) => updateArray('medicalHistoryQuestions', 0, e.target.value)} />
              <InputTextarea disabled={!isEditing} size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'2. Cardiovasculares?'} text={formData.medicalHistoryQuestions?.[1] ?? ''} onChange={(e) => updateArray('medicalHistoryQuestions', 1, e.target.value)} />
              <InputTextarea disabled={!isEditing} size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'3. Neurológicos?'} text={formData.medicalHistoryQuestions?.[2] ?? ''} onChange={(e) => updateArray('medicalHistoryQuestions', 2, e.target.value)} />
              <InputTextarea disabled={!isEditing} size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'4. Hemadinámicos?'} text={formData.medicalHistoryQuestions?.[3] ?? ''} onChange={(e) => updateArray('medicalHistoryQuestions', 3, e.target.value)} />
              <InputTextarea disabled={!isEditing} size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'5. Infeccionsos?'} text={formData.medicalHistoryQuestions?.[4] ?? ''} onChange={(e) => updateArray('medicalHistoryQuestions', 4, e.target.value)} />
              <InputTextarea disabled={!isEditing} size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'6. Hormonales?'} text={formData.medicalHistoryQuestions?.[5] ?? ''} onChange={(e) => updateArray('medicalHistoryQuestions', 5, e.target.value)} />
              <InputTextarea disabled={!isEditing} size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'7. Gastrointestinales?'} text={formData.medicalHistoryQuestions?.[6] ?? ''} onChange={(e) => updateArray('medicalHistoryQuestions', 6, e.target.value)} />
              <InputTextarea disabled={!isEditing} size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'8. Respiratorios?'} text={formData.medicalHistoryQuestions?.[7] ?? ''} onChange={(e) => updateArray('medicalHistoryQuestions', 7, e.target.value)} />
              <InputTextarea disabled={!isEditing} size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'9. Medico Quirurigicos?'} text={formData.medicalHistoryQuestions?.[8] ?? ''} onChange={(e) => updateArray('medicalHistoryQuestions', 8, e.target.value)} />
              <InputTextarea disabled={!isEditing} size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'10. Hijos?'} text={formData.medicalHistoryQuestions?.[9] ?? ''} onChange={(e) => updateArray('medicalHistoryQuestions', 9, e.target.value)} />
              <InputTextarea disabled={!isEditing} size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'11. Traumático?'} text={formData.medicalHistoryQuestions?.[10] ?? ''} onChange={(e) => updateArray('medicalHistoryQuestions', 10, e.target.value)} />
              <InputTextarea disabled={!isEditing} size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'12. Renales?'} text={formData.medicalHistoryQuestions?.[11] ?? ''} onChange={(e) => updateArray('medicalHistoryQuestions', 11, e.target.value)} />
              <InputTextarea disabled={!isEditing} size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'13. Psicologicos y/o Psiquiatricos?'} text={formData.medicalHistoryQuestions?.[12] ?? ''} onChange={(e) => updateArray('medicalHistoryQuestions', 12, e.target.value)} />
              <InputTextarea disabled={!isEditing} size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'14. Cáncer?'} text={formData.medicalHistoryQuestions?.[13] ?? ''} onChange={(e) => updateArray('medicalHistoryQuestions', 13, e.target.value)} />
              <InputTextarea disabled={!isEditing} size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'15. Osteoporosis?'} text={formData.medicalHistoryQuestions?.[14] ?? ''} onChange={(e) => updateArray('medicalHistoryQuestions', 14, e.target.value)} />
              <InputTextarea disabled={!isEditing} size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'16. Condición de discapacidad?'} text={formData.medicalHistoryQuestions?.[15] ?? ''} onChange={(e) => updateArray('medicalHistoryQuestions', 15, e.target.value)} />
              <InputTextarea disabled={!isEditing} size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'17. Consumo de Alcohol?'} text={formData.medicalHistoryQuestions?.[16] ?? ''} onChange={(e) => updateArray('medicalHistoryQuestions', 16, e.target.value)} />
              <InputTextarea disabled={!isEditing} size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'18. Consumo de Tabaco?'} text={formData.medicalHistoryQuestions?.[17] ?? ''} onChange={(e) => updateArray('medicalHistoryQuestions', 17, e.target.value)} />
              <InputTextarea disabled={!isEditing} size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'19. Consumo otras sustancias?'} text={formData.medicalHistoryQuestions?.[18] ?? ''} onChange={(e) => updateArray('medicalHistoryQuestions', 18, e.target.value)} />
              <InputTextarea disabled={!isEditing} size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'20. Otro, cual?'} text={formData.medicalHistoryQuestions?.[19] ?? ''} onChange={(e) => updateArray('medicalHistoryQuestions', 19, e.target.value)} />
              <InputTextarea disabled={!isEditing} size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'21. Ha sido hospitalizado?'} text={formData.medicalHistoryQuestions?.[20] ?? ''} onChange={(e) => updateArray('medicalHistoryQuestions', 20, e.target.value)} />
              <InputTextarea disabled={!isEditing} size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'22. Tomando algun medicamento?'} text={formData.medicalHistoryQuestions?.[21] ?? ''} onChange={(e) => updateArray('medicalHistoryQuestions', 21, e.target.value)} />
            </div>
          </div>
          <div className='mt-16 text-center'>
            <h2 className='text-2xl'>Antecedentes Odontologicos</h2>
            <div className=' mt-2 justify-items-center grid grid-cols-1 md:grid-cols-2'>
              <InputTextarea disabled={!isEditing} size={"lg:w-80 xl:w-125 w-80 sm:w-96 md:w-65"} label={'1. Anestesia local? Reaccion?'} text={formData.dentalHistoryQuestions?.[0] ?? ''} onChange={(e) => updateArray('dentalHistoryQuestions', 0, e.target.value)} />
              <InputTextarea disabled={!isEditing} size={"lg:w-80 xl:w-125 w-80 sm:w-96 md:w-65"} label={'2. Ultima visita al Odontologo? Tratamiento?'} text={formData.dentalHistoryQuestions?.[1] ?? ''} onChange={(e) => updateArray('dentalHistoryQuestions', 1, e.target.value)} />
            </div>
          </div>
          <div className='py-10 text-center'>
            <div className=' mt-4 justify-items-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              <button className='btn btn-md w-35 text-xs'>{isEditingPatient ? <LoaderIcon className='w-full h-5 animate-spin text-center' /> : 'Modificar Paciente'}</button>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}

export default PatientDetails