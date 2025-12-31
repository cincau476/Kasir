// src/pages/KasirPosPage.jsx
import React, { useState, useEffect } from 'react';
// import Layout from '../components/Layout'; // 1. HAPUS IMPORT INI
import StandSelector from '../components/StandSelector';
import MenuGrid from '../components/MenuGrid';
import Cart from '../components/Cart';
import { getPosStands, getPosMenusByStandId, createPosCashOrder } from '../api/apiService';
import { FiShoppingCart, FiChevronUp, FiChevronDown, FiLoader } from 'react-icons/fi';

const KasirPosPage = () => {
  // --- STATE DATA ---
  const [stands, setStands] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedStandId, setSelectedStandId] = useState(null);
  const [cart, setCart] = useState([]);
  
  // --- STATE UI & RESPONSIVE ---
  const [loadingStands, setLoadingStands] = useState(true);
  const [loadingMenus, setLoadingMenus] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isCartExpanded, setIsCartExpanded] = useState(false);

  // 1. Ambil daftar stand
  useEffect(() => {
    const fetchStands = async () => {
      try {
        setLoadingStands(true);
        const response = await getPosStands();
        setStands(response.data);
        if (response.data.length > 0) {
          setSelectedStandId(response.data[0].id);
        }
      } catch (err) {
        console.error("Gagal memuat stand:", err);
      } finally {
        setLoadingStands(false);
      }
    };
    fetchStands();
  }, []);

  // 2. Ambil menu setiap kali stand berubah
  useEffect(() => {
    if (!selectedStandId) return;
    const fetchMenus = async () => {
      try {
        setLoadingMenus(true);
        const response = await getPosMenusByStandId(selectedStandId);
        setMenus(response.data);
      } catch (err) {
        console.error("Gagal memuat menu:", err);
        setMenus([]);
      } finally {
        setLoadingMenus(false);
      }
    };
    fetchMenus();
  }, [selectedStandId]);

  // --- LOGIKA KERANJANG ---
  const handleAddItemToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, qty: cartItem.qty + 1 } : cartItem
        );
      }
      return [...prevCart, { ...item, qty: 1 }];
    });
  };

  const handleUpdateQty = (itemId, newQty) => {
    if (newQty <= 0) {
      setCart((prevCart) => prevCart.filter(item => item.id !== itemId));
      return;
    }
    setCart((prevCart) =>
      prevCart.map(item => item.id === itemId ? { ...item, qty: newQty } : item)
    );
  };

  const handleRemoveItem = (itemId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== itemId));
  };

  const handleSubmitOrder = async () => {
    if (cart.length === 0) return;
    setLoadingSubmit(true);
    try {
      const orderData = {
        tenant: selectedStandId,
        payment_method: "CASH",
        items: cart.map(item => ({
          menu_item: item.id,
          qty: item.qty
        }))
      };
      await createPosCashOrder(orderData);
      alert('Pesanan berhasil dibuat!');
      setCart([]);
      setIsCartExpanded(false);
    } catch (err) {
      alert('Gagal membuat pesanan. Coba lagi.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  // --- RENDER ---
  if (loadingStands) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <FiLoader className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  // 2. HAPUS PEMBUNGKUS <Layout> DI BAWAH INI
  return (
    // <Layout> <-- INI PENYEBABNYA
      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] bg-gray-100 overflow-hidden relative">
        
        {/* AREA KIRI: SELEKTOR STAND & MENU GRID */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header Bar */}
          <div className="p-4 bg-white border-b border-gray-200 shadow-sm z-10">
            <StandSelector 
              stands={stands}
              selectedStandId={selectedStandId}
              onSelectStand={(id) => {
                setSelectedStandId(id);
                setCart([]); 
              }}
            />
          </div>

          {/* List Menu - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 pb-32 lg:pb-6">
            <div className="max-w-7xl mx-auto">
              {loadingMenus ? (
                <div className="flex justify-center p-10"><FiLoader className="animate-spin" /></div>
              ) : (
                <MenuGrid menus={menus} onAddItem={handleAddItemToCart} />
              )}
            </div>
          </div>
        </div>

        {/* AREA KANAN / BOTTOM SHEET: KERANJANG */}
        <div 
          className={`
            fixed bottom-0 left-0 right-0 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.15)] z-50 
            transition-all duration-300 ease-in-out border-t border-gray-200
            lg:relative lg:w-[400px] lg:h-full lg:translate-y-0 lg:shadow-none lg:border-l lg:border-t-0
            ${isCartExpanded ? 'h-[85vh] rounded-t-3xl' : 'h-20 lg:h-full'}
          `}
        >
          {/* Mobile Cart Header (Toggle Bar) */}
          <div 
            onClick={() => setIsCartExpanded(!isCartExpanded)}
            className="lg:hidden h-20 px-6 flex justify-between items-center bg-orange-600 text-white cursor-pointer rounded-t-xl sm:rounded-none"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <FiShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-orange-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                    {cart.length}
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs opacity-80 uppercase font-bold">Total Tagihan</p>
                <p className="font-bold text-lg">Rp {cartTotal.toLocaleString('id-ID')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-orange-700/50 px-3 py-1.5 rounded-lg">
              <span className="text-sm font-bold">{isCartExpanded ? 'Tutup' : 'Detail'}</span>
              {isCartExpanded ? <FiChevronDown /> : <FiChevronUp />}
            </div>
          </div>

          {/* Cart Content (Desktop & Mobile Expanded) */}
          <div className={`h-[calc(100%-80px)] lg:h-full overflow-hidden ${!isCartExpanded ? 'hidden lg:block' : 'block'}`}>
            <Cart 
              items={cart}
              onUpdateQty={handleUpdateQty}
              onRemoveItem={handleRemoveItem}
              onSubmit={handleSubmitOrder}
              loadingSubmit={loadingSubmit}
            />
          </div>
        </div>

        {/* Backdrop Overlay (Hanya di Mobile saat Cart Expand) */}
        {isCartExpanded && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsCartExpanded(false)}
          />
        )}
      </div>
    // </Layout> <-- INI PENYEBABNYA
  );
};

export default KasirPosPage;
