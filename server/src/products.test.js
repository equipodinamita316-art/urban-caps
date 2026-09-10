import { test, describe, before, after } from 'node:test'
import assert from 'node:assert/strict'
import os from 'node:os'
import path from 'node:path'
import { rmSync } from 'node:fs'

const dbPath = path.join(os.tmpdir(), `uc-test-${process.pid}-${Date.now()}.db`)
process.env.DB_PATH = dbPath

const { productInput, insertProduct, getProduct, updateProduct, deleteProduct, listProducts } =
  await import('./products.js')
const { db } = await import('./db.js')

after(() => {
  try {
    db.close()
    rmSync(dbPath, { force: true })
    rmSync(`${dbPath}-wal`, { force: true })
    rmSync(`${dbPath}-shm`, { force: true })
  } catch {
    /* noop */
  }
})

describe('productos', () => {
  test('productInput normaliza datos', () => {
    const p = productInput({
      name: '  Gorra  ',
      price: '29.5',
      compareAt: '40',
      images: ['a.svg'],
      sizes: ['M', 'L'],
      stock: '5',
      category: 'gorras',
      featured: true,
    })
    assert.equal(p.name, 'Gorra')
    assert.equal(p.price, 29.5, 'precio numérico')
    assert.equal(p.compareAt, 40)
    assert.equal(p.stock, 5)
    assert.equal(p.category, 'gorras')
    assert.equal(p.featured, 1)
  })

  test('insert + get + update + delete roundtrip', () => {
    const id = insertProduct(productInput({
      name: 'Gorra TEST', price: 10, category: 'gorras', stock: 3, images: [], colors: [], sizes: ['Única'],
    }))
    const got = getProduct(id)
    assert.ok(got)
    assert.equal(got.id, 1, 'comienza en id 1 en BD de prueba aislada')
    assert.equal(got.name, 'Gorra TEST')
    assert.equal(got.sku.slice(0, 3), 'UC-')

    const updated = updateProduct(id, productInput({ ...got, name: 'Gorra X', price: 12 }))
    assert.equal(updated.name, 'Gorra X')

    const found = listProducts({ search: 'Gorra X' })
    assert.equal(found.length, 1)

    assert.equal(deleteProduct(id), true)
    assert.equal(getProduct(id), null)
  })

  test('seed productos queda en BD aislada', async () => {
    const { seedProducts, runSeed } = await import('./products.js')
    assert.ok(seedProducts.length >= 1)
    const res = runSeed()
    assert.ok(res.seeded >= 1)
    assert.equal(listProducts().length, seedProducts.length)
  })
})