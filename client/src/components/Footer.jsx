import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t-2 border-ink-950 bg-ink-900">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-3xl uppercase leading-none tracking-tight text-bone-50">
            URBAN <span className="text-acid-400">CAPS</span>®
          </p>
          <p className="mt-4 max-w-xs font-body text-sm text-bone-200/60">
            Streetwear de edición limitada. Piezas hechas con la calle en mente desde 2026.
          </p>
        </div>

        <div>
          <p className="font-display text-xs uppercase tracking-[0.25em] text-ember-400">Shop</p>
          <ul className="mt-4 space-y-2 font-body text-sm text-bone-200/70">
            <li><Link className="hover:text-acid-400" to="/shop">Todos los productos</Link></li>
            <li><Link className="hover:text-acid-400" to="/shop?c=gorras">Gorras</Link></li>
            <li><Link className="hover:text-acid-400" to="/shop?c=camisetas">Camisetas</Link></li>
            <li><Link className="hover:text-acid-400" to="/shop?c=hoodies">Hoodies</Link></li>
            <li><Link className="hover:text-acid-400" to="/shop?c=accesorios">Accesorios</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-display text-xs uppercase tracking-[0.25em] text-ember-400">Ayuda</p>
          <ul className="mt-4 space-y-2 font-body text-sm text-bone-200/70">
            <li><span className="cursor-pointer hover:text-acid-400">Envíos y devoluciones</span></li>
            <li><span className="cursor-pointer hover:text-acid-400">Guía de tallas</span></li>
            <li><span className="cursor-pointer hover:text-acid-400">Contacto</span></li>
            <li><Link className="hover:text-acid-400" to="/admin">Admin</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-display text-xs uppercase tracking-[0.25em] text-ember-400">Boletín</p>
          <p className="mt-4 font-body text-sm text-bone-200/60">Enterate de los drops antes que nadie.</p>
          <form onSubmit={(e) => e.preventDefault()} className="mt-4 flex">
            <input type="email" required placeholder="tu@mail.com" className="form-input" />
            <button className="btn-block shrink-0 bg-acid-400 text-ink-950 hover:bg-acid-300">OK</button>
          </form>
        </div>
      </div>

      <div className="border-t border-ink-800">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-3 px-6 py-6 font-body text-xs uppercase tracking-widest text-bone-200/40 sm:flex-row">
          <span>© 2026 URBAN CAPS® — Todos los derechos reservados</span>
          <span className="flex items-center gap-4">
            <span>IG / TK / YT</span>
            <span className="text-acid-400">HECHO EN LA CALLE</span>
          </span>
        </div>
      </div>
    </footer>
  )
}