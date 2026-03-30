import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function Cart({ user }) {
  const [cart, setCart] = useState([])
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(saved)
  }, [])

  function updateQuantity(id, qty) {
    const updated = cart.map(item => item.id === id ? { ...item, quantity: qty } : item).filter(item => item.quantity > 0)
    setCart(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  function removeItem(id) {
    const updated = cart.filter(item => item.id !== id)
    setCart(updated)
    localStorage.setItem('cart', JSON.stringify(updated))
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  async function handleCheckout() {
    if (!user) return navigate('/login')
    if (!address) return setMessage('Please enter a shipping address')
    setLoading(true)

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{ user_id: user.id, total, shipping_address: address }])
      .select()

    if (orderError) { setMessage('Order failed. Try again.'); setLoading(false); return }

    const orderItems = cart.map(item => ({
      order_id: order[0].id,
      product_id: item.id,
      quantity: item.quantity,
      unit_price: item.price
    }))

    await supabase.from('order_items').insert(orderItems)

    localStorage.removeItem('cart')
    setCart([])
    setMessage('Order placed successfully! 🎉')
    setTimeout(() => navigate('/orders'), 2000)
    setLoading(false)
  }

  if (cart.length === 0) return (
    <div style={styles.empty}>
      <h2>Your cart is empty 🛒</h2>
      <button style={styles.btn} onClick={() => navigate('/products')}>Shop Now</button>
    </div>
  )

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Your Cart</h2>
      {message && <p style={styles.message}>{message}</p>}
      {cart.map(item => (
        <div key={item.id} style={styles.item}>
          <div>
            <h3 style={styles.name}>{item.name}</h3>
            <p style={styles.price}>${item.price} each</p>
          </div>
          <div style={styles.controls}>
            <button style={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
            <span style={styles.qty}>{item.quantity}</span>
            <button style={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            <button style={styles.removeBtn} onClick={() => removeItem(item.id)}>🗑️</button>
          </div>
          <span style={styles.subtotal}>${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
      <div style={styles.summary}>
        <h3>Total: ${total.toFixed(2)}</h3>
        <input style={styles.input} placeholder="Shipping address" value={address} onChange={e => setAddress(e.target.value)} />
        <button style={styles.btn} onClick={handleCheckout} disabled={loading}>
          {loading ? 'Placing order...' : 'Place Order'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: { padding: '2rem', maxWidth: '800px', margin: '0 auto' },
  title: { color: '#1a73e8', marginBottom: '1.5rem' },
  item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #eee', flexWrap: 'wrap', gap: '1rem' },
  name: { margin: 0, color: '#333' },
  price: { margin: '0.3rem 0 0', color: '#888', fontSize: '0.9rem' },
  controls: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  qtyBtn: { width: '30px', height: '30px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', background: '#f5f5f5', fontSize: '1rem' },
  qty: { minWidth: '30px', textAlign: 'center', fontWeight: 'bold' },
  removeBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' },
  subtotal: { fontWeight: 'bold', color: '#1a73e8', minWidth: '70px', textAlign: 'right' },
  summary: { marginTop: '2rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '12px' },
  input: { display: 'block', width: '100%', padding: '0.8rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '0.9rem', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' },
  message: { color: 'green', fontWeight: 'bold', textAlign: 'center' },
  empty: { textAlign: 'center', padding: '4rem' }
}
```

---

**File 12** — path:
```
frontend/src/pages/Orders.js
