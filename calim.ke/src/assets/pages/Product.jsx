import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Button from '../components/Button'
import { fetchProducts } from '../../api/api.js'
import { useAuth } from '../../auth/useAuth.js'
import { useCart } from '../../context/CartContext.jsx'

// Product detail page — loads canonical product list and finds by id.
function Product() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [products, setProducts] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selections, setSelections] = useState({})

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const data = await fetchProducts()
        if (mounted) setProducts(data)
      } catch (err) {
        if (mounted) setError(err.message || String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  const setProductSize = (size) => {
    setSelections((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        size,
      },
    }))
  }

  const setProductColor = (color) => {
    setSelections((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        color,
      },
    }))
  }

  if (loading) return <h2>Loading product...</h2>
  if (error) return <div className="api-error">{error}</div>

  // Match IDs as strings to avoid numeric/string coercion bugs.
  const product = (products || []).find((p) => String(p.id) === String(id))

  if (!product) {
    console.warn('Product detail: no product matched id', id)
    return <h2>Product not found</h2>
  }

  const currentSelection = selections[id] || {}
  const activeSize = currentSelection.size || product.sizes?.[0] || ''
  const activeColor = currentSelection.color || product.colors?.[0] || ''

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login', { state: { from: location } })
      return
    }

    const options = { size: activeSize, color: activeColor }
    const added = addToCart(product, 1, options)
    if (added) {
      navigate('/cart')
    }
  }

  return (
    <section className="product-page">
      <div className="product-container">
        <div className="product-image-container">
          <img src={product.image} alt={product.name} className="product-page-image" />
        </div>

        <div className="product-details">
          <p className="product-category">{product.category || product.collection_id}</p>

          <h1>{product.name}</h1>

          <h2 className="product-price">KES {Number(product.price).toLocaleString()}</h2>

          <p className="product-description">{product.description}</p>

          <div className="product-options">
            <h3>Available Sizes</h3>

            <div className="sizes">
              {(product.sizes || []).map((size) => (
                <button
                  type="button"
                  key={size}
                  className={`option-btn ${activeSize === size ? 'active' : ''}`}
                  onClick={() => setProductSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="product-options">
            <h3>Available Colours</h3>

            <div className="colors">
              {(product.colors || []).map((color) => (
                <button
                  type="button"
                  key={color}
                  className={`option-btn ${activeColor === color ? 'active' : ''}`}
                  onClick={() => setProductColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="product-actions">
            <Button type="button" text="Add to Cart" onClick={handleAddToCart} />

            <Button type="button" text="Buy Now" onClick={handleAddToCart} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Product
