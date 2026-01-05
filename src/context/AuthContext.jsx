// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { checkAuth, logout as logoutApi } from '../api/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getLoginUrl = () => {
    const baseUrl = window.location.origin;
    return window.location.hostname === 'localhost' 
      ? 'http://localhost:5173/login' 
      : `${baseUrl}/login`; // Sesuaikan jika login page ada di domain utama
  };

  useEffect(() => {
    const initAuth = async () => {
      // 1. Prioritas: Ambil token dari URL (Redirect dari login portal)
      const params = new URLSearchParams(window.location.search);
      const tokenFromUrl = params.get('token');
      
      let activeToken = null;

      if (tokenFromUrl) {
        activeToken = tokenFromUrl;
        sessionStorage.setItem('kasir_token', tokenFromUrl);
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

      // Set token ke state segera
      setToken(activeToken);

      try {
        // 3. Verifikasi token ke backend
        const response = await checkAuth();
        
        // Validasi struktur data sebelum set user
        if (response.data && response.data.user) {
          setUser(response.data.user);
        } else {
          throw new Error("Format user tidak valid dari API");
        }

      } catch (error) {
        console.error("Auth Failed:", error);
        sessionStorage.removeItem('kasir_token');
        sessionStorage.removeItem('kasir_user');
        setToken(null);
        setUser(null);
        // Biarkan ProtectedRoute yang menangani redirect
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
      sessionStorage.clear();
      setToken(null);
      setUser(null);
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
