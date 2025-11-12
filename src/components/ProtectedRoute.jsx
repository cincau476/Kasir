// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// --- TAMBAHKAN IMPOR INI ---
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  // --- PERUBAHAN: Ambil data dari context ---
  const { user, isLoading } = useAuth();

  // Ambil token dari localStorage // <-- HAPUS BARIS INI
  // const token = localStorage.getItem('authToken');

  // Tampilkan loading jika context masih mengecek auth
  if (isLoading) {
    return <div>Memeriksa sesi...</div>;
  }

  // --- PERUBAHAN: Cek 'user' dari context ---
  if (!user) {
    // Jika TIDAK ADA user, lempar ke halaman /login
    return <Navigate to="/login" replace />;
  }

  // Jika ADA user, izinkan akses
  return <Outlet />;
};

export default ProtectedRoute;