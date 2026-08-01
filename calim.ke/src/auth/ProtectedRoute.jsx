// ProtectedRoute.jsx guards routes that require a logged-in user.
// If authentication is still loading, it shows a loading state.
// If the user is not authenticated, it redirects to the login page.
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth.js'

function isAdminUser(user) {
  if (!user) return false

  const role = user?.role?.toString().toLowerCase()
  return !!(
    role === 'admin' ||
    role === 'administrator' ||
    user?.is_admin === true ||
    user?.isAdmin === true ||
    user?.email === 'admin@calim.com'
  )
}

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, authLoading } = useAuth()
  const location = useLocation()

  if (authLoading) {
    return <div className="loading-state">Checking authentication…</div>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  const isAdmin = isAdminUser(user)

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
