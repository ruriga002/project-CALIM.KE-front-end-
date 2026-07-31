import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const CART_STORAGE_KEY = 'calim-cart-items'

function readCartFromStorage() {
  if (typeof window === 'undefined') return []

  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(readCartFromStorage)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
    }
  }, [cartItems])

  const addToCart = (product, quantity = 1, options = {}) => {
    setCartItems((items) => {
      const existingItem = items.find(
        (item) =>
          String(item.id) === String(product.id) &&
          JSON.stringify(item.options || {}) === JSON.stringify(options || {})
      )

      if (existingItem) {
        return items.map((item) =>
          String(item.id) === String(product.id) &&
          JSON.stringify(item.options || {}) === JSON.stringify(options || {})
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [
        ...items,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price) || 0,
          image: product.image,
          quantity,
          options: options || {},
        },
      ]
    })

    return true
  }

  const increaseQuantity = (id, options = {}) => {
    setCartItems((items) =>
      items.map((item) =>
        String(item.id) === String(id) && JSON.stringify(item.options || {}) === JSON.stringify(options || {})
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    )
  }

  const decreaseQuantity = (id, options = {}) => {
    setCartItems((items) =>
      items
        .map((item) =>
          String(item.id) === String(id) && JSON.stringify(item.options || {}) === JSON.stringify(options || {})
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeItem = (id, options = {}) => {
    setCartItems((items) =>
      items.filter((item) => !(String(item.id) === String(id) && JSON.stringify(item.options || {}) === JSON.stringify(options || {})))
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const value = useMemo(() => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return {
      cartItems,
      addToCart,
      removeItem,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }
  }, [cartItems])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
