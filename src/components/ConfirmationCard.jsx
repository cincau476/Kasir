import React from 'react';
import { Building, MapPin, Phone, Hash } from 'lucide-react'; // <-- 1. Tambahkan ikon Hash

const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

const ConfirmationCard = ({ order, onConfirm, isLoading }) => {
  const location = order.table ? `Meja ${order.table.code}` : 'Takeaway';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
      <div className="p-6">
        {/* Header: PIN Kasir & Referensi */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{order.references_code}</h3>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Building size={12} className="mr-1" />
              <span>{order.tenant.name}</span>
            </div>
          </div>
          {/* PIN Kasir */}
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase">PIN Kasir</p>
            <p className="text-2xl font-black text-orange-600 tracking-widest">{order.cashier_pin || "-"}</p>
          </div>
        </div>
        
        {/* Info Lokasi & Kontak */}
        <div className="text-sm text-gray-600 space-y-2">
          <div className="flex items-center">
            <MapPin size={14} className="mr-2 text-gray-400" />
            <span>{location}</span>
          </div>
          
          {/* PERBAIKAN: Hanya muncul jika ada nomor HP */}
          {order.customer?.phone && (
            <div className="flex items-center">
              <Phone size={14} className="mr-2 text-gray-400" />
              <span>{order.customer.phone}</span>
            </div>
          )}
        </div>

        <hr className="my-4" />

        {/* Detail Pesanan */}
        <div>
          <h4 className="text-xs font-semibold uppercase text-gray-400 mb-3">Item Pesanan:</h4>
          <div className="space-y-2 text-sm text-gray-700">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-start">
                <span className="flex-1">
                  {/* PERBAIKAN: Gunakan item.menu_item.name */}
                  <span className="font-bold">{item.qty}x</span> {item.menu_item?.name || "Menu"}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <hr className="my-4" />

        {/* Total Harga */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Total</span>
          <span className="text-xl font-bold text-blue-600">
            {formatRupiah(order.total)}
          </span>
        </div>
      </div>
      
      <div className="mt-auto p-4 border-t bg-gray-50 rounded-b-xl">
        <button
          onClick={() => onConfirm(order.uuid)}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {isLoading ? 'Memproses...' : 'Konfirmasi Pembayaran'}
        </button>
      </div>
    </div>
  );
};

export default ConfirmationCard;
