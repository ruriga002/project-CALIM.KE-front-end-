import { Link, useNavigate, useLocation } from 'react-router-dom'
import Button from './Button'
import { useCart } from '../../context/CartContext.jsx'
import { useAuth } from '../../auth/useAuth.js'

function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login', { state: { from: location } })
      return
    }

    const added = addToCart(product, 1)
    if (added) {
      navigate('/cart')
    }
  }

  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
      />

      <div className="product-info">
        <p className="product-category">{product.category}</p>

        <h3>{product.name}</h3>

        <p className="product-price">
          KES {Number(product.price).toLocaleString()}
        </p>

        <div className="product-buttons">
          <Link to={`/product/${product.id}`}>
            <Button text="View Details" />
          </Link>

          <Button
            type="button"
            text="Add to Cart"
            onClick={handleAddToCart}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductCard
