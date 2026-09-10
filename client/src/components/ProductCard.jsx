import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../store/CartContext.jsx'
import { formatPrice, imgUrl } from '../api.js'

const CATEGORY_LABEL = {
  gorras: 'Gorras',
  camisetas: 'Camisetas',
  hoodies: 'Hoodies',
  accesorios: 'Accesorios',
}

export default function ProductCard({ product, index = 0 }) {
  const { add } = useCart()
  const discount = product.compareAt
    ? Math.round((1 - product.price / product.compareAt) * 100)
    : 0

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group relative border border-ink-800 bg-ink-900 transition-colors hover:border-acid-400/60"
    >
      <Link to={`/producto/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={imgUrl.for(product.images)}
            alt={product.name}
            loading="lazy"
            className="card-img h-full w-full object-cover"
          />
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {product.hot && (
              <span className="animate-blink bg-ember-500 px-2 py-1 font-display text-[10px] uppercase tracking-widest text-ink-950">
                🔥 Hot
              </span>
            )}
            {discount > 0 && (
              <span className="bg-acid-400 px-2 py-1 font-display text-[10px] uppercase tracking-widest text-ink-950">
                −{discount}%
              </span>
            )}
          </div>
          {product.stock === 0 && (
            <div className="absolute inset-0 grid place-items-center bg-ink-950/80">
              <span className="rotate-[-12deg] border-2 border-ember-500 px-6 py-2 font-display text-sm uppercase tracking-widest text-ember-500">
                Agotado
              </span>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-acid-400 p-3 transition-transform duration-300 group-hover:translate-y-0">
            <p className="text-center font-display text-xs uppercase tracking-widest text-ink-950">
              Ver pieza →
            </p>
          </div>
        </div>
      </Link>

      <div className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-ember-400">
            {CATEGORY_LABEL[product.category] || product.category}
          </p>
          <Link to={`/producto/${product.id}`} className="mt-1 block truncate font-display text-sm uppercase leading-tight text-bone-50 hover:text-acid-400">
            {product.name}
          </Link>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-base text-bone-100">{formatPrice(product.price)}</span>
            {product.compareAt && (
              <span className="text-xs text-bone-200/50 line-through">{formatPrice(product.compareAt)}</span>
            )}
          </div>
          <p className="mt-1 font-body text-[10px] uppercase tracking-widest text-bone-200/40">
            {product.stock > 0 ? `${product.stock} en stock` : '0 en stock'}
          </p>
        </div>
        <button
          disabled={product.stock === 0}
          onClick={() => add(product)}
          className="shrink-0 bg-ink-950 px-3 py-3 font-display text-[10px] uppercase tracking-widest text-acid-400 transition-colors hover:bg-ember-500 hover:text-ink-950 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={`Añadir ${product.name} al carrito`}
        >
          + Añadir
        </button>
      </div>
    </motion.article>
  )
}