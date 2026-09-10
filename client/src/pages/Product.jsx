import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Marquee from '../components/Marquee.jsx'
import Reveal from '../components/Reveal.jsx'
import { api, CATEGORIES, formatPrice, imgUrl } from '../api.js'
import { useCart } from '../store/CartContext.jsx'

const CAT_LABEL = CATEGORIES.reduce((acc, c) => ({ ...acc, [c.id]: c.label }), {})

export default function Product() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeImg, setActiveImg] = useState(0)
  const [color, setColor] = useState('')
  const [size, setSize] = useState('')
  const [qty, setQty] = useState(1)
  const { add } = useCart()
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError('')
    setActiveImg(0)
    setColor('')
    setSize('')
    setQty(1)
    api
      .product(id)
      .then((p) => {
        setProduct(p)
        setLoading(false)
        if (p.colors?.length === 1) setColor(p.colors[0])
        if (p.sizes?.length === 1) setSize(p.sizes[0])
      })
      .catch((e) => {
        setError(e.message)
        setLoading(false)
      })
  }, [id])

  const canAdd = product && product.stock > 0 && (!product.colors.length || color) && (!product.sizes.length || size)

  const handleAdd = () => {
    if (!canAdd) return
    setAdding(true)
    add(product, { color, size })
    setTimeout(() => setAdding(false), 400)
  }

  if (loading) {
    return (
      <div className="grid-bg grain flex min-h-screen items-center justify-center pt-20">
        <p className="animate-pulse font-display text-3xl uppercase text-bone-50">Cargando pieza…</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="grid-bg grain flex min-h-screen flex-col items-center justify-center gap-6 px-6 pt-20 text-center">
        <h1 className="font-display text-5xl uppercase text-ember-500">404 — No existe</h1>
        <p className="font-body text-bone-200/60">{error || 'La pieza que buscas no está en el catálogo.'}</p>
        <Link to="/shop" className="btn-block bg-acid-400 text-ink-950 hover:bg-acid-300">
          Ir al shop
        </Link>
      </div>
    )
  }

  const discount = product.compareAt ? Math.round((1 - product.price / product.compareAt) * 100) : 0
  const singleSelect = product.colors.length === 1 && product.sizes.length === 1

  return (
    <div className="grain relative">
      <section className="mx-auto grid max-w-[1400px] gap-12 px-6 pb-24 pt-36 lg:grid-cols-2 lg:pt-44">
        {/* Galería */}
        <div>
          <motion.div
            key={activeImg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative aspect-[3/4] overflow-hidden border-2 border-ink-800 bg-ink-900"
          >
            <img src={imgUrl.for(product.images, activeImg)} alt={product.name} className="h-full w-full object-cover" />
            {product.hot && (
              <span className="animate-blink absolute left-4 top-4 bg-ember-500 px-3 py-1.5 font-display text-xs uppercase tracking-widest text-ink-950">
                🔥 Hot
              </span>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 grid place-items-center bg-ink-950/80">
                <span className="rotate-[-12deg] border-2 border-ember-500 px-8 py-3 font-display text-xl uppercase tracking-widest text-ember-500">
                  Agotado
                </span>
              </div>
            )}
          </motion.div>
          <div className="mt-4 flex gap-3">
            {product.images.map((im, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`h-20 w-16 overflow-hidden border-2 transition-colors ${activeImg === i ? 'border-acid-400' : 'border-ink-700 hover:border-ink-600'}`}
              >
                <img src={imgUrl.for(product.images, i)} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Compra */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-body text-xs uppercase tracking-[0.35em] text-ember-400">
            {CAT_LABEL[product.category]} · {product.sku}
          </p>
          <Reveal>
            <h1 className="mt-3 font-display text-5xl uppercase leading-[0.95] tracking-tight text-bone-50 sm:text-6xl">
              {product.name}
            </h1>
          </Reveal>

          <div className="mt-6 flex items-baseline gap-4">
            <span className="font-display text-4xl text-acid-400">{formatPrice(product.price)}</span>
            {product.compareAt && (
              <span className="font-display text-xl text-bone-200/40 line-through">{formatPrice(product.compareAt)}</span>
            )}
            {discount > 0 && (
              <span className="bg-ember-500 px-2 py-1 font-display text-xs uppercase text-ink-950">−{discount}%</span>
            )}
          </div>

          <p className="mt-6 max-w-lg font-body leading-relaxed text-bone-200/70">{product.description}</p>

          {product.colors.length > 1 && (
            <div className="mt-8">
              <p className="font-display text-xs uppercase tracking-[0.25em] text-bone-200/60">
                Color: <span className="text-acid-400">{color || '—'}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`border px-4 py-2 font-body text-sm transition-colors ${
                      color === c
                        ? 'border-acid-400 bg-acid-400 text-ink-950'
                        : 'border-ink-600 text-bone-50 hover:border-acid-400 hover:text-acid-400'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 1 && (
            <div className="mt-6">
              <p className="font-display text-xs uppercase tracking-[0.25em] text-bone-200/60">
                Talla: <span className="text-acid-400">{size || '—'}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`grid h-12 w-14 place-items-center border font-display text-sm transition-colors ${
                      size === s
                        ? 'border-acid-400 bg-acid-400 text-ink-950'
                        : 'border-ink-600 text-bone-50 hover:border-acid-400 hover:text-acid-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center border-2 border-ink-700">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-4 font-display text-bone-50 hover:bg-ink-800">−</button>
              <span className="w-12 text-center font-display text-xl text-acid-400">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(99, q + 1))} className="px-4 py-4 font-display text-bone-50 hover:bg-ink-800">+</button>
            </div>

            <button
              disabled={!canAdd}
              onClick={handleAdd}
              className={`btn-block flex-1 text-lg ${
                product.stock === 0
                  ? 'cursor-not-allowed bg-ink-700 text-ink-600'
                  : canAdd
                    ? 'bg-acid-400 text-ink-950 hover:bg-acid-300'
                    : 'cursor-not-allowed bg-ink-800 text-ink-600'
              }`}
            >
              {adding ? '✓ En el carrito' : product.stock === 0 ? 'Agotado' : canAdd ? 'Añadir al carrito' : 'Elige color/talla'}
            </button>
          </div>

          {product.colors.length === 1 && product.sizes.length <= 1 && (
            <p className="mt-3 font-body text-xs uppercase tracking-widest text-bone-200/50">
              {singleSelect ? 'Talla única · ' : ''}Stock disponible: {product.stock} uds
            </p>
          )}

          <div className="mt-10 grid gap-px border border-ink-600 bg-ink-600 sm:grid-cols-3">
            {[
              ['Envío gratis', '+$100'],
              ['Devolución', '30 días'],
              ['Stock', `${product.stock} uds`],
            ].map(([t, v]) => (
              <div key={t} className="bg-ink-900 p-4 text-center">
                <p className="font-body text-xs uppercase tracking-widest text-bone-200/50">{t}</p>
                <p className="mt-1 font-display text-sm text-acid-400">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Marquee />
      <div className="mx-auto max-w-[1400px] px-6 py-12">
        <p className="font-body text-xs uppercase tracking-[0.35em] text-ember-400">Datos técnicos</p>
        <ul className="mt-4 grid gap-2 font-body text-sm text-bone-200/60 sm:grid-cols-2">
          <li>· SKU: <span className="text-bone-50">{product.sku}</span></li>
          <li>· Categoría: <span className="text-bone-50">{CAT_LABEL[product.category]}</span></li>
          <li>· Tallas: <span className="text-bone-50">{product.sizes.join(', ') || 'Única'}</span></li>
          <li>· Colores: <span className="text-bone-50">{product.colors.join(', ') || '—'}</span></li>
        </ul>
      </div>
    </div>
  )
}