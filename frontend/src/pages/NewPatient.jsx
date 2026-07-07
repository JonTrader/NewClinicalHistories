import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { usePatientStore } from '../store/PatientStore.js'
import { LoaderIcon, ArrowLeft } from 'lucide-react'
import { antecedentesMedicos } from '../lib/patientHelper.js'
import FieldsetInput from '../components/FieldsetInput.jsx'
import SelectInput from '../components/SelectInput.jsx'
import FieldsetTextarea from '../components/FieldsetTextarea.jsx'
import RecordSection from '../components/RecordSection.jsx'

function NewPatient() {
  const [formData, setFormData] = useState({
    medicalHistoryQuestions: Array(22).fill('No refiere'),
    dentalHistoryQuestions: Array(2).fill('No refiere')
  })
  const [activeSection, setActiveSection] = useState('basic')
  const { isCreatingPatient, createPatient } = usePatientStore()
  const navigate = useNavigate()

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

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId)
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const sections = [
    { id: 'basic', title: 'Información básica' },
    { id: 'emergency', title: 'Contacto de emergencia' },
    { id: 'motive', title: 'Motivo de consulta' },
    { id: 'medical', title: 'Antecedentes médicos' },
    { id: 'dental', title: 'Antecedentes odontológicos' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-body text-lightBone">
      <form onSubmit={handleSubmit}>
        <div className="bg-blueSteel/30 border border-blueSteel rounded-lg p-6 mb-8">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-lightOcre hover:text-lightBone transition-colors duration-150">
            <ArrowLeft className="w-4 h-4" />
            Volver a pacientes
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-lightBone mt-4">
            Nuevo paciente
          </h1>
          <p className="text-lightOcre/80 mt-2 text-sm">
            Completa la información para crear la historia clínica.
          </p>
        </div>

        <div className="sticky top-0 z-10 bg-blueSteel/95 backdrop-blur-sm border-y border-blueSteel py-3 mb-8 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto pb-1">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-body whitespace-nowrap transition-colors duration-150 ${
                  activeSection === section.id
                    ? 'bg-lightOcre text-blueDeep'
                    : 'bg-blueDeep text-lightBone border border-blueSteel hover:border-lightOcre hover:text-lightOcre'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <RecordSection id="basic" title="Información básica">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <FieldsetInput required onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} label={'Nombre(s)'} value={formData.firstName} />
              <FieldsetInput required onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} label={'Apellido(s)'} value={formData.lastName} />
              <FieldsetInput type={'email'} onChange={(e) => setFormData({ ...formData, email: e.target.value })} label={'Correo electrónico'} value={formData.email} />
              <FieldsetInput type={'tel'} onChange={(e) => setFormData({ ...formData, contactNumber: parseInt(e.target.value) })} label={'Teléfono'} value={formData.contactNumber} />
              <FieldsetInput type="date" onChange={(e) => setFormData({ ...formData, dob: e.target.value })} label={'Fecha de nacimiento'} value={formData.dob} />
              <SelectInput value={formData.gender} label={'Sexo'} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                <option value="Hombre">Hombre</option>
                <option value="Mujer">Mujer</option>
              </SelectInput>
              <SelectInput value={formData.idType} label={'Tipo de identificación'} onChange={(e) => setFormData({ ...formData, idType: e.target.value })}>
                <option value="C.C">C.C</option>
                <option value="C.I">C.I</option>
                <option value="C.E">C.E</option>
                <option value="Pasaporte">Pasaporte</option>
              </SelectInput>
              <FieldsetInput type="tel" onChange={(e) => setFormData({ ...formData, idNumber: parseInt(e.target.value) })} label={'Número de identificación'} value={formData.idNumber} />
              <SelectInput value={formData.civilStatus} label={'Estado civil'} onChange={(e) => setFormData({ ...formData, civilStatus: e.target.value })}>
                <option value="Soltero">Soltero</option>
                <option value="Casado">Casado</option>
                <option value="Viudo">Viudo</option>
                <option value="Divorciado">Divorciado</option>
                <option value="Union Libre">Unión libre</option>
              </SelectInput>
              <FieldsetInput type="text" onChange={(e) => setFormData({ ...formData, address: e.target.value })} label={'Dirección'} value={formData.address} />
              <FieldsetInput type="text" onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })} label={'Lugar de nacimiento'} value={formData.birthPlace} />
              <FieldsetInput type="text" onChange={(e) => setFormData({ ...formData, epsName: e.target.value })} label={'EPS'} value={formData.epsName} />
              <SelectInput value={formData.epsType} label={'Tipo de EPS'} onChange={(e) => setFormData({ ...formData, epsType: e.target.value })}>
                <option value="Contributivo">Contributivo</option>
                <option value="Subsidiado">Subsidiado</option>
                <option value="Beneficiario">Beneficiario</option>
              </SelectInput>
              <SelectInput value={formData.bloodType} label={'Tipo de sangre'} onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}>
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
          </RecordSection>

          <RecordSection id="emergency" title="Contacto de emergencia">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <FieldsetInput type="text" onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })} label={'Nombre completo'} value={formData.emergencyContactName} />
              <FieldsetInput type="tel" onChange={(e) => setFormData({ ...formData, emergencyContactNumber: parseInt(e.target.value) })} label={'Teléfono'} value={formData.emergencyContactNumber} />
              <FieldsetInput type="text" onChange={(e) => setFormData({ ...formData, emergencyContactRelationship: e.target.value })} label={'Parentesco'} value={formData.emergencyContactRelationship} />
            </div>
          </RecordSection>

          <RecordSection id="motive" title="Motivo de consulta">
            <FieldsetTextarea label={'Motivo de consulta'} text={formData?.motive} onChange={(e) => setFormData({ ...formData, motive: e.target.value })} />
          </RecordSection>

          <RecordSection id="medical" title="Antecedentes médicos">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {antecedentesMedicos.map((question, index) => (
                <FieldsetTextarea
                  key={index}
                  label={`${index + 1}. ${question}`}
                  text={formData.medicalHistoryQuestions[index]}
                  onChange={(e) => updateArray('medicalHistoryQuestions', index, e.target.value)}
                />
              ))}
            </div>
          </RecordSection>

          <RecordSection id="dental" title="Antecedentes odontológicos">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FieldsetTextarea label={'1. ¿Anestesia local? ¿Reacción?'} text={formData.dentalHistoryQuestions[0]} onChange={(e) => updateArray('dentalHistoryQuestions', 0, e.target.value)} />
              <FieldsetTextarea label={'2. ¿Última visita al odontólogo? ¿Tratamiento?'} text={formData.dentalHistoryQuestions[1]} onChange={(e) => updateArray('dentalHistoryQuestions', 1, e.target.value)} />
            </div>
          </RecordSection>
        </div>

        <div className="flex justify-end gap-3 pt-8 mt-8 border-t border-blueSteel">
          <Link
            to="/"
            className="btn btn-md bg-blueDeep text-lightBone border-blueSteel hover:border-lightOcre hover:text-lightOcre font-body"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="btn btn-md bg-lightOcre text-blueDeep hover:bg-lightSand border-none font-body"
          >
            {isCreatingPatient ? <LoaderIcon className='w-5 h-5 animate-spin' /> : 'Crear paciente'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewPatient
