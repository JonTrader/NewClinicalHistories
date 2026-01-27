import { LoaderIcon } from 'lucide-react'

function PageLoader() {
  return (
    <div className='flex items-center bg-blueSteel justify-center h-screen'>
        <LoaderIcon className="text-lightOcre size-12 animate-spin"/>
    </div>
  )
}

export default PageLoader