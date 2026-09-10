const base = (rel) => {
  const url = new URL(rel, window.location.origin)
  return url.pathname + url.search
}

async function request(path, options = {}) {
  const res = await fetch(base(path), {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (res.status === 204) return null
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || 'Error de la API')
  }
  return data
}

export const api = {
  products: (params = {}) => {
    const q = new URLSearchParams()
    if (params.category && params.category !== 'todo') q.set('category', params.category)
    if (params.search) q.set('search', params.search)
    const qs = q.toString()
    return request(`/api/products${qs ? `?${qs}` : ''}`)
  },
  product: (id) => request(`/api/products/${id}`),
  createOrder: (payload) => request('/api/orders', { method: 'POST', body: JSON.stringify(payload) }),
  findOrder: (number) => request(`/api/orders/${number}`),
  adminLogin: (password) => request('/api/admin/login', { method: 'POST', body: JSON.stringify({ password }) }),
  adminProducts: () => request('/api/admin/products', authHeaders()),
  adminCreate: (p) => request('/api/admin/products', authHeaders({ method: 'POST', body: JSON.stringify(p) })),
  adminUpdate: (id, p) => request(`/api/admin/products/${id}`, authHeaders({ method: 'PUT', body: JSON.stringify(p) })),
  adminDelete: (id) => request(`/api/admin/products/${id}`, authHeaders({ method: 'DELETE' })),
}

function authHeaders(extra = {}) {
  const token = localStorage.getItem('uc_admin_token')
  return {
    ...extra,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...extra.headers,
    },
  }
}

export const imgUrl = {
  for(images, index = 0) {
    if (images && images.length) return base(images[index % images.length])
    return base('/api/img/gorras/placeholder')
  },
}

export const formatPrice = (n) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n)

export const CATEGORIES = [
  { id: 'todo', label: 'Todo' },
  { id: 'gorras', label: 'Gorras' },
  { id: 'camisetas', label: 'Camisetas' },
  { id: 'hoodies', label: 'Hoodies' },
  { id: 'accesorios', label: 'Accesorios' },
]