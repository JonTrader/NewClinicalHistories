import { LoaderIcon } from 'lucide-react'

function ConfirmModal({ isOpen, onCancel, onConfirm, isLoading }) {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-blueDeep/80 backdrop-blur-sm' onClick={onCancel}>
      <div className='bg-blueSteel border border-lightOcre rounded-lg p-8 max-w-sm w-full mx-4 text-center font-body text-lightOcre shadow-xl' onClick={(e) => e.stopPropagation()}>
        <h3 className='text-xl mb-2 font-display'>Confirmar eliminación</h3>
        <p className='text-sm mb-6 text-lightSand'>¿Está seguro de que desea eliminar este paciente? Esta acción no se puede deshacer.</p>
        <div className='flex justify-center gap-4'>
          <button onClick={onCancel} className='btn btn-md w-28 text-xs bg-blueDeep text-lightBone border-blueSteel hover:border-lightOcre hover:text-lightOcre font-body'>Cancelar</button>
          <button onClick={onConfirm} className='btn btn-md w-28 text-xs bg-red-700 hover:bg-red-800 text-lightSand font-body'>
            {isLoading ? <LoaderIcon className='w-full h-5 animate-spin text-center' /> : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
