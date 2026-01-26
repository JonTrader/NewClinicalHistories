import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ax } from '../lib/axios.js'
import PageLoader from '../components/PageLoader.jsx'
import { useOdontogramStore } from '../store/Odontogram.js'

function Odontogram() {

  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const { isUpdatingOdontogram, updateOdontogram } = useOdontogramStore()

  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOdontogram = async (id) => {
      try {
        const res = await ax.get(`/api/v1/patients/${id}/odontogram`)
        console.log(res.data[0])
        setFormData(res.data[0])
      } catch (error) {
        console.error('Error in fetching patient odontogram: ', error)
        toast.error(error.response?.data?.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOdontogram(id)
  }, [id])

  const updateArray = (keyName, index, value) => {
    setFormData(prev => ({
      ...prev,
      [keyName]: prev[keyName].map((item, i) => i === index ? value : item)
    }))
  }

  const handleSumbit = (e) => {
    e.preventDefault()
    updateOdontogram(id, formData)
    navigate('/')
  }

  if (isLoading) return <PageLoader />

  return (
    <div>
      <form>
        <button onClick={handleSumbit} className='btn-xl'>Click me</button>
      </form>
    </div>
  )
}

export default Odontogram