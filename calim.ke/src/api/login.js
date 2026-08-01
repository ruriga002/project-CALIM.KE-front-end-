// login.js
// Authentication helpers for the Flask backend.

const AUTH_BASES = ["/api/auth", "/api", "/auth"]

function getStoredToken() {
  return localStorage.getItem("authToken")
}

function buildHeaders() {
  const headers = {
    "Content-Type": "application/json",
  }

  const token = getStoredToken()

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

function extractAuthToken(payload) {
  if (!payload || typeof payload !== "object") return null
  if (payload.token) return payload.token
  if (payload.access_token) return payload.access_token
  if (payload.accessToken) return payload.accessToken
  if (payload.authToken) return payload.authToken
  if (payload.jwt) return payload.jwt
  if (payload.data) return extractAuthToken(payload.data)
  if (payload.user) return extractAuthToken(payload.user)
  return null
}

function normalizeProfilePayload(payload) {
  if (!payload || typeof payload !== "object") return payload
  return payload.user || payload.data || payload.profile || payload
}

function parseJson(response) {
  return response
    .json()
    .catch(() => null)
}

function buildUrls(path) {
  return AUTH_BASES.map((base) => `${base}${path}`)
}

async function tryFetchUrls(urls, options) {
  let lastError = null

  for (const url of urls) {
    const response = await fetch(url, options)
    const data = await parseJson(response)

    if (response.ok) {
      return { response, data }
    }

    if (response.status === 404 || response.status === 405) {
      continue
    }

    lastError = new Error(data?.message || data?.error || `${response.status} ${response.statusText}`)
  }

  throw lastError || new Error("Authentication endpoint did not respond successfully")
}

// ------------------------
// LOGIN
// ------------------------
export async function loginUser(credentials) {
  const { response, data } = await tryFetchUrls(buildUrls("/login"), {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  })

  if (!response.ok) {
    throw new Error(data?.message || "Login failed")
  }

  const authToken = extractAuthToken(data)
  if (authToken) {
    saveAuthToken(authToken)
  }

  return data
}

// ------------------------
// REGISTER
// ------------------------
export async function registerUser(user) {
  const { response, data } = await tryFetchUrls(buildUrls("/register"), {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      full_name: user.full_name || user.name,
      email: user.email,
      password: user.password,
      phone: user.phone,
    }),
  })

  if (!response.ok) {
    throw new Error(data?.message || "Registration failed")
  }

  const authToken = extractAuthToken(data)
  if (authToken) {
    saveAuthToken(authToken)
  }

  return data
}

// ------------------------
// GET PROFILE
// ------------------------
export async function fetchUserProfile() {
  const { response, data } = await tryFetchUrls(buildUrls("/profile"), {
    method: "GET",
    headers: buildHeaders(),
  })

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch profile")
  }

  return normalizeProfilePayload(data)
}

// ------------------------
// LOGOUT
// ------------------------
export function clearAuthToken() {
  localStorage.removeItem("authToken");
}

// ------------------------
// SAVE TOKEN
// ------------------------
export function saveAuthToken(token) {
  localStorage.setItem("authToken", token);
}

// ------------------------
// GET TOKEN
// ------------------------
export function getAuthToken() {
  return getStoredToken();
}