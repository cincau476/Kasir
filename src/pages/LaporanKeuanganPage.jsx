// src/pages/LaporanKeuanganPage.jsx
import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import FilterDropdown from '../components/FilterDropdown';
import TransactionTable from '../components/TransactionTable';
import { getLaporanKeuangan, getPosStands } from '../api/apiService';
import { DollarSign, CreditCard, List } from 'lucide-react';

const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value || 0); // Tambahkan || 0 agar aman
};

const periodeOptions = [
  { value: 'hari-ini', label: 'Hari Ini' },
  { value: 'kemarin', label: 'Kemarin' },
  { value: '7-hari', label: '7 Hari Terakhir' },
  { value: 'kustom', label: 'Kustom' },
];

const LaporanKeuanganPage = () => {
  // Inisialisasi state dengan nilai default 0
  const [stats, setStats] = useState({
    totalPendapatanTunai: 0,
    totalPendapatanTransfer: 0,
    totalTransaksi: 0,
  });
  const [transactions, setTransactions] = useState([]);
  
  const [stands, setStands] = useState([]);
  const [selectedPeriode, setSelectedPeriode] = useState('hari-ini');
  const [selectedStand, setSelectedStand] = useState('semua');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Load Stands
  useEffect(() => {
    const fetchStands = async () => {
      try {
        const response = await getPosStands();
        // Cek data stands
        const standData = response.data || []; 
        const standOptions = [
          { value: 'semua', label: 'Semua Stand' },
          ...standData.map(stand => ({ value: stand.id.toString(), label: stand.name }))
        ];
        setStands(standOptions);
      } catch (err) {
        console.error("Gagal memuat stands:", err);
      }
    };
    fetchStands();
  }, []);

  // 2. Load Report Data
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Panggil API
        const response = await getLaporanKeuangan({
          periode: selectedPeriode,
          stand: selectedStand
        });
        
        // --- PERBAIKAN PENTING DI SINI (SAFETY CHECK) ---
        if (response.data && response.data.stats) {
            setStats(response.data.stats);
        } else {
            console.warn("Data stats kosong dari backend, menggunakan default 0");
            // Kembalikan ke 0 jika data kosong
            setStats({
                totalPendapatanTunai: 0,
                totalPendapatanTransfer: 0,
                totalTransaksi: 0,
            });
        }

        if (response.data && response.data.transactions) {
            setTransactions(response.data.transactions);
        } else {
            setTransactions([]);
        }
        // ------------------------------------------------

      } catch (err) {
        console.error("Error Fetch Report:", err);
        setError("Gagal memuat data laporan. Pastikan server backend berjalan.");
      } finally {
        setLoading(false);
      }
    };
    
    if (stands.length > 0) {
      fetchReport();
    }
  }, [selectedPeriode, selectedStand, stands]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Laporan Keuangan</h1>
      
      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <FilterDropdown
            label="Periode"
            options={periodeOptions}
            value={selectedPeriode}
            onChange={setSelectedPeriode}
          />
          <FilterDropdown
            label="Stand"
            options={stands}
            value={selectedStand}
            onChange={setSelectedStand}
          />
        </div>
      </div>

      {loading && <div className="text-center p-10">Memuat laporan...</div>}
      {error && <div className="text-center text-red-500 p-10">{error}</div>}

      {!loading && !error && (
        <>
          {/* Kartu Statistik dengan Optional Chaining (?.) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Pendapatan Tunai"
              // Pakai ?. dan || 0 agar tidak error jika stats undefined
              value={formatRupiah(stats?.totalPendapatanTunai || 0)}
              icon={DollarSign}
              valueColor="text-accent-orange"
            />
            <StatCard
              title="Total Pendapatan Transfer"
              value={formatRupiah(stats?.totalPendapatanTransfer || 0)}
              icon={CreditCard}
              valueColor="text-gray-900"
            />
            <StatCard
              title="Total Transaksi"
              value={stats?.totalTransaksi || 0}
              icon={List}
              valueColor="text-gray-900"
            />
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Riwayat Transaksi</h2>
            <TransactionTable transactions={transactions || []} />
          </div>
        </>
      )}
    </div>
  );
};

export default LaporanKeuanganPage;