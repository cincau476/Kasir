// File: cincau476/kasir/Kasir-728d3a8c5898c7c2af7199da371dd810b3222865/src/api/apiService.js
import api from './api.js';

// --- FUNGSI API BARU UNTUK AUTENTIKASI ---

export const login = (username, password) => {
  return api.post('users/login/', {
    username,
    password,
  });
};

export const checkAuth = () => {
  // PERBAIKAN: Hapus '/' di awal agar tidak me-reset baseURL
  // Menjadi: http://localhost:8000/api/users/check-auth/
  return api.get('users/check-auth/');
};

export const logout = () => {
  // PERBAIKAN: Hapus '/' di awal
  return api.post('users/logout/');
};

// --- Fungsi API (Terhubung ke Backend) ---

// 1. DashboardPage
export const getKasirDashboardSummary = () => {
  return api.get('reports/summary/'); 
};

// 2. KasirPosPage
export const getPosStands = () => {
  return api.get('tenants/stands/'); 
};

// 2. KasirPosPage
export const getPosMenusByStandId = (standId) => {
  return api.get(`tenants/stands/${standId}/menus/`);
};

// 2. KasirPosPage
export const createPosCashOrder = (orderData) => {
  return api.post('orders/create/', orderData);
};

export const getAwaitingCashOrders = () => {
  // Gunakan status 'pending' sesuai saran sebelumnya agar data muncul
  return api.get('orders/all/?status=pending&payment_method=CASH');
};

export const confirmCashPaymentApi = (orderUuid) => {
  return api.post(`orders/${orderUuid}/status/`, {
    status: 'PAID' 
  });
};

// 4. LaporanKeuanganPage
export const getLaporanKeuangan = (paramsObject) => {
  // PENTING: Definisikan variabel 'params' sebelum dipakai!
  const params = {
    periode: paramsObject.periode,
    // Jika 'semua', jangan kirim stand_id agar backend mengambil semua data
    stand_id: paramsObject.stand === 'semua' ? undefined : paramsObject.stand
  };
  
  // Kirim request dengan params yang sudah dibuat di atas
  return api.get('reports/summary/', { params });
};
