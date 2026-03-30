import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Navbar({ user, role }) {
  const navigate = useNavigate()

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🏥 MedStore</Link>
      <div style={styles.links}>
        <Link to="/products" style={styles.link}>Products</Link>
        <Link to="/cart" style={styles.link}>🛒 Cart</Link>
        {user && <Link to="/orders" style={styles.link}>My Orders</Link>}
        {role === 'admin' && <Link to="/admin" style={styles.adminLink}>Admin</Link>}
        {user
          ? <button onClick={handleSignOut} style={styles.btn}>Sign Out</button>
          : <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/signup" style={styles.signupBtn}>Sign Up</Link>
            </>
        }
      </div>
    </nav>
  )
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#1a73e8', color: '#fff' },
  brand: { color: '#fff', textDecoration: 'none', fontSize: '1.4rem', fontWeight: 'bold' },
  links: { display: 'flex', alignItems: 'center', gap: '1.2rem' },
  link: { color: '#fff', textDecoration: 'none' },
  adminLink: { color: '#ffd700', textDecoration: 'none', fontWeight: 'bold' },
  btn: { background: 'transparent', border: '1px solid #fff', color: '#fff', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer' },
  signupBtn: { background: '#fff', color: '#1a73e8', padding: '0.4rem 1rem', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }
}
```

---

**File 7** — path:
```
frontend/src/pages/Home.js
