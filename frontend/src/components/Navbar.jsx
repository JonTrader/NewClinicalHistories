import { useAuthStore } from '../store/AuthStore.js'
import { NavLink } from 'react-router'
import { Settings } from 'lucide-react'

function Navbar() {
    const { logout } = useAuthStore()

    const linkBase = "text-sm font-body transition-colors duration-150 hover:text-lightOcre focus:outline-none focus-visible:ring-2 focus-visible:ring-blueSky rounded-sm"
    const navLinkActive = "text-lightOcre"
    const navLinkInactive = "text-lightBone"

    return (
        <nav className="navbar px-6 sm:px-12 lg:px-20 bg-blueDeep text-lightBone shadow-sm">
            <div className="navbar-start">
                <NavLink
                    to="/"
                    className={({ isActive }) => `${linkBase} font-display text-base ${isActive ? navLinkActive : navLinkInactive}`}
                >
                    Pacientes
                </NavLink>
            </div>
            <div className="navbar-end gap-4 sm:gap-6">
                <button
                    type="button"
                    onClick={logout}
                    className={`${linkBase} cursor-pointer`}
                >
                    Cerrar sesión
                </button>
                <NavLink
                    to="/profile"
                    title="Configuración"
                    className={({ isActive }) => `${linkBase} ${isActive ? navLinkActive : navLinkInactive}`}
                >
                    <Settings className="w-5 h-5" />
                </NavLink>
            </div>
        </nav>
    )
}

export default Navbar