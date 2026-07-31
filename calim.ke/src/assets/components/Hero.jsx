// Hero.jsx defines the homepage hero section,
// including headline copy, call-to-action buttons, and feature stats.
import { Link } from 'react-router-dom'
import Button from './Button'

function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">CALIM / KE</p>
          <h1>Worn with the land.</h1>
          <p className="hero-description">
            Editorial layers, utility cuts, and a bold streetwear attitude built for Nairobi nights and the long haul.
          </p>
          <div className="hero-buttons">
            <Link to="/shop">
              <Button text="Shop the drop" className="btn-primary" />
            </Link>
            <Link to="/about">
              <Button text="Meet the brand" className="btn-secondary" />
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card">
            <p className="hero-card-label">New season / 01</p>
            <h3>Field Cargo + Utility Layers</h3>
            <p>Heavy cotton, waxed finishes, and sharp silhouettes cut for movement.</p>
          </div>
        </div>
      </div>

      <div className="hero-stats">
        <div>
          <strong>6</strong>
          <span>Signature pieces</span>
        </div>
        <div>
          <strong>24h</strong>
          <span>Dispatch window</span>
        </div>
        <div>
          <strong>100%</strong>
          <span>Kenyan-born energy</span>
        </div>
      </div>
    </section>
  )
}

export default Hero;