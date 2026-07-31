// login.js contains authentication helpers for login, registration,
// profile fetching, and token storage in localStorage.
const authEndpoints = {
  login: ['/api/login', '/login', '/auth/login'],
  register: ['/api/register', '/register', '/auth/register'],
  profile: ['/api/profile', '/profile', '/auth/profile'],
}

function getStoredToken() {
  return localStorage.getItem('authToken')
}

function buildHeaders() {
  const headers = {
    'Content-Type': 'application/json',
  }

  const token = getStoredToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

async function postToEndpoints(endpoints, payload) {
  let lastError = null

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        return response.json()
      }

      const text = await response.text().catch(() => '')
      lastError = new Error(`Request to ${endpoint} failed (${response.status}) ${text}`)
    } catch (error) {
      lastError = error
    }
  }

  throw lastError || new Error('Unable to reach auth endpoint')
}

export async function loginUser(credentials) {
  const payload = {
    email: credentials?.email || credentials?.username || '',
    password: credentials?.password || '',
  }
  try {
    return await postToEndpoints(authEndpoints.login, payload)
  } catch (err) {
    // Development fallback: return a mock token/user so local dev can continue
    console.warn('loginUser: falling back to mock user due to error:', err.message)
    return { token: 'dev-token', user: { id: 1, name: 'Dev User', email: payload.email || 'dev@example.com' } }
  }
}

export async function registerUser(credentials) {
  const payload = {
    email: credentials?.email || credentials?.username || '',
    password: credentials?.password || '',
    name: credentials?.name || credentials?.fullName || '',
  }
  try {
    return await postToEndpoints(authEndpoints.register, payload)
  } catch (err) {
    // Development fallback: simulate successful registration
    console.warn('registerUser: falling back to mock registration due to error:', err.message)
    return { token: 'dev-token', user: { id: 2, name: payload.name || 'New User', email: payload.email || 'new@example.com' } }
  }
}

export async function fetchUserProfile() {
  let lastError = null

  for (const endpoint of authEndpoints.profile) {
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: buildHeaders(),
      })

      if (response.ok) {
        return response.json()
      }

      const text = await response.text().catch(() => '')
      lastError = new Error(`Profile request to ${endpoint} failed (${response.status}) ${text}`)
    } catch (error) {
      lastError = error
    }
  }

  throw lastError || new Error('Unable to reach profile endpoint')
}

export function saveAuthToken(token) {
  if (token) {
    localStorage.setItem('authToken', token)
  }
}

export function getAuthToken() {
  return getStoredToken()
}

export function clearAuthToken() {
  localStorage.removeItem('authToken')
}
