const BASE_URL = import.meta.env.VITE_API_URL || '/backend'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

// Auth
export const login = (username, password) =>
  request('/auth/login.php', { method: 'POST', body: JSON.stringify({ username, password }) })

export const logout = () =>
  request('/auth/logout.php', { method: 'POST' })

export const getMe = () =>
  request('/auth/me.php')

// Products
export const getProducts = () => request('/api/products/index.php')
export const createProduct = (data) => request('/api/products/create.php', { method: 'POST', body: JSON.stringify(data) })
export const updateProduct = (id, data) => request(`/api/products/update.php?id=${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteProduct = (id) => request(`/api/products/delete.php?id=${id}`, { method: 'DELETE' })

// Sales
export const createSale = (data) => request('/api/sales/create.php', { method: 'POST', body: JSON.stringify(data) })
export const getSales = (from, to) => {
  let url = '/api/sales/index.php'
  if (from && to) url += `?from=${from}&to=${to}`
  return request(url)
}
export const getSaleDetail = (id) => request(`/api/sales/detail.php?id=${id}`)

// Users
export const getUsers = () => request('/api/users/index.php')
export const createUser = (data) => request('/api/users/create.php', { method: 'POST', body: JSON.stringify(data) })
export const deleteUser = (id) => request(`/api/users/delete.php?id=${id}`, { method: 'DELETE' })

// Dashboard
export const getDashboard = () => request('/api/dashboard/index.php')
