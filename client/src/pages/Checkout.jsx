import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Marquee from '../components/Marquee.jsx'
import { api, formatPrice, imgUrl } from '../api.js'
import { useCart } from '../store/CartContext.jsx'

const emptyCustomer = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  zip: '',
  country: 'México',
}

export default function Checkout() {
  const { items, subtotal, clear } = useCart()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(emptyCustomer)
  const [card, setCard] = useState({ number: '', name: '', exp: '', cvc: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (items.length === 0 && !busy) {
      navigate('/shop', { replace: true })
    }
  }, [items, navigate, busy])

  const shipping = subtotal >= 100 ? 0 : 12
  const total = subtotal + shipping

  const set = (obj, field) => (e) => setCustomer({ ...obj, [field]: e.target.value })
  const setCardField = (field) => (e) => setCard({ ...card, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const order = await api.createOrder({
        customer,
        items: items.map((it) => ({ productId: it.productId, qty: it.qty, color: it.color, size: it.size })),
      })
      clear()
      navigate(`/confirmacion/${order.orderNumber}`, { replace: true })
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="grain relative">
      <header className="grid-bg border-b-2 border-ink-950 px-6 pb-8 pt-40">
        <div className="mx-auto max-w-[1400px]">
          <p className="font-body text-xs uppercase tracking-[0.35em] text-ember-400">Paso final</p>
          <h1 className="mt-2 font-display text-[clamp(3rem,10vw,8rem)] uppercase leading-[0.9] tracking-tight">
            <span className="fill-bone">Check</span>
            <span className="text-stroke-bone">out</span>
          </h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 lg:grid-cols-[1fr_420px]">
        <div className="space-y-12">
          {/* Envío */}
          <section>
            <h2 className="flex items-center gap-3 font-display text-sm uppercase tracking-[0.25em] text-bone-50">
              <span className="grid h-8 w-8 place-items-center bg-acid-400 text-ink-950">1</span>
              Envío
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <input className="form-input" placeholder="Nombre completo *" value={customer.name} onChange={set(customer, 'name')} required />
              <input className="form-input" placeholder="Correo electrónico *" type="email" value={customer.email} onChange={set(customer, 'email')} required />
              <input className="form-input" placeholder="Teléfono" value={customer.phone} onChange={set(customer, 'phone')} />
              <input className="form-input sm:col-span-2" placeholder="Calle, número, colonia *" value={customer.address} onChange={set(customer, 'address')} required />
              <input className="form-input" placeholder="Ciudad *" value={customer.city} onChange={set(customer, 'city')} required />
              <div className="grid grid-cols-2 gap-4">
                <input className="form-input" placeholder="C.P." value={customer.zip} onChange={set(customer, 'zip')} />
                <select className="form-input" value={customer.country} onChange={set(customer, 'country')}>
                  {['México', 'Estados Unidos', 'Colombia', 'Argentina', 'Chile', 'España'].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Pago simulado */}
          <section>
            <h2 className="flex items-center gap-3 font-display text-sm uppercase tracking-[0.25em] text-bone-50">
              <span className="grid h-8 w-8 place-items-center bg-ember-500 text-ink-950">2</span>
              Pago <span className="ml-2 text-xs normal-case tracking-normal text-ember-400">(simulado — usa 4242 4242 4242 4242)</span>
            </h2>
            <div className="mt-5 grid gap-4">
              <input className="form-input" placeholder="Número de tarjeta *" inputMode="numeric" value={card.number} onChange={setCardField('number')} required />
              <input className="form-input" placeholder="Nombre en la tarjeta *" value={card.name} onChange={setCardField('name')} required />
              <div className="grid grid-cols-3 gap-4">
                <input className="form-input" placeholder="MM/AA *" value={card.exp} onChange={setCardField('exp')} required />
                <input className="form-input" placeholder="CVC *" inputMode="numeric" value={card.cvc} onChange={setCardField('cvc')} required />
                <div className="form-input grid place-items-center border-dashed font-body text-xs uppercase tracking-widest text-bone-200/50">
                  SSL 🔒
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Resumen */}
        <aside className="h-fit border-2 border-ink-950 bg-ink-900 lg:sticky lg:top-28">
          <div className="border-b border-ink-800 px-6 py-4">
            <h2 className="font-display text-sm uppercase tracking-[0.25em] text-bone-50">Tu pedido</h2>
          </div>
          <div className="max-h-72 overflow-y-auto px-6 py-2">
            {items.map((it) => (
              <div key={it.key} className="flex items-center gap-4 border-b border-ink-800 py-4">
                <img src={imgUrl.for(it.images)} alt={it.name} className="h-16 w-14 shrink-0 border border-ink-700 object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="truncate font-display text-xs uppercase text-bone-50">{it.name}</p>
                  <p className="mt-0.5 font-body text-[11px] text-bone-200/50">
                    {[it.color, it.size].filter(Boolean).join(' · ')} × {it.qty}
                  </p>
                </div>
                <span className="font-display text-sm text-bone-50">{formatPrice(it.price * it.qty)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 px-6 py-4 font-body text-sm text-bone-200/70">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span>Envío</span><span>{shipping === 0 ? <span className="text-acid-400">GRATIS</span> : formatPrice(shipping)}</span></div>
            <div className="flex justify-between border-t border-ink-800 pt-3 font-display text-lg uppercase text-bone-50">
              <span>Total</span><span className="text-acid-400">{formatPrice(total)}</span>
            </div>
          </div>

          {error && (
            <div className="mx-6 mb-4 border-2 border-ember-500 bg-ember-500/10 p-4">
              <p className="font-display text-xs uppercase tracking-widest text-ember-400">{error}</p>
            </div>
          )}

          <div className="px-6 pb-6">
            <button
              type="submit"
              disabled={busy}
              className="btn-block w-full bg-acid-400 text-ink-950 hover:bg-acid-300 disabled:opacity-50"
            >
              {busy ? 'Procesando…' : `Pagar ${formatPrice(total)}`}
            </button>
            <Link to="/shop" className="mt-3 block text-center font-body text-xs uppercase tracking-widest text-bone-200/50 hover:text-acid-400">
              ← Volver al shop
            </Link>
          </div>
        </aside>
      </form>

      <Marquee />
    </div>
  )
}