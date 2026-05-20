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

// ==========================================
// ANTI-RACE CONDITION (MUTEX LOCK)
// ==========================================
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
  // SECURE CODING: Gunakan standard naming dan penyimpanan
  const token = localStorage.getItem('access_token'); 
  if (token) {
    // SECURE CODING: Sesuaikan dengan setting SimpleJWT Django ('Bearer')
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ==========================================
// RESPONSE INTERCEPTOR (Silent Refresh)
// ==========================================
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Hindari loop tak terbatas jika request refresh itu sendiri yang gagal
    if (originalRequest.url.includes('/users/token/refresh/')) {
        return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
        
        // JIKA SEDANG REFRESH: Antrekan request kasir (polling pesanan, dsb)
        if (isRefreshing) {
            return new Promise(function(resolve, reject) {
                failedQueue.push({resolve, reject});
            }).then(token => {
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                return apiClient(originalRequest);
            }).catch(err => Promise.reject(err));
        }

        // JIKA BELUM REFRESH: Kunci gembok
        originalRequest._retry = true;
        isRefreshing = true;

        try {
            // Meminta access_token baru via HttpOnly Cookie (refresh_token)
            const response = await axios.post(`${API_URL}/users/token/refresh/`, {}, {
                withCredentials: true
            });
            
            const newAccessToken = response.data.access;
            localStorage.setItem('access_token', newAccessToken);
            
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            
            // Buka gembok dan jalankan ulang semua request yang mengantre
            processQueue(null, newAccessToken);
            return apiClient(originalRequest);

        } catch (refreshError) {
            // Sesi kedaluwarsa sepenuhnya (lebih dari 1 hari) atau di-blacklist
            processQueue(refreshError, null);
            localStorage.removeItem('access_token');
            window.location.href = '/login'; 
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
    
    // Jangan tampilkan detail error di console produksi
    if (import.meta.env.MODE !== 'production') {
      console.error('Kasir API Error:', error.response?.status, error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;