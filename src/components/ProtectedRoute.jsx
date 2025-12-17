// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-lg font-semibold animate-pulse">Memuat Data...</div>
      </div>
    );
  }

  // 1. Jika User belum login, lempar ke Login User App
  if (!user) {
    window.location.href = 'http://localhost:5173/login'; 
    return null;
  }

  // 2. Cek Role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    
    // -- LOGIKA BARU UNTUK SELLER --
    // Jika Seller mencoba masuk, tendang keluar ke Aplikasi User (Port 5173)
    if (user.role === 'seller') {
        window.location.href = 'http://localhost:5173/';
        return null;
    }

    // Jika Kasir nyasar ke halaman khusus Admin (jika ada), kembalikan ke Dashboard
    // Karena sekarang Kasir boleh akses "/" (Dashboard), ini aman.
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;