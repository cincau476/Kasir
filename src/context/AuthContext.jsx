// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { checkAuth, logout as logoutApi } from '../api/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper untuk mendapatkan URL login yang benar sesuai environment
  const getLoginUrl = () => {
    return window.location.hostname === 'localhost' 
      ? 'http://localhost:5173/login' 
      : 'https://www.kantinku.com/login';
  };

  useEffect(() => {
    const initAuth = async () => {
      // 1. Tangkap Token dari URL (saat redirect dari portal utama)
      const params = new URLSearchParams(window.location.search);
      const tokenFromUrl = params.get('token');
      
      if (tokenFromUrl) {
        sessionStorage.setItem('kasir_token', tokenFromUrl);
        // Hapus query param agar URL bersih
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      // 2. Ambil token dari sessionStorage
      const storedToken = sessionStorage.getItem('kasir_token');
      
      if (!storedToken) {
        // Jangan redirect di sini, biarkan ProtectedRoute yang menangani
        setIsLoading(false);
        return;
      }

      setToken(storedToken);

      try {
        // 3. Verifikasi token ke backend
        const response = await checkAuth();
        setUser(response.data.user);
      } catch (error) {
        console.error("Auth Failed:", error);
        sessionStorage.removeItem('kasir_token');
        sessionStorage.removeItem('kasir_user');
        // Jika token tidak valid, baru kita lempar ke login
        window.location.href = getLoginUrl();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback((newToken, userData) => {
    sessionStorage.setItem('kasir_token', newToken);
    sessionStorage.setItem('kasir_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.warn("Logout server fail", err);
    } finally {
      sessionStorage.clear(); // Bersihkan semua sesi
      setToken(null);
      setUser(null);
      window.location.href = getLoginUrl();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoading, isAuthenticated: !!token }}>
      {!isLoading ? children : (
        <div className="flex h-screen items-center justify-center bg-gray-900 text-white font-medium">
            Memuat Sistem Kasir...
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
