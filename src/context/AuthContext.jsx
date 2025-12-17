// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
// Import fungsi logout dari API service
import { checkAuth, logout as logoutApi } from '../api/apiService'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
        window.location.href = 'http://localhost:5173/login';
        return;
      }

      try {
        const response = await checkAuth(); 
        setUser(response.data.user); 
      } catch (error) {
        console.error("Auth Failed:", error);
        localStorage.removeItem('token');
        window.location.href = 'http://localhost:5173/login';
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  // --- FUNGSI LOGOUT (Wajib ada!) ---
  const logout = async () => {
    try {
      await logoutApi(); // Panggil API backend
    } catch (err) {
      console.warn("Logout server fail", err);
    } finally {
      // Selalu bersihkan lokal data & redirect
      localStorage.removeItem('token');
      setUser(null);
      window.location.href = 'http://localhost:5173/login';
    }
  };

  return (
    // Masukkan 'logout' ke dalam value Provider
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {!isLoading ? children : (
        <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
            Memuat Sistem Kasir...
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);