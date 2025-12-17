// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import KasirPosPage from './pages/KasirPosPage';
import AntrianKonfirmasiPage from './pages/AntrianKonfirmasiPage';
import LaporanKeuanganPage from './pages/LaporanKeuanganPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// --- KOMPONEN HELPER: AUTH SYNC ---
// Bertugas menangkap token dari URL, menyimpannya, dan me-refresh aplikasi
const AuthSync = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Ambil token dari URL parameters
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // 2. Simpan token ke LocalStorage milik Kasir App
      localStorage.setItem('token', token);
      
      // 3. Bersihkan URL (hapus ?token=... agar rapi) tanpa refresh halaman dulu
      window.history.replaceState({}, document.title, location.pathname);

      // 4. Force Reload halaman agar AuthProvider menginisialisasi ulang 
      //    dengan token yang baru saja disimpan di LocalStorage.
      window.location.reload(); 
    }
  }, [location, navigate]);

  return null; // Komponen ini tidak merender apa-apa
};

function App() {
  return (
    <BrowserRouter>
      {/* Pasang AuthSync DI DALAM BrowserRouter agar bisa menggunakan useLocation */}
      <AuthSync />

      <AuthProvider>
        <Routes>
          {/* Wrapper Layout Utama (Ada Header) */}
          <Route element={<Layout />}>
            
            {/* GRUP 1: Hanya OWNER (Seller) & ADMIN yang boleh masuk */}
            <Route element={<ProtectedRoute allowedRoles={['seller', 'admin']} />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/laporan" element={<LaporanKeuanganPage />} />
            </Route>

            {/* GRUP 2: KASIR & OWNER boleh masuk */}
            <Route element={<ProtectedRoute allowedRoles={['cashier', 'seller', 'admin']} />}>
              <Route path="/pos" element={<KasirPosPage />} />
              <Route path="/antrian" element={<AntrianKonfirmasiPage />} />
            </Route>

          </Route>

          {/* Fallback jika halaman tidak ditemukan */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;