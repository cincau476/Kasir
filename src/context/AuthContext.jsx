// src/context/AuthContext.jsx (Portal Kasir)
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Cek token dari URL terlebih dahulu (untuk handle redirect)
  const queryParams = new URLSearchParams(window.location.search);
  const tokenFromUrl = queryParams.get('token');
  if (tokenFromUrl) {
    sessionStorage.setItem('kasir_token', tokenFromUrl);
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  const [token, setToken] = useState(sessionStorage.getItem('kasir_token'));
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('kasir_user')));

  const login = useCallback((newToken, userData) => {
    sessionStorage.setItem('kasir_token', newToken);
    sessionStorage.setItem('kasir_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  }, []); 

  const logout = useCallback(() => {
    sessionStorage.removeItem('kasir_token');
    sessionStorage.removeItem('kasir_user');
    setToken(null);
    setUser(null);
    window.location.href = 'https://www.kantinku.com/login'; 
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
