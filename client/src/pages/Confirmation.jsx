import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Marquee from '../components/Marquee.jsx'
import { api, formatPrice, imgUrl } from '../api.js'

export default function Confirmation() {
  const { number } = useParams()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.findOrder(number).then(setOrder).catch((e) => setError(e.message))
  }, [number])

  return (
    <div className="grain relative">
      <section className="grid-bg mx-auto max-w-3xl px-6 pb-24 pt-44 text-center">
        <div className="mx-auto mb-8 grid h-24 w-24 rotate-6 place-items-center bg-acid-400">
          <span className="font-display text-4xl text-ink-950">✓</span>
        </div>
        <p className="font-body text-xs uppercase tracking-[0.4em] text-acid-400">Pedido confirmado</p>
        <h1 className="mt-3 font-display text-4xl uppercase leading-none tracking-tight text-bone-50 sm:text-6xl">
          Gracias, has <span className="text-stroke-bone">caído</span>
        </h1>

        {error ? (
          <p className="mt-8 font-body text-ember-400">{error}</p>
        ) : !order ? (
          <p className="mt-8 animate-pulse font-display text-sm uppercase tracking-widest text-bone-200/60">
            Cargando pedido…
          </p>
        ) : (
          <>
            <p className="mt-6 font-body text-bone-200/70">
              Tu pieza ya está en el taller de empaque. Número de pedido:
            </p>
            <p className="mt-2 font-display text-2xl text-acid-400">{order.orderNumber}</p>

            <div className="mt-10 border-2 border-ink-950 bg-ink-900 text-left">
              <div className="border-b border-ink-800 px-6 py-4 flex justify-between font-body text-xs uppercase tracking-widest text-bone-200/60">
                <span>Resumen</span>
                <span>{order.created_at}</span>
              </div>
              {order.items.map((it, i) => (
                <div key={i} className="flex items-center gap-4 border-b border-ink-800 px-6 py-4">
                  <img src={imgUrl.for([`/api/img/placeholder`])} alt="" className="hidden h-14 w-12 border border-ink-700 object-cover sm:block" />
                  <div className="flex-1">
                    <p className="font-display text-sm uppercase text-bone-50">{it.name}</p>
                    <p className="font-body text-xs text-bone-200/50">{[it.color, it.size].filter(Boolean).join(' · ')} × {it.qty}</p>
                  </div>
                  <span className="font-display text-sm text-bone-50">{formatPrice(it.price * it.qty)}</span>
                </div>
              ))}
              <div className="space-y-2 px-6 py-5 font-body text-sm text-bone-200/70">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                <div className="flex justify-between"><span>Envío</span><span>{order.shipping === 0 ? <span className="text-acid-400">GRATIS</span> : formatPrice(order.shipping)}</span></div>
                <div className="flex justify-between border-t border-ink-800 pt-3 font-display text-lg uppercase text-bone-50">
                  <span>Total</span><span className="text-acid-400">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link to="/shop" className="btn-block bg-acid-400 text-ink-950 hover:bg-acid-300">
                Seguir comprando
              </Link>
              <Link to="/" className="btn-block border-2 border-bone-50 text-bone-50 hover:border-acid-400 hover:text-acid-400">
                Volver al inicio
              </Link>
            </div>
          </>
        )}
      </section>
      <Marquee />
    </div>
  )
}