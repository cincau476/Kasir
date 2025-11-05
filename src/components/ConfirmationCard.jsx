import React from 'react';
// Impor semua ikon yang kita butuhkan
import { Building, MapPin, Phone } from 'lucide-react';

// Fungsi helper untuk format Rupiah
const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

const ConfirmationCard = ({ order, onConfirm, isLoading }) => {
  // Tentukan info lokasi berdasarkan data 'table'
  const location = order.table
    ? `Makan di tempat - Meja ${order.table.code}`
    : 'Takeaway';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
      <div className="p-6">
        {/* Header Kartu */}
        <h3 className="text-xl font-bold text-accent-orange">{order.references_code}</h3>
        <div className="flex items-center text-sm text-gray-600 mt-2">
          <Building size={14} className="mr-2" />
          <span>{order.tenant.name}</span>
        </div>
        
        {/* Info Lokasi & Kontak */}
        <div className="text-sm text-gray-600 mt-4 space-y-2">
          <div className="flex items-center">
            <MapPin size={14} className="mr-2" />
            <span>{location}</span>
          </div>
          <div className="flex items-center">
            <Phone size={14} className="mr-2" />
            <span>{order.customer.phone || '-'}</span>
          </div>
        </div>

        <hr className="my-4" />

        {/* Detail Pesanan */}
        <div>
          <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">Detail Pesanan:</h4>
          <div className="space-y-1 text-sm text-gray-700">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.name} x {item.qty}</span>
              </div>
            ))}
          </div>
        </div>
        
        <hr className="my-4" />

        {/* Total Harga */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Total Harga</span>
          <span className="text-2xl font-bold text-primary-blue">
            {formatRupiah(order.total)}
          </span>
        </div>
      </div>
      
      {/* Tombol Aksi (di luar padding p-6) */}
      <div className="mt-auto p-4 border-t bg-gray-50 rounded-b-xl">
        <button
          onClick={() => onConfirm(order.uuid)}
          disabled={isLoading}
          className="w-full bg-primary-blue text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-800 transition-colors disabled:bg-gray-400"
        >
          {isLoading ? 'Memproses...' : 'Konfirmasi Pembayaran'}
        </button>
      </div>
    </div>
  );
};

export default ConfirmationCard;