import { useState, useRef } from 'react'
import { useAuthStore } from '../store/AuthStore.js'
import { LoaderIcon } from 'lucide-react'
import { useNavigate } from 'react-router'

function UpdateProfile() {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore()
  // initialize form values from current user (authUser is expected to be available)
  const [formData, setFormData] = useState(() => ({
    firstName: authUser?.firstName || '',
    lastName: authUser?.lastName || '',
    logo: authUser?.logo || null
  }))
  const [selectedImg, setSelectedImg] = useState(null)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const handleImageChange = (e) => {
    e.preventDefault()
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onloadend = async () => {
      const base64Image = reader.result
      setSelectedImg(base64Image)
      setFormData({ ...formData, logo: base64Image })}
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await updateProfile(formData)
    navigate('/')
  }

  return (
    <>
      <form onSubmit={handleSubmit} className='flex justify-center items-center h-screen'>
        <fieldset className="fieldset bg-blueDeep border-base-800 text-lightOcre rounded-box w-sm border p-10">
          <legend className="fieldset-legend text-lightOcre">Update Profile</legend>

          <div className='text-center'>
            <button type="button" onClick={() => fileInputRef.current.click()} className='size-45 rounded-full overflow-hidden relative group'>
              {isUpdatingProfile ? (<LoaderIcon className='w-full h-5 animate-spin text-center' />) : (
                <>
                  <img src={selectedImg || formData.logo || "/avatar.png"} alt="User Logo" className='size-full object-cover' />
                  <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity'>
                    <span className='text-white text-xs'>Change</span>
                  </div>
                </>)}
            </button>
            <input type="file"
              accept='image/*'
              className='hidden'
            ref={fileInputRef}
            onChange={handleImageChange}
            />
          </div>

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

          <button className="btn text-lightOcre bg-blueSteel mt-4" disabled={isUpdatingProfile}>{isUpdatingProfile ? <LoaderIcon className='w-full h-5 animate-spin text-center' /> : 'Save Changes'}</button>
        </fieldset>
      </form>
    </>
  )
}

export default UpdateProfile