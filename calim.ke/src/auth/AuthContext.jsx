// AuthContext.jsx sets up authentication state for the app.
// It attempts to load the current user profile from the backend
// when a token exists, and it provides login/logout helpers to children.
import { useEffect, useState } from 'react'
import { fetchUserProfile, getAuthToken, clearAuthToken } from '../api/login.js'
import { AuthContext } from './AuthContextValue.js'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    async function loadProfile() {
      const token = getAuthToken()
      if (!token) {
        setAuthLoading(false)
        return
      }

      try {
        const profile = await fetchUserProfile()
        setUser(profile)
      } catch (error) {
        console.error('Profile fetch failed', error)
        clearAuthToken()
        setUser(null)
        setAuthError(error.message)
      } finally {
        setAuthLoading(false)
      }
    }

    loadProfile()
  }, [])

  const login = (userData) => {
    setUser(userData)
    setAuthError(null)
  }

  const logout = () => {
    clearAuthToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading, authError }}>
      {children}
    </AuthContext.Provider>
  )
}
