import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import KasirPosPage from './pages/KasirPosPage';
import AntrianKonfirmasiPage from './pages/AntrianKonfirmasiPage';
import LaporanKeuanganPage from './pages/LaporanKeuanganPage'; // <-- 1. Impor halaman baru

function App() {
  const isLogin = true; 
  // ...
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="pos" element={<KasirPosPage />} />
          <Route path="antrian" element={<AntrianKonfirmasiPage />} />
          <Route path="laporan" element={<LaporanKeuanganPage />} /> {/* <-- 2. Ganti di sini */}
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;