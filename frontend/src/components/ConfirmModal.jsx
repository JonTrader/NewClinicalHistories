import { LoaderIcon } from 'lucide-react'

function ConfirmModal({ isOpen, onCancel, onConfirm, isLoading }) {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50' onClick={onCancel}>
      <div className='bg-blueSteel border border-lightOcre rounded-lg p-8 max-w-sm w-full mx-4 text-center font-serif text-lightOcre' onClick={(e) => e.stopPropagation()}>
        <h3 className='text-xl mb-2'>Confirmar Eliminacion</h3>
        <p className='text-sm mb-6'>Esta seguro que desea borrar este paciente? Esta accion no se puede deshacer.</p>
        <div className='flex justify-center gap-4'>
          <button onClick={onCancel} className='btn btn-md w-28 text-xs'>Cancelar</button>
          <button onClick={onConfirm} className='btn btn-md w-28 text-xs bg-red-700 hover:bg-red-800 text-lightSand'>
            {isLoading ? <LoaderIcon className='w-full h-5 animate-spin text-center' /> : 'Borrar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
