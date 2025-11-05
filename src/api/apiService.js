// Hapus semua data mock (mockDashboardData, mockStands, dll.)
// ...

// Impor instance axios yang sudah kita konfigurasi
import api from './api.js';

// --- Fungsi API (Simulasi) --- GANTI MENJADI:
// --- Fungsi API (Terhubung ke Backend) ---

// 1. DashboardPage
export const getKasirDashboardSummary = () => {
  // Kita akan panggil endpoint 'reports/summary/'
  // Backend akan kita modifikasi untuk menyediakan data ini
  return api.get('reports/summary/'); 
};

// 2. KasirPosPage
export const getPosStands = () => {
  // Mengambil daftar stand dari /api/orders/stands/
  return api.get('stands/');
};

// 2. KasirPosPage
export const getPosMenusByStandId = (standId) => {
  // Mengambil menu dari stand spesifik
  // /api/orders/stands/{standId}/menus/
  return api.get(`stands/${standId}/menus/`);
};

// 2. KasirPosPage
export const createPosCashOrder = (orderData) => {
  /*
    orderData harus memiliki format yang sesuai dengan OrderCreateSerializer
    Contoh:
    {
      "tenant": 1, (ID Stand)
      "payment_method": "CASH",
      "items": [
        {"menu_item": 101, "qty": 2},
        {"menu_item": 201, "qty": 1, "variants": [3, 5]}
      ]
    }
  */
  return api.post('create/', orderData);
};

// 3. AntrianKonfirmasiPage
export const getAwaitingCashOrders = () => {
  // Kita akan modifikasi backend 'all/' agar bisa filter
  return api.get('all/?status=AWAITING_PAYMENT&payment_method=CASH');
};

// 3. AntrianKonfirmasiPage
export const confirmCashPaymentApi = (orderUuid) => {
  // Endpoint ini sudah benar di backend
  return api.post(`${orderUuid}/confirm-cash/`);
};

// 4. LaporanKeuanganPage
export const getLaporanKeuangan = (periode, standId) => {
  // Kita akan BUAT endpoint baru di backend untuk ini
  let params = `?periode=${periode}`;
  if (standId !== 'semua') {
    params += `&stand_id=${standId}`;
  }
  
  return api.get(`reports/laporan-keuangan/`, { params });
};