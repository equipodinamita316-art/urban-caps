import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useCart } from '../store/CartContext.jsx'

const links = [
  { to: '/', label: 'Inicio', endsWith: true },
  { to: '/shop', label: 'Shop' },
  { to: '/shop?c=gorras', label: 'Gorras' },
  { to: '/shop?c=hoodies', label: 'Hoodies' },
]

export default function Navbar() {
  const { count, open } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')

  const submitSearch = (e) => {
    e.preventDefault()
    setMenuOpen(false)
    navigate(query ? `/shop?s=${encodeURIComponent(query)}` : '/shop')
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-ink-800 bg-ink-950/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-stretch justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 py-4">
            <span className="grid h-9 w-9 place-items-center bg-acid-400 font-display text-lg text-ink-950">U</span>
            <span className="font-display text-base tracking-tight text-bone-50 sm:text-lg">
              URBAN <span className="text-acid-400">CAPS</span>®
            </span>
          </Link>

          <nav className="hidden items-stretch md:flex">
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                end={l.endsWith}
                className={({ isActive }) =>
                  `relative flex items-center gap-2 px-5 font-display text-xs uppercase tracking-widest transition-colors ${
                    isActive ? 'text-acid-400' : 'text-bone-100 hover:text-acid-300'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`size-2 ${isActive ? 'bg-acid-400' : 'bg-ember-500'} rotate-45`} />
                    {l.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-stretch">
            <form onSubmit={submitSearch} className="hidden items-center gap-2 border-l border-ink-800 px-4 lg:flex">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar…"
                className="w-36 bg-transparent font-body text-sm text-bone-50 placeholder:text-ink-600 focus:outline-none"
              />
              <button type="submit" className="font-display text-xs uppercase tracking-widest text-ember-400 hover:text-ember-500">
                Ir
              </button>
            </form>

            <button
              onClick={open}
              className="relative flex items-center gap-2 border-l border-ink-800 px-5 font-display text-xs uppercase tracking-widest text-bone-50 hover:text-acid-400"
            >
              Carrito
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="grid h-6 w-6 place-items-center bg-ember-500 font-display text-xs text-ink-950"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center border-l border-ink-800 px-5 font-display text-xs uppercase tracking-widest text-bone-50 hover:text-acid-400 md:hidden"
            >
              {menuOpen ? 'Cerrar' : 'Menú'}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed inset-x-0 top-[61px] z-40 border-b-2 border-ink-950 bg-ink-900 px-6 py-8 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {links.map((l, i) => (
                <Link
                  key={l.label}
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-ink-800 py-4 font-display text-2xl uppercase tracking-tight text-bone-50 hover:text-acid-400"
                >
                  <span className="mr-3 text-ember-500">0{i + 1}</span>
                  {l.label}
                </Link>
              ))}
              <form onSubmit={submitSearch} className="mt-6 flex gap-2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar producto…"
                  className="form-input"
                />
                <button className="btn-block bg-acid-400 text-ink-950 hover:bg-acid-300">Ir</button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}