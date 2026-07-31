import { useState, useEffect } from 'react'
import Hero from '../components/Hero'
import ProductGrid from '../components/ProductGrid'
import { fetchProducts } from '../../api/api.js'

function Home() {
  const [products, setProducts] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts()
        setProducts(data)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const categories = ['All', ...new Set(products.map((product) => product.category || 'Other'))]

  const filteredProducts =
    activeCategory === 'All'
      ? products
      : products.filter((product) => product.category === activeCategory)

  return (
    <>
      <Hero />

      <section className="story-section">
        <div className="story-card">
          <p className="eyebrow">The story</p>
          <h2>Built from Kenya. Cut for the city.</h2>
          <p>
            CALIM began with a simple idea: make clothes that carry weight, texture, and attitude without losing comfort.
            Our founder blends old-world craft with contemporary streetwear to create pieces that feel both durable and personal.
          </p>
        </div>
      </section>

      <section className="featured-products">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Collection</p>
            <h2>Drop-ready essentials</h2>
          </div>
          <div className="chip-row">
            {categories.map((category) => (
              <button
                key={category}
                className={activeCategory === category ? 'chip active' : 'chip'}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
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

      <section className="quote-strip">
        <p>“Worn with the land. Built for movement.”</p>
      </section>
    </>
  )
}

export default Home;
