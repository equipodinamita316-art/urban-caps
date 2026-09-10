import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '../store/CartContext.jsx'
import { formatPrice, imgUrl } from '../api.js'

export default function CartDrawer() {
  const { items, isOpen, close, subtotal, setQty, remove } = useCart()
  const navigate = useNavigate()
  const shipping = subtotal >= 100 || subtotal === 0 ? 0 : 12

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const goCheckout = () => {
    close()
    navigate('/checkout')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[60] bg-ink-950/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="grain fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l-2 border-ink-950 bg-ink-900"
          >
            <div className="flex items-center justify-between border-b border-ink-800 px-6 py-5">
              <h2 className="font-display text-xl uppercase tracking-tight text-bone-50">
                Tu carrito <span className="text-acid-400">({items.length})</span>
              </h2>
              <button onClick={close} className="grid h-10 w-10 place-items-center bg-ember-500 font-display text-ink-950 hover:bg-ember-400">
                ✕
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
                <div className="grid h-24 w-24 rotate-12 place-items-center border-2 border-dashed border-acid-400">
                  <span className="font-display text-3xl text-acid-400">UC</span>
                </div>
                <p className="font-display text-lg uppercase text-bone-50">Carrito vacío</p>
                <p className="text-sm text-bone-200/60">Tu próxima pieza te espera en el shop.</p>
                <button onClick={() => { close(); navigate('/shop') }} className="btn-block bg-acid-400 text-ink-950 hover:bg-acid-300">
                  Ir al shop
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {items.map((it) => (
                    <div key={it.key} className="flex gap-4 border-b border-ink-800 py-5">
                      <img
                        src={imgUrl.for(it.images)}
                        alt={it.name}
                        className="h-24 w-20 shrink-0 border border-ink-700 object-cover"
                      />
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <p className="font-display text-sm uppercase leading-tight text-bone-50">{it.name}</p>
                          <button onClick={() => remove(it.key)} className="text-xs text-ember-400 hover:text-ember-500" aria-label="Quitar">
                            Quitar
                          </button>
                        </div>
                        <p className="mt-1 font-body text-xs text-bone-200/60">
                          {[it.color, it.size].filter(Boolean).join(' · ')}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center border border-ink-700">
                            <button onClick={() => setQty(it.key, it.qty - 1)} className="px-3 py-1 font-display text-sm text-bone-50 hover:bg-ink-800">−</button>
                            <span className="w-8 text-center font-display text-sm text-acid-400">{it.qty}</span>
                            <button onClick={() => setQty(it.key, it.qty + 1)} className="px-3 py-1 font-display text-sm text-bone-50 hover:bg-ink-800">+</button>
                          </div>
                          <p className="font-display text-sm text-bone-50">{formatPrice(it.price * it.qty)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-ink-950 bg-ink-800 px-6 py-5">
                  <div className="flex justify-between text-sm text-bone-200/70">
                    <span>Envío</span>
                    <span>{shipping === 0 ? 'GRATIS' : formatPrice(shipping)}</span>
                  </div>
                  <div className="mt-2 flex justify-between font-display text-lg uppercase text-bone-50">
                    <span>Total</span>
                    <span className="text-acid-400">{formatPrice(subtotal + shipping)}</span>
                  </div>
                  <button onClick={goCheckout} className="btn-block mt-4 w-full bg-ember-500 text-ink-950 hover:bg-ember-400">
                    Pagar → Checkout
                  </button>
                  <Link to="/shop" onClick={close} className="mt-3 block text-center font-body text-xs uppercase tracking-widest text-bone-200/60 hover:text-acid-400">
                    ← Seguir comprando
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}