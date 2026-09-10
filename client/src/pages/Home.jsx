import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Marquee from '../components/Marquee.jsx'
import Reveal from '../components/Reveal.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { api, imgUrl } from '../api.js'

const HERO_LINE = [
  { word: 'URBAN', cls: 'fill-bone' },
  { word: 'CAPS', cls: 'text-stroke-bone', accent: true },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.products().then((all) => {
      const feats = all.filter((p) => p.featured && p.stock > 0).slice(0, 4)
      setFeatured(feats.length ? feats : all.slice(0, 4))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="grain relative">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b-2 border-ink-950">
        <div className="grid-bg absolute inset-0 opacity-60" aria-hidden />
        <div className="absolute -left-24 top-1/3 h-72 w-72 rotate-12 border-2 border-dashed border-ember-500/40" aria-hidden />
        <div className="absolute right-0 top-10 h-96 w-96 border-2 border-ember-500/20" aria-hidden />

        <div className="relative mx-auto flex max-w-[1400px] flex-col px-6 pb-24 pt-40 sm:pt-48">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 font-body text-xs uppercase tracking-[0.35em] text-acid-400"
          >
            <span className="mr-3 inline-block h-2.5 w-2.5 animate-blink bg-ember-500" />
            Drop 002 — Ya disponible. Edición limitada.
          </motion.p>

          <h1 className="font-display leading-[0.85] tracking-tight">
            {HERO_LINE.map((item, i) => (
              <motion.span
                key={item.word}
                className={`block text-[clamp(3.5rem,16vw,16rem)] ${item.cls} ${item.accent ? '' : ''}`}
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                {item.word}
              </motion.span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-12 flex flex-wrap items-end justify-between gap-8"
          >
            <div className="max-w-md">
              <p className="font-body text-lg text-bone-200/80">
                Gorras y ropa de calle con<strong className="text-acid-400"> actitud</strong>.
                Diseño brutal, tela pesada, números cortos.
              </p>
              <div className="mt-7 flex flex-wrap gap-4">
                <Link to="/shop" className="btn-block bg-acid-400 text-ink-950 hover:bg-acid-300">
                  Comprar ahora ↓
                </Link>
                <Link to="/shop?c=gorras" className="btn-block border-2 border-bone-50 text-bone-50 hover:border-acid-400 hover:text-acid-400">
                  Ver gorras
                </Link>
              </div>
            </div>

            <div className="relative grid h-32 w-32 place-items-center sm:h-40 sm:w-40">
              <svg viewBox="0 0 100 100" className="absolute inset-0 animate-spin-slow">
                <defs>
                  <path id="circ" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                </defs>
                <text className="fill-none text-[9.5px] font-display uppercase tracking-[0.2em]">
                  <textPath href="#circ">est. 2026 · streetwear · limitado · </textPath>
                </text>
              </svg>
              <p className="font-display text-lg uppercase text-ember-500">Drop<br />002</p>
            </div>
          </motion.div>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-6">
          <span className="animate-float-y font-body text-xs uppercase tracking-[0.3em] text-bone-200/50">
            ▼ scroll
          </span>
        </div>
      </section>

      <Marquee />

      {/* ============ FEATURED ============ */}
      <section className="mx-auto max-w-[1400px] px-6 py-24">
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.35em] text-ember-400">Selección</p>
            <h2 className="mt-2 font-display text-5xl uppercase leading-none tracking-tight sm:text-7xl">
              Piezas <span className="text-stroke-bone">destacadas</span>
            </h2>
          </div>
          <Link to="/shop" className="btn-block border-2 border-ink-700 text-bone-50 hover:border-acid-400 hover:text-acid-400">
            Ver todos →
          </Link>
        </Reveal>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-[3/4] animate-pulse border border-ink-800 bg-ink-800" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ============ MARCHA / VALORES ============ */}
      <section className="border-y-2 border-ink-950 bg-ink-900 py-24">
        <div className="mx-auto max-w-[1400px] px-6">
          <Reveal>
            <p className="font-body text-xs uppercase tracking-[0.35em] text-ember-400">El manifiesto</p>
            <h2 className="mt-2 max-w-4xl font-display text-4xl uppercase leading-tight tracking-tight sm:text-6xl">
              No hacemos piezas <span className="text-stroke-bone">para todos</span>. Hacemos piezas para
              <span className="text-acid-400"> los que se atreven</span>.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-px overflow-hidden border border-ink-600 bg-ink-600 sm:grid-cols-3">
            {[
              { n: '01', t: 'Números cortos', d: 'Cada color se produce en tiradas de 20 unidades. Cuando se acaba, se acaba.' },
              { n: '02', t: 'Tela pesada', d: '450gsm de algodón peinado. Costuras reforzadas. Sin atajos.' },
              { n: '03', t: 'Hecho en la calle', d: 'Diseñado en garajes y azoteas. Inspirado en el asfalto, no en pasarelas.' },
            ].map((v, i) => (
              <div key={v.n} className="group bg-ink-900 p-8 transition-colors hover:bg-ink-800">
                <Reveal delay={i * 0.1}>
                  <span className="font-display text-6xl text-ink-600 transition-colors group-hover:text-ember-500">{v.n}</span>
                  <h3 className="mt-4 font-display text-xl uppercase text-bone-50">{v.t}</h3>
                  <p className="mt-3 font-body text-sm leading-relaxed text-bone-200/60">{v.d}</p>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Marquee reverse />

      {/* ============ LOOKBOOK ============ */}
      <section className="mx-auto max-w-[1400px] px-6 py-24">
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-body text-xs uppercase tracking-[0.35em] text-ember-400">Lookbook</p>
            <h2 className="mt-2 font-display text-5xl uppercase leading-none tracking-tight sm:text-7xl">
              Street<span className="text-stroke-bone">ography</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { k: 'gorras', s: 'skyline-acid', cap: 'Callejón 04, CDMX' },
            { k: 'hoodies', s: 'hoodie-green-front', cap: 'Azotea, hora azul' },
            { k: 'camisetas', s: 'tee-urban-red', cap: 'Parada de autobús' },
            { k: 'accesorios', s: 'buzo-black', cap: 'Noche lluviosa' },
          ].map((im, i) => (
            <Reveal key={im.s} delay={i * 0.08} className={i % 2 === 1 ? 'md:translate-y-10' : ''}>
              <figure className="group relative overflow-hidden border border-ink-800">
                <img
                  src={imgUrl.for([`/api/img/${im.k}/${im.s}`])}
                  alt={im.cap}
                  loading="lazy"
                  className="card-img aspect-[3/4] w-full object-cover"
                />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-ink-950/90 p-3 font-body text-xs uppercase tracking-widest text-bone-50 transition-transform duration-300 group-hover:translate-y-0">
                  {im.cap}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="relative overflow-hidden border-t-2 border-ink-950 bg-acid-400 py-24 text-ink-950">
        <div className="grid-bg absolute inset-0 opacity-40" />
        <Reveal className="relative mx-auto max-w-[1400px] px-6 text-center">
          <p className="font-display text-xs uppercase tracking-[0.4em]">Última llamada</p>
          <h2 className="mt-3 font-display text-5xl uppercase leading-[0.9] tracking-tight sm:text-8xl">
            Tu talla <span className="text-ember-500">se va</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl font-body text-ink-900/80">
            El drop 002 está cerca de agotarse. Haz tu pedido hoy. Cuando el stock llega a 0, no vuelve.
          </p>
          <Link to="/shop" className="btn-block mt-8 bg-ink-950 text-acid-400 hover:bg-ink-800">
            Entrar al shop →
          </Link>
        </Reveal>
      </section>
    </div>
  )
}