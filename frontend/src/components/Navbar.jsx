import { useAuthStore } from '../store/AuthStore.js'
import { Link } from 'react-router'
import { Settings } from 'lucide-react'

function Navbar({ img = null }) {
    const { logout } = useAuthStore()

    return (
        <div className="font-serif navbar px-8 py-8 bg-blueDeep shadow-sm text-lightBone">
            <div className="navbar-start">
                <Link to="/" className="text-lightBone text-sm hover:cursor-pointer hover:text-lightOcre hover:scale-110 transition-all">Pacientes</Link>
            </div>
            {img &&
                <div className="navbar-center">
                    <a className="h-8 w-12">
                        <img src={img} alt="" />
                    </a>
                </div>
            }
            <div className="navbar-end">
                <a onClick={logout} className="text-sm hover:cursor-pointer hover:scale-110 hover:text-lightOcre transition-all">Logout</a>
                <Link to="/profile" className="ml-4 hover:cursor-pointer hover:scale-110 hover:text-lightOcre transition-all"><Settings /></Link>
            </div>
        </div>
    )
}

export default Navbar