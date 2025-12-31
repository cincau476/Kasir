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
  const token = sessionStorage.getItem('kasir_token'); // Ubah ke sessionStorage
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
