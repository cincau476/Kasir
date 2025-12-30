// File: cincau476/kasir/Kasir-728d3a8c5898c7c2af7199da371dd810b3222865/src/api/api.js
import axios from 'axios';

// Menghapus trailing slash agar penggabungan URL bersih
const API_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

/**
 * Interceptor untuk menyisipkan kasir_token
 */
apiClient.interceptors.request.use((config) => {
  // MENGGUNAKAN kasir_token AGAR TIDAK BENTROK
  const token = localStorage.getItem('kasir_token');
  
  if (token) {
    // Gunakan format 'Token' (dengan T kapital) sesuai standar Django Authtoken
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
