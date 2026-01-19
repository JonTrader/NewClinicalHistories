import { useState } from 'react'
import { usePatientStore } from '../store/PatientStore.jsx'
import { LoaderIcon } from 'react-hot-toast'

function NewPatient() {
  const [formData, setFormData] = useState({})

  const { isCreatingPatient, createPatient } = usePatientStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    createPatient(formData)
  }

  return (
    <div>NewPatient</div>
  )
}

export default NewPatient