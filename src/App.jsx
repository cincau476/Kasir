// Nama File: App.jsx
// (Berdasarkan file App.jsx Anda)

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import KasirPosPage from './pages/KasirPosPage';
import AntrianKonfirmasiPage from './pages/AntrianKonfirmasiPage';
import LaporanKeuanganPage from './pages/LaporanKeuanganPage';

import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';

// --- TAMBAHKAN IMPOR INI ---
import { AuthProvider } from './context/AuthContext';

function App() {
  
  return (
    <BrowserRouter>
      {/* --- BUNGKUS SEMUA RUTES DENGAN AUTHPROVIDER --- */}
      <AuthProvider>
        <Routes>
          
          {/* === Rute Publik === */}
          <Route path="/login" element={<LoginPage />} />

          {/* === Rute Terproteksi === */}
          <Route element={<ProtectedRoute />}>
            
            <Route path="/" element={<Layout />}> 
              <Route index element={<DashboardPage />} />
              <Route path="pos" element={<KasirPosPage />} />
              <Route path="antrian" element={<AntrianKonfirmasiPage />} />
              <Route path="laporan" element={<LaporanKeuanganPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
            
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;