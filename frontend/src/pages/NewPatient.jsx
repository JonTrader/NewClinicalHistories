import { useState } from 'react'
import { useNavigate } from 'react-router'
import { usePatientStore } from '../store/PatientStore.js'
import { LoaderIcon } from 'lucide-react'
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
            <FieldsetTextarea id="question1" size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'1. Antecedentes alregicos?'} text={formData.medicalHistoryQuestions[0]} onChange={(e) => updateArray('medicalHistoryQuestions', 0, e.target.value)} />
            <FieldsetTextarea id="question2" size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'2. Cardiovasculares?'} text={formData.medicalHistoryQuestions[1]} onChange={(e) => updateArray('medicalHistoryQuestions', 1, e.target.value)} />
            <FieldsetTextarea id="question3" size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'3. Neurológicos?'} text={formData.medicalHistoryQuestions[2]} onChange={(e) => updateArray('medicalHistoryQuestions', 2, e.target.value)} />
            <FieldsetTextarea id="question4" size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'4. Hemadinámicos?'} text={formData.medicalHistoryQuestions[3]} onChange={(e) => updateArray('medicalHistoryQuestions', 3, e.target.value)} />
            <FieldsetTextarea id="question5" size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'5. Infeccionsos?'} text={formData.medicalHistoryQuestions[4]} onChange={(e) => updateArray('medicalHistoryQuestions', 4, e.target.value)} />
            <FieldsetTextarea id="question6" size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'6. Hormonales?'} text={formData.medicalHistoryQuestions[5]} onChange={(e) => updateArray('medicalHistoryQuestions', 5, e.target.value)} />
            <FieldsetTextarea id="question7" size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'7. Gastrointestinales?'} text={formData.medicalHistoryQuestions[6]} onChange={(e) => updateArray('medicalHistoryQuestions', 6, e.target.value)} />
            <FieldsetTextarea id="question8" size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'8. Respiratorios?'} text={formData.medicalHistoryQuestions[7]} onChange={(e) => updateArray('medicalHistoryQuestions', 7, e.target.value)} />
            <FieldsetTextarea id="question9" size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'9. Medico Quirurigicos?'} text={formData.medicalHistoryQuestions[8]} onChange={(e) => updateArray('medicalHistoryQuestions', 8, e.target.value)} />
            <FieldsetTextarea id="question10" size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'10. Hijos?'} text={formData.medicalHistoryQuestions[9]} onChange={(e) => updateArray('medicalHistoryQuestions', 9, e.target.value)} />
            <FieldsetTextarea id="question11" size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'11. Traumático?'} text={formData.medicalHistoryQuestions[10]} onChange={(e) => updateArray('medicalHistoryQuestions', 10, e.target.value)} />
            <FieldsetTextarea id="question12" size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'12. Renales?'} text={formData.medicalHistoryQuestions[11]} onChange={(e) => updateArray('medicalHistoryQuestions', 11, e.target.value)} />
            <FieldsetTextarea id="question13" size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'13. Psicologicos y/o Psiquiatricos?'} text={formData.medicalHistoryQuestions[12]} onChange={(e) => updateArray('medicalHistoryQuestions', 12, e.target.value)} />
            <FieldsetTextarea id="question14" size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'14. Cáncer?'} text={formData.medicalHistoryQuestions[13]} onChange={(e) => updateArray('medicalHistoryQuestions', 13, e.target.value)} />
            <FieldsetTextarea id="question15" size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'15. Osteoporosis?'} text={formData.medicalHistoryQuestions[14]} onChange={(e) => updateArray('medicalHistoryQuestions', 14, e.target.value)} />
            <FieldsetTextarea id="question16" size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'16. Condición de discapacidad?'} text={formData.medicalHistoryQuestions[15]} onChange={(e) => updateArray('medicalHistoryQuestions', 15, e.target.value)} />
            <FieldsetTextarea id="question17" size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'17. Consumo de Alcohol?'} text={formData.medicalHistoryQuestions[16]} onChange={(e) => updateArray('medicalHistoryQuestions', 16, e.target.value)} />
            <FieldsetTextarea id="question18" size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'18. Consumo de Tabaco?'} text={formData.medicalHistoryQuestions[17]} onChange={(e) => updateArray('medicalHistoryQuestions', 17, e.target.value)} />
            <FieldsetTextarea id="question19" size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'19. Consumo otras sustancias?'} text={formData.medicalHistoryQuestions[18]} onChange={(e) => updateArray('medicalHistoryQuestions', 18, e.target.value)} />
            <FieldsetTextarea id="question20" size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'20. Otro, cual?'} text={formData.medicalHistoryQuestions[19]} onChange={(e) => updateArray('medicalHistoryQuestions', 19, e.target.value)} />
            <FieldsetTextarea id="question21" size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'21. Ha sido hospitalizado?'} text={formData.medicalHistoryQuestions[20]} onChange={(e) => updateArray('medicalHistoryQuestions', 20, e.target.value)} />
            <FieldsetTextarea id="question22" size={"lg:w-80 w-80 sm:w-96 md:w-65"} label={'22. Tomando algun medicamento?'} text={formData.medicalHistoryQuestions[21]} onChange={(e) => updateArray('medicalHistoryQuestions', 21, e.target.value)} />
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