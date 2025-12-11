// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

// Hapus 'logout' dari import agar tidak error SyntaxError
import { checkAuth, login as apiLogin } from '../api/apiService'; 

const AuthContext = createContext(null);

// URL Login Customer (Port 5173)
const CUSTOMER_LOGIN_URL = 'http://localhost:5173/login';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        setIsLoading(true);
        // 1. Cek ke backend: "Siapa saya?"
        const response = await checkAuth();
        const userData = response.data.user;

        // 2. Validasi Role: Pastikan bukan customer biasa
        if (userData.role === 'customer') {
             throw new Error("Customer tidak boleh masuk sini");
        }

        // 3. Sukses, simpan data user
        setUser(userData);
      } catch (error) {
        console.warn("Belum login atau sesi habis, redirecting...", error);
        // 4. Jika gagal, lempar ke Login Customer
        window.location.href = CUSTOMER_LOGIN_URL;
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = async (username, password) => {
    const response = await apiLogin(username, password);
    setUser(response.data);
    return response.data;
  };

  const logout = async () => {
    // --- MODIFIKASI: Hapus call ke Backend ---
    // Kita hapus 'await apiLogout()' untuk menghindari error di api.js
    
    // Langsung hapus user di state frontend
    setUser(null);
    
    // Redirect kembali ke login customer
    window.location.href = CUSTOMER_LOGIN_URL;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {!isLoading ? children : (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <p className="text-gray-500 font-semibold animate-pulse">Memuat Kasir...</p>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);