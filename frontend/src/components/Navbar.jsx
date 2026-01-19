import React from 'react'
import { Plus } from 'lucide-react'

function Navbar() {
    return (
        <div className="navbar bg-[#1E232B] shadow-sm">
            <div className="navbar-start">
                <a className="btn btn-ghost bg-[#283E63] text-[#E0C6AB] text-md rounded-md">Pacientes</a>
            </div>
            <div className="navbar-end">
                <a className="btn text-[#E0C6AB] bg-[#283E63]"><Plus /></a>
            </div>
        </div>
    )
}

export default Navbar