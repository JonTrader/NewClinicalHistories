import { Routes, Route, Navigate } from 'react-router'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import PatientDetails from './pages/PatientDetails.jsx'
import Patients from './pages/Patients.jsx'
import Odontogram from './pages/Odontogram.jsx'
import Evolution from './pages/Evolution.jsx'
// import { useAuthStore } from './store/AuthStore.jsx'

function App() {

  return (
    <div className='min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden'>
      <Routes>
        <Route path="/" element={<Patients />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/details/:id" element={<PatientDetails />} />
        <Route path="/odontogram/:id" element={<Odontogram />} />
        <Route path="/evolution/:id" element={<Evolution />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </div>
  )
}

export default App