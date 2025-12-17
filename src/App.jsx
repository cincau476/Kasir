// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import KasirPosPage from './pages/KasirPosPage';
import AntrianKonfirmasiPage from './pages/AntrianKonfirmasiPage';
import LaporanKeuanganPage from './pages/LaporanKeuanganPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            
            {/* GRUP 1: DASHBOARD & LAPORAN */}
            {/* Perubahan: Tambahkan 'cashier', Hapus 'seller' */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'cashier']} />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/laporan" element={<LaporanKeuanganPage />} />
            </Route>

            {/* GRUP 2: POS & ANTRIAN */}
            {/* Perubahan: Hapus 'seller' */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'cashier']} />}>
              <Route path="/pos" element={<KasirPosPage />} />
              <Route path="/antrian" element={<AntrianKonfirmasiPage />} />
            </Route>

          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;