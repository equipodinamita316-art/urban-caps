function hashSeed(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const INK = '#0A0A0A'
const ACCENTS = ['#D6FF3F', '#FF4D00', '#FF6B35', '#38BDF8', '#F472B6', '#E7E5E4']
const PAPER = ['#E7E5E4', '#F5F5F4', '#D6FF3F', '#FDE68A']

function uid() {
  return `u${Math.random().toString(36).slice(2, 10)}`
}

function palette(rand) {
  const accent = ACCENTS[Math.floor(rand() * ACCENTS.length)]
  const flip = rand() < 0.55
  return flip
    ? { bg: INK, fg: accent, strip: accent }
    : { bg: PAPER[Math.floor(rand() * PAPER.length)], fg: INK, strip: accent }
}

function stripes(fill, id) {
  return `
  <g fill="${fill}">
    <rect x="-50" y="-50" width="220" height="60" transform="rotate(-45 50 0)"/>
    <rect x="-230" y="-50" width="220" height="60" transform="rotate(-45 50 0)"/>
    <rect x="430" y="-50" width="220" height="60" transform="rotate(-45 50 0)"/>
  </g>`
}

function silhouette(kind, color, id) {
  if (kind === 'camisetas') {
    return `
    <g fill="none" stroke="${color}" stroke-width="22" stroke-linejoin="round" stroke-linecap="round">
      <path d="M400 430 L360 370 L260 400 C220 300 260 260 300 260 L330 300 C360 250 540 250 570 300 L600 260 C640 260 680 300 640 400 L540 370 L500 430 L400 430 Z"/>
      <path d="M330 300 L300 560 C380 580 520 580 600 560 L570 300"/>
    </g>`
  }
  if (kind === 'hoodies') {
    return `
    <g fill="none" stroke="${color}" stroke-width="22" stroke-linejoin="round" stroke-linecap="round">
      <rect x="320" y="380" width="260" height="340" rx="16"/>
      <path d="M300 560 L300 640 C300 700 372 740 450 740 C528 740 600 700 600 640 L600 560"/>
      <path d="M370 560 L450 640 L530 560"/>
      <path d="M420 250 C460 220 500 220 520 250 L560 400 L340 400 Z"/>
    </g>`
  }
  if (kind === 'accesorios') {
    return `
    <g fill="none" stroke="${color}" stroke-width="22">
      <circle cx="450" cy="560" r="150"/>
      <path d="M450 410 L450 250 M500 250 L400 250" stroke-linecap="round"/>
      <circle cx="450" cy="560" r="52" fill="${color}" stroke="none"/>
    </g>`
  }
  return `
  <g fill="none" stroke="${color}" stroke-width="22" stroke-linejoin="round" stroke-linecap="round">
    <path d="M330 470 L345 330 C360 250 540 250 555 330 L570 470 Z"/>
    <path d="M300 560 C450 720 450 720 600 560" stroke-width="26"/>
    <path d="M560 500 L750 520 C770 470 740 430 690 430 L575 480" fill="${color}" stroke="none"/>
    ${'<rect x="280" y="470" width="28" height="120" rx="10" fill="' + color + '"/>'}
  </g>`
}

export function svgFor(kind, slug) {
  const id = uid()
  const rand = mulberry32(hashSeed(`${kind}:${slug}`))
  const { bg, fg, strip } = palette(rand)
  const label = slug
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .toUpperCase()
    .split(/(?=[A-Z])|\s+/)
    .join(' ')
    .slice(0, 26)
  const big = kind === 'gorras' ? 'CAP' : kind === 'camisetas' ? 'T-SHIRT' : kind === 'hoodies' ? 'HOODIE' : 'GEAR'
  const code = `${slug.length}${hashSeed(slug) % 97}`.slice(0, 4)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1200">
  <defs>
    <filter id="${id}">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.14"/></feComponentTransfer>
      <feComposite in2="SourceGraphic" operator="in"/>
    </filter>
  </defs>
  <rect width="900" height="1200" fill="${bg}"/>
  ${stripes(strip, id)}
  <text x="48" y="118" font-family="'Archivo Black', Arial Black, sans-serif" font-size="44" fill="${fg}" letter-spacing="4">URBAN CAPS®</text>
  <text x="48" y="1194" font-family="monospace" font-size="30" fill="${fg}">#${code} — W29 − L35 − EST.2026</text>
  ${silhouette(kind, fg, id)}
  <text x="48" y="1125" font-family="'Archivo Black', Arial Black, sans-serif" font-size="96" fill="${fg}" letter-spacing="-2">${label}</text>
  <rect width="900" height="1200" filter="url(#${id})" opacity="1"/>
  <text x="822" y="1194" font-family="'Archivo Black', Arial, sans-serif" font-size="30" fill="${fg}" text-anchor="end">UC.</text>
</svg>`
}

export const imgKinds = ['gorras', 'camisetas', 'hoodies', 'accesorios']