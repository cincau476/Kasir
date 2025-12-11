import axios from 'axios';

// Pastikan mengarah ke port Django (8000) dengan prefix /api
const API_URL = 'http://localhost:8000/api'; 

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // <-- PENTING: Wajib true agar cookie terbaca
});

export default apiClient;