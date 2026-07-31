// App.jsx is the main React component for the client application.
// It configures routing, wraps the app with authentication state,
// and renders the shared header and footer across all pages.
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './assets/components/Navbar'
import Footer from './assets/components/Footer'
import Home from './assets/pages/Home'
import Shop from './assets/pages/Shop'
import Product from './assets/pages/Product'
import Cart from './assets/pages/Cart'
import About from './assets/pages/About'
import Contact from './assets/pages/Contact'
import Login from './assets/pages/Login'
import Register from './assets/pages/Register'
import Profile from './assets/pages/Profile'
import { AuthProvider } from './auth/AuthContext.jsx'
import ProtectedRoute from './auth/ProtectedRoute.jsx'
import { CartProvider } from './context/CartContext.jsx'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
        <div className="app-shell">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={
              <ProtectedRoute>
                <Shop />
              </ProtectedRoute>
            } />
            <Route path="/product/:id" element={
              <ProtectedRoute>
                <Product />
              </ProtectedRoute>
            } />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </CartProvider>
    </AuthProvider>
  )
}

export default App;
