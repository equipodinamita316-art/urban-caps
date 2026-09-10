import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'uc_cart_v1'

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)
  const [isOpen, setIsOpen] = useState(false)
  const [lastAdded, setLastAdded] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* noop */
    }
  }, [items])

  const uid = (product, opts) => `${product.id}-${opts.color || ''}-${opts.size || ''}`

  const add = useCallback((product, opts = {}) => {
    setItems((prev) => {
      const key = uid(product, opts)
      const existing = prev.find((it) => it.key === key)
      if (existing) {
        return prev.map((it) =>
          it.key === key ? { ...it, qty: Math.min(it.qty + 1, 99) } : it,
        )
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: product.name,
          price: product.price,
          images: product.images,
          color: opts.color || null,
          size: opts.size || null,
          qty: 1,
        },
      ]
    })
    setLastAdded({ product, opts: { ...opts, key: uid(product, opts) } })
    setIsOpen(true)
  }, [])

  const remove = useCallback((key) => {
    setItems((prev) => prev.filter((it) => it.key !== key))
  }, [])

  const setQty = useCallback((key, qty) => {
    setItems((prev) =>
      prev
        .map((it) => (it.key === key ? { ...it, qty: Math.max(1, Math.min(Number(qty) || 1, 99)) } : it))
    )
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  const count = useMemo(() => items.reduce((n, it) => n + it.qty, 0), [items])
  const subtotal = useMemo(
    () => items.reduce((n, it) => n + it.price * it.qty, 0),
    [items],
  )

  const value = useMemo(
    () => ({ items, count, subtotal, isOpen, lastAdded, add, remove, setQty, clear, open, close }),
    [items, count, subtotal, isOpen, lastAdded, add, remove, setQty, clear, open, close],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}