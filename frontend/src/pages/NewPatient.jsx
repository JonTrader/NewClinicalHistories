import { useState } from 'react'
import { usePatientStore } from '../store/PatientStore.js'
import { LoaderIcon } from 'react-hot-toast'

function NewPatient() {
  const [formData, setFormData] = useState({})

  const { isCreatingPatient, createPatient } = usePatientStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    createPatient(formData)
  }

  return (
    <form action="">
      <div className='p-8 md:p-24'>
        <div className='mb-10 text-center text-[#E0C6AB]'>
          <h2 className='text-2xl'>Informacion Basica</h2>
        </div>
        <div className='gap-6 text-[#E0C6AB] justify-items-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          <fieldset className="fieldset w-3/4">
            <p className="label">Nombre(s)</p>
            <input required type="text" className="validator input input-sm" />
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label">Apellido(s)</p>
            <input type="text" className="input input-sm" />
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label">Correo Electronico</p>
            <input type="email" className="input input-sm" />
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label"># de Telefono</p>
            <label className="input input-sm validator">
              <input
                type="tel"
                className="tabular-nums"
                placeholder=""
                pattern="[0-9]*"
                minLength="5"
                maxLength="15"
              />
            </label>
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label">Fecha de Nacimiento</p>
            <input type="date" className="input input-sm" />
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label">Sexo</p>
            <select defaultValue="Seleccione" className="select input-sm">
              <option disabled={true}>Seleccione</option>
              <option>Hombre</option>
              <option>Mujer</option>
            </select>
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label">Tipo de Identificacion</p>
            <select defaultValue="Seleccione" className="select input-sm">
              <option disabled={true}>Seleccione</option>
              <option>C.C</option>
              <option>C.I</option>
              <option>C.E</option>
              <option>Pasaporte</option>
            </select>
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label"># de Identificacion</p>
            <label className="input input-sm validator">
              <input
                type="tel"
                className="tabular-nums"
                required
                placeholder=""
                pattern="[0-9]*"
                minLength="1"
                maxLength="20"
              />
            </label>
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label">Estado Civil</p>
            <select defaultValue="Casado" className="select input-sm">
              <option disabled={true}>Seleccione</option>
              <option>Soltero</option>
              <option>Casado</option>
              <option>Viudo</option>
              <option>Divorciado</option>
              <option>Union Libre</option>
            </select>
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label">Direccion</p>
            <input type="text" className="input input-sm" />
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label">Lugar de Nacimiento</p>
            <input type="text" className="input input-sm" />
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label">EPS</p>
            <input type="text" className="input input-sm" />
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label">Tipo EPS:</p>
            <select className="select input-sm">
              <option disabled={true}>Seleccione</option>
              <option>Contributivo</option>
              <option>Subsidiado</option>
              <option>Beneficiario</option>
            </select>
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label">Tipo de Sangre</p>
            <select defaultValue="Estado Civil" className="select input-sm">
              <option disabled={true}>Seleccione</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
              <option>O+</option>
              <option>0-</option>
            </select>
          </fieldset>
        </div>
        <div className='m-10 text-center text-[#E0C6AB]'>
          <h2 className='text-2xl'>Contacto de Emergencia</h2>
        </div>
        <div className='gap-6 text-[#E0C6AB] justify-items-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          <fieldset className="fieldset w-3/4">
            <p className="label">Nombre Completo</p>
            <input required type="text" className="validator input input-sm" />
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label"># de Telefono</p>
            <label className="input input-sm validator">
              <input
                type="tel"
                className="tabular-nums"
                placeholder=""
                pattern="[0-9]*"
                minLength="5"
                maxLength="15"
              />
            </label>
          </fieldset>
          <fieldset className="fieldset w-3/4">
            <p className="label">Parentesco</p>
            <input required type="text" className="validator input input-sm" />
          </fieldset>
        </div>
        <div className='m-10 text-center text-[#E0C6AB]'>
          <h2 className='text-2xl'>Motivo de consulta</h2>
        </div>
        <div className='gap-6 text-[#E0C6AB] justify-items-center grid grid-cols-1'>
          <fieldset className="fieldset">
            <div className="label">Motivo</div>
            <textarea className="textarea h-24 w-96"></textarea>

          </fieldset>
        </div>

      </div>
    </form>
  )
}

export default NewPatient