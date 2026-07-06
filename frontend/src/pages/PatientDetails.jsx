import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router'
import { usePatientStore } from '../store/PatientStore.js'
import { LoaderIcon, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { ax } from '../lib/axios.js'
import { antecedentesMedicos } from '../lib/patientHelper.js'
import FieldsetInput from '../components/FieldsetInput.jsx'
import SelectInput from '../components/SelectInput.jsx'
import FieldsetTextarea from '../components/FieldsetTextarea.jsx'
import PageLoader from '../components/PageLoader.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'
import RecordSection from '../components/RecordSection.jsx'

function calculateAge(dob) {
  if (!dob) return null
  const birthDate = new Date(dob)
  if (isNaN(birthDate.getTime())) return null
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-blueDeep text-lightOcre text-xs font-mono border border-blueSteel">
      {children}
    </span>
  )
}

function PatientDetails() {
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('basic')
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
        toast.error(error.response?.data?.message || 'Problema cargando detalles de paciente')
      } finally {
        setIsLoading(false)
      }
    }
    fetchPatient(id)
  }, [id])

  const updateArray = (keyName, index, value) => {
    setFormData(prev => ({
      ...prev,
      [keyName]: prev[keyName].map((item, i) => i === index ? value : item)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updatePatient(id, formData)
    setIsEditing(false)
  }

  const handleDelete = () => {
    deletePatient(id)
    navigate('/')
  }

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId)
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (isLoading) return <PageLoader />

  const sections = [
    { id: 'basic', title: 'Información básica' },
    { id: 'emergency', title: 'Contacto de emergencia' },
    { id: 'motive', title: 'Motivo de consulta' },
    { id: 'medical', title: 'Antecedentes médicos' },
    { id: 'dental', title: 'Antecedentes odontológicos' },
  ]

  const age = calculateAge(formData.dob)

  return (
    <>
      <ConfirmModal isOpen={isModalOpen} onCancel={() => setIsModalOpen(false)} onConfirm={handleDelete} isLoading={isDeletingPatient} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-body text-lightBone">
        <form onSubmit={handleSubmit}>
          <div className="bg-blueSteel/30 border border-blueSteel rounded-lg p-6 mb-8">
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-lightOcre hover:text-lightBone transition-colors duration-150">
              <ArrowLeft className="w-4 h-4" />
              Volver a pacientes
            </Link>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-4">
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-lightBone">
                  {formData.firstName} {formData.lastName}
                </h1>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge>{formData.idType} {formData.idNumber}</Badge>
                  {age !== null && <Badge>{age} años</Badge>}
                  {formData.gender && <Badge>{formData.gender}</Badge>}
                  {formData.bloodType && <Badge>Tipo {formData.bloodType}</Badge>}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(wasEditing => !wasEditing)}
                  className="btn btn-md bg-blueDeep text-lightBone border-blueSteel hover:border-lightOcre hover:text-lightOcre font-body"
                >
                  {isEditing ? 'Dejar de editar' : 'Editar paciente'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="btn btn-md bg-red-700 hover:bg-red-800 text-lightSand font-body"
                >
                  Eliminar paciente
                </button>
              </div>
            </div>
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
                <FieldsetInput disabled={!isEditing} required onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} label={'Nombre(s)'} value={formData.firstName} />
                <FieldsetInput disabled={!isEditing} required onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} label={'Apellido(s)'} value={formData.lastName} />
                <FieldsetInput disabled={!isEditing} type={'email'} onChange={(e) => setFormData({ ...formData, email: e.target.value })} label={'Correo electrónico'} value={formData.email} />
                <FieldsetInput disabled={!isEditing} type={'tel'} onChange={(e) => setFormData({ ...formData, contactNumber: parseInt(e.target.value) })} label={'Teléfono'} value={formData.contactNumber} />
                <FieldsetInput disabled={!isEditing} type="date" onChange={(e) => setFormData({ ...formData, dob: e.target.value })} label={'Fecha de nacimiento'} value={formData.dob} />
                <SelectInput value={formData.gender} disabled={!isEditing} label={'Sexo'} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                  <option value="Hombre">Hombre</option>
                  <option value="Mujer">Mujer</option>
                </SelectInput>
                <SelectInput value={formData.idType} disabled={!isEditing} label={'Tipo de identificación'} onChange={(e) => setFormData({ ...formData, idType: e.target.value })}>
                  <option value="C.C">C.C</option>
                  <option value="C.I">C.I</option>
                  <option value="C.E">C.E</option>
                  <option value="Pasaporte">Pasaporte</option>
                </SelectInput>
                <FieldsetInput disabled={!isEditing} type="tel" onChange={(e) => setFormData({ ...formData, idNumber: parseInt(e.target.value) })} label={'Número de identificación'} value={formData.idNumber} />
                <SelectInput disabled={!isEditing} value={formData.civilStatus} label={'Estado civil'} onChange={(e) => setFormData({ ...formData, civilStatus: e.target.value })}>
                  <option value="Soltero">Soltero</option>
                  <option value="Casado">Casado</option>
                  <option value="Viudo">Viudo</option>
                  <option value="Divorciado">Divorciado</option>
                  <option value="Union Libre">Unión libre</option>
                </SelectInput>
                <FieldsetInput disabled={!isEditing} type="text" onChange={(e) => setFormData({ ...formData, address: e.target.value })} label={'Dirección'} value={formData.address} />
                <FieldsetInput disabled={!isEditing} type="text" onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })} label={'Lugar de nacimiento'} value={formData.birthPlace} />
                <FieldsetInput disabled={!isEditing} type="text" onChange={(e) => setFormData({ ...formData, epsName: e.target.value })} label={'EPS'} value={formData.epsName} />
                <SelectInput value={formData.epsType} disabled={!isEditing} label={'Tipo de EPS'} onChange={(e) => setFormData({ ...formData, epsType: e.target.value })}>
                  <option value="Contributivo">Contributivo</option>
                  <option value="Subsidiado">Subsidiado</option>
                  <option value="Beneficiario">Beneficiario</option>
                </SelectInput>
                <SelectInput value={formData.bloodType} disabled={!isEditing} label={'Tipo de sangre'} onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}>
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
                <FieldsetInput disabled={!isEditing} type="text" onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })} label={'Nombre completo'} value={formData.emergencyContactName} />
                <FieldsetInput disabled={!isEditing} type="tel" onChange={(e) => setFormData({ ...formData, emergencyContactNumber: parseInt(e.target.value) })} label={'Teléfono'} value={formData.emergencyContactNumber} />
                <FieldsetInput disabled={!isEditing} type="text" onChange={(e) => setFormData({ ...formData, emergencyContactRelationship: e.target.value })} label={'Parentesco'} value={formData.emergencyContactRelationship} />
              </div>
            </RecordSection>

            <RecordSection id="motive" title="Motivo de consulta">
              <FieldsetTextarea disabled={!isEditing} label={'Motivo de consulta'} text={formData?.motive} onChange={(e) => setFormData({ ...formData, motive: e.target.value })} />
            </RecordSection>

            <RecordSection id="medical" title="Antecedentes médicos">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {antecedentesMedicos.map((question, index) => (
                  <FieldsetTextarea
                    key={index}
                    disabled={!isEditing}
                    label={`${index + 1}. ${question}`}
                    text={formData.medicalHistoryQuestions[index]}
                    onChange={(e) => updateArray('medicalHistoryQuestions', index, e.target.value)}
                  />
                ))}
              </div>
            </RecordSection>

            <RecordSection id="dental" title="Antecedentes odontológicos">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FieldsetTextarea disabled={!isEditing} label={'1. ¿Anestesia local? ¿Reacción?'} text={formData.dentalHistoryQuestions[0]} onChange={(e) => updateArray('dentalHistoryQuestions', 0, e.target.value)} />
                <FieldsetTextarea disabled={!isEditing} label={'2. ¿Última visita al odontólogo? ¿Tratamiento?'} text={formData.dentalHistoryQuestions[1]} onChange={(e) => updateArray('dentalHistoryQuestions', 1, e.target.value)} />
              </div>
            </RecordSection>
          </div>

          {isEditing && (
            <div className="flex justify-end gap-3 pt-8 mt-8 border-t border-blueSteel">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-md bg-blueDeep text-lightBone border-blueSteel hover:border-lightOcre hover:text-lightOcre font-body"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-md bg-lightOcre text-blueDeep hover:bg-lightSand border-none font-body"
              >
                {isEditingPatient ? <LoaderIcon className='w-5 h-5 animate-spin' /> : 'Guardar cambios'}
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  )
}

export default PatientDetails
