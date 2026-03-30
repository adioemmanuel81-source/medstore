import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Products({ user }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existing = cart.find(item => item.id === product.id)
    if (existing) existing.quantity += 1
    else cart.push({ ...product, quantity: 1 })
    localStorage.setItem('cart', JSON.stringify(cart))
    setMessage(`${product.name} added to cart!`)
    setTimeout(() => setMessage(''), 2000)
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (category === '' || p.category === category)
  )

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]

  if (loading) return <div style={styles.loading}>Loading products...</div>

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Medical Products</h2>
      {message && <div style={styles.toast}>{message}</div>}
      <div style={styles.filters}>
        <input style={styles.search} placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        <select style={styles.select} value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      {filtered.length === 0
        ? <p style={styles.empty}>No products found.</p>
        : <div style={styles.grid}>
            {filtered.map(product => (
              <div key={product.id} style={styles.card}>
                {product.image_url && <img src={product.image_url} alt={product.name} style={styles.img} />}
                <div style={styles.cardBody}>
                  <h3 style={styles.productName}>{product.name}</h3>
                  <p style={styles.category}>{product.category}</p>
                  <p style={styles.description}>{product.description}</p>
                  {product.requires_prescription && <span style={styles.rx}>🔴 Prescription Required</span>}
                  <div style={styles.footer}>
                    <span style={styles.price}>${product.price}</span>
                    <span style={styles.stock}>Stock: {product.stock}</span>
                  </div>
                  <button
                    style={product.stock > 0 ? styles.btn : styles.btnDisabled}
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                  >
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  )
}

const styles = {
  container: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  title: { textAlign: 'center', color: '#1a73e8', marginBottom: '2rem' },
  filters: { display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' },
  search: { flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', minWidth: '200px' },
  select: { padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' },
  card: { borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', overflow: 'hidden', background: '#fff' },
  img: { width: '100%', height: '180px', objectFit: 'cover' },
  cardBody: { padding: '1rem' },
  productName: { margin: '0 0 0.3rem', color: '#333' },
  category: { color: '#1a73e8', fontSize: '0.85rem', marginBottom: '0.5rem' },
  description: { color: '#666', fontSize: '0.9rem', marginBottom: '0.8rem' },
  rx: { display: 'block', fontSize: '0.8rem', color: 'red', marginBottom: '0.5rem' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' },
  price: { fontWeight: 'bold', fontSize: '1.2rem', color: '#1a73e8' },
  stock: { fontSize: '0.85rem', color: '#888' },
  btn: { width: '100%', padding: '0.7rem', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  btnDisabled: { width: '100%', padding: '0.7rem', background: '#ccc', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'not-allowed' },
  toast: { position: 'fixed', bottom: '2rem', right: '2rem', background: '#1a73e8', color: '#fff', padding: '1rem 2rem', borderRadius: '8px', zIndex: 1000 },
  loading: { textAlign: 'center', padding: '3rem', fontSize: '1.2rem' },
  empty: { textAlign: 'center', color: '#888', fontSize: '1.1rem' }
}
```

---

**File 11** — path:
```
frontend/src/pages/Cart.js
