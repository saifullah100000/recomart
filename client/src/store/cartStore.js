import { create } from 'zustand';
import api from '../api/axios';

const useCartStore = create((set, get) => ({
  items: [],
  itemCount: 0,
  total: 0,

  fetchCart: async () => {
    try {
      const { data } = await api.get('/cart');
      const items = data.cart?.items || [];
      set({
        items,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        total: items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      });
    } catch {
      set({ items: [], itemCount: 0, total: 0 });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    await api.post('/cart/add', { productId, quantity });
    await get().fetchCart();
  },

  updateQuantity: async (productId, quantity) => {
    await api.put('/cart/update', { productId, quantity });
    await get().fetchCart();
  },

  removeFromCart: async (productId) => {
    await api.delete(`/cart/remove/${productId}`);
    await get().fetchCart();
  },

  clearCart: async () => {
    await api.delete('/cart/clear');
    set({ items: [], itemCount: 0, total: 0 });
  }
}));

export default useCartStore;
