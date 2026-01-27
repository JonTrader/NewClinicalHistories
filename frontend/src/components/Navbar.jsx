import { useAuthStore } from '../store/AuthStore.js'
import { Link } from 'react-router'
import { Plus } from 'lucide-react'

function Navbar() {
    const { logout } = useAuthStore()

    return (
        <div className="navbar px-8 bg-blueDeep shadow-sm text-lightBone">
            <div className="navbar-start">
                <Link to="/" className="font-serif text-lightBone text-sm hover:cursor-pointer hover:text-lightOcre hover:scale-110 transition-all">Pacientes</Link>
            </div>
            <div className="navbar-end">
                <Link to="/new" className="btn mr-4 bg-blueSteel hover:text-lightOcre"><Plus /></Link>
                <a onClick={logout} className="font-serif text-sm hover:cursor-pointer hover:scale-110 hover:text-lightOcre transition-all">Logout</a>
            </div>
        </div>
    )
}

export default Navbar