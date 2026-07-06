import { LoaderIcon } from 'lucide-react'

function PageLoader() {
  return (
    <div className='flex flex-1 items-center bg-blueSteel justify-center'>
        <LoaderIcon className="text-lightOcre size-12 animate-spin" aria-label="Cargando" />
    </div>
  )
}

export default PageLoader