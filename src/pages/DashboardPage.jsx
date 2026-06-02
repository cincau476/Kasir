// src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import MfaSetupModal from '../components/MfaSetupModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import StatCard from '../components/StatCard';
import TopStandChart from '../components/TopStandChart';
import { getKasirDashboardSummary } from '../api/apiService';

// Impor ikon dari Lucide
import { DollarSign, ShoppingCart, Clock } from 'lucide-react';

// Fungsi untuk format Rupiah
const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

const DashboardPage = () => {
  // === State untuk MFA & Autentikasi ===
  const { user } = useAuth();
  const [isMfaOpen, setIsMfaOpen] = useState(false);

  // === State untuk Data Dashboard ===
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getKasirDashboardSummary();
        setData(response.data);
      } catch (err) {
        setError("Gagal memuat data dashboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-10 font-medium">{error}</div>;
  }

  if (!data) {
    return null;
  }
  
  // Data untuk 3 kartu statistik
  const stats = [
    {
      title: 'Total Konfirmasi Tunai Hari Ini',
      value: formatRupiah(data?.stats_today?.total_revenue_cash || 0),
      icon: DollarSign,
      valueColor: 'text-blue-600', 
    },
    {
      title: 'Jumlah Pesanan Dikonfirmasi',
      value: data?.stats_today?.completed || 0,
      icon: ShoppingCart,
      valueColor: 'text-gray-900',
    },
    {
      title: 'Pesanan Menunggu Konfirmasi',
      value: data?.stats_today?.pending || 0,
      icon: Clock,
      valueColor: 'text-gray-900',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* HEADER BESERTA TOMBOL MFA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        
        {/* Tombol Setup MFA Dinamis */}
        {user && (
          <button
            onClick={() => setIsMfaOpen(true)}
            className={`flex items-center gap-2 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all shadow-sm border ${
              user.is_mfa_enabled
                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:shadow-green-500/20'
                : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:shadow-red-500/20'
            }`}
          >
            {user.is_mfa_enabled ? '✅ MFA Aktif (Reset)' : '⚠️ Aktifkan MFA'}
          </button>
        )}
      </div>
      
      {/* Bagian 1: Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            valueColor={stat.valueColor}
          />
        ))}
      </div>
      
      {/* Bagian 2: Chart Stand Terlaris */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <TopStandChart data={data.stand_performance} />
      </div>

      {/* MODAL SETUP MFA */}
      <MfaSetupModal 
        isOpen={isMfaOpen} 
        onClose={() => setIsMfaOpen(false)} 
        onSuccess={() => window.location.reload()} 
      />

    </div>
  );
};

export default DashboardPage;
