// Nama File: src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Ambil token dari localStorage, sesuai dengan yang Anda set di api.js
  const token = localStorage.getItem('authToken'); 

  if (!token) {
    // Jika TIDAK ADA token, lempar pengguna ke halaman /login
    // 'replace' berarti pengguna tidak bisa menekan "back" untuk kembali
    return <Navigate to="/login" replace />;
  }

  // Jika ADA token, izinkan akses ke halaman (Render <Outlet />)
  // <Outlet /> ini mewakili halaman DashboardPage, KasirPosPage, dll.
  return <Outlet />;
};

export default ProtectedRoute;