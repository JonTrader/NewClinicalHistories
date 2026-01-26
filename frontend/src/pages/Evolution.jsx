import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import InputTextarea from '../components/InputTextarea.jsx'
import { LoaderIcon } from 'lucide-react'
import { useEvolutionStore } from '../store/EvolutionStore.js'
import { ax } from '../lib/axios.js'
import toast from 'react-hot-toast'
import PageLoader from '../components/PageLoader.jsx'

function Evolution() {
  const [isLoading, setIsLoading] = useState(true)
  const [evolutionData, setEvolutionData] = useState([])
  const [formData, setFormData] = useState({ body: '' })
  const { isUpdatingEvolution, updateEvolution } = useEvolutionStore()


  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchEvolution = async (id) => {
      try {
        const res = await ax.get(`/api/v1/patients/${id}/evolution`)
        setEvolutionData(res.data[0])
      } catch (error) {
        console.error('Error in feching evolution:', error)
        toast.error(error.response?.data?.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEvolution(id)
  }, [id])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
    updateEvolution(id, formData)
    navigate('/')
  }

  if (isLoading) return <PageLoader />

  return (
    <div>
      <div>
        {evolutionData.update.map(item => (
          <InputTextarea disabled size={"lg:w-200 w-80 sm:w-96 md:w-156 opacity-75"} label={item?.createdAt || 'Data shuld go here'} text={item.body} />
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <InputTextarea size={"lg:w-200 w-80 sm:w-96 md:w-156"} label="Nueva evolucion" onChange={(e) => setFormData({ body: e.target.value })} />
        <button className='btn btn-xl'>{isUpdatingEvolution ? <LoaderIcon className='w-full h-5 animate-spin text-center' /> : 'Agregar'}</button>
      </form>
    </div>
  )
}

export default Evolution