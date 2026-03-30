const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')

// Get all products
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
})

// Get single product
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', req.params.id)
    .single()

  if (error) return res.status(404).json({ error: 'Product not found' })
  res.json(data)
})

// Create product (admin only)
router.post('/', async (req, res) => {
  const { name, description, price, stock, category, image_url, requires_prescription } = req.body

  const { data, error } = await supabase
    .from('products')
    .insert([{ name, description, price, stock, category, image_url, requires_prescription }])
    .select()

  if (error) return res.status(400).json({ error: error.message })
  res.status(201).json(data[0])
})

// Update product (admin only)
router.put('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .update(req.body)
    .eq('id', req.params.id)
    .select()

  if (error) return res.status(400).json({ error: error.message })
  res.json(data[0])
})

// Delete product (admin only)
router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', req.params.id)

  if (error) return res.status(400).json({ error: error.message })
  res.json({ message: 'Product deleted' })
})

module.exports = router
