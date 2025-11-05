import React from 'react';

// Fungsi helper untuk format Rupiah
const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

// Badge kecil untuk Tunai/Transfer
const PaymentBadge = ({ method }) => {
  const isCash = method === 'Tunai';
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        isCash
          ? 'bg-accent-orange/20 text-accent-orange' // Oren
          : 'bg-accent-blue/20 text-accent-blue' // Biru
      }`}
    >
      {method}
    </span>
  );
};

const TransactionTable = ({ transactions }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Detail Transaksi</h2>
        <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200">
          Cetak Laporan
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left">
          {/* Header Tabel */}
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-xs font-semibold uppercase text-gray-500">ID Pesanan</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase text-gray-500">Waktu</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase text-gray-500">Nama Stand</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase text-gray-500">Metode Bayar</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase text-gray-500 text-right">Total</th>
            </tr>
          </thead>
          
          {/* Body Tabel */}
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 text-sm font-medium text-gray-800">{tx.id}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{tx.waktu}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{tx.namaStand}</td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  <PaymentBadge method={tx.metodeBayar} />
                </td>
                <td className="py-4 px-4 text-sm font-semibold text-gray-800 text-right">
                  {formatRupiah(tx.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          Tidak ada transaksi yang cocok dengan filter.
        </div>
      )}
    </div>
  );
};

export default TransactionTable;