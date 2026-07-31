// Cart.jsx renders a shopping cart interface.
// It manages cart item state through the shared cart context and
// allows quantity changes, removal of items, and displays a checkout total.
import { useState } from 'react'
import Button from "../components/Button";
import { useCart } from '../../context/CartContext.jsx'

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    totalPrice,
    clearCart,
  } = useCart()
  const [checkoutMessage, setCheckoutMessage] = useState('')

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setCheckoutMessage('Your cart is empty. Add something first.')
      return
    }

    clearCart()
    setCheckoutMessage('Checkout complete. Your order is on its way!')
  }

  return (
    <section className="cart-page">
      <div className="cart-container">
        <h1>Shopping Cart</h1>

        {checkoutMessage && (
          <div className="api-success">{checkoutMessage}</div>
        )}

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <h2>Your cart is empty.</h2>
            <p>Browse our collections and add your favourite items.</p>
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-image"
                />

                <div className="cart-details">
                  <h3>{item.name}</h3>
                  <p>KES {item.price.toLocaleString()}</p>
                </div>

                <div className="cart-quantity">
                  <button onClick={() => decreaseQuantity(item.id)}>-</button>

                  <span>{item.quantity}</span>

                  <button onClick={() => increaseQuantity(item.id)}>+</button>
                </div>

                <div className="cart-total">
                  KES {(item.price * item.quantity).toLocaleString()}
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="cart-summary">
              <h2>Total: KES {totalPrice.toLocaleString()}</h2>

              <Button text="Proceed to Checkout" onClick={handleCheckout} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Cart;