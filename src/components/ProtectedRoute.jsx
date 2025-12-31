// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token, isLoading } = useAuth();

  if (isLoading) {
    return null; // Spinner sudah ditangani di AuthContext
  }

  // Jika tidak ada token atau user, arahkan ke login utama
  if (!token || !user) {
    const loginUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:5173/login' 
      : 'https://www.kantinku.com/login';
    
    window.location.href = loginUrl;
    return null;
  }

  // Cek Role (Opsional, jika kasir punya role spesifik 'cashier')
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Jika role salah, kembalikan ke dashboard atau halaman error
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
