import { useAuthStore } from '../store/AuthStore.js'
import { Plus } from 'lucide-react'

function Navbar() {
    const { logout } = useAuthStore()

    return (
        <div className="navbar bg-[#1E232B] shadow-sm">
            <div className="navbar-start">
                <a className="font-serif text-[#E0C6AB] text-sm hover:cursor-pointer hover:scale-110 transition-all">Pacientes</a>
            </div>
            <div className="navbar-end">
                <a className="btn mr-4 text-[#E0C6AB] bg-[#283E63]"><Plus /></a>
                <a onClick={logout} className="font-serif text-sm text-[#E0C6AB] hover:cursor-pointer hover:scale-110 transition-all">Logout</a>
            </div>
        </div>
    )
}

export default Navbar