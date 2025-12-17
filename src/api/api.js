// File: cincau476/kasir/Kasir-728d3a8c5898c7c2af7199da371dd810b3222865/src/api/api.js
import axios from 'axios';

// Gunakan VITE_API_URL, fallback ke localhost jika tidak ada
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// --- WAJIB TAMBAH INI SUPAYA TOKEN TERBAWA ---
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});
// ---------------------------------------------

export default apiClient;