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
import Dashboard from './assets/pages/admin/Dashboard'
import Products from './assets/pages/admin/Products'
import Orders from './assets/pages/admin/Orders'
import Customers from './assets/pages/admin/Customers'
import Collections from './assets/pages/admin/Collections'
import Inventory from './assets/pages/admin/Inventory'
import Settings from './assets/pages/admin/Settings'
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
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<Product />} />
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
            <Route path="/admin/dashboard" element={
              <ProtectedRoute adminOnly>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/products" element={
              <ProtectedRoute adminOnly>
                <Products />
              </ProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <ProtectedRoute adminOnly>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/admin/customers" element={
              <ProtectedRoute adminOnly>
                <Customers />
              </ProtectedRoute>
            } />
            <Route path="/admin/collections" element={
              <ProtectedRoute adminOnly>
                <Collections />
              </ProtectedRoute>
            } />
            <Route path="/admin/inventory" element={
              <ProtectedRoute adminOnly>
                <Inventory />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/settings" element={
              <ProtectedRoute adminOnly>
                <Settings />
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
