import React, { useEffect, useState } = from 'react'
import { supabase } from '../supabaseClient'

export default function AdminDashboard() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [tab, setTab] = useState('products')
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category: '', image_url: '', requires_prescription: false })
  const [editing, setEditing] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => { fetchProducts(); fetchOrders() }, [])

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
  }

  async function fetchOrders() {
    const { data } = await supabase.from('orders').select(`*, profiles(full_name), order_items(*, products(name))`).order('created_at', { ascending: false })
    setOrders(data || [])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) }
    if (editing) {
      await supabase.from('products').update(payload).eq('id', editing)
      setMessage('Product updated!')
    } else {
      await supabase.from('products').insert([payload])
      setMessage('Product added!')
    }
    setForm({ name: '', description: '', price: '', stock: '', category: '', image_url: '', requires_prescription: false })
    setEditing(null)
    fetchProducts()
    setTimeout(() => setMessage(''), 3000)
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  async function updateOrderStatus(id, status) {
    await supabase.from('orders').update({ status }).eq('id', id)
    fetchOrders()
  }

  function startEdit(product) {
    setEditing(product.id)
    setForm(product)
    setTab('products')
    window.scrollTo(0, 0)
  }

  const statusColor = { pending: '#f59e0b', processing: '#3b82f6', shipped: '#8b5cf6', delivered: '#10b981', cancelled: '#ef4444' }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Admin Dashboard</h2>
      <div style={styles.tabs}>
        <button style={tab === 'products' ? styles.activeTab : styles.tab} onClick={() => setTab('products')}>Products</button>
        <button style={tab === 'orders' ? styles.activeTab : styles.tab} onClick={() => setTab('orders')}>Orders ({orders.length})</button>
      </div>

      {tab === 'products' && (
        <>
          <div style={styles.card}>
            <h3>{editing ? 'Edit Product' : 'Add New Product'}</h3>
            {message && <p style={styles.success}>{message}</p>}
            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <input style={styles.input} placeholder="Product name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                <input style={styles.input} placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
                <input style={styles.input} type="number" placeholder="Price" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
                <input style={styles.input} type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required />
                <input style={styles.input} placeholder="Image URL" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} />
                <label style={styles.checkbox}>
                  <input type="checkbox" checked={form.requires_prescription} onChange={e => setForm({...form, requires_prescription: e.target.checked})} />
                  Requires Prescription
                </label>
              </div>
              <textarea style={styles.textarea} placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              <button style={styles.btn} type="submit">{editing ? 'Update Product' : 'Add Product'}</button>
              {editing && <button style={styles.cancelBtn} type="button" onClick={() => { setEditing(null); setForm({ name: '', description: '', price: '', stock: '', category: '', image_url: '', requires_prescription: false }) }}>Cancel</button>}
            </form>
          </div>

          <div style={styles.card}>
            <h3>All Products ({products.length})</h3>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Stock</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} style={styles.tr}>
                    <td style={styles.td}>{p.name}</td>
                    <td style={styles.td}>{p.category}</td>
                    <td style={styles.td}>${p.price}</td>
                    <td style={styles.td}>{p.stock}</td>
                    <td style={styles.td}>
                      <button style={styles.editBtn} onClick={() => startEdit(p)}>Edit</button>
                      <button style={styles.deleteBtn} onClick={() => handleDelete(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'orders' && (
        <div style={styles.card}>
          <h3>All Orders</h3>
          {orders.map(order => (
            <div key={order.id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <span style={styles.orderId}>#{order.id.slice(0, 8)}</span>
                <span style={styles.customerName}>{order.profiles?.full_name || 'Customer'}</span>
                <span style={{ ...styles.statusBadge, background: statusColor[order.status] }}>{order.status}</span>
                <span style={styles.orderTotal}>${order.total}</span>
              </div>
              <p style={styles.orderDate}>{new Date(order.created_at).toLocaleDateString()} — {order.shipping_address}</p>
              <div style={styles.orderItems}>
                {order.order_items?.map(item => (
                  <span key={item.id} style={styles.orderItem}>{item.products?.name} x{item.quantity}</span>
                ))}
              </div>
              <select style={styles.statusSelect} value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value)}>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { padding: '2rem', maxWidth: '1100px', margin: '0 auto' },
  title: { color: '#1a73e8', marginBottom: '1rem' },
  tabs: { display: 'flex', gap: '1rem', marginBottom: '1.5rem' },
  tab: { padding: '0.6rem 1.5rem', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', background: '#fff' },
  activeTab: { padding: '0.6rem 1.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer', background: '#1a73e8', color: '#fff', fontWeight: 'bold' },
  card: { background: '#fff', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '1.5rem', marginBottom: '1.5rem' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' },
  input: { padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' },
  textarea: { width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', minHeight: '80px', boxSizing: 'border-box', marginBottom: '1rem' },
  checkbox: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' },
  btn: { padding: '0.8rem 2rem', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginRight: '1rem' },
  cancelBtn: { padding: '0.8rem 2rem', background: '#888', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  success: { color: 'green', marginBottom: '1rem' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f5f5f5' },
  th: { padding: '0.8rem', textAlign: 'left', fontWeight: 'bold', color: '#333', borderBottom: '2px solid #eee' },
  tr: { borderBottom: '1px solid #eee' },
  td: { padding: '0.8rem', color: '#555' },
  editBtn: { padding: '0.3rem 0.8rem', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' },
  deleteBtn: { padding: '0.3rem 0.8rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  orderCard: { border: '1px solid #eee', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' },
  orderHeader: { display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.5rem' },
  orderId: { fontWeight: 'bold', color: '#333' },
  customerName: { color: '#555' },
  statusBadge: { padding: '0.2rem 0.7rem', borderRadius: '20px', color: '#fff', fontSize: '0.8rem' },
  orderTotal: { fontWeight: 'bold', color: '#1a73e8', marginLeft: 'auto' },
  orderDate: { color: '#888', fontSize: '0.85rem', margin: '0.3rem 0' },
  orderItems: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '0.5rem 0' },
  orderItem: { background: '#f0f4ff', color: '#1a73e8', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem' },
  statusSelect: { padding: '0.4rem', borderRadius: '6px', border: '1px solid #ddd', marginTop: '0.5rem' }
}
