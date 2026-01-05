// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token, isLoading } = useAuth();

  // 1️⃣ Tunggu auth benar-benar siap
  if (isLoading) {
    return null;
  }

  // 2️⃣ Jika belum login, redirect DENGAN REACT ROUTER
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 3️⃣ Cek role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
