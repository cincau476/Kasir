// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
// Pastikan path ini benar menunjuk ke apiService.js Anda
import { checkAuth, login as apiLogin, logout as apiLogout } from '../api/apiService';

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Untuk loading awal

  // Cek status login (via cookie) saat aplikasi pertama kali dimuat
  useEffect(() => {
    checkAuth()
      .then(response => {
        setUser(response.data); // Jika berhasil, user login
      })
      .catch(() => {
        setUser(null); // Jika gagal (cookie tidak ada/valid), user tidak login
      })
      .finally(() => {
        setIsLoading(false); // Selesai loading
      });
  }, []);

  const login = async (username, password) => {
    const response = await apiLogin(username, password);
    setUser(response.data); // Simpan data user di state
    return response.data;
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
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