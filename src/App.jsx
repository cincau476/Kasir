// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import KasirPosPage from './pages/KasirPosPage';
import AntrianKonfirmasiPage from './pages/AntrianKonfirmasiPage';
import LaporanKeuanganPage from './pages/LaporanKeuanganPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Wrapper Layout Utama (Ada Header) */}
          <Route element={<Layout />}>
            
            {/* GRUP 1: Hanya OWNER (Seller) & ADMIN yang boleh masuk */}
            {/* Misal: Dashboard & Laporan Keuangan */}
            <Route element={<ProtectedRoute allowedRoles={['seller', 'admin']} />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/laporan" element={<LaporanKeuanganPage />} />
            </Route>

            {/* GRUP 2: KASIR & OWNER boleh masuk */}
            {/* Misal: POS & Antrian */}
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