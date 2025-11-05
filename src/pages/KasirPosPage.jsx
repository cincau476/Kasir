import React, { useState, useEffect } from 'react';
import StandSelector from '../components/StandSelector';
import MenuGrid from '../components/MenuGrid';
import Cart from '../components/Cart';
import { getPosStands, getPosMenusByStandId, createPosCashOrder } from '../api/apiService';

const KasirPosPage = () => {
  // State untuk data dari API
  const [stands, setStands] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedStandId, setSelectedStandId] = useState(null);
  
  // State untuk keranjang
  const [cart, setCart] = useState([]);
  
  // State untuk UI
  const [loadingStands, setLoadingStands] = useState(true);
  const [loadingMenus, setLoadingMenus] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // 1. Ambil daftar stand saat halaman dimuat
  useEffect(() => {
    const fetchStands = async () => {
      try {
        setLoadingStands(true);
        const response = await getPosStands();
        setStands(response.data);
        // Otomatis pilih stand pertama
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

  // 2. Ambil menu setiap kali 'selectedStandId' berubah
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

  // --- Fungsi untuk Keranjang ---

  // Menambah item ke keranjang
  const handleAddItemToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      
      // Jika item sudah ada, tambah qty
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, qty: cartItem.qty + 1 }
            : cartItem
        );
      }
      // Jika item baru, tambahkan ke keranjang
      return [...prevCart, { ...item, qty: 1 }];
    });
  };

  // Update kuantitas (bisa + atau -)
  const handleUpdateQty = (itemId, newQty) => {
    if (newQty <= 0) {
      // Hapus jika qty 0 atau kurang
      handleRemoveItem(itemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, qty: newQty } : item
      )
    );
  };

  // Hapus item dari keranjang
  const handleRemoveItem = (itemId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== itemId));
  };

  // Submit pesanan
  const handleSubmitOrder = async () => {
    setLoadingSubmit(true);
    try {
      // Kirim data ke API
      await createPosCashOrder({
        standId: selectedStandId,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.qty), 0)
      });
      alert('Pesanan berhasil dibuat!');
      setCart([]); // Kosongkan keranjang
    } catch (err) {
      alert('Gagal membuat pesanan. Coba lagi.');
      console.error(err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  // --- Render ---

  if (loadingStands) {
    return <div className="text-center p-10">Memuat data kasir...</div>;
  }

  const selectedStand = stands.find(s => s.id === selectedStandId);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Kasir POS</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Kolom 1: Stand */}
        <div className="lg:col-span-1">
          <StandSelector 
            stands={stands}
            selectedStandId={selectedStandId}
            onSelectStand={(id) => {
              setSelectedStandId(id);
              setCart([]); // Kosongkan keranjang saat ganti stand
            }}
          />
        </div>
        
        {/* Kolom 2: Menu */}
        <div className="lg:col-span-1">
          {loadingMenus ? (
            <p>Memuat menu...</p>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Menu {selectedStand?.name}
              </h2>
              <MenuGrid 
                menus={menus} 
                onAddItem={handleAddItemToCart} 
              />
            </>
          )}
        </div>
        
        {/* Kolom 3: Keranjang */}
        <div className="lg:col-span-1 lg:sticky lg:top-24">
          <Cart 
            items={cart}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onSubmit={handleSubmitOrder}
            loadingSubmit={loadingSubmit}
          />
        </div>

      </div>
    </div>
  );
};

export default KasirPosPage;