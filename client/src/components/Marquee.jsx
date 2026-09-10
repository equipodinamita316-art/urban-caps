const MARQUEE_ITEMS = [
  'NUEVO DROP 002',
  'ENVÍO GRATIS +$100',
  'EDICIÓN LIMITADA',
  'STREETWEAR SIN EXCUSAS',
  'ENVÍO GRATIS +$100',
  'URBAN CAPS® EST. 2026',
  '12 UNIDADES RESTANTES',
  'NO FALSIFICACIONES',
  'ENVÍO GRATIS +$100',
]

export default function Marquee({ reverse = false, items = MARQUEE_ITEMS, className = '' }) {
  const doubled = [...items, ...items]
  return (
    <div className={`relative z-20 overflow-hidden border-y-2 border-ink-950 bg-acid-400 py-3 ${className}`}>
      <div className={`marquee-track ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}>
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center" aria-hidden={half === 1}>
            {doubled.map((text, i) => (
              <span key={`${half}-${i}`} className="flex items-center font-display text-sm uppercase tracking-widest text-ink-950">
                <span className="px-6">{text}</span>
                <span className="text-ember-500">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}