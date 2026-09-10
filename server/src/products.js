import { db, rowToProduct } from './db.js'

const CATEGORIES = ['gorras', 'camisetas', 'hoodies', 'accesorios']
const IMG = (kind, slug) => `/api/img/${kind}/${slug}`

export const productInput = (p) => ({
  sku: String(p.sku || '').trim().toUpperCase(),
  name: String(p.name || '').trim(),
  description: String(p.description || ''),
  category: CATEGORIES.includes(p.category) ? p.category : 'gorras',
  price: Number(p.price),
  compareAt: p.compareAt ? Number(p.compareAt) : null,
  images: Array.isArray(p.images) ? p.images.map(String) : [],
  colors: Array.isArray(p.colors) ? p.colors.map(String) : [],
  sizes: Array.isArray(p.sizes) ? p.sizes.map(String) : [],
  stock: Math.max(0, Math.floor(Number(p.stock) || 0)),
  featured: p.featured ? 1 : 0,
  hot: p.hot ? 1 : 0,
})

export const insertProduct = (p) => {
  const now = new Date().toISOString()
  const sku = p.sku || `UC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  const info = db.prepare(`
    INSERT INTO products (sku, name, description, category, price, compare_at, images, colors, sizes, stock, featured, hot, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    sku, p.name, p.description, p.category, p.price, p.compareAt,
    JSON.stringify(p.images), JSON.stringify(p.colors), JSON.stringify(p.sizes),
    p.stock, p.featured, p.hot, now,
  )
  return Number(info.lastInsertRowid)
}

export const seedProducts = [
  {
    name: 'SNAP "SKYLINE" 003', category: 'gorras', price: 39.99, compareAt: 55,
    description: 'Snapback de perfil rígido con bordado tridimensional. Algodón 8oz, cierre ajustable. Edición limitada a 20 unidades por color.',
    images: [IMG('gorras', 'skyline-acid'), IMG('gorras', 'skyline-side'), IMG('gorras', 'skyline-top')],
    colors: ['Acid Lime', 'Pitch Black'], sizes: ['Única'], stock: 20, featured: 1, hot: 1, sku: 'UC-SNAP-003',
  },
  {
    name: 'TRUCKER "BLOCK" 7É', category: 'gorras', price: 34.99, compareAt: 45,
    description: 'Trucker de malla con panel frontal en gabardina. Etiqueta tejida reflectante en el lateral.',
    images: [IMG('gorras', 'trucker-orange'), IMG('gorras', 'trucker-back')],
    colors: ['Ember Orange', 'Acid Lime'], sizes: ['Única'], stock: 15, featured: 1, hot: 1, sku: 'UC-TRK-007',
  },
  {
    name: 'CAMIONERO "GRAFF" LOW', category: 'gorras', price: 29.99,
    description: 'Trucker de perfil bajo con logo pintado a mano (técnicas de aerosol). Cada pieza es única.',
    images: [IMG('gorras', 'graff-green'), IMG('gorras', 'graff-profile')],
    colors: ['Verde Gráfico', 'Negro Carbón'], sizes: ['Única'], stock: 12, hot: 1, sku: 'UC-TRK-LOW',
  },
  {
    name: 'FITTED "NEON CITY" 12', category: 'gorras', price: 44.99, compareAt: 60,
    description: 'Gorra fitted de 6 paneles, 59FIFTY-ish, con sarga nacarada que refleja luz neón.',
    images: [IMG('gorras', 'fitted-pink')],
    colors: ['Rosa Neón', 'Blanco', 'Azul Eléctrico'], sizes: ['7', '7 1/8', '7 1/4', '7 3/8'], stock: 25, featured: 1, sku: 'UC-FIT-012',
  },
  {
    name: 'CURLY "O.G." VINTAGE', category: 'gorras', price: 38.99,
    description: 'Visera curva lavada a la piedra con parches vintage bordados. Estilo old school.',
    images: [IMG('gorras', 'curly-tan')],
    colors: ['Tan', 'Militar'], sizes: ['Única'], stock: 18, featured: 1, sku: 'UC-CURLY-OG',
  },
  {
    name: 'TEE "RAW TYPE" 001', category: 'camisetas', price: 25.99, compareAt: 35,
    description: 'Camiseta oversize 240gsm, algodón peinado. Serigrafía en agua a 2 tintas. Corte boxy.',
    images: [IMG('camisetas', 'tee-type-front'), IMG('camisetas', 'tee-type-back')],
    colors: ['Blanco', 'Negro'], sizes: ['S', 'M', 'L', 'XL'], stock: 40, featured: 1, sku: 'UC-TEE-001',
  },
  {
    name: 'TEE "URBAN TYPE" 002', category: 'camisetas', price: 27.99,
    description: 'Camiseta de cuello reforzado con tipografía expandida estilo industrial.',
    images: [IMG('camisetas', 'tee-urban-red')],
    colors: ['Rojo', 'Blanco'], sizes: ['M', 'L', 'XL', 'XXL'], stock: 30, sku: 'UC-TEE-002',
  },
  {
    name: 'HOODIE "HAZARD" 01', category: 'hoodies', price: 79.99, compareAt: 95,
    description: 'Hoodie pesado 450gsm con bolsillo canguro, capucha doble capa y costura refuerzo de remaches.',
    images: [IMG('hoodies', 'hoodie-green-front'), IMG('hoodies', 'hoodie-green-back')],
    colors: ['Verde Ácido', 'Negro', 'Gris'], sizes: ['S', 'M', 'L', 'XL'], stock: 22, featured: 1, hot: 1, sku: 'UC-HOOD-01',
  },
  {
    name: 'HOODIE "NOCTA BLOQUE"', category: 'hoodies', price: 85.99,
    description: 'Hoodie boxy con bloque de color y bordado con hilo reflectante.',
    images: [IMG('hoodies', 'hoodie-orange-front')],
    colors: ['Naranja', 'Negro'], sizes: ['M', 'L', 'XL'], stock: 16, sku: 'UC-HOOD-02',
  },
  {
    name: 'BALACLAVA "GHOST"', category: 'accesorios', price: 22.99,
    description: 'Balaclava de tejido técnico transpirable, cosido en un solo panel.',
    images: [IMG('accesorios', 'balaclava-black')],
    colors: ['Negro'], sizes: ['Única'], stock: 50, hot: 1, sku: 'UC-ACC-01',
  },
  {
    name: 'BUZÓN "DVST" BLACK', category: 'accesorios', price: 24.99,
    description: 'Chaqueta de buzo tecnológica con impermeabilidad DWR y logo jacquard.',
    images: [IMG('accesorios', 'buzo-black')],
    colors: ['Negro', 'Verde Ácido'], sizes: ['S', 'M', 'L'], stock: 28, sku: 'UC-ACC-02',
  },
  {
    name: 'BOLSA "URBAN TOTE"', category: 'accesorios', price: 18.99,
    description: 'Tote de lona 12oz con estampado de látex. Capacidad 18L.',
    images: [IMG('accesorios', 'tote-bag')],
    colors: ['Crudo', 'Negro'], sizes: ['Única'], stock: 35, sku: 'UC-ACC-03',
  },
]

export const runSeed = (force = false) => {
  const count = db.prepare('SELECT COUNT(*) AS n FROM products').get().n
  if (count > 0 && !force) return { seeded: 0, message: 'Ya hay productos en la base. Usa --force para resemillar.' }
  if (force) db.exec('DELETE FROM products')
  for (const p of seedProducts) insertProduct(productInput(p))
  return { seeded: seedProducts.length, message: `${seedProducts.length} productos sembrados.` }
}

export const listProducts = (filters = {}) => {
  const { category, search } = filters
  let sql = 'SELECT * FROM products'
  const where = []
  const params = []
  if (category && category !== 'todo') {
    where.push('category = ?')
    params.push(category)
  }
  if (search) {
    where.push('(name LIKE ? OR sku LIKE ? OR description LIKE ?)')
    const like = `%${search}%`
    params.push(like, like, like)
  }
  if (where.length) sql += ' WHERE ' + where.join(' AND ')
  sql += ' ORDER BY featured DESC, created_at DESC'
  return db.prepare(sql).all(...params).map(rowToProduct)
}

export const getProduct = (id) => {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id)
  return row ? rowToProduct(row) : null
}

export const updateProduct = (id, p) => {
  db.prepare(`
    UPDATE products SET name=?, description=?, category=?, price=?, compare_at=?, images=?, colors=?, sizes=?, stock=?, featured=?, hot=?
    WHERE id=?
  `).run(
    p.name, p.description, p.category, p.price, p.compareAt,
    JSON.stringify(p.images), JSON.stringify(p.colors), JSON.stringify(p.sizes),
    p.stock, p.featured, p.hot, id,
  )
  return getProduct(id)
}

export const deleteProduct = (id) => {
  const info = db.prepare('DELETE FROM products WHERE id = ?').run(id)
  return info.changes > 0
}

export const createOrder = ({ customer, items }) => {
  return db.transaction(() => {
    let subtotal = 0
    const lines = items.map((it) => {
      const product = getProduct(it.productId)
      if (!product) throw new Error(`Producto ${it.productId} no existe`)
      const qty = Math.max(1, Math.floor(Number(it.qty) || 1))
      if (product.stock < qty) {
        const e = new Error(`Stock insuficiente para "${product.name}"`)
        e.status = 409
        throw e
      }
      subtotal += product.price * qty
      db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(qty, product.id)
      return {
        productId: product.id,
        sku: product.sku,
        name: product.name,
        price: product.price,
        color: String(it.color || ''),
        size: String(it.size || ''),
        qty,
      }
    })
    const shipping = subtotal >= 100 ? 0 : 12
    const total = Math.round((subtotal + shipping) * 100) / 100
    const orderNumber = `UC-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`
    const info = db.prepare(`
      INSERT INTO orders (order_number, customer, items, subtotal, shipping, total, status)
      VALUES (?, ?, ?, ?, ?, ?, 'paid')
    `).run(
      orderNumber,
      JSON.stringify(customer),
      JSON.stringify(lines),
      Math.round(subtotal * 100) / 100,
      shipping,
      total,
    )
    return { id: Number(info.lastInsertRowid), orderNumber, subtotal, shipping, total, items: lines }
  })()
}

export const findOrder = (number) => {
  const row = db.prepare('SELECT * FROM orders WHERE order_number = ?').get(number)
  return row ? { ...row, customer: JSON.parse(row.customer), items: JSON.parse(row.items) } : null
}

export const getImgKind = () => ['gorras', 'camisetas', 'hoodies', 'accesorios']