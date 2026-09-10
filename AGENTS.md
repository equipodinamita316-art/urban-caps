# AGENTS.md

URBAN CAPS® — tienda e-commerce streetwear con estética brutalista urbana. Frontend React + Vite + Tailwind v4 en `client/`, backend Express + SQLite (`node:sqlite`, sin dependencias nativas) en `server/`. Interfaz en español. Pagos simulados.

## Run / verify

- Dev (ambos servicios): `npm run dev` en la raíz (concurrently: API en :4000, Vite en :5173 con proxy `/api`).
- Server solo: `npm run dev --prefix server`. Client solo: `npm run dev --prefix client`.
- Tests API: `npm test` (node --test, BD aislada en temp).
- Lint: `npm run lint` (oxlint en `client/src`).
- Build: `npm run build` → `client/dist`; el server sirve ese build en `http://localhost:4000` (útil sin levantar Vite).
- Seed: el server siembra 12 productos al arrancar si la BD está vacía. `npm run seed --prefix server -- --force` para resemillar.

**Windows:** PowerShell bloquea `npm.ps1` por execution policy → usa siempre `npm.cmd` (o `npm run` con el .cmd). Los `Start-Process`/`Stop-Process` para correr el server en segundo plano están bien, pero prefiere `npm run dev`.

## Architecture

```
client/  React SPA (Vite + Tailwind v4 + framer-motion + react-router-dom)
  src/
    api.js            fetch wrapper + helpers (formatPrice MXN, imgUrl, CATEGORIES)
    store/CartContext.jsx   carrito con localStorage (key "uc_cart_v1")
    components/       Navbar, CartDrawer, Marquee, ProductCard, Reveal, Footer
    pages/            Home, Shop, Product, Checkout, Confirmation, Admin
    index.css         sistema de diseño (@theme tokens + utilities)
server/  Express API
  src/
    index.js          rutas + auth admin (HMAC token) + sirve client/dist
    db.js             conexión node:sqlite, esquema (products, orders)
    products.js       lógica de negocio (CRUD, seed, crear órdenes)
    img.js            generador SVG on-brand (/api/img/:kind/:slug.svg) — sin fotos reales
    products.test.js  unit tests (BD temp aislada)
```

- BD SQLite: `server/data/urbancaps.db` (gitignored). Esquema se crea solo con `CREATE TABLE IF NOT EXISTS`.
- Añadir rutas en `index.js`; lógica de datos en `products.js`; nunca lógica en rutas.

## API

- `GET  /api/products[?category=&search=]`, `GET /api/products/:id`
- `POST /api/orders` (customer + items; valida stock, descuenta, calcula envío gratis +$100)
- `GET  /api/orders/:number`
- Admin (requieren `Authorization: Bearer <token>`):
  - `POST /api/admin/login` → token (pass default `urbancaps123`, cambiable con `ADMIN_PASSWORD`)
  - `GET|POST /api/admin/products`, `PUT|DELETE /api/admin/products/:id`
- `GET /api/img/:kind/:slug.svg` — imágenes SVG generadas (kinds: gorras, camisetas, hoodies, accesorios).

## Design system (brutalismo urbano)

- Fuentes: `Archivo Black` (display) + `Space Grotesk` (body), via Google Fonts en `index.css`.
- Tokens en `@theme`: `ink-*` (negros), `acid-400` (#D6FF3F neón), `ember-500` (#FF4D00 naranja), `bone-*` (blanco hueso).
- Utilities clave (definidas en `index.css`): `text-stroke-*` (outline), `grain` (textura noise overlay), `grid-bg`, `animate-marquee`/`-reverse`, `btn-block`, `card-img`, `form-input`.
- MARQUEE es la firma del sitio: bandas de texto animadas entre secciones.
- Sin fotos reales = usar `/api/img/<kind>/<slug>`; el admin acepta cualquier URL de imagen.
- No uses colores de otro proyecto (universo/DEV-HUB); la paleta vive solo en este `@theme`.

## Gotchas (do not break)

- **Contenido JSON:** el spread `...options` en fetch puede pisar el header `Content-Type` — en el client los options de `authHeaders` ya incluyen ese header; respeta ese patrón al añadir llamadas.
- **`node:sqlite`** es el module bundled de Node 24 — no introduces `better-sqlite3` ni prisma salvo que sea estrictamente necesario.
- Los tests de server usan una BD temp y la borran; nunca corren contra la BD de desarrollo. Mantené aislados los nuevos tests.
- El server auto-seedea solo con BD vacía; `runSeed(true)` borra productos.
- `timingSafeEqual` con passwords de distinta longitud lanza excepción — ya manejado en login (comparación de longitud antes).
- Precios en MXN vía `formatPrice`; no hardcodees moneda en views.
- Página Admin en `/admin` (password `urbancaps123`); el token expira a las 12h.
- Mensajes de UI en español; copys con actitud streetwear (Drop, "Pieza", "Agotado", etc.).