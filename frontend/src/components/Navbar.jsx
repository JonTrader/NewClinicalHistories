import { useAuthStore } from '../store/AuthStore.js'
import { Plus } from 'lucide-react'

function Navbar() {
    const { logout } = useAuthStore()

    return (
        <div className="navbar bg-[#1E232B] shadow-sm">
            <div className="navbar-start">
                <a className="btn btn-ghost bg-[#283E63] text-[#E0C6AB] text-md rounded-md">Pacientes</a>
            </div>
            <div className="navbar-end">
                <a className="btn mr-4 text-[#E0C6AB] bg-[#283E63]"><Plus /></a>
                <a onClick={logout} className="btn text-[#E0C6AB] hover:bg-[#283E63]">Logout</a>
            </div>
        </div>
    )
}

export default Navbar