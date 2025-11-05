import React from 'react';
import { Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';

// Fungsi untuk format Rupiah
const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

const CartItem = ({ item, onUpdateQty, onRemoveItem }) => (
  <div className="flex items-center justify-between py-4 border-b">
    <div>
      <h4 className="font-semibold text-gray-800">{item.name}</h4>
      <div className="flex items-center space-x-2 mt-2">
        <button 
          onClick={() => onUpdateQty(item.id, item.qty - 1)}
          className="p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
        >
          <Minus size={14} />
        </button>
        <span className="w-8 text-center font-medium">{item.qty}</span>
        <button 
          onClick={() => onUpdateQty(item.id, item.qty + 1)}
          className="p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
    <div className="text-right">
      <p className="font-semibold text-gray-700">{formatRupiah(item.price * item.qty)}</p>
      <button 
        onClick={() => onRemoveItem(item.id)}
        className="text-red-500 hover:text-red-700 mt-2"
      >
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);

const Cart = ({ items, onUpdateQty, onRemoveItem, onSubmit, loadingSubmit }) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <ShoppingCart size={20} className="mr-2 text-primary-blue" />
        Keranjang
      </h2>
      
      {items.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">Keranjang masih kosong</p>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto">
          {items.map(item => (
            <CartItem 
              key={item.id} 
              item={item} 
              onUpdateQty={onUpdateQty} 
              onRemoveItem={onRemoveItem} 
            />
          ))}
        </div>
      )}
      
      <div className="border-t pt-6 mt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold text-gray-800">TOTAL</span>
          <span className="text-2xl font-bold text-accent-orange">
            {formatRupiah(total)}
          </span>
        </div>
        <button
          onClick={onSubmit}
          disabled={items.length === 0 || loadingSubmit}
          className="w-full bg-primary-blue text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-800 transition-colors disabled:bg-gray-400"
        >
          {loadingSubmit ? 'Memproses...' : 'Buat Pesanan & Bayar Tunai'}
        </button>
      </div>
    </div>
  );
};

export default Cart;