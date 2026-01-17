import { useState } from 'react'
import { useAuthStore } from '../store/AuthStore.js'

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })

  const { register, isRegistering } = useAuthStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    register(formData)
  }


  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="fieldset bg-base-200 border-base-800 rounded-box w-sm border p-10">
        <legend className="fieldset-legend">Register</legend>

        <label className="label mt-4">First Name</label>
        <input type="text" className="input" placeholder="First Name" />

        <label className="label mt-4">Last Name</label>
        <input type="text" className="input" placeholder="Last Name" />

        <label className="label mt-4">Email</label>
        <input type="email" className="input" placeholder="Email" />

        <label className="label mt-4">Password</label>
        <input type="password" className="input" placeholder="Password" />

        <button className="btn btn-success mt-4">Register</button>
      </fieldset>
    </form>
  )
}

export default Register