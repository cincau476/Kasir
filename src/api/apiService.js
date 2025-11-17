// Impor instance axios yang sudah kita konfigurasi
import api from './api.js';

// --- FUNGSI API BARU UNTUK AUTENTIKASI ---

export const login = (username, password) => {
  // HAPUS '/api/' dari sini
  return api.post('auth/login/', {
    username,
    password,
  });
};

export const logout = () => {
  // HAPUS '/api/' dari sini
  return api.post('auth/logout/');
};

export const checkAuth = () => {
  // HAPUS '/api/' dari sini
  return api.get('auth/user/');
};

// --- Fungsi API (Terhubung ke Backend) ---

// 1. DashboardPage
export const getKasirDashboardSummary = () => {
  // 'reports/summary/' sudah benar (tanpa /api/)
  return api.get('reports/summary/'); 
};

// 2. KasirPosPage
export const getPosStands = () => {
  // 'stands/' sudah benar
  return api.get('stands/');
};

// 2. KasirPosPage
export const getPosMenusByStandId = (standId) => {
  return api.get(`stands/${standId}/menus/`);
};

// 2. KasirPosPage
export const createPosCashOrder = (orderData) => {
  return api.post('create/', orderData);
};

// 3. AntrianKonfirmasiPage
export const getAwaitingCashOrders = () => {
  return api.get('all/?status=AWAITING_PAYMENT&payment_method=CASH');
};

// 3. AntrianKonfirmasiPage
export const confirmCashPaymentApi = (orderUuid) => {
  return api.post(`${orderUuid}/confirm-cash/`);
};

// 4. LaporanKeuanganPage
export const getLaporanKeuangan = (paramsObject) => {
  const params = {
    periode: paramsObject.periode,
    stand_id: paramsObject.stand === 'semua' ? undefined : paramsObject.stand
  };
  // 'reports/laporan-keuangan/' sudah benar
  return api.get(`reports/laporan-keuangan/`, { params });
};