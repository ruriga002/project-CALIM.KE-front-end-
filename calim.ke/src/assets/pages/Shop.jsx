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
        console.table(data);

        // data is already an array from fetchProducts()
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const searchTerm = search.toLowerCase();

  const filteredProducts = products.filter((product) => {
    const name = (product.name || "").toLowerCase();
    const category = (product.category || "").toLowerCase();
    const description = (product.description || "").toLowerCase();

    return (
      name.includes(searchTerm) ||
      category.includes(searchTerm) ||
      description.includes(searchTerm)
    );
  });

  return (
    <section className="shop-page">
      <div className="shop-header">
        <h1>THIS IS MY SHOP</h1>

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

      {!loading && !error && (
        <ProductGrid products={filteredProducts} />
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <div className="empty-products">
          <h2>No products found.</h2>
          <p>Try a different search term.</p>
        </div>
      )}
    </section>
  );
}

export default Shop;