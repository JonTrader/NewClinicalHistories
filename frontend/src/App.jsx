import { Routes, Route, Navigate } from 'react-router'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import PatientDetails from './pages/PatientDetails.jsx'
import Patients from './pages/Patients.jsx'
import NewPatient from './pages/NewPatient.jsx'
import Odontogram from './pages/Odontogram.jsx'
import Evolution from './pages/Evolution.jsx'
import PageLoader from './components/PageLoader.jsx'
import { useAuthStore } from './store/AuthStore.js'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

function App() {

  const { checkAuth, isCheckingAuth, authUser } = useAuthStore()

  useEffect( () => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth) return <PageLoader />
  return (
    <div className='min-h-screen bg-[#283E63] relative'>
      <Routes>
        <Route path="/" element={authUser ? <NewPatient /> : <Navigate to='/login' />} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to='/' />} />
        <Route path="/register" element={!authUser ? <Register /> : <Navigate to='/' />} />
        <Route path="/details/:id" element={authUser ? <PatientDetails /> : <Navigate to='/login' />} />
        <Route path="/odontogram/:id" element={authUser ? <Odontogram /> : <Navigate to='/login' />} />
        <Route path="/evolution/:id" element={authUser ? <Evolution /> : <Navigate to='/login' />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App