import { useState } from 'react'
import { usePatientStore } from '../store/PatientStore.js'
import { LoaderIcon } from 'react-hot-toast'
import Navbar from '../components/Navbar.jsx'
import InputFieldset from '../components/InputFieldset.jsx'
import InputSelect from '../components/InputSelect.jsx'

function NewPatient() {
  const [formData, setFormData] = useState({})

  const { isCreatingPatient, createPatient } = usePatientStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
    // createPatient(formData)
  }

  return (
    <>
      <Navbar />
      <form action="" onSubmit={handleSubmit}>
        <div className='p-8 md:p-24 font-serif'>
          <div className='mb-4 text-center text-[#E0C6AB]'>
            <h2 className='text-3xl'>Informacion Basica</h2>
          </div>
          <div className='gap-6 text-[#E0C6AB] justify-items-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            <InputFieldset required onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} label={'Nombre(s) *'} />
            <InputFieldset required onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} label={'Apellido(s) *'} />
            <InputFieldset type={'email'} onChange={(e) => setFormData({ ...formData, email: e.target.value })} label={'Correo Electronico'} />
            <InputFieldset type={'tel'} onChange={(e) => setFormData({ ...formData, contactNumber: parseInt(e.target.value) })} label={'# de Telefono'} />
            <InputFieldset type="date" onChange={(e) => setFormData({ ...formData, dob: e.target.value })} label={'Fecha de Nacimiento'} />
            <InputSelect label={'Sexo'} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
            </InputSelect>
            <InputSelect label={'Tipo de Identificacion'} onChange={(e) => setFormData({ ...formData, idType: e.target.value })}>
              <option value="C.C">C.C</option>
              <option value="C.I">C.I</option>
              <option value="C.I">C.E</option>
              <option value="Pasaporte">Pasaporte</option>
            </InputSelect>
            <InputFieldset type="tel" onChange={(e) => setFormData({ ...formData, idNumber: parseInt(e.target.value) })} label={'# de Identificacion'} />
            <InputSelect label={'Estado Civil'} onChange={(e) => setFormData({ ...formData, civilStatus: e.target.value })}>
              <option value="Soltero">Soltero</option>
              <option value="Casado">Casado</option>
              <option value="Viudo">Viudo</option>
              <option value="Divorciado">Divorciado</option>
              <option value="Union Libre">Union Libre</option>
            </InputSelect>
            <InputFieldset type="text" onChange={(e) => setFormData({ ...formData, address: e.target.value })} label={'Direccion'} />
            <InputFieldset type="text" onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })} label={'Lugar de Nacimiento'} />
            <InputFieldset type="text" onChange={(e) => setFormData({ ...formData, epsName: e.target.value })} label={'EPS'} />
            <InputSelect label={'Tipo EPS:'} onChange={(e) => setFormData({ ...formData, epsType: e.target.value })}>
              <option>Contributivo</option>
              <option>Subsidiado</option>
              <option>Beneficiario</option>
            </InputSelect>
            <InputSelect label={'Tipo de Sangre'} onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>
            </InputSelect>
          </div>
          <div className='mb-4 mt-16 text-center text-[#E0C6AB]'>
            <h2 className='text-2xl'>Contacto de Emergencia</h2>
          </div>
          <div className='gap-6 text-[#E0C6AB] justify-items-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
            <InputFieldset type="text" onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })} label={'Nombre Completo'} />
            <InputFieldset type="tel" onChange={(e) => setFormData({ ...formData, emergencyContactNumber: parseInt(e.target.value) })} label={'# de Telefono'} />
            <InputFieldset type="text" onChange={(e) => setFormData({ ...formData, emergencyContactRelationship: e.target.value })} label={'Parentesco'} />
          </div>
          <div className='mb-4 mt-16 text-center text-[#E0C6AB]'>
            <h2 className='text-2xl'>Motivo de consulta</h2>
          </div>
          <div className='text-[#E0C6AB] justify-items-center grid grid-cols-1'>
            <fieldset className="fieldset">
              <div className="label">Motivo</div>
              <textarea className="textarea h-24 w-125" onChange={(e) => setFormData({ ...formData, motive: e.target.value })}></textarea>
            </fieldset>
          </div>

        </div>
        <div>
          <button className='btn'>Submit</button>
        </div>
      </form>
    </>
  )
}

export default NewPatient