const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')

router.post('/signup', async (req, res) => {
  const { email, password, full_name } = req.body
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name } }
  })
  if (error) return res.status(400).json({ error: error.message })
  res.status(201).json({ user: data.user })
})

router.post('/signin', async (req, res) => {
  const { email, password } = req.body
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) return res.status(400).json({ error: error.message })
  res.json({ user: data.user, session: data.session })
})

router.post('/signout', async (req, res) => {
  const { error } = await supabase.auth.signOut()
  if (error) return res.status(400).json({ error: error.message })
  res.json({ message: 'Signed out successfully' })
})

module.exports = router
```

---

**File 5** — path:
```
backend/index.js
