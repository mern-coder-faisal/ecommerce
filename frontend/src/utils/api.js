const BASE = 'https://ecommerce-jt68.onrender.com/api';

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('ng_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is FormData, don't set Content-Type, fetch will set it with boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (res.status === 204) return null;

  const contentType = res.headers.get('content-type');
  let data;

  try {
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }
  } catch (err) {
    data = null;
  }

  if (!res.ok) {
    throw new Error(
      data?.message || data?.error || (typeof data === 'string' ? data : 'Request failed')
    );
  }

  return data;
}

export const api = {
  getProducts: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiFetch(`/products${q ? '?' + q : ''}`);
  },

  getProduct: (id) => apiFetch(`/products/${id}`),

  login: (body) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  register: (body) =>
    apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  me: () => apiFetch('/auth/me'),

  createOrder: (body) =>
    apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  customerOrders: () => apiFetch('/orders/user'),

  adminStats: () => apiFetch('/admin/stats'),
  adminOrders: () => apiFetch('/admin/orders'),
  adminUsers: () => apiFetch('/admin/users'),

  updateOrderStatus: (orderId, status) =>
    apiFetch(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),
  
  deleteOrder: (orderId) =>
    apiFetch(`/admin/orders/${orderId}`, {
      method: 'DELETE'
    }),

  getCategories: () => apiFetch('/categories'),

  createCategory: (body) =>
    apiFetch('/categories', {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body)
    }),

  updateCategory: (id, body) =>
    apiFetch(`/categories/${id}`, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body)
    }),

  deleteCategory: (id) =>
    apiFetch(`/categories/${id}`, {
      method: 'DELETE'
    }),

  getBanners: () => apiFetch('/banners'),

  createBanner: (body) =>
    apiFetch('/banners', {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body)
    }),

  updateBanner: (id, body) =>
    apiFetch(`/banners/${id}`, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body)
    }),

  deleteBanner: (id) =>
    apiFetch(`/banners/${id}`, {
      method: 'DELETE'
    }),

  createProduct: (body) =>
    apiFetch('/products', {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body)
    }),

  updateProduct: (id, body) =>
    apiFetch(`/products/${id}`, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body)
    }),

  deleteProduct: (id) =>
    apiFetch(`/products/${id}`, {
      method: 'DELETE'
    }),

  getSettings: () => apiFetch('/settings'),

  updateSettings: (body) =>
    apiFetch('/settings', {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body)
    }),

  getPopups: () => apiFetch('/popups'),
  getAllPopups: () => apiFetch('/popups/all'),
  createPopup: (body) =>
    apiFetch('/popups', {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body)
    }),
  deletePopup: (id) => apiFetch(`/popups/${id}`, { method: 'DELETE' }),

  recordVisit: (body) =>
    apiFetch('/visits', {
      method: 'POST',
      body: JSON.stringify(body)
    }),
};