// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { checkAuth, logout as logoutApi } from '../api/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // URL portal login terpusat
  const getLoginUrl = () => {
    const baseUrl = window.location.origin;
    return window.location.hostname === 'localhost' 
      ? 'http://localhost:5173/login' 
      : `${baseUrl}/login`; 
  };

  useEffect(() => {
    const initAuth = async () => {
      // 1. Prioritas: Ambil token dari URL (Redirect dari login portal / SSO)
      const params = new URLSearchParams(window.location.search);
      const tokenFromUrl = params.get('token');
      
      let activeToken = null;

      if (tokenFromUrl) {
        activeToken = tokenFromUrl;
        // SECURE CODING: Simpan dengan nama standar 'access_token' di localStorage
        // agar terbaca oleh Axios Interceptor di api.js
        localStorage.setItem('access_token', tokenFromUrl);
        
        // Bersihkan token dari URL agar tidak bocor jika di-copy-paste (Shoulder Surfing mitigation)
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        // 2. Fallback: Ambil dari localStorage (bukan sessionStorage)
        activeToken = localStorage.getItem('access_token');
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
        // Interceptor di api.js akan otomatis menyisipkan: Authorization: Bearer <token>
        // dan melakukan Silent Refresh jika token ternyata sudah expired.
        const response = await checkAuth();
        
        // Validasi struktur data sebelum set user
        if (response.data && response.data.user) {
          setUser(response.data.user);
          // Opsional: Simpan data user ke sessionStorage untuk caching UI
          sessionStorage.setItem('kasir_user', JSON.stringify(response.data.user));
        } else if (response.user) { 
          // Fallback jika API merespons langsung tanpa bungkus .data
          setUser(response.user);
        } else {
          throw new Error("Format user tidak valid dari API");
        }

      } catch (error) {
        console.error("Auth Failed:", error);
        // SECURE CODING: Bersihkan token standar jika otentikasi gagal total
        localStorage.removeItem('access_token');
        sessionStorage.removeItem('kasir_user');
        setToken(null);
        setUser(null);
        // Biarkan ProtectedRoute yang menangani redirect ke halaman Login
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Fungsi Login untuk dipanggil dari form login manual (jika tidak dari portal SSO)
  const login = useCallback((newToken, userData) => {
    // SECURE CODING: Simpan Access Token di localStorage agar tab browser baru tetap login
    localStorage.setItem('access_token', newToken);
    sessionStorage.setItem('kasir_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      // Memanggil endpoint logout di Django untuk me-revoke token di database
      await logoutApi();
    } catch (err) {
      console.warn("Logout server fail", err);
    } finally {
      // SECURE CODING: Bersihkan semua jejak sesi
      localStorage.removeItem('access_token');
      sessionStorage.clear();
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