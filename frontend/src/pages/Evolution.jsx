import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router'
import FieldsetTextarea from '../components/FieldsetTextarea.jsx'
import { LoaderIcon, BrainIcon, ArrowLeft, FileText } from 'lucide-react'
import { useEvolutionStore } from '../store/EvolutionStore.js'
import { ax } from '../lib/axios.js'
import toast from 'react-hot-toast'
import PageLoader from '../components/PageLoader.jsx'

function Evolution() {
  const [isEvolutionsLoading, setIsEvolutionsLoading] = useState(true)
  const [evolutionData, setEvolutionData] = useState({ update: [] })

  const [formData, setFormData] = useState({ body: '' })

  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [hasGeneratedSummary, setHasGeneratedSummary] = useState(false)
  const [summary, setSummary] = useState('')

  const [isGeneratingEvolution, setIsGeneratingEvolution] = useState(false)
  const [hasGeneratedEvolution, setHasGeneratedEvolution] = useState(false)
  const { isUpdatingEvolution, updateEvolution } = useEvolutionStore()

  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchEvolution = async (id) => {
      try {
        const res = await ax.get(`/api/v1/evolutions/${id}`)
        const data = res.data[0] || { update: [] }
        setEvolutionData(data)
        setSummary(data.summary?.summary || '')
      } catch (error) {
        console.error('Error in fetching evolution:', error)
        toast.error(error.response?.data?.message || 'Problema cargando evoluciones')
      } finally {
        setIsEvolutionsLoading(false)
      }
    }
    fetchEvolution(id)
  }, [id])

  const generateSummary = async () => {
    const updates = evolutionData.update || []
    if (updates.length === 0) {
      toast.error('No hay evoluciones para resumir')
      return
    }

    setIsGeneratingSummary(true)
    const text = updates.map((evo, index) => `${index + 1}. ${evo.body.trim()}`).join('\n')

    try {
      const res = await ax.post(`/api/v1/ai/summary/${id}`, { text })
      setSummary(res.data)
      setHasGeneratedSummary(true)
      toast.success('Resumen creado')
    } catch (error) {
      console.error('Error trying to generate a summary', error)
      toast.error(error.response?.data?.message || 'Error generando resumen')
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  const generateEvolution = async () => {
    if (!formData.body.trim()) {
      toast.error('Escribe una nota para generar la evolución')
      return
    }

    setIsGeneratingEvolution(true)
    try {
      const res = await ax.post('/api/v1/ai/evolution', formData)
      setHasGeneratedEvolution(true)
      setFormData({ body: res.data })
      toast.success('Evolución generada')
    } catch (error) {
      console.error('Error trying to generate an evolution', error)
      toast.error(error.response?.data?.message || 'Error generando evolución')
    } finally {
      setIsGeneratingEvolution(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.body.trim() === '') {
      toast.error('El texto de la evolución es requerido')
      return
    }
    updateEvolution(id, formData)
    navigate('/')
  }

  if (isEvolutionsLoading) return <PageLoader />

  const updates = evolutionData.update || []
  const isSummaryUpToDate = evolutionData.summary?.dateOfLastEvolution &&
    updates.length > 0 &&
    evolutionData.summary.dateOfLastEvolution === updates[updates.length - 1].createdAt

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-body text-lightBone">
      <div className="bg-blueSteel/30 border border-blueSteel rounded-lg p-6 mb-8">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-lightOcre hover:text-lightBone transition-colors duration-150">
          <ArrowLeft className="w-4 h-4" />
          Volver a pacientes
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-lightBone mt-4">
          Evolución
        </h1>
        <p className="text-lightOcre/80 mt-2 text-sm">
          Historial de visitas y notas de evolución del paciente.
        </p>
      </div>

      {updates.length > 0 ? (
        <div className="mb-10">
          <h2 className="font-display text-xl text-lightBone mb-4">Historial</h2>
          <div className="space-y-4 relative pl-6 border-l-2 border-blueSteel">
            {updates.map((item) => (
              <div key={item.createdAt} className="relative">
                <div className="absolute -left-[29px] top-2 w-4 h-4 rounded-full bg-blueSky border-2 border-blueSteel" />
                <div className="bg-blueSteel/30 border border-blueSteel rounded-lg p-4">
                  <div className="inline-block px-3 py-1 bg-blueDeep text-lightOcre text-xs font-mono rounded-md mb-2">
                    {new Date(item.createdAt).toLocaleString('es-CO')}
                  </div>
                  <p className="text-lightBone text-sm whitespace-pre-wrap">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-blueSteel rounded-lg bg-blueDeep/30 mb-10">
          <FileText className="w-10 h-10 text-lightOcre/50 mb-3" />
          <h2 className="font-display text-lg text-lightBone mb-1">Sin evoluciones registradas</h2>
          <p className="text-lightOcre/70 text-sm">Agrega la primera nota de evolución más abajo.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-blueSteel/30 border border-blueSteel rounded-lg p-6">
        <h2 className="font-display text-xl text-lightBone mb-4">Nueva evolución</h2>
        <FieldsetTextarea
          label="Nota de evolución"
          text={formData.body}
          onChange={(e) => setFormData({ body: e.target.value })}
        />
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button
            type="button"
            disabled={hasGeneratedEvolution}
            onClick={generateEvolution}
            className="btn btn-md bg-blueDeep text-lightBone border-blueSteel hover:border-lightOcre hover:text-lightOcre font-body inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingEvolution ? <LoaderIcon className='w-5 h-5 animate-spin' /> : <><BrainIcon className="w-4 h-4" /> Generar con IA</>}
          </button>
          <button
            type="submit"
            className="btn btn-md bg-lightOcre text-blueDeep hover:bg-lightSand border-none font-body"
          >
            {isUpdatingEvolution ? <LoaderIcon className='w-5 h-5 animate-spin' /> : 'Agregar nota'}
          </button>
        </div>
      </form>

      <div className="bg-blueDeep/30 border border-blueSteel rounded-lg p-6 mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="font-display text-xl text-lightBone">Resumen</h2>
          <button
            type="button"
            disabled={isSummaryUpToDate || hasGeneratedSummary || updates.length <= 1}
            onClick={generateSummary}
            className="btn btn-md bg-blueDeep text-lightBone border-blueSteel hover:border-lightOcre hover:text-lightOcre font-body inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingSummary ? <LoaderIcon className='w-5 h-5 animate-spin' /> : <><BrainIcon className="w-4 h-4" /> Resumir con IA</>}
          </button>
        </div>
        {(summary || hasGeneratedSummary) ? (
          <FieldsetTextarea disabled text={summary} />
        ) : (
          <p className="text-lightOcre/70 text-sm">
            Genera un resumen con IA para ver el consolidado de las evoluciones aquí.
          </p>
        )}
      </div>
    </div>
  )
}

export default Evolution
