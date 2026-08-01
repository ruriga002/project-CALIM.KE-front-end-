// Profile.jsx displays the authenticated user's account details.
// It fetches the profile from the backend if needed and shows logout.
import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/useAuth.js'
import { fetchUserProfile } from '../../api/login.js'

function Profile() {
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState(user)
  const [loading, setLoading] = useState(!user)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadProfile() {
      if (user) {
        setLoading(false)
        return
      }

      try {
        const data = await fetchUserProfile()
        setProfile(data)
      } catch (err) {
        setError(err.message || 'Unable to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [user])

  if (loading) {
    return <div className="loading-state">Loading profile…</div>
  }

  if (error) {
    return <div className="api-error">{error}</div>
  }

  return (
    <section className="profile-page">
      <div className="profile-card">
        <h1>My Account</h1>
        <p>
          <strong>Name:</strong> {profile?.name || profile?.full_name || profile?.username || 'Unknown'}
        </p>
        <p>
          <strong>Email:</strong> {profile?.email || 'Not available'}
        </p>
        <button onClick={logout}>Logout</button>
      </div>
    </section>
  )
}

export default Profile
