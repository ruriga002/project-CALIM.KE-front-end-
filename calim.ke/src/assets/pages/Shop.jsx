// Shop.jsx renders the shop page and search field.
// It fetches the full product catalog and filters results by name/category.
import { useState, useEffect } from "react";
import ProductGrid from "../components/ProductGrid";
import { fetchProducts } from "../../api/api.js";

function Shop() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="shop-page">
      <div className="shop-header">
        <h1>Shop CALIM</h1>
        <p>
          Discover premium fashion designed for confidence, comfort, and
          everyday style.
        </p>

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="search-bar"
        />
      </div>

      {error && (
        <div className="api-error">
          <p>Unable to load products: {error}</p>
        </div>
      )}

      {loading && !error && (
        <div className="loading-state">
          <p>Loading products…</p>
        </div>
      )}

      {!loading && !error && <ProductGrid products={filteredProducts} />}
    </section>
  );
}

export default Shop;
