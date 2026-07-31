// ProductGrid.jsx renders a grid of product cards.
// It also shows an empty state message if there are no products available.
import ProductCard from "./ProductCard";

function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="empty-products">
        <h2>No products available.</h2>
        <p>Please check back later.</p>
      </div>
    );
  }

  return (
    <section className="product-grid-section">
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}

export default ProductGrid;