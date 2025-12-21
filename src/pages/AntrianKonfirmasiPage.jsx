import React, { useState, useEffect } from 'react';
import ConfirmationCard from '../components/ConfirmationCard';
import { getAwaitingCashOrders, confirmCashPaymentApi } from '../api/apiService';
import { Clock, Search } from 'lucide-react'; // <-- 1. Impor ikon Search

const AntrianKonfirmasiPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- 2. Tambahkan state baru untuk search ---
  const [searchTerm, setSearchTerm] = useState('');
  // --- ------------------------------------ ---
  
  const [loadingOrders, setLoadingOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getAwaitingCashOrders();
        setOrders(response.data);
      } catch (err) {
        setError("Gagal memuat antrian.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleConfirm = async (orderUuid) => {
    setLoadingOrders(prev => [...prev, orderUuid]);
    
    try {
      await confirmCashPaymentApi(orderUuid);
      // Sukses: Hapus dari list
      setOrders(prevOrders => prevOrders.filter(o => o.uuid !== orderUuid));
      alert("Pembayaran berhasil dikonfirmasi!"); // Feedback sukses
      
    } catch (err) {
      console.error(err);
      
      // Tangkap pesan error dari backend
      const errorMessage = err.response?.data?.detail || "Gagal mengonfirmasi pesanan.";
      alert(`Gagal: ${errorMessage}`);

      // Jika errornya karena Kadaluarsa atau Sudah Dibayar, hapus saja dari tampilan
      if (err.response?.status === 400) {
         // Opsional: Hapus kartu dari layar agar kasir tidak bingung
         setOrders(prevOrders => prevOrders.filter(o => o.uuid !== orderUuid));
      }
    } finally {
      setLoadingOrders(prev => prev.filter(id => id !== orderUuid));
    }
  };
  
  // --- 3. Logika untuk memfilter pesanan ---
  const filteredOrders = orders.filter(order =>
    order.references_code.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // --- ------------------------------------ ---

  if (loading) {
    return <div className="text-center p-10">Memuat antrian...</div>;
  }
  
  if (error) {
    return <div className="text-center text-red-500 p-10">{error}</div>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Antrian Konfirmasi</h1>
        
        {/* --- 4. Tambahkan Search Bar di sini --- */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Cari berdasarkan Kode Pesanan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
          />
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
        {/* --- ----------------------------- --- */}
        
        <span className="flex items-center bg-blue-100 text-accent-blue text-sm font-semibold px-4 py-2 rounded-full">
          <Clock size={16} className="mr-2" />
          {/* Ubah ini untuk menampilkan jumlah hasil filter */}
          {filteredOrders.length} Pesanan Menunggu
        </span>
      </div>

      {/* Tampilkan jika antrian kosong ATAU filter tidak menemukan hasil */}
      {filteredOrders.length === 0 ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-sm border">
          <p className="text-gray-500">
            {orders.length === 0
              ? "Tidak ada antrian konfirmasi tunai saat ini."
              : "Kode pesanan tidak ditemukan."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* --- 5. Gunakan 'filteredOrders' untuk me-render --- */}
          {filteredOrders.map((order) => (
            <ConfirmationCard
              key={order.uuid}
              order={order}
              onConfirm={handleConfirm}
              isLoading={loadingOrders.includes(order.uuid)}
            />
          ))}
          {/* --- ----------------------------------------- --- */}
        </div>
      )}
    </div>
  );
};

export default AntrianKonfirmasiPage;