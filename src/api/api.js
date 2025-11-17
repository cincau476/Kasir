import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // --- PERUBAHAN: TAMBAHKAN INI ---
  // Ini adalah perintah agar axios mengirim cookie di setiap request
  withCredentials: true,
});

export default api;