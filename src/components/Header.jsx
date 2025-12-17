// src/components/Header.jsx
import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom'; // Tambah 'Link' di sini
import { Rocket, LogOut, User, Menu, X } from 'lucide-react'; // Tambah icon Menu & X untuk mobile
import { useAuth } from '../context/AuthContext'; 

const NavItem = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
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
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Untuk Dropdown Profil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Untuk Menu Mobile
  const { user, logout } = useAuth(); 

  const handleLogout = () => {
    setIsMenuOpen(false);
    if (typeof logout === 'function') {
      logout(); 
    } else {
      localStorage.removeItem('token');
      window.location.href = 'http://localhost:5173/login';
    }
  };
  
  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : 'K';

  return (
    <header className="bg-primary-blue shadow-lg relative z-50"> 
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* 1. PERBAIKAN: Logo dibungkus Link agar bisa diklik ke Dashboard */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <span className="bg-white/10 p-2 rounded-lg">
              <Rocket size={20} className="text-white" /> 
            </span>
            <span className="text-white text-xl font-bold">Kantinku</span>
          </Link>

          {/* Navigasi Desktop (Hanya muncul di layar MD ke atas) */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            <NavItem to="/">Dashboard</NavItem>
            <NavItem to="/pos">Kasir POS</NavItem>
            <NavItem to="/antrian">Antrian</NavItem>
            <NavItem to="/laporan">Laporan</NavItem>
          </div>

          {/* Area Kanan: Tombol Mobile & Profil */}
          <div className="flex items-center gap-4">
            
            {/* Area Profil (Dropdown) */}
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-accent-orange h-8 w-8 rounded-full flex items-center justify-center text-primary-blue text-sm font-bold transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
              >
                {userInitial}
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                // 2. PERBAIKAN: Tambahkan z-50 pada dropdown agar selalu di paling atas
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
                  <div className="p-4 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {user?.username || 'Kasir'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.role || 'Staff'}
                    </p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-red-600 rounded-md hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      <span>Keluar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. PERBAIKAN: Tombol Hamburger untuk Mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white p-2"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* 4. PERBAIKAN: Menu Navigasi Mobile (Muncul di bawah header saat tombol ditekan) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-primary-blue border-t border-white/10 py-2 space-y-1">
            <NavItem to="/" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</NavItem>
            <NavItem to="/pos" onClick={() => setIsMobileMenuOpen(false)}>Kasir POS</NavItem>
            <NavItem to="/antrian" onClick={() => setIsMobileMenuOpen(false)}>Antrian Konfirmasi</NavItem>
            <NavItem to="/laporan" onClick={() => setIsMobileMenuOpen(false)}>Laporan Keuangan</NavItem>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;