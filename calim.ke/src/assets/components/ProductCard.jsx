// ProductCard.jsx displays an individual product tile
// with an image, price, and action buttons.
import { Link } from "react-router-dom";
import Button from "./Button";
import { useCart } from '../../context/CartContext.jsx'

function ProductCard({ product }) {
  const { addToCart } = useCart()

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
            text="Add to Cart"
            onClick={() => addToCart(product, 1)}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductCard;