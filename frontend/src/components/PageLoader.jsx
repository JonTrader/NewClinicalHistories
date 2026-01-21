import { LoaderIcon } from 'lucide-react'

function PageLoader() {
  return (
    <div className='flex items-center bg-[#283E63] justify-center h-screen'>
        <LoaderIcon className="text-[#E0C6AB] size-10 animate-spin"/>
    </div>
  )
}

export default PageLoader