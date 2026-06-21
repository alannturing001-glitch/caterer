/**
 * Wishlist Store (Zustand)
 * Global state management for wishlist
 */

import { create } from 'zustand';
import { WishlistItem, WishlistState } from '../types';

interface WishlistStore extends WishlistState {
  addItem: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => void;
  removeItem: (packageId: number) => void;
  isInWishlist: (packageId: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  itemCount: 0,
  loading: false,
  error: null,

  addItem: (item) =>
    set((state) => {
      const exists = state.items.find((i) => i.packageId === item.packageId);
      if (exists) return state;

      const newItem: WishlistItem = {
        id: `${item.packageId}_${Date.now()}`,
        ...item,
        addedAt: new Date().toISOString(),
      };

      return {
        items: [...state.items, newItem],
        itemCount: state.items.length + 1,
      };
    }),

  removeItem: (packageId) =>
    set((state) => ({
      items: state.items.filter((i) => i.packageId !== packageId),
      itemCount: state.items.length - 1,
    })),

  isInWishlist: (packageId) => {
    const state = get();
    return state.items.some((i) => i.packageId === packageId);
  },

  clearWishlist: () =>
    set({
      items: [],
      itemCount: 0,
    }),
}));
