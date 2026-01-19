import { useState } from 'react'
import { useAuthStore } from '../store/AuthStore.js'
import { Link } from 'react-router'
import { LoaderIcon } from 'lucide-react'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const { login, isLoggingIn } = useAuthStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    login(formData)
  }


  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="fieldset bg-[#1E232B] border-base-800 text-[#E0C6AB] rounded-box w-sm border p-10">
        <legend className="fieldset-legend text-[#E0C6AB]">Login</legend>

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

        <button className="btn text-[#E0C6AB] bg-[#283e63] mt-4" disabled={isLoggingIn}>{isLoggingIn ? <LoaderIcon className='w-full h-5 animate-spin text-center' /> : 'Login'}</button>
        <div className='mt-6 text-center'>
          <Link to="/register" className="auth-link">
            Don't have an account? Register
          </Link>
        </div>
      </fieldset>
    </form>
  )
}

export default Login