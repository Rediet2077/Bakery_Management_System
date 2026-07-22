const BASE_URL = import.meta.env.VITE_API_URL || 'https://bakery-management-system-0cla.onrender.com'

// Token stored in localStorage — no cookies needed
export const getToken = () => localStorage.getItem('bms_token')
export const setToken = (t) => localStorage.setItem('bms_token', t)
export const clearToken = () => localStorage.removeItem('bms_token')

async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

// Auth
export const login = async (username, password) => {
  const data = await request('/auth/login.php', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  if (data.token) setToken(data.token)
  return data
}

export const logout = () => {
  clearToken()
  return Promise.resolve()
}

export const getMe = () => request('/auth/me.php')

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
export const deleteSale = (id) => request(`/api/sales/delete.php?id=${id}`, { method: 'DELETE' })

// Users
export const getUsers = () => request('/api/users/index.php')
export const createUser = (data) => request('/api/users/create.php', { method: 'POST', body: JSON.stringify(data) })
export const deleteUser = (id) => request(`/api/users/delete.php?id=${id}`, { method: 'DELETE' })

// Dashboard
export const getDashboard = () => {
  const threshold = localStorage.getItem('bms_low_stock') || '10'
  return request(`/api/dashboard/index.php?threshold=${threshold}`)
}
