import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Marquee from '../components/Marquee.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { api, CATEGORIES } from '../api.js'

const SORTS = [
  { id: 'recent', label: 'Novedades' },
  { id: 'price-asc', label: 'Precio: menor' },
  { id: 'price-desc', label: 'Precio: mayor' },
  { id: 'name', label: 'Nombre A–Z' },
]

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const category = params.get('c') || 'todo'
  const search = params.get('s') || ''
  const [sort, setSort] = useState('recent')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => setSort('recent'), [category, search])

  useEffect(() => {
    setLoading(true)
    setError('')
    api
      .products({ category, search })
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch((e) => {
        setError(e.message)
        setLoading(false)
      })
  }, [category, search])

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params)
    if (value && value !== 'todo') next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const sorted = useMemo(() => {
    const copy = [...products]
    if (sort === 'price-asc') copy.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') copy.sort((a, b) => b.price - a.price)
    if (sort === 'name') copy.sort((a, b) => a.name.localeCompare(b.name))
    return copy
  }, [products, sort])

  const activeCat = CATEGORIES.find((c) => c.id === category)

  return (
    <div className="grain relative">
      <header className="grid-bg border-b-2 border-ink-950 px-6 pt-40 pb-10">
        <div className="mx-auto max-w-[1400px]">
          <p className="font-body text-xs uppercase tracking-[0.35em] text-ember-400">Catálogo</p>
          <h1 className="mt-2 font-display text-[clamp(3rem,12vw,9rem)] uppercase leading-[0.9] tracking-tight">
            <span className="fill-bone">Shop</span>{' '}
            <span className="text-stroke-bone">{activeCat?.label || 'Todo'}</span>
          </h1>
          <p className="mt-4 max-w-lg font-body text-bone-200/70">
            {loading
              ? 'Cargando piezas…'
              : `${sorted.length} ${sorted.length === 1 ? 'pieza' : 'piezas'} encontradas`}
            {search && <> para “<span className="text-acid-400">{search}</span>”</>}
          </p>
        </div>

        <div className="mx-auto mt-10 flex max-w-[1400px] flex-wrap items-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter('c', c.id)}
              className={`btn-block !px-5 !py-2.5 text-xs ${
                category === c.id
                  ? 'bg-acid-400 text-ink-950'
                  : 'border border-ink-700 text-bone-100 hover:border-acid-400 hover:text-acid-400'
              }`}
            >
              {c.label}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-3">
            <label className="font-body text-xs uppercase tracking-widest text-bone-200/60">Orden</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="form-input w-auto !border-ink-700 !bg-ink-900"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <Marquee />

      <main className="mx-auto max-w-[1400px] px-6 py-16">
        {error && (
          <div className="mb-8 border-2 border-ember-500 bg-ember-500/10 p-6 text-center">
            <p className="font-display text-sm uppercase tracking-widest text-ember-400">
              Error: {error} — ¿Está corriendo el servidor en el puerto 4000?
            </p>
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse border border-ink-800 bg-ink-800" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="grid border-2 border-dashed border-ink-700 py-20 text-center">
            <p className="font-display text-3xl uppercase text-bone-50">Nada por aquí</p>
            <p className="mt-3 font-body text-bone-200/60">Cambiá los filtros o volvé más tarde.</p>
            <div className="mt-8 flex justify-center gap-4">
              <button onClick={() => setFilter('c', 'todo')} className="btn-block bg-acid-400 text-ink-950 hover:bg-acid-300">
                Todos los productos
              </button>
              <button onClick={() => setFilter('s', '')} className="btn-block border border-ink-700 text-bone-50 hover:text-acid-400">
                Limpiar búsqueda
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sorted.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </main>

      <Marquee reverse />
    </div>
  )
}