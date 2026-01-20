import { useState } from 'react'
import { usePatientStore } from '../store/PatientStore.js'
import { LoaderIcon } from 'react-hot-toast'
import Navbar from '../components/Navbar.jsx'

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
          <fieldset className="fieldset w-3/4">
            <p className="label">Nombre(s) *</p>
            <input required type="text" className="validator input input-sm" onChange={(e) => setFormData({...formData, firstName: e.target.value})}/>
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label">Apellido(s) *</p>
            <input required type="text" className="validator input input-sm" onChange={(e) => setFormData({...formData, lastName: e.target.value})}/>
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label">Correo Electronico</p>
            <input type="email" className="input input-sm" onChange={(e) => setFormData({...formData, email: e.target.value})}/>
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label"># de Telefono</p>
            <label className="input input-sm">
              <input
                type="tel"
                className="tabular-nums"
                placeholder=""
                pattern="[0-9]*"
                minLength="5"
                maxLength="15"
                onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
              />
            </label>
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label">Fecha de Nacimiento</p>
            <input type="date" className="input input-sm" onChange={(e) => setFormData({...formData, dob: e.target.value})}/>
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label">Sexo</p>
            <select defaultValue="Seleccione" className="select input-sm" onChange={(e) => setFormData({...formData, gender: e.target.value})}>
              <option disabled={true}>Seleccione</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
            </select>
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label">Tipo de Identificacion</p>
            <select defaultValue="Seleccione" className="select input-sm" onChange={(e) => setFormData({...formData, idType: e.target.value})}>
              <option disabled={true}>Seleccione</option>
              <option value="C.C">C.C</option>
              <option value="C.I">C.I</option>
              <option value="C.I">C.E</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label"># de Identificacion</p>
            <label className="input input-sm">
              <input
                type="tel"
                className="tabular-nums"
                placeholder=""
                pattern="[0-9]*"
                minLength="5"
                maxLength="20"
                onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
              />
            </label>
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label">Estado Civil</p>
            <select defaultValue="Seleccione" className="select input-sm" onChange={(e) => setFormData({...formData, civilStatus: e.target.value})}>
              <option disabled={true}>Seleccione</option>
              <option value="Soltero">Soltero</option>
              <option value="Casado">Casado</option>
              <option value="Viudo">Viudo</option>
              <option value="Divorciado">Divorciado</option>
              <option value="Union Libre">Union Libre</option>
            </select>
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label">Direccion</p>
            <input type="text" className="input input-sm" onChange={(e) => setFormData({...formData, address: e.target.value})}/>
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label">Lugar de Nacimiento</p>
            <input type="text" className="input input-sm" onChange={(e) => setFormData({...formData, birthPlace: e.target.value})}/>
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label">EPS</p>
            <input type="text" className="input input-sm" onChange={(e) => setFormData({...formData, epsName: e.target.value})}/>
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label">Tipo EPS:</p>
            <select className="select input-sm" defaultValue="Seleccione" onChange={(e) => setFormData({...formData, epsType: e.target.value})}>
              <option disabled={true}>Seleccione</option>
              <option>Contributivo</option>
              <option>Subsidiado</option>
              <option>Beneficiario</option>
            </select>
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label">Tipo de Sangre</p>
            <select defaultValue="Seleccione" className="select input-sm" onChange={(e) => setFormData({...formData, bloodType: e.target.value})}>
              <option disabled={true}>Seleccione</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>O-</option>
            </select>
          </fieldset>
        </div>
        <div className='mb-4 mt-16 text-center text-[#E0C6AB]'>
          <h2 className='text-2xl'>Contacto de Emergencia</h2>
        </div>
        <div className='gap-6 text-[#E0C6AB] justify-items-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          <fieldset className="fieldset w-3/4">
            <p className="label">Nombre Completo</p>
            <input type="text" className="input input-sm" onChange={(e) => setFormData({...formData, emergencyContactName: e.target.value})}/>
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label"># de Telefono</p>
            <label className="input input-sm">
              <input
                type="tel"
                className="tabular-nums"
                placeholder=""
                pattern="[0-9]*"
                minLength="5"
                maxLength="15"
                onChange={(e) => setFormData({...formData, emergencyContactNumber: e.target.value})}
              />
            </label>
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label">Parentesco</p>
            <input type="text" className="input input-sm" onChange={(e) => setFormData({...formData, emergencyContactRelationship: e.target.value})}/>
          </fieldset>
        </div>
        <div className='mb-4 mt-16 text-center text-[#E0C6AB]'>
          <h2 className='text-2xl'>Motivo de consulta</h2>
        </div>
        <div className='text-[#E0C6AB] justify-items-center grid grid-cols-1'>
          <fieldset className="fieldset">
            <div className="label">Motivo</div>
            <textarea className="textarea h-24 w-125" onChange={(e) => setFormData({...formData, motive: e.target.value})}></textarea>
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