import { useState } from 'react'
import { useAuthStore } from '../store/AuthStore.js'
import { LoaderIcon } from 'lucide-react'
import { useNavigate } from 'react-router'

function UpdateProfile() {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore()
  const navigate = useNavigate()

  // initialize form values from current user (authUser is expected to be available)
  const [formData, setFormData] = useState(() => ({
    firstName: authUser?.firstName || '',
    lastName: authUser?.lastName || ''
  }))


  const handleSubmit = async (e) => {
    e.preventDefault()
    await updateProfile(formData)
    navigate('/') // go back home after success
  }

  return (
    <form onSubmit={handleSubmit} className='flex justify-center items-center h-screen'>
      <div className="bg-blueDeep text-lightOcre rounded-box w-sm p-10">
        <h2 className="text-lg font-semibold">Update Profile</h2>

        <label className="label mt-4">First Name</label>
        <input
          type="text"
          className="input"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        />

        <label className="label mt-4">Last Name</label>
        <input
          type="text"
          className="input"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        />

        <button
          className="btn text-lightOcre bg-blueSteel mt-4"
          disabled={isUpdatingProfile}
        >
          {isUpdatingProfile ? (
            <LoaderIcon className='w-full h-5 animate-spin text-center' />
          ) : (
            'Save changes'
          )}
        </button>
      </div>
    </form>
  )
}

export default UpdateProfile