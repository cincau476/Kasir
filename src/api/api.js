import axios from 'axios';

// PERBAIKAN:
// Ambil URL dari Environment Variable.
// React (CRA) otomatis membaca variabel yang diawali 'REACT_APP_'
const API_BASE_URL = process.env.REACT_APP_API_URL;

// Saat di-deploy ke production, Anda akan mengganti nilai variabel ini
// menjadi "https://api.website-anda.com/api/orders/"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* Interceptor ini akan otomatis menambahkan Token Auth 
  dari localStorage ke setiap request.
*/
api.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage
    const token = localStorage.getItem('authToken'); 
    
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;