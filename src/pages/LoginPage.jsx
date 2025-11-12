// src/pages/LoginPage.jsx
// (Berdasarkan file LoginPage.jsx Anda)

import React, { useState } from 'react'; // <-- TAMBAHKAN useState
import { useNavigate } from 'react-router-dom';
// --- TAMBAHKAN IMPOR INI ---
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  // --- TAMBAHKAN INI ---
  const { login } = useAuth();

  // --- TAMBAHKAN STATE UNTUK FORM ---
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // --- PERUBAHAN: Panggil 'login' dari context ---
      await login(username, password);
      
      // Hapus simulasi localStorage
      // localStorage.setItem('authToken', 'ini-adalah-token-simulasi-anda');
      
      // Arahkan ke halaman utama setelah login sukses
      navigate('/');

    } catch (err) {
      console.error("Login Gagal:", err);
      // Tampilkan error dari server jika ada
      setError(err.response?.data?.detail || "Login Gagal! Cek username/password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Login Kasir</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label>Username</label>
            <input 
              type="text" 
              placeholder="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg" 
            />
          </div>
          <div>
            <label>Password</label>
            <input 
              type="password" 
              placeholder="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg" 
            />
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary-blue text-white font-semibold py-2 rounded-lg disabled:bg-gray-400"
          >
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;