// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { checkAuth } from '../api/apiService'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // 1. TANGKAP TOKEN DARI URL (Kiriman dari User App)
      const params = new URLSearchParams(window.location.search);
      const tokenFromUrl = params.get('token');

      if (tokenFromUrl) {
        localStorage.setItem('token', tokenFromUrl);
        // Hapus token dari URL biar bersih
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      // 2. CEK VALIDITAS TOKEN
      try {
        await checkAuth(); // Panggil backend
        // Kalau sukses, backend akan return user data (atau dihandle di apiService)
        // Kita set user manual atau panggil endpoint profile jika perlu
        setUser({ role: 'cashier', name: 'Kasir' }); // Atau ambil dari response checkAuth
      } catch (error) {
        // Kalau gagal/tidak ada token, lempar balik ke Login User
        window.location.href = 'http://localhost:5173/login';
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {!isLoading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);