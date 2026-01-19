import { useState } from 'react'
import { useAuthStore } from '../store/AuthStore.js'
import { Link } from 'react-router'
import { LoaderIcon } from 'lucide-react'

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
    <form onSubmit={handleSubmit} className='flex justify-center items-center h-screen'>
      <fieldset className="fieldset bg-[#1E232B] border-base-800 text-[#E0C6AB] rounded-box w-sm border p-10">
        <legend className="fieldset-legend text-[#E0C6AB]">Register</legend>

        <label className="label mt-4">First Name</label>
        <input
          type="text"
          className="input"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        />

        <label className="label mt-4">Last Name</label>
        <input type="text" className="input" placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        />

        <label className="label mt-4">Email</label>
        <input type="email" className="input" placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <label className="label mt-4">Password</label>
        <input type="password" className="input" placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />

        <button className="btn text-[#E0C6AB] bg-[#283e63] mt-4" disabled={isRegistering}>{isRegistering ? <LoaderIcon className='w-full h-5 animate-spin text-center' /> : 'Register'}</button>
        <div className='mt-6 text-center'>
          <Link to="/login" className="auth-link">
            Already have an account? Login
          </Link>
        </div>
      </fieldset>
    </form>
  )
}

export default Register