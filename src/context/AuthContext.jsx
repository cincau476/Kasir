// src/context/AuthContext.jsx (Portal Kasir)
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Ambil data dengan key khusus kasir
  const initialToken = localStorage.getItem('kasir_token');
  const initialUser = localStorage.getItem('kasir_user') 
    ? JSON.parse(localStorage.getItem('kasir_user')) 
    : null;

  const [token, setToken] = useState(initialToken);
  const [user, setUser] = useState(initialUser);

  // LOGIN: Simpan data ke state dan localStorage dengan key khusus
  const login = useCallback((newToken, userData) => {
    localStorage.setItem('kasir_token', newToken); // MENGGUNAKAN kasir_token
    localStorage.setItem('kasir_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  }, []); 

  // LOGOUT: Hapus data spesifik kasir
  const logout = useCallback(() => {
    localStorage.removeItem('kasir_token'); // HAPUS kasir_token
    localStorage.removeItem('kasir_user');
    setToken(null);
    setUser(null);
    
    // Arahkan ke domain utama
    window.location.href = 'https://www.kantinku.com/login'; 
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
