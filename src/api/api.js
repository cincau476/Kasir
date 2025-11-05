import axios from 'axios';

// Ganti URL ini dengan URL backend Django Anda
const API_BASE_URL = 'http://localhost:8000/api/orders/'; 

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