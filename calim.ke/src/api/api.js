// api/api.js exposes data fetching helpers for product-related API requests.
// It centralizes remote calls and error handling for product listings.
import mockProducts from '../assets/data/product.js'

export async function fetchProducts() {
  try {
    const response = await fetch('http://127.0.0.1:5001/api/products')
    if (!response.ok) {
      throw new Error(`Failed to fetch products (${response.status})`)
    }
    const payload = await response.json()
    // Normalize response shapes: backend may return { products: [...] }
    if (Array.isArray(payload)) return payload
    if (payload && Array.isArray(payload.products)) return payload.products
    // Fallback: if payload is an object but not the expected shape,
    // return it wrapped in an array so UI doesn't crash.
    return Array.isArray(payload) ? payload : [payload]
  } catch (err) {
    // Fall back to local mock data when the backend is not reachable.
    console.warn('fetchProducts failed, returning mock products:', err.message)
    return mockProducts
  }
}
