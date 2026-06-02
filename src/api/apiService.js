// File: src/api/apiService.js
import api from './api.js';

// --- FUNGSI API UNTUK AUTENTIKASI ---
export const login = (username, password) => api.post('users/login/', { username, password });
export const checkAuth = () => api.get('users/check-auth/');
export const logout = () => api.post('users/logout/');

// --- FUNGSI KASIR (POS & DASHBOARD) ---

// 1. DashboardPage
export const getKasirDashboardSummary = () => api.get('reports/summary/'); 

// 2. KasirPosPage
export const getPosStands = () => api.get('tenants/stands/'); 
export const getPosMenusByStandId = (standId) => api.get(`tenants/stands/${standId}/menus/`);
export const createPosCashOrder = (orderData) => api.post('orders/create/', orderData);

// 3. Antrian / Konfirmasi Kasir
export const getAwaitingCashOrders = (params) => api.get('orders/all/', { params });
export const confirmCashPaymentApi = (orderUuid) => api.post(`cashier/cash/confirm/${orderUuid}/`);

// 4. LaporanKeuanganPage
export const getLaporanKeuangan = (paramsObject) => {
  const params = {
    periode: paramsObject.periode,
    stand_id: paramsObject.stand === 'semua' ? undefined : paramsObject.stand
  };
  return api.get('reports/summary/', { params });
};


// === MFA Keamanan ===
export const generateMfaSetup = () => apiClient.post('/users/mfa/setup/generate/');

export const verifyMfaSetup = (otpCode) => apiClient.post('/users/mfa/setup/verify/', { 
    otp_code: otpCode 
});
