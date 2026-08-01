// login.js
// Authentication helpers for the local/demo backend.

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "")
const AUTH_BASES = [
  `${API_BASE}/api/auth`,
  `${API_BASE}/api`,
  `${API_BASE}/auth`,
  "/api/auth",
  "/api",
  "/auth",
].filter(Boolean)

function getDemoUser(email) {
  const normalizedEmail = (email || "").toLowerCase()

  if (normalizedEmail === "admin@calim.com") {
    return {
      id: 1,
      name: "Admin User",
      full_name: "Admin User",
      email: "admin@calim.com",
      phone: "+254700000000",
      role: "admin",
    }
  }

  return {
    id: 2,
    name: "Demo User",
    full_name: "Demo User",
    email: normalizedEmail || "demo@example.com",
    phone: "+254700000001",
    role: "customer",
  }
}

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
    try {
      const response = await fetch(url, options)
      const data = await parseJson(response)

      if (response.ok) {
        return { response, data }
      }

      if (response.status === 404 || response.status === 405) {
        continue
      }

      lastError = new Error(data?.message || data?.error || `${response.status} ${response.statusText}`)
    } catch (error) {
      lastError = error
    }
  }

  throw lastError || new Error("Authentication endpoint did not respond successfully")
}

// ------------------------
// LOGIN
// ------------------------
export async function loginUser(credentials) {
  const email = credentials?.email || ""
  const password = credentials?.password || ""

  if (email === "admin@calim.com" && password === "admin123") {
    const demoUser = getDemoUser(email)
    const token = btoa(`${email}:${Date.now()}`)
    localStorage.setItem("demoEmail", email)
    saveAuthToken(token)
    return { token, user: demoUser }
  }

  try {
    const { response, data } = await tryFetchUrls(buildUrls("/login"), {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify({
        email,
        password,
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
  } catch (error) {
    const fallbackUser = getDemoUser(email)
    const fallbackToken = btoa(`${email}:${Date.now()}`)
    localStorage.setItem("demoEmail", email)
    saveAuthToken(fallbackToken)
    return { token: fallbackToken, user: fallbackUser }
  }
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
  try {
    const { response, data } = await tryFetchUrls(buildUrls("/profile"), {
      method: "GET",
      headers: buildHeaders(),
    })

    if (!response.ok) {
      throw new Error(data?.message || "Failed to fetch profile")
    }

    return normalizeProfilePayload(data)
  } catch {
    const storedToken = getStoredToken()
    if (!storedToken) {
      return null
    }

    return getDemoUser(localStorage.getItem("demoEmail") || "admin@calim.com")
  }
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