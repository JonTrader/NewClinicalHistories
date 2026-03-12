import { Routes, Route, Navigate, Outlet, useNavigate, useLocation } from 'react-router'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import PatientDetails from './pages/PatientDetails.jsx'
import Patients from './pages/Patients.jsx'
import NewPatient from './pages/NewPatient.jsx'
import Odontogram from './pages/Odontogram.jsx'
import Evolution from './pages/Evolution.jsx'
import UpdateProfile from './pages/UpdateProfile.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PageLoader from './components/PageLoader.jsx'
import { useAuthStore } from './store/AuthStore.js'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

const MainLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
)

function App() {

  const { checkAuth, isCheckingAuth, authUser } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if(!isCheckingAuth && !authUser && location.pathname !== '/login' && location.pathname !== '/register') {
      navigate('/login', { state: { from: location } })
    }
  }, [isCheckingAuth, authUser, navigate, location])

  if (isCheckingAuth) return <PageLoader />
  return (
    <div className='min-h-screen bg-blueSteel relative'>
      <Routes>
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to='/' replace/>} />
        <Route path="/register" element={!authUser ? <Register /> : <Navigate to='/' replace/>} />
        <Route element={<MainLayout />}>
          <Route element={<ProtectedRoute user={authUser} />}>
            <Route path="/" element={<Patients />} />
            <Route path="/new" element={<NewPatient />} />
            <Route path="/details/:id" element={<PatientDetails />} />
            <Route path="/odontogram/:id" element={<Odontogram />} />
            <Route path="/evolution/:id" element={<Evolution />} />
            <Route path="/profile" element={<UpdateProfile />} />
          </Route>
        </Route>
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
      <Toaster />
    </div >
  )
}

export default App