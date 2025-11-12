// Nama File: src/pages/LoginPage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { loginApi } from '../api/apiService'; // <-- Impor fungsi login Anda nanti

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Di sini Anda akan mengambil username/password dari form
    
    try {
      // --- INI HANYA SIMULASI ---
      // Ganti bagian ini dengan panggilan API login Anda yang sebenarnya
      // const response = await loginApi(username, password);
      // localStorage.setItem('authToken', response.data.token);
      
      // Simulasi sukses login, langsung set token:
      console.log("Simulasi Login Sukses!");
      localStorage.setItem('authToken', 'ini-adalah-token-simulasi-anda');
      // --- AKHIR SIMULASI ---

      // Arahkan ke halaman utama setelah login sukses
      navigate('/');

    } catch (err) {
      console.error("Login Gagal:", err);
      alert("Login Gagal! (Cek console untuk detail)");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Login Kasir</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label>Username</label>
            <input type="text" placeholder="username" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label>Password</label>
            <input type="password" placeholder="password" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <button 
            type="submit"
            className="w-full bg-primary-blue text-white font-semibold py-2 rounded-lg"
          >
            Login (Simulasi)
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;