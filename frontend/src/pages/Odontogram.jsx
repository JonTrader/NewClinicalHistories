import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ax } from '../lib/axios.js'
import { tejidosBlandos, problemas } from '../lib/patientHelper.js'
import PageLoader from '../components/PageLoader.jsx'
import { useOdontogramStore } from '../store/Odontogram.js'
import toast from 'react-hot-toast'

function Odontogram() {

  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({})
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
        toast.error(error.response?.data?.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOdontogram(id)
  }, [id])

  const handleSubmit = (e) => {
    e.preventDefault()
    updateOdontogram(id, formData)
    navigate('/')
  }

  if (isLoading) return <PageLoader />

  return (
    <form onSubmit={handleSubmit} className='font-serif text-xs text-lightBone p-6 md:p-24'>
      <div className='text-center'>
        <h2 className='text-3xl'>Odontograma</h2>
        <div className='mt-8 gap-1 justify-items-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {formData.teeth.map((tooth, index) =>
            <label key={index} className="input">
              <span className="label">{tooth.number}</span>
              <input type="text" value={tooth.description} onChange={(e) => setFormData({ ...formData }, tooth.description = e.target.value)} />
            </label>
          )}
        </div>
      </div>
      <div className="p-6 sm:p-12 flex justify-center">
        <table className="table table-xs lg:w-175">
          {/* head */}
          <thead>
            <tr>
              <th>Tejidos Blandos</th>
              <th>Si</th>
              <th>No</th>
            </tr>
          </thead>
          <tbody>
            {formData.tejidosBlandos.map((item, index) =>
              <tr key={index} className="hover:bg-base-300">
                <th className='font-medium lg:text-lg'>{tejidosBlandos[index]}</th>
                <td><input type="radio" value='true' name={`radio-${index}`} className="radio" defaultChecked={item === true} onChange={e => setFormData({ ...formData }, formData.tejidosBlandos[index] = e.target.value)} /></td>
                <td><input type="radio" value='false' name={`radio-${index}`} className="radio" defaultChecked={item === false} onChange={e => setFormData({ ...formData }, formData.tejidosBlandos[index] = e.target.value)} /></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className='text-center'>
        <h2 className='text-3xl'>Problemas</h2>
        <div className='mt-8 gap-6 justify-items-center grid grid-cols-1 lg:grid-cols-2'>
          {formData.problemas.map((item, index) =>
            <label key={index} className="input w-180 lg:w-125">
              <span className="label">{problemas[index]}</span>
              <input type="text" value={item} onChange={e => setFormData({ ...formData }, formData.problemas[index] = e.target.value)} />
            </label>
          )}
        </div>
      </div>
      <div className='mt-8 justify-items-center sm:justify-items-center grid grid-cols-1'>
        <button className='btn btn-md w-40 text-xs text-lightSand bg-blueDeep hover:text-lightOcre transition-colors'>{isUpdatingOdontogram ? <LoaderIcon className='w-full h-5 animate-spin text-center' /> : 'Modificar Odontograma'}</button>
      </div>
    </form>
  )
}

export default Odontogram