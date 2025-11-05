import React from 'react';

// Fungsi untuk format Rupiah
const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

const MenuGrid = ({ menus, onAddItem }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      {/* Kolom ini akan menampilkan 2 menu per baris */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-8">
        {menus.map((item) => {
          const isOutOfStock = item.stock === 0;
          return (
            <div
              key={item.id}
              onClick={() => !isOutOfStock && onAddItem(item)} // Hanya bisa diklik jika stok ada
              className={`group cursor-pointer ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary-blue transition-colors">
                {item.name}
              </h3>
              <p className="text-accent-orange font-bold mt-1">
                {formatRupiah(item.price)}
              </p>
              <p className={`text-sm mt-1 ${isOutOfStock ? 'text-red-500' : 'text-gray-500'}`}>
                Stok: {item.stock}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MenuGrid;