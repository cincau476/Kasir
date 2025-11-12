import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

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