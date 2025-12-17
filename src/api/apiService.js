// src/api/apiService.js
import api from './api.js';

// --- FUNGSI API BARU UNTUK AUTENTIKASI ---

export const login = (username, password) => {
  return api.post('users/login/', {
    username,
    password,
  });
};

export const checkAuth = () => {
  // Hapus '/' di awal agar konsisten dengan baseURL
  return api.get('/users/check-auth/');
};

export const logout = () => {
  return api.post('/users/logout/');
};

// --- Fungsi API (Terhubung ke Backend) ---

// 1. DashboardPage
export const getKasirDashboardSummary = () => {
  // Sesuai orders/urls.py: path('reports/summary/', ...) -> /api/reports/summary/
  return api.get('reports/summary/'); 
};

// 2. KasirPosPage
export const getPosStands = () => {
  // PERBAIKAN: Tambahkan 'tenants/' karena di canteen/urls.py pakai path('api/tenants/', ...)
  return api.get('tenants/stands/'); 
};

// 2. KasirPosPage
export const getPosMenusByStandId = (standId) => {
  // PERBAIKAN: Tambahkan 'tenants/'
  return api.get(`tenants/stands/${standId}/menus/`);
};

// 2. KasirPosPage
export const createPosCashOrder = (orderData) => {
  // Sesuai orders/urls.py: path('orders/create/', ...) -> /api/orders/create/
  return api.post('orders/create/', orderData);
};

// 3. AntrianKonfirmasiPage
export const getAwaitingCashOrders = () => {
  // Sesuai orders/urls.py: path('orders/', ...) -> /api/orders/
  return api.get('orders/?status=AWAITING_PAYMENT&payment_method=CASH');
};

// 3. AntrianKonfirmasiPage
export const confirmCashPaymentApi = (orderUuid) => {
  // Sesuai cashier/urls.py: path('orders/.../confirm-cash/') 
  // dan canteen/urls.py include 'api/cashier/'
  return api.post(`cashier/orders/${orderUuid}/confirm-cash/`);
};

// 4. LaporanKeuanganPage
export const getLaporanKeuangan = (paramsObject) => {
  const params = {
    periode: paramsObject.periode,
    stand_id: paramsObject.stand === 'semua' ? undefined : paramsObject.stand
  };
  return api.get('reports/summary/', { params });
};