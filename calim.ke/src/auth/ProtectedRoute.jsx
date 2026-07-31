// ProtectedRoute.jsx guards routes that require a logged-in user.
// If authentication is still loading, it shows a loading state.
// If the user is not authenticated, it redirects to the login page.
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth.js'

function ProtectedRoute({ children }) {
  const { user, authLoading } = useAuth()
  const location = useLocation()

  if (authLoading) {
    return <div className="loading-state">Checking authentication…</div>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
