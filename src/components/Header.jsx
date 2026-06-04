// src/components/Header.jsx
import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom'; 
import { Rocket, LogOut, Menu, X } from 'lucide-react'; 
import { useAuth } from '../context/AuthContext'; 
import { logout as logoutApi } from '../api/apiService'; // Impor API logout

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
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const { user } = useAuth(); 

  const handleLogout = async () => {
    setIsMenuOpen(false);
    
    // 1. Panggil API backend untuk menghapus token (opsional, error diabaikan)
    try {
      await logoutApi();
    } catch (e) {
      console.warn("Logout API failed, continuing local cleanup");
    }

    // 2. Pembersihan Total: Hapus semua jejak sesi Kasir
    sessionStorage.clear(); // Bersihkan semua sessionStorage
    localStorage.removeItem('kasir_token');
    localStorage.removeItem('kasir_user');
    localStorage.removeItem('access_token'); // Hapus juga access_token jika ada
    
    // 3. Paksa pindah ke halaman login dinamis berdasarkan IP/Domain
    window.location.href = `${window.location.origin}/login`;
  };
  
  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : 'K';

  return (
    // PERBAIKAN 1: Tambahkan z-[9999] agar Header selalu di atas semua konten page
    <header className="bg-primary-blue shadow-lg relative z-[9999]"> 
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <span className="bg-white/10 p-2 rounded-lg">
              <Rocket size={20} className="text-white" /> 
            </span>
            <span className="text-white text-xl font-bold">Kantinku</span>
          </Link>

          {/* Navigasi Desktop */}
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
                className="bg-accent-orange h-8 w-8 rounded-full flex items-center justify-center text-primary-blue text-sm font-bold transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white relative z-[9999]"
              >
                {userInitial}
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                // PERBAIKAN 2: Tambahkan z-[99999] pada menu dropdown agar tidak tertutup aset page
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-[99999] animate-in fade-in zoom-in duration-200">
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
                      className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-red-600 rounded-md hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      <span>Keluar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tombol Hamburger untuk Mobile */}
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

        {/* Menu Navigasi Mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-primary-blue border-t border-white/10 py-2 space-y-1 relative z-[9999]">
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
