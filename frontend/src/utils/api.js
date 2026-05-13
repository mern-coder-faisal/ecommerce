const BASE = '/api';

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('ng_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  
  if (res.status === 204) return null;
  
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    if (!res.ok) throw new Error(text || 'Request failed');
    return text;
  }
  
  if (!res.ok) throw new Error(data?.message || data?.error || 'Request failed');
  return data;
}

export const api = {
  getProducts: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiFetch(`/products${q ? '?' + q : ''}`);
  },
  getProduct: (id) => apiFetch(`/products/${id}`),
  login: (body) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  me: () => apiFetch('/auth/me'),
  createOrder: (body) => apiFetch('/orders', { method: 'POST', body: JSON.stringify(body) }),
  customerOrders: () => apiFetch('/orders/user'),
  adminStats: () => apiFetch('/admin/stats'),
  adminOrders: () => apiFetch('/admin/orders'),
  adminUsers: () => apiFetch('/admin/users'),
  updateOrderStatus: (orderId, status) => apiFetch(`/admin/orders/${orderId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getCategories: () => apiFetch('/categories'),
  createCategory: (body) => apiFetch('/categories', { method: 'POST', body: JSON.stringify(body) }),
  updateCategory: (id, body) => apiFetch(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCategory: (id) => apiFetch(`/categories/${id}`, { method: 'DELETE' }),
  getBanners: () => apiFetch('/banners'),
  createBanner: (body) => apiFetch('/banners', { method: 'POST', body: JSON.stringify(body) }),
  updateBanner: (id, body) => apiFetch(`/banners/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteBanner: (id) => apiFetch(`/banners/${id}`, { method: 'DELETE' }),
  createProduct: (body) => apiFetch('/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id, body) => apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProduct: (id) => apiFetch(`/products/${id}`, { method: 'DELETE' }),
  getSettings: () => apiFetch('/settings'),
  updateSettings: (body) => apiFetch('/settings', { method: 'POST', body: JSON.stringify(body) }),
  recordVisit: (body) => apiFetch('/visits', { method: 'POST', body: JSON.stringify(body) }),
};
