import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Currency
export const currencyAPI = {
  getRates: () => api.get('/currency/rates'),
};

// Categories
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getRoot: () => api.get('/categories/root'),
  getByType: (type) => api.get(`/categories/type/${type}`),
  getSubs: (id) => api.get(`/categories/${id}/subcategories`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Records
export const recordAPI = {
  getAll: (page = 0, size = 20) => api.get(`/records?page=${page}&size=${size}`),
  getByDateRange: (start, end) => api.get(`/records/date-range?start=${start}&end=${end}`),
  getByCategory: (catId) => api.get(`/records/category/${catId}`),
  getByType: (type) => api.get(`/records/type/${type}`),
  getRecent: (limit = 10) => api.get(`/records/recent?limit=${limit}`),
  create: (data) => api.post('/records', data),
  update: (id, data) => api.put(`/records/${id}`, data),
  delete: (id) => api.delete(`/records/${id}`),
};

// Tags
export const tagAPI = {
  getAll: () => api.get('/tags'),
  create: (data) => api.post('/tags', data),
  update: (id, data) => api.put(`/tags/${id}`, data),
  delete: (id) => api.delete(`/tags/${id}`),
};

// Goals
export const goalAPI = {
  getAll: () => api.get('/goals'),
  getActive: () => api.get('/goals/active'),
  create: (data) => api.post('/goals', data),
  update: (id, data) => api.put(`/goals/${id}`, data),
  delete: (id) => api.delete(`/goals/${id}`),
};

// Dashboard
export const dashboardAPI = {
  get: () => api.get('/dashboard'),
};

export default api;
