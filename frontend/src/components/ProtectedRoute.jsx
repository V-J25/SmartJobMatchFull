import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/authContextValue'

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useContext(AuthContext)
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return <Navigate to='/login' replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to='/' replace /> // Redirect to home if unauthorized role
  }

  return children
}

export default ProtectedRoute
