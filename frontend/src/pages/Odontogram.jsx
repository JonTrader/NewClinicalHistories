import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ax } from '../lib/axios.js'
import { tejidosBlandos, problemas } from '../lib/patientHelper.js'
import PageLoader from '../components/PageLoader.jsx'
import { useOdontogramStore } from '../store/Odontogram.js'
import { LoaderIcon, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import RecordSection from '../components/RecordSection.jsx'

function Odontogram() {
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({})
  const [activeSection, setActiveSection] = useState('teeth')
  const { isUpdatingOdontogram, updateOdontogram } = useOdontogramStore()

  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOdontogram = async (id) => {
      try {
        const res = await ax.get(`/api/v1/odontograms/${id}`)
        setFormData(res.data[0])
      } catch (error) {
        console.error('Error in fetching patient odontogram: ', error)
        toast.error(error.response?.data?.message || 'Problema cargando odontograma')
      } finally {
        setIsLoading(false)
      }
    }
    fetchOdontogram(id)
  }, [id])

  const updateTeeth = (index, value) => {
    const updated = [...formData.teeth]
    updated[index] = { ...updated[index], description: value }
    setFormData({ ...formData, teeth: updated })
  }

  const updateTejido = (index, value) => {
    const updated = [...formData.tejidosBlandos]
    updated[index] = value === 'true'
    setFormData({ ...formData, tejidosBlandos: updated })
  }

  const updateProblema = (index, value) => {
    const updated = [...formData.problemas]
    updated[index] = value
    setFormData({ ...formData, problemas: updated })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateOdontogram(id, formData)
    navigate('/')
  }

  if (isLoading) return <PageLoader />

  const sections = [
    { id: 'teeth', title: 'Dientes' },
    { id: 'tissues', title: 'Tejidos blandos' },
    { id: 'problems', title: 'Problemas' },
  ]

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId)
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-body text-lightBone">
      <form onSubmit={handleSubmit}>
        <div className="bg-blueSteel/30 border border-blueSteel rounded-lg p-6 mb-8">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-lightOcre hover:text-lightBone transition-colors duration-150">
            <ArrowLeft className="w-4 h-4" />
            Volver a pacientes
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-lightBone mt-4">
            Odontograma
          </h1>
          <p className="text-lightOcre/80 mt-2 text-sm">
            Registra el estado de cada pieza y los hallazgos clínicos.
          </p>
        </div>

        <div className="sticky top-0 z-10 bg-blueSteel/95 backdrop-blur-sm border-y border-blueSteel py-3 mb-8 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto pb-1">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-body whitespace-nowrap transition-colors duration-150 ${
                  activeSection === section.id
                    ? 'bg-lightOcre text-blueDeep'
                    : 'bg-blueDeep text-lightBone border border-blueSteel hover:border-lightOcre hover:text-lightOcre'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <RecordSection id="teeth" title="Dientes">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {formData.teeth.map((tooth, index) => (
                <div key={index} className="bg-blueDeep border border-blueSteel rounded-md p-2 focus-within:border-blueSky focus-within:ring-1 focus-within:ring-blueSky transition-colors">
                  <label className="block text-xs text-lightOcre font-mono mb-1">{tooth.number}</label>
                  <input
                    type="text"
                    value={tooth.description}
                    onChange={(e) => updateTeeth(index, e.target.value)}
                    className="w-full bg-transparent text-sm text-lightBone font-body focus:outline-none placeholder:text-blueSky/30"
                    placeholder="—"
                  />
                </div>
              ))}
            </div>
          </RecordSection>

          <RecordSection id="tissues" title="Tejidos blandos">
            <div className="rounded-lg border border-blueSteel overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-blueDeep text-lightBone text-xs uppercase tracking-wide">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Tejido blando</th>
                    <th className="px-4 py-3 text-center font-medium w-20 sm:w-24">Sí</th>
                    <th className="px-4 py-3 text-center font-medium w-20 sm:w-24">No</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blueSteel">
                  {formData.tejidosBlandos.map((item, index) => (
                    <tr key={index} className="bg-blueSteel/20 hover:bg-blueSteel/40 transition-colors duration-150">
                      <td className="px-4 py-3 text-lightBone">{tejidosBlandos[index]}</td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="radio"
                          name={`tejido-${index}`}
                          value="true"
                          checked={item === true}
                          onChange={(e) => updateTejido(index, e.target.value)}
                          className="radio radio-accent"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="radio"
                          name={`tejido-${index}`}
                          value="false"
                          checked={item === false}
                          onChange={(e) => updateTejido(index, e.target.value)}
                          className="radio radio-accent"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </RecordSection>

          <RecordSection id="problems" title="Problemas">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.problemas.map((item, index) => (
                <div key={index} className="bg-blueDeep border border-blueSteel rounded-md p-3 focus-within:border-blueSky focus-within:ring-1 focus-within:ring-blueSky transition-colors">
                  <label className="block text-xs text-lightOcre uppercase tracking-wide mb-1.5">{problemas[index]}</label>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateProblema(index, e.target.value)}
                    className="w-full bg-transparent text-sm text-lightBone font-body focus:outline-none placeholder:text-blueSky/30"
                    placeholder="—"
                  />
                </div>
              ))}
            </div>
          </RecordSection>
        </div>

        <div className="flex justify-end gap-3 pt-8 mt-8 border-t border-blueSteel">
          <Link
            to="/"
            className="btn btn-md bg-blueDeep text-lightBone border-blueSteel hover:border-lightOcre hover:text-lightOcre font-body"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="btn btn-md bg-lightOcre text-blueDeep hover:bg-lightSand border-none font-body"
          >
            {isUpdatingOdontogram ? <LoaderIcon className='w-5 h-5 animate-spin' /> : 'Guardar odontograma'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Odontogram
