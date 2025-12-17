// src/components/ProtectedRoute.jsx (KASIR APP - Port 5175)
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Verifikasi Izin...</div>;
  }

  // 1. Jika User null (Login Gagal), lempar ke Login User App (5173)
  if (!user) {
    window.location.href = 'http://localhost:5173/login'; 
    return null;
  }

  // 2. Cek Role
  // Pastikan role user ada di daftar yang diizinkan
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Jika dia Kasir tapi nyasar ke halaman Admin, kembalikan ke POS
    if (user.role === 'cashier') {
        return <Navigate to="/pos" replace />;
    }
    // Jika role lain, kembali ke Dashboard
    return <Navigate to="/" replace />;
  }

  // Jika aman, tampilkan halaman
  return <Outlet />;
};

export default ProtectedRoute;