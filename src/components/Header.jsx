// src/components/Header.jsx

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
// Impor ikon baru dan hook useAuth
import { Rocket, LogOut, User } from 'lucide-react'; 
import { useAuth } from '../context/AuthContext'; // Sesuaikan path jika perlu

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
  // State untuk mengontrol menu dropdown
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Ambil user dan fungsi logout dari Context
  const { user, logout } = useAuth();

  const handleLogout = () => {
    setIsMenuOpen(false); // Tutup menu
    logout(); // Panggil fungsi logout dari context
  };
  
  // Ambil inisial, 'K' adalah fallback jika user tidak ada
  const userInitial = user ? user.username.charAt(0).toUpperCase() : 'K';

  return (
    <header className="bg-primary-blue shadow-lg"> 
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Kantinku */}
          <div className="flex items-center space-x-3">
            <span className="bg-white/10 p-2 rounded-lg">
              <Rocket size={20} className="text-white" /> 
            </span>
            <span className="text-white text-xl font-bold">Kantinku</span>
          </div>

          {/* Navigasi Halaman */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            <NavItem to="/">Dashboard</NavItem>
            <NavItem to="/pos">Kasir POS</NavItem>
            <NavItem to="/antrian">Antrian Konfirmasi</NavItem>
            <NavItem to="/laporan">Laporan Keuangan</NavItem>
          </div>

          {/* Tombol Akun dan Menu Dropdown */}
          <div className="relative">
            {/* Tombol Bulat Oranye */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-accent-orange h-8 w-8 rounded-full flex items-center justify-center text-primary-blue text-sm font-bold transition-transform duration-150 hover:scale-110"
            >
              {userInitial}
            </button>

            {/* Menu Dropdown (Muncul saat isMenuOpen true) */}
            {isMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
              >
                {/* Detail Akun Singkat */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-full text-gray-600">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {user.username}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Tombol Logout */}
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