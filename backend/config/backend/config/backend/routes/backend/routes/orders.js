const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')

router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`*, order_items(*, products(*))`)
    .order('created_at', { ascending: false })

  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
})

router.post('/', async (req, res) => {
  const { user_id, items, shipping_address } = req.body
  const total = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{ user_id, total, shipping_address }])
    .select()

  if (orderError) return res.status(400).json({ error: orderError.message })

  const orderItems = items.map(item => ({
    order_id: order[0].id,
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: item.unit_price
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) return res.status(400).json({ error: itemsError.message })
  res.status(201).json(order[0])
})

router.put('/:id/status', async (req, res) => {
  const { status } = req.body
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', req.params.id)
    .select()

  if (error) return res.status(400).json({ error: error.message })
  res.json(data[0])
})

module.exports = router
```

---

**File 4** — path:
```
backend/routes/auth.js
