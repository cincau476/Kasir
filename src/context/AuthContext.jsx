// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
// --- TAMBAHKAN IMPOR REACT ROUTER ---
import { useNavigate, useLocation } from 'react-router-dom';
// Pastikan path ini benar menunjuk ke apiService.js Anda
import { checkAuth, login as apiLogin, logout as apiLogout } from '../api/apiService';

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- TAMBAHKAN HOOK NAVIGASI ---
  const navigate = useNavigate();
  const location = useLocation();

  // Cek status login saat aplikasi pertama kali dimuat
  useEffect(() => {
    checkAuth()
      .then(response => {
        setUser(response.data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (username, password) => {
    const response = await apiLogin(username, password);
    setUser(response.data);
    
    // --- TAMBAHKAN NAVIGASI SETELAH LOGIN ---
    // Arahkan ke halaman yang terakhir dikunjungi sebelum redirect ke login,
    // atau ke halaman utama jika tidak ada.
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
    
    return response.data;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout gagal:", error);
      // Tetap lanjutkan proses logout di frontend
    } finally {
      setUser(null);
      // --- TAMBAHKAN NAVIGASI SETELAH LOGOUT ---
      navigate('/login');
    }
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
  };

  // Tampilkan loading jika sedang mengecek auth awal
  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            Memverifikasi sesi...
        </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};