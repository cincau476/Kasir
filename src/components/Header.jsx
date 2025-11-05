import React from 'react';
import { NavLink } from 'react-router-dom';
import { Rocket } from 'lucide-react'; 

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
  return (
    // 'bg-primary-blue' sekarang akan dikenali
    <header className="bg-primary-blue shadow-lg"> 
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center space-x-3">
            <span className="bg-white/10 p-2 rounded-lg">
              <Rocket size={20} className="text-white" /> 
            </span>
            <span className="text-white text-xl font-bold">Kantinku</span>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-2">
            <NavItem to="/">Dashboard</NavItem>
            <NavItem to="/pos">Kasir POS</NavItem>
            <NavItem to="/antrian">Antrian Konfirmasi</NavItem>
            <NavItem to="/laporan">Laporan Keuangan</NavItem>
          </div>

          <div className="flex items-center">
             {/* 'bg-accent-orange' sekarang akan dikenali */}
            <button className="bg-accent-orange h-8 w-8 rounded-full flex items-center justify-center text-primary-blue text-sm font-bold">
              K 
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;