// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Terima props 'allowedRoles' (Array role yang boleh masuk)
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Memuat sesi...</div>;
  }

  // 1. Cek Login: Kalau tidak ada user, lempar ke Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Cek Role: Kalau role user tidak ada di daftar allowedRoles, tolak!
  // (Pastikan backend mengirim role dalam huruf kecil: 'admin', 'cashier', 'seller')
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logika redirect jika ditolak:
    // Jika dia Cashier tapi coba akses halaman Admin, kembalikan ke POS
    if (user.role === 'cashier') {
        return <Navigate to="/pos" replace />;
    }
    // Jika user lain, kembalikan ke Dashboard utama
    return <Navigate to="/" replace />;
  }

  // Jika lolos semua cek, tampilkan halaman
  return <Outlet />;
};

export default ProtectedRoute;