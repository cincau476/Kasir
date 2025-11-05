import React, { useState, useEffect } from 'react';
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
    return <div className="text-center p-10">Memuat data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-10">{error}</div>;
  }

  if (!data) {
    return null;
  }
  
  // Data untuk 3 kartu statistik
  const stats = [
    {
      title: 'Total Konfirmasi Tunai Hari Ini',
      value: formatRupiah(data.stats_today.total_revenue_cash),
      icon: DollarSign,
      valueColor: 'text-accent-orange', // Warna Oren
    },
    {
      title: 'Jumlah Pesanan Dikonfirmasi',
      value: data.stats_today.total_orders_confirmed,
      icon: ShoppingCart,
      valueColor: 'text-gray-900',
    },
    {
      title: 'Pesanan Menunggu Konfirmasi',
      value: data.stats_today.pending_confirmation,
      icon: Clock,
      valueColor: 'text-gray-900',
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      
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
      <div>
        <TopStandChart data={data.stand_performance} />
      </div>
    </div>
  );
};

export default DashboardPage;