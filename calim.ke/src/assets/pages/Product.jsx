import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Button from '../components/Button'
import { fetchProducts } from '../../api/api.js'
import { useCart } from '../../context/CartContext.jsx'

// Product detail page — loads canonical product list and finds by id.
function Product() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [products, setProducts] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  if (loading) return <h2>Loading product...</h2>
  if (error) return <div className="api-error">{error}</div>

  // Match IDs as strings to avoid numeric/string coercion bugs.
  const product = (products || []).find((p) => String(p.id) === String(id))

  if (!product) {
    console.warn('Product detail: no product matched id', id)
    return <h2>Product not found</h2>
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
                <button key={size} className="option-btn">
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="product-options">
            <h3>Available Colours</h3>

            <div className="colors">
              {(product.colors || []).map((color) => (
                <button key={color} className="option-btn">
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="product-actions">
            <Button text="Add to Cart" onClick={() => addToCart(product, 1)} />

            <Button text="Buy Now" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Product
