// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { checkAuth, logout as logoutApi } from '../api/apiService'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi dinamis untuk mendapatkan URL Login (agar otomatis menyesuaikan VM/Lokal)
  const getLoginUrl = () => {
    // Jika di production (VM), arahkan ke kantinku.com/login
    // Jika di development, arahkan ke localhost:5173/login
    return window.location.hostname === 'localhost' 
      ? 'http://localhost:5173/login' 
      : 'https://kantinku.com/login';
  };

  useEffect(() => {
    const initAuth = async () => {
      // 1. Tangkap Token URL
      const params = new URLSearchParams(window.location.search);
      const tokenFromUrl = params.get('token');
      if (tokenFromUrl) {
        localStorage.setItem('token', tokenFromUrl);
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      // 2. Cek Validitas
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = getLoginUrl();
        return;
      }

      try {
        const response = await checkAuth(); 
        setUser(response.data.user); 
      } catch (error) {
        console.error("Auth Failed:", error);
        localStorage.removeItem('token');
        window.location.href = getLoginUrl();
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const logout = async () => {
    try {
      await logoutApi(); 
    } catch (err) {
      console.warn("Logout server fail", err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      // Menggunakan URL dinamis
      window.location.href = getLoginUrl();
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {!isLoading ? children : (
        <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
            Memuat Sistem...
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);