import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Marquee from '../components/Marquee.jsx'
import { api, CATEGORIES, formatPrice, imgUrl } from '../api.js'

const empty = {
  name: '',
  description: '',
  category: 'gorras',
  price: '',
  compareAt: '',
  images: '',
  colors: '',
  sizes: '',
  stock: '',
  featured: false,
  hot: false,
}

function parseList(str) {
  return str.split(',').map((s) => s.trim()).filter(Boolean)
}

function toPayload(f) {
  return {
    name: f.name,
    description: f.description,
    category: f.category,
    price: Number(f.price),
    compareAt: f.compareAt ? Number(f.compareAt) : null,
    images: parseList(f.images),
    colors: parseList(f.colors),
    sizes: parseList(f.sizes),
    stock: Number(f.stock) || 0,
    featured: !!f.featured,
    hot: !!f.hot,
  }
}

function fromProduct(p) {
  return {
    name: p.name,
    description: p.description,
    category: p.category,
    price: p.price,
    compareAt: p.compareAt ?? '',
    images: p.images.join(', '),
    colors: p.colors.join(', '),
    sizes: p.sizes.join(', '),
    stock: p.stock,
    featured: p.featured,
    hot: p.hot,
  }
}

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem('uc_admin_token') || '')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [listError, setListError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setListError('')
    try {
      setProducts(await api.adminProducts())
    } catch (e) {
      setListError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (token) refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const login = async (e) => {
    e.preventDefault()
    setLoginError('')
    try {
      const res = await api.adminLogin(password)
      localStorage.setItem('uc_admin_token', res.token)
      setToken(res.token)
    } catch (err) {
      setLoginError(err.message)
    }
  }

  const logout = () => {
    localStorage.removeItem('uc_admin_token')
    setToken('')
    setProducts([])
  }

  const openCreate = () => {
    setForm(empty)
    setEditingId(null)
    setFormOpen(true)
  }

  const openEdit = (p) => {
    setForm(fromProduct(p))
    setEditingId(p.id)
    setFormOpen(true)
  }

  const submit = async (e) => {
    e.preventDefault()
    setNotice('')
    try {
      const payload = toPayload(form)
      if (editingId) await api.adminUpdate(editingId, payload)
      else await api.adminCreate(payload)
      setFormOpen(false)
      setNotice(editingId ? `Pieza #${editingId} actualizada.` : 'Pieza creada.')
      refresh()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setNotice(`Error: ${err.message}`)
    }
  }

  const remove = async (p) => {
    if (!window.confirm(`¿Eliminar "${p.name}"? Esta acción es permanente.`)) return
    try {
      await api.adminDelete(p.id)
      setNotice(`"${p.name}" eliminado.`)
      refresh()
    } catch (err) {
      setNotice(`Error: ${err.message}`)
    }
  }

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [field]: value }))
  }

  const fieldInput = (label, field, placeholder) => (
    <label className="block">
      <span className="mb-1 block font-display text-xs uppercase tracking-widest text-bone-200/60">{label}</span>
      <input className="form-input" value={form[field]} onChange={set(field)} placeholder={placeholder} />
    </label>
  )

  return (
    <div className="grain relative">
      <header className="grid-bg border-b-2 border-ink-950 px-6 pb-8 pt-40">
        <div className="mx-auto flex max-w-[1400px] items-end justify-between gap-6">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.35em] text-ember-400">Control total</p>
            <h1 className="mt-2 font-display text-[clamp(3rem,9vw,7rem)] uppercase leading-[0.9] tracking-tight">
              <span className="fill-bone">Admin</span>
            </h1>
          </div>
          <Link to="/" className="btn-block border border-ink-700 text-bone-100 hover:text-acid-400">← Tienda</Link>
        </div>
      </header>

      {!token ? (
        <main className="mx-auto max-w-md px-6 py-20">
          <form onSubmit={login} className="border-2 border-ink-950 bg-ink-900 p-8">
            <h2 className="font-display text-xl uppercase text-bone-50">Acceso restringido</h2>
            <p className="mt-2 font-body text-sm text-bone-200/60">
              Zona solo para el crew. Password por defecto: <code className="bg-ink-800 px-1 text-acid-400">urbancaps123</code>
            </p>
            <input
              type="password"
              className="form-input mt-6"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {loginError && <p className="mt-3 font-display text-xs uppercase tracking-widest text-ember-400">{loginError}</p>}
            <button className="btn-block mt-5 w-full bg-acid-400 text-ink-950 hover:bg-acid-300">Entrar</button>
          </form>
        </main>
      ) : (
        <main className="mx-auto max-w-[1400px] px-6 py-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-body text-sm text-bone-200/60">
                {products.length} {products.length === 1 ? 'pieza' : 'piezas'} en catálogo
              </p>
              {notice && <p className="mt-1 font-display text-xs uppercase tracking-widest text-acid-400">{notice}</p>}
            </div>
            <div className="flex gap-3">
              <button onClick={refresh} className="btn-block !py-3 border border-ink-700 text-bone-100 hover:text-acid-400">
                ↻ Recargar
              </button>
              <button onClick={openCreate} className="btn-block !py-3 bg-acid-400 text-ink-950 hover:bg-acid-300">
                + Nueva pieza
              </button>
              <button onClick={logout} className="btn-block !py-3 bg-ember-500 text-ink-950 hover:bg-ember-400">
                Salir
              </button>
            </div>
          </div>

          {listError && (
            <div className="mt-6 border-2 border-ember-500 bg-ember-500/10 p-4">
              <p className="font-display text-xs uppercase tracking-widest text-ember-400">Sesión expirada: {listError}.</p>
              <button onClick={logout} className="mt-2 font-body text-xs uppercase tracking-widest text-bone-100 underline">Volver al login</button>
            </div>
          )}

          {formOpen && (
            <form onSubmit={submit} className="mt-8 grid gap-5 border-2 border-ink-950 bg-ink-900 p-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="sm:col-span-2 lg:col-span-3 flex items-center justify-between">
                <h2 className="font-display text-lg uppercase text-bone-50">
                  {editingId ? `Editar pieza #${editingId}` : 'Nueva pieza'}
                </h2>
                <button type="button" onClick={() => setFormOpen(false)} className="grid h-9 w-9 place-items-center bg-ink-800 text-bone-50 hover:bg-ember-500">✕</button>
              </div>

              {fieldInput('Nombre *', 'name', 'Gorra "SKYLINE" 004')}
              <div>
                <span className="mb-1 block font-display text-xs uppercase tracking-widest text-bone-200/60">Categoría</span>
                <select className="form-input" value={form.category} onChange={set('category')}>
                  {CATEGORIES.filter((c) => c.id !== 'todo').map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
              {fieldInput('Precio *', 'price', '49.99')}
              {fieldInput('Precio tachado (opcional)', 'compareAt', '65.00')}
              {fieldInput('Stock *', 'stock', '20')}
              {fieldInput('SKUs de imagen /api/img (coma)', 'images', '/api/img/gorras/skyline-acid, /api/img/gorras/skyline-top')}
              {fieldInput('Colores (coma)', 'colors', 'Negro, Acid Lime')}
              {fieldInput('Tallas (coma, vacío = única)', 'sizes', 'S, M, L, XL')}

              <label className="block sm:col-span-2">
                <span className="mb-1 block font-display text-xs uppercase tracking-widest text-bone-200/60">Descripción</span>
                <textarea className="form-input min-h-24 resize-y" value={form.description} onChange={set('description')} placeholder="Tela, corte, acabados…" />
              </label>

              <div className="flex flex-wrap items-center gap-6 sm:col-span-2">
                <label className="flex items-center gap-2 font-body text-sm text-bone-100">
                  <input type="checkbox" checked={form.featured} onChange={set('featured')} className="h-4 w-4 accent-acid-400" />
                  Destacado
                </label>
                <label className="flex items-center gap-2 font-body text-sm text-bone-100">
                  <input type="checkbox" checked={form.hot} onChange={set('hot')} className="h-4 w-4 accent-ember-500" />
                  🔥 Hot
                </label>
              </div>

              <div className="flex gap-3 sm:col-span-2">
                <button className="btn-block bg-acid-400 text-ink-950 hover:bg-acid-300">
                  {editingId ? 'Guardar cambios' : 'Crear pieza'}
                </button>
                <button type="button" onClick={() => setFormOpen(false)} className="btn-block border border-ink-700 text-bone-100">
                  Cancelar
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 overflow-x-auto border border-ink-800">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-ink-800 bg-ink-900 font-display text-[10px] uppercase tracking-[0.25em] text-bone-200/60">
                  <th className="px-4 py-3">Pieza</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Tags</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={6} className="px-4 py-10 text-center font-display text-sm uppercase tracking-widest text-bone-200/50 animate-pulse">Cargando…</td></tr>
                )}
                {!loading && products.map((p) => (
                  <tr key={p.id} className="border-b border-ink-800 transition-colors hover:bg-ink-900/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={imgUrl.for(p.images)} alt="" className="h-14 w-12 border border-ink-700 object-cover" />
                        <div>
                          <p className="font-display text-xs uppercase text-bone-50">{p.name}</p>
                          <p className="font-body text-[11px] text-bone-200/40">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-bone-200/70">{p.category}</td>
                    <td className="px-4 py-3 font-display text-sm text-acid-400">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3 font-body text-sm text-bone-200/70">
                      <span className={p.stock === 0 ? 'text-ember-500' : p.stock <= 10 ? 'text-ember-400' : 'text-bone-200/70'}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-1 flex-wrap max-w-40">
                      {p.featured && <span className="bg-ink-950 px-2 py-0.5 font-display text-[9px] uppercase text-bone-100">Feat</span>}
                      {p.hot && <span className="bg-ember-500 px-2 py-0.5 font-display text-[9px] uppercase text-ink-950">Hot</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="border border-ink-700 px-3 py-1.5 font-body text-xs uppercase tracking-widest text-bone-100 hover:border-acid-400 hover:text-acid-400">Editar</button>
                        <button onClick={() => remove(p)} className="bg-ember-500 px-3 py-1.5 font-body text-xs uppercase tracking-widest text-ink-950 hover:bg-ember-400">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      )}
      <Marquee />
    </div>
  )
}