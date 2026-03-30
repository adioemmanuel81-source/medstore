import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Welcome to MedStore 🏥</h1>
        <p style={styles.subtitle}>Your trusted source for quality medical products</p>
        <Link to="/products" style={styles.btn}>Shop Now</Link>
      </div>
      <div style={styles.features}>
        <div style={styles.card}>💊 <h3>Wide Selection</h3><p>Thousands of medical products</p></div>
        <div style={styles.card}>🚚 <h3>Fast Delivery</h3><p>Get products at your doorstep</p></div>
        <div style={styles.card}>🔒 <h3>Secure Shopping</h3><p>Your data is always protected</p></div>
      </div>
    </div>
  )
}

const styles = {
  container: { fontFamily: 'Arial, sans-serif' },
  hero: { textAlign: 'center', padding: '5rem 2rem', background: 'linear-gradient(135deg, #1a73e8, #0d47a1)', color: '#fff' },
  title: { fontSize: '3rem', marginBottom: '1rem' },
  subtitle: { fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 },
  btn: { background: '#fff', color: '#1a73e8', padding: '0.8rem 2rem', borderRadius: '25px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1rem' },
  features: { display: 'flex', justifyContent: 'center', gap: '2rem', padding: '4rem 2rem', flexWrap: 'wrap' },
  card: { textAlign: 'center', padding: '2rem', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '200px' }
}
```

---

**File 8** — path:
```
frontend/src/pages/Login.js
