import { LoaderIcon } from 'lucide-react'

function PageLoader() {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-blueSteel'>
        <LoaderIcon className="text-lightOcre size-12 animate-spin" aria-label="Cargando" />
    </div>
  )
}

export default PageLoader