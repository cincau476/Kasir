// src/App.jsx
import React from 'react';
// 1. HAPUS 'BrowserRouter' dari import ini
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import KasirPosPage from './pages/KasirPosPage';
import AntrianKonfirmasiPage from './pages/AntrianKonfirmasiPage';
import LaporanKeuanganPage from './pages/LaporanKeuanganPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    // 2. HAPUS <BrowserRouter> pembungkus di sini.
    // Langsung mulai dari AuthProvider atau div
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          
          {/* GRUP 1: DASHBOARD & LAPORAN */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'cashier']} />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/laporan" element={<LaporanKeuanganPage />} />
          </Route>

          {/* GRUP 2: POS & ANTRIAN */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'cashier']} />}>
            <Route path="/pos" element={<KasirPosPage />} />
            <Route path="/antrian" element={<AntrianKonfirmasiPage />} />
          </Route>

        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
    // 3. HAPUS penutup </BrowserRouter>
  );
}

export default App;
