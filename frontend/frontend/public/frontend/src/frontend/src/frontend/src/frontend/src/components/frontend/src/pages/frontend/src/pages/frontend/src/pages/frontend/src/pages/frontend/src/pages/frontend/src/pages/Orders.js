import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Orders({ user }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchOrders() }, [])

  async function fetchOrders() {
    const { data } = await supabase
      .from('orders')
      .select(`*, order_items(*, products(*))`)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  const statusColor = { pending: '#f59e0b', processing: '#3b82f6', shipped: '#8b5cf6', delivered: '#10b981', cancelled: '#ef4444' }

  if (loading) return <div style={styles.loading}>Loading orders...</div>

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Orders</h2>
      {orders.length === 0
        ? <p style={styles.empty}>No orders yet.</p>
        : orders.map(order => (
          <div key={order.id} style={styles.card}>
            <div style={styles.header}>
              <span style={styles.orderId}>Order #{order.id.slice(0, 8)}</span>
              <span style={{ ...styles.status, background: statusColor[order.status] }}>{order.status}</span>
            </div>
            <p style={styles.date}>{new Date(order.created_at).toLocaleDateString()}</p>
            <p style={styles.address}>📍 {order.shipping_address}</p>
            <div style={styles.items}>
              {order.order_items?.map(item => (
                <div key={item.id} style={styles.item}>
                  <span>{item.products?.name}</span>
                  <span>x{item.quantity}</span>
                  <span>${(item.unit_price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div style={styles.total}>Total: ${order.total}</div>
          </div>
        ))
      }
    </div>
  )
}

const styles = {
  container: { padding: '2rem', maxWidth: '800px', margin: '0 auto' },
  title: { color: '#1a73e8', marginBottom: '1.5rem' },
  card: { background: '#fff', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '1.5rem', marginBottom: '1.5rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  orderId: { fontWeight: 'bold', color: '#333' },
  status: { padding: '0.3rem 0.8rem', borderRadius: '20px', color: '#fff', fontSize: '0.85rem', textTransform: 'capitalize' },
  date: { color: '#888', fontSize: '0.9rem', margin: '0.3rem 0' },
  address: { color: '#555', fontSize: '0.9rem', margin: '0.3rem 0 1rem' },
  items: { borderTop: '1px solid #eee', paddingTop: '0.8rem' },
  item: { display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', color: '#555', fontSize: '0.95rem' },
  total: { fontWeight: 'bold', color: '#1a73e8', textAlign: 'right', marginTop: '0.8rem', fontSize: '1.1rem' },
  loading: { textAlign: 'center', padding: '3rem' },
  empty: { textAlign: 'center', color: '#888' }
}
```

---

**File 13** — path:
```
frontend/src/pages/AdminDashboard.js
