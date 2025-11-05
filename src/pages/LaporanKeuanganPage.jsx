import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import FilterDropdown from '../components/FilterDropdown';
import TransactionTable from '../components/TransactionTable';
import { getLaporanKeuangan, getPosStands } from '../api/apiService';

// Ikon untuk kartu statistik
import { DollarSign, CreditCard, List } from 'lucide-react';

// Fungsi helper untuk format Rupiah
const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

// Opsi statis untuk filter Periode
const periodeOptions = [
  { value: 'hari-ini', label: 'Hari Ini' },
  { value: 'kemarin', label: 'Kemarin' },
  { value: '7-hari', label: '7 Hari Terakhir' },
  { value: 'kustom', label: 'Kustom' },
];

const LaporanKeuanganPage = () => {
  // State untuk data laporan
  const [stats, setStats] = useState({
    totalPendapatanTunai: 0,
    totalPendapatanTransfer: 0,
    totalTransaksi: 0,
  });
  const [transactions, setTransactions] = useState([]);
  
  // State untuk filter
  const [stands, setStands] = useState([]);
  const [selectedPeriode, setSelectedPeriode] = useState('hari-ini');
  const [selectedStand, setSelectedStand] = useState('semua');
  
  // State untuk UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Ambil daftar stand (untuk filter) saat halaman dimuat
  useEffect(() => {
    const fetchStands = async () => {
      try {
        const response = await getPosStands();
        // Buat opsi 'Semua Stand'
        const standOptions = [
          { value: 'semua', label: 'Semua Stand' },
          ...response.data.map(stand => ({ value: stand.id.toString(), label: stand.name }))
        ];
        setStands(standOptions);
      } catch (err) {
        console.error("Gagal memuat stands untuk filter:", err);
      }
    };
    fetchStands();
  }, []);

  // 2. Ambil data laporan setiap kali filter berubah
  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getLaporanKeuangan(selectedPeriode, selectedStand);
        
        setStats(response.data.stats);
        setTransactions(response.data.transactions);
      } catch (err) {
        setError("Gagal memuat data laporan.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    // Hanya jalankan jika 'stands' sudah selesai dimuat
    if (stands.length > 0) {
      fetchReport();
    }
  }, [selectedPeriode, selectedStand, stands]); // <-- Dijalankan ulang saat filter berubah

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Laporan Keuangan</h1>
      
      {/* Bagian 1: Filter */}
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

      {/* Tampilkan Loading/Error */}
      {loading && <div className="text-center p-10">Memuat laporan...</div>}
      {error && <div className="text-center text-red-500 p-10">{error}</div>}

      {/* Bagian 2 & 3: Tampilkan jika tidak loading DAN tidak error */}
      {!loading && !error && (
        <>
          {/* Kartu Statistik */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Pendapatan Tunai"
              value={formatRupiah(stats.totalPendapatanTunai)}
              icon={DollarSign}
              valueColor="text-accent-orange"
            />
            <StatCard
              title="Total Pendapatan Transfer"
              value={formatRupiah(stats.totalPendapatanTransfer)}
              icon={CreditCard}
              valueColor="text-gray-900" // Atau 'text-accent-blue'
            />
            <StatCard
              title="Total Transaksi"
              value={stats.totalTransaksi}
              icon={List}
              valueColor="text-gray-900"
            />
          </div>

          {/* Tabel Detail Transaksi */}
          <div>
            <TransactionTable transactions={transactions} />
          </div>
        </>
      )}
    </div>
  );
};

export default LaporanKeuanganPage;