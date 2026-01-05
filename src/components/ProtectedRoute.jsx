// src/components/ProtectedRoute.jsx
import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token, isLoading } = useAuth();

  // 1️⃣ Tampilkan loading state agar tidak ada "flicker" atau redirect prematur
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  // 2️⃣ Jika tidak ada token atau user, redirect ke halaman Login (External/Portal)
  // Kita bungkus dalam komponen RedirectToLogin agar aman
  if (!token || !user) {
    return <RedirectToLogin />;
  }

  // 3️⃣ Cek role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

// Komponen kecil untuk menangani side-effect redirect
const RedirectToLogin = () => {
  useEffect(() => {
    // Gunakan URL login yang sesuai
    window.location.href = 'https://www.kantinku.com/login';
  }, []);

  return null; // Tidak merender apa-apa saat proses redirect
};

export default ProtectedRoute;
