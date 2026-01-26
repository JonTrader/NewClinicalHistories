import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ax } from '../lib/axios.js'
import { tejidosBlandos, problemas } from '../lib/odontogramHelper.js'
import PageLoader from '../components/PageLoader.jsx'
import { useOdontogramStore } from '../store/Odontogram.js'
import toast from 'react-hot-toast'

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

  const handleSumbit = (e) => {
    e.preventDefault()
    updateOdontogram(id, formData)
    navigate('/')
  }

  if (isLoading) return <PageLoader />

  return (
    <form>
      <div>
        {formData.teeth.map((tooth) =>
          <label className="input">
            <span className="label">{tooth.number}</span>
            <input type="text" value={tooth.description} onChange={(e) => setFormData({...formData}, tooth.description = e.target.value)} />
          </label>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="table table-xs">
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
              <tr className="hover:bg-base-300">
                <th>{tejidosBlandos[index]}</th>
                <td><input type="radio" value='true' name={`radio-${index}`} className="radio" defaultChecked={item === true} onChange={ e => setFormData({...formData}, formData.tejidosBlandos[index] = e.target.value)}/></td>
                <td><input type="radio" value='false' name={`radio-${index}`} className="radio" defaultChecked={item === false} onChange={ e => setFormData({...formData}, formData.tejidosBlandos[index] = e.target.value)}/></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div>
        {formData.problemas.map((item, index) =>
          <label className="input">
            <span className="label">{problemas[index]}</span>
            <input type="text" value={item} onChange={ e => setFormData({...formData}, formData.problemas[index] = e.target.value)} />
          </label>
        )}
      </div>

      <button onClick={handleSumbit} className='btn btn-xl'>{isUpdatingOdontogram ? <LoaderIcon className='w-full h-5 animate-spin text-center' /> : 'Modificar Odontograma'}</button>
    </form>
  )
}

export default Odontogram