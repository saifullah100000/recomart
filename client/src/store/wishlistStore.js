import { create } from 'zustand';
import api from '../api/axios';

const useWishlistStore = create((set) => ({
  products: [],
  productIds: new Set(),

  fetchWishlist: async () => {
    try {
      const { data } = await api.get('/wishlist');
      const products = data.wishlist?.products || [];
      set({
        products,
        productIds: new Set(products.map(p => p._id))
      });
    } catch {
      set({ products: [], productIds: new Set() });
    }
  },

  toggleWishlist: async (productId) => {
    const { data } = await api.post(`/wishlist/toggle/${productId}`);
    const products = data.wishlist?.products || [];
    set({
      products,
      productIds: new Set(products.map(p => p._id))
    });
    return data.isInWishlist;
  },

  isInWishlist: (productId) => {
    return useWishlistStore.getState().productIds.has(productId);
  }
}));

export default useWishlistStore;
