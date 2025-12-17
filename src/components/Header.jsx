// src/components/Header.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Rocket, LogOut, User } from 'lucide-react'; 
import { useAuth } from '../context/AuthContext'; 

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? 'bg-white/10 text-white'
          : 'text-gray-300 hover:bg-white/5 hover:text-white'
      }`
    }
  >
    {children}
  </NavLink>
);

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth(); // Ambil user & logout dari Context

  const handleLogout = () => {
    setIsMenuOpen(false); // Tutup dropdown
    
    // Cek apakah fungsi logout tersedia sebelum dipanggil
    if (typeof logout === 'function') {
      logout(); 
    } else {
      console.error("Fungsi logout belum tersedia di AuthContext");
      // Fallback darurat: hapus token manual & redirect
      localStorage.removeItem('token');
      window.location.href = 'http://localhost:5173/login';
    }
  };
  
  // Fallback inisial nama jika user belum terload
  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : 'K';

  return (
    // PERBAIKAN UTAMA: 'relative z-50' agar menu tidak tertutup konten lain
    <header className="bg-primary-blue shadow-lg relative z-50"> 
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Kantinku */}
          <div className="flex items-center space-x-3">
            <span className="bg-white/10 p-2 rounded-lg">
              <Rocket size={20} className="text-white" /> 
            </span>
            <span className="text-white text-xl font-bold">Kantinku</span>
          </div>

          {/* Navigasi Halaman (Tengah) */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            <NavItem to="/">Dashboard</NavItem>
            <NavItem to="/pos">Kasir POS</NavItem>
            <NavItem to="/antrian">Antrian Konfirmasi</NavItem>
            <NavItem to="/laporan">Laporan Keuangan</NavItem>
          </div>

          {/* Area Akun (Kanan) */}
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-accent-orange h-8 w-8 rounded-full flex items-center justify-center text-primary-blue text-sm font-bold transition-transform duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-blue focus:ring-white"
            >
              {userInitial}
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-full text-gray-600">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {user?.username || 'Kasir'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.role || 'Staff'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-red-600 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Keluar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;