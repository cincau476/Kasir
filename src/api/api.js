// File: src/api/api.js
import axios from 'axios';

// Menghapus trailing slash agar penggabungan URL bersih
const API_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // SECURE CODING: Mengizinkan pengiriman HttpOnly Cookie (Refresh Token & CSRF)
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ==========================================
// REQUEST INTERCEPTOR (Otorisasi)
// ==========================================
apiClient.interceptors.request.use((config) => {
  // PERBAIKAN 1: Gunakan sessionStorage dan 'kasir_token' (Klop dengan LoginPage utama)
  const token = sessionStorage.getItem('kasir_token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ==========================================
// RESPONSE INTERCEPTOR (Silent Refresh & Pagination)
// ==========================================
apiClient.interceptors.response.use(
  (response) => {
    // PERBAIKAN 2: Ekstrak '.results' otomatis agar tabel/list tidak kena error .map()
    if (response.data && response.data.results !== undefined) {
      response.data = response.data.results;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url.includes('/users/token/refresh/')) {
        return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
        
        if (isRefreshing) {
            return new Promise(function(resolve, reject) {
                failedQueue.push({resolve, reject});
            }).then(token => {
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                return apiClient(originalRequest);
            }).catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const response = await axios.post(`${API_URL}/users/token/refresh/`, {}, {
                withCredentials: true
            });
            
            const newAccessToken = response.data.access;
            // PERBAIKAN 1: Simpan pembaruan ke 'kasir_token'
            sessionStorage.setItem('kasir_token', newAccessToken);
            
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            
            processQueue(null, newAccessToken);
            return apiClient(originalRequest);

        } catch (refreshError) {
            processQueue(refreshError, null);
            // PERBAIKAN 1: Bersihkan token Kasir dan arahkan kembali ke Domain Utama
            sessionStorage.removeItem('kasir_token');
            sessionStorage.removeItem('kasir_user');
            window.location.href = `${window.location.origin}/login`; 
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
    
    if (import.meta.env.MODE !== 'production') {
      console.error('Kasir API Error:', error.response?.status, error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;