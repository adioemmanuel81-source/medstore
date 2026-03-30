const express = require('express')
const cors = require('cors')
require('dotenv').config()

const productRoutes = require('./routes/products')
const orderRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'MedStore API is running!' })
})

app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

---

**File 6** — path:
```
backend/package.json
