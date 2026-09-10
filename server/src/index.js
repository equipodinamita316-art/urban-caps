import express from 'express'
import cors from 'cors'
import crypto from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { db, rowToProduct } from './db.js'
import {
  productInput, insertProduct, listProducts, getProduct,
  updateProduct, deleteProduct, createOrder, findOrder, runSeed, seedProducts,
} from './products.js'
import { svgFor, imgKinds } from './img.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 4000
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'urbancaps123'
const TOKEN_SECRET = process.env.TOKEN_SECRET || crypto.randomBytes(32).toString('hex')

app.use(cors())
app.use(express.json({ limit: '1mb' }))

const signToken = () => {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + 1000 * 60 * 60 * 12 })).toString('base64url')
  const sig = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

const verifyToken = (token) => {
  if (!token) return false
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return false
  const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('base64url')
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return data.exp > Date.now()
  } catch {
    return false
  }
}

const requireAdmin = (req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!verifyToken(token)) {
    return res.status(401).json({ error: 'No autorizado' })
  }
  next()
}

app.get('/api/health', (_req, res) => res.json({ ok: true, name: 'URBAN CAPS API' }))

app.post('/api/admin/login', (req, res) => {
  const pass = String(req.body?.password || '')
  const ok = crypto.timingSafeEqual(
    Buffer.from(pass),
    Buffer.from(ADMIN_PASSWORD),
  )
  if (!ok || pass.length !== ADMIN_PASSWORD.length) {
    return res.status(401).json({ error: 'Password incorrecta' })
  }
  res.json({ token: signToken() })
})

app.get('/api/products', (req, res) => {
  res.json(listProducts({ category: req.query.category, search: req.query.search }))
})

app.get('/api/products/:id', (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID inválido' })
  const product = getProduct(id)
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' })
  res.json(product)
})

app.post('/api/orders', (req, res) => {
  const { customer, items } = req.body || {}
  if (!customer?.name || !customer?.email || !customer?.address || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Datos de pedido incompletos' })
  }
  try {
    const order = createOrder({ customer, items })
    res.status(201).json(order)
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message })
  }
})

app.get('/api/orders/:number', (req, res) => {
  const order = findOrder(req.params.number)
  if (!order) return res.status(404).json({ error: 'Pedido no encontrado' })
  res.json(order)
})

app.get('/api/admin/products', requireAdmin, (_req, res) => {
  const rows = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all()
  res.json(rows.map(rowToProduct))
})

app.post('/api/admin/products', requireAdmin, (req, res) => {
  try {
    const p = productInput(req.body)
    const id = insertProduct(p)
    res.status(201).json(getProduct(id))
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.put('/api/admin/products/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id)
  if (!getProduct(id)) return res.status(404).json({ error: 'Producto no encontrado' })
  const updated = updateProduct(id, productInput({ ...getProduct(id), ...req.body }))
  res.json(updated)
})

app.delete('/api/admin/products/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id)
  if (!deleteProduct(id)) return res.status(404).json({ error: 'Producto no encontrado' })
  res.status(204).end()
})

app.get('/api/img/:kind/:slug.svg', (req, res) => {
  const { kind, slug } = req.params
  if (!imgKinds.includes(kind)) return res.status(404).end()
  res.type('image/svg+xml').set('Cache-Control', 'public, max-age=31536000, immutable').send(svgFor(kind, slug))
})

const clientDist = path.join(__dirname, '..', '..', 'client', 'dist')
app.use(express.static(clientDist))
app.get(/^\/(?!api).*/, (_req, res, next) => {
  return res.sendFile(path.join(clientDist, 'index.html'), (err) => {
    if (err) next()
  })
})

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Error interno' })
})

const start = () => {
  runSeed()
  app.listen(PORT, () => {
    console.log(`URBAN CAPS API en http://localhost:${PORT} (seed: ${seedProducts.length} productos)`)
  })
}

start()