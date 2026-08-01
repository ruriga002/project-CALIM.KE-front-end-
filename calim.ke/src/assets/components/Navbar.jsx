// Navbar.jsx renders the top navigation bar.
// It shows different links based on whether the user is authenticated,
// and it includes a mobile menu toggle for smaller screens.
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth.js'
import { useCart } from '../../context/CartContext.jsx'

function isAdminUser(user) {
  if (!user) return false

  const role = user?.role?.toString().toLowerCase()
  return !!(
    role === 'admin' ||
    role === 'administrator' ||
    user?.is_admin === true ||
    user?.isAdmin === true ||
    user?.email === 'admin@calim.com'
  )
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { totalItems } = useCart()

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          CALIM<span>.KE</span>
        </Link>

        <ul className={menuOpen ? 'nav-links active' : 'nav-links'}>
          <li>
            <NavLink to="/" onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/shop" onClick={() => setMenuOpen(false)}>
              Shop
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" onClick={() => setMenuOpen(false)}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" onClick={() => setMenuOpen(false)}>
              Contact
            </NavLink>
          </li>
          <li>
            <NavLink to="/cart" onClick={() => setMenuOpen(false)}>
              Bag {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </NavLink>
          </li>
          {user ? (
            <>
              {isAdminUser(user) && (
                <li>
                  <NavLink to="/admin/dashboard" onClick={() => setMenuOpen(false)}>
                    Admin
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink to="/profile" onClick={() => setMenuOpen(false)}>
                  Account
                </NavLink>
              </li>
              <li>
                <button className="nav-logout" onClick={logout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <NavLink to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </NavLink>
            </li>
          )}
        </ul>

        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
      </div>
    </nav>
  )
}

export default Navbar;