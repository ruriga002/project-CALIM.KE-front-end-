// Login.jsx renders the login page and handles form submission.
// It calls the backend login helper, stores the auth token,
// and updates the auth context after a successful login.
import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { loginUser, fetchUserProfile } from '../../api/login.js'
import { useAuth } from '../../auth/useAuth.js'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const from = location.state?.from?.pathname || '/'

  function isAdminUser(userData) {
    if (!userData) return false

    const role = userData?.role?.toString().toLowerCase()
    return !!(
      role === 'admin' ||
      role === 'administrator' ||
      userData?.is_admin === true ||
      userData?.isAdmin === true ||
      userData?.email === 'admin@calim.com'
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const loginResponse = await loginUser({ email, password })
      const profile = loginResponse?.user || loginResponse?.profile || await fetchUserProfile()
      login(profile)

      const targetPath = from === '/' || from === '/login' || from === '/register'
        ? (isAdminUser(profile) ? '/admin/dashboard' : '/')
        : from

      navigate(targetPath, { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid login credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error && <div className="form-error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
          <button
            type="button"
            className="demo-btn"
            onClick={() => {
              setEmail('admin@calim.com')
              setPassword('admin123')
            }}
          >
            Use admin demo
          </button>
        </form>
        <p>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </section>
  )
}

export default Login
