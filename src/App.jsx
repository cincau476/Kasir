// Nama File: App.jsx (Perbarui file ini)

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import KasirPosPage from './pages/KasirPosPage';
import AntrianKonfirmasiPage from './pages/AntrianKonfirmasiPage';
import LaporanKeuanganPage from './pages/LaporanKeuanganPage';

// --- Impor Halaman & Komponen Baru ---
import ProtectedRoute from './components/ProtectedRoute'; // <-- Impor
import LoginPage from './pages/LoginPage';         // <-- Impor

function App() {
  // Hapus "const isLogin = true;" karena sudah ditangani ProtectedRoute
  
  return (
    <BrowserRouter>
      <Routes>
        
        {/* === Rute Publik === */}
        {/* Halaman Login ada di luar Layout & ProtectedRoute */}
        <Route path="/login" element={<LoginPage />} />

        {/* === Rute Terproteksi === */}
        {/* Semua rute di dalam sini WAJIB login */}
        <Route element={<ProtectedRoute />}>
          
          {/* Layout (Header, dll) sekarang ikut terproteksi */}
          <Route path="/" element={<Layout />}> 
            <Route index element={<DashboardPage />} />
            <Route path="pos" element={<KasirPosPage />} />
            <Route path="antrian" element={<AntrianKonfirmasiPage />} />
            <Route path="laporan" element={<LaporanKeuanganPage />} />
            
            {/* Redirect semua path yg tidak dikenal ke dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;