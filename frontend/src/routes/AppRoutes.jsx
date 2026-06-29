import { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import Home from '../pages/Home.jsx'
import JobDetails from '../pages/JobDetails.jsx'
import Jobs from '../pages/Jobs.jsx'
import Login from '../pages/Login.jsx'
import Profile from '../pages/Profile.jsx'
import SavedJobs from '../pages/SavedJobs.jsx'
import Signup from '../pages/Signup.jsx'
import Tracker from '../pages/Tracker.jsx'
import ForgotPassword from '../pages/ForgotPassword.jsx'
import ResetPassword from '../pages/ResetPassword.jsx'
import { AuthContext } from '../context/authContextValue.js'
import Loader from '../components/Loader.jsx'

function AppRoutes() {
  const { loading } = useContext(AuthContext)

  if (loading) {
    return <Loader message="Checking authentication..." />
  }

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/jobs' element={<Jobs />} />
      <Route path='/jobs/:id' element={<JobDetails />} />
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path='/saved'
        element={
          <ProtectedRoute>
            <SavedJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path='/tracker'
        element={
          <ProtectedRoute>
            <Tracker />
          </ProtectedRoute>
        }
      />
      <Route
        path='/profile'
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/reset-password' element={<ResetPassword />} />
      <Route path='*' element={<Home />} />
    </Routes>
  )
}

export default AppRoutes
