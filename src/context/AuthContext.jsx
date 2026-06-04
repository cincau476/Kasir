// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { checkAuth, logout as logoutApi } from '../api/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // URL portal login terpusat (Dinamis menyesuaikan IP/Domain)
  const getLoginUrl = () => {
    return `${window.location.origin}/login`; 
  };

  useEffect(() => {
    const initAuth = async () => {
      // 1. Prioritas: Ambil token dari URL (Redirect dari login portal / SSO)
      const params = new URLSearchParams(window.location.search);
      const tokenFromUrl = params.get('token');
      
      let activeToken = null;

      if (tokenFromUrl) {
        activeToken = tokenFromUrl;
        // PERBAIKAN 1: Gunakan nama 'kasir_token' dan simpan di sessionStorage agar sinkron dengan api.js
        sessionStorage.setItem('kasir_token', tokenFromUrl);
        
        // Bersihkan token dari URL agar tidak bocor
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        // 2. Fallback: Ambil dari sessionStorage
        activeToken = sessionStorage.getItem('kasir_token');
      }

      // Jika sama sekali tidak ada token
      if (!activeToken) {
        setToken(null);
        setUser(null);
        setIsLoading(false);
        return;
      }

      setToken(activeToken);

      try {
        // 3. Verifikasi token ke backend
        const response = await checkAuth();
        
        if (response.data && response.data.user) {
          setUser(response.data.user);
          sessionStorage.setItem('kasir_user', JSON.stringify(response.data.user));
        } else if (response.user) { 
          setUser(response.user);
          sessionStorage.setItem('kasir_user', JSON.stringify(response.user));
        } else {
          throw new Error("Format user tidak valid dari API");
        }

      } catch (error) {
        console.error("Auth Failed:", error);
        // Bersihkan sesi jika otentikasi gagal
        sessionStorage.removeItem('kasir_token');
        sessionStorage.removeItem('kasir_user');
        localStorage.removeItem('kasir_token');
        setToken(null);
        setUser(null);
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
      // PERBAIKAN 2: Pastikan yang dihapus adalah kunci yang tepat ('kasir_token')
      sessionStorage.removeItem('kasir_token');
      sessionStorage.removeItem('kasir_user');
      localStorage.removeItem('kasir_token');
      localStorage.removeItem('kasir_user');
      
      setToken(null);
      setUser(null);
      
      // Tendang ke halaman login utama
      window.location.href = getLoginUrl();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoading, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
