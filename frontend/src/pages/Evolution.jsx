import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import FieldsetTextarea from '../components/FieldsetTextarea.jsx'
import { LoaderIcon } from 'lucide-react'
import { useEvolutionStore } from '../store/EvolutionStore.js'
import { ax } from '../lib/axios.js'
import toast from 'react-hot-toast'
import PageLoader from '../components/PageLoader.jsx'
import { Brain } from 'lucide-react'

function Evolution() {
  const [isLoading, setIsLoading] = useState(true)
  const [evolutionData, setEvolutionData] = useState([])
  const [formData, setFormData] = useState({ body: '' })
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [hasGeneratedSummary, setHasGeneratedSummary] = useState(false)
  const [summary, setSummary] = useState('')
  const { isUpdatingEvolution, updateEvolution } = useEvolutionStore()


  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchEvolution = async (id) => {
      try {
        const res = await ax.get(`/api/v1/evolutions/${id}`)
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

  const generateSummary = async () => {
    setIsGeneratingSummary(true)
    let text = ``
    evolutionData.update.map((evo, index) => (
      text = text + `${index + 1}. ${evo.body.trim()}\n`
    ))
    try {
      const res = await ax.post('/api/v1/ai/summary', { text })
      setSummary(res.data)
      setHasGeneratedSummary(true)
    } catch (error) {
      console.error('Error trying to generate a summary', error)
      toast.error(error.response?.data?.message)
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.body === '') {
      toast.error('Texto es requerido')
      return
    }
    updateEvolution(id, formData)
    navigate('/')
  }

  if (isLoading) return <PageLoader />

  return (
    <div className='p-10 md:p-24 font-serif text-lightOcre justify-items-center'>
      <div className='gap-2 justify-items-center grid grid-cols-1'>
        {evolutionData.update.map(item => (
          <FieldsetTextarea key={item?.createdAt} disabled size={"lg:w-200 w-80 sm:w-96 md:w-156 opacity-75"} label={item?.createdAt.toString() || 'Date'} text={item.body} />
        ))}
      </div>
      <form onSubmit={handleSubmit} className=' p-10 gap-4 md:gap-6 justify-items-center grid grid-cols-1'>
        <FieldsetTextarea size={"lg:w-200 w-80 sm:w-96 md:w-156"} label="Nueva evolucion" onChange={(e) => setFormData({ body: e.target.value })} />
        <button className='btn btn-md text-lightSand hover:text-lightOcre'>{isUpdatingEvolution ? <LoaderIcon className='w-full h-5 animate-spin text-center' /> : 'Agregar'}</button>
      </form>
      <div className="card lg:w-200 w-100 md:w-156 bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex justify-between">
            <h2 className="text-xl">Resumen</h2>
            <span className="text-xl">
              <button className='btn' disabled={hasGeneratedSummary} onClick={generateSummary}>{isGeneratingSummary ? <LoaderIcon className='w-full h-5 animate-spin text-center' /> : 'Resumir con IA'}</button>
            </span>
          </div>
          {hasGeneratedSummary && <FieldsetTextarea disabled size={"mt-6 w-auto h-96 textarea-success"} text={summary} />}
        </div>
      </div>
    </div>
  )
}

export default Evolution