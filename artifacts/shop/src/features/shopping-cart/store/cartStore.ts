/**
 * Shopping Cart Store (Zustand)
 * Global state management for shopping cart
 */

import { create } from 'zustand';
import { CartItem, CartState } from '../types';

interface CartStore extends CartState {
  addItem: (item: Omit<CartItem, 'id' | 'subtotal'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  calculateTotals: () => void;
}

const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.subtotal, 0);
};

const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  total: 0,
  itemCount: 0,
  loading: false,
  error: null,

  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find(
        (i) => i.packageId === item.packageId
      );

      let newItems: CartItem[];
      if (existingItem) {
        newItems = state.items.map((i) =>
          i.packageId === item.packageId
            ? {
                ...i,
                quantity: i.quantity + item.quantity,
                subtotal: (i.quantity + item.quantity) * item.price,
              }
            : i
        );
      } else {
        const newItem: CartItem = {
          id: `${item.packageId}_${Date.now()}`,
          ...item,
          subtotal: item.quantity * item.price,
        };
        newItems = [...state.items, newItem];
      }

      return {
        items: newItems,
        total: calculateSubtotal(newItems),
        itemCount: calculateItemCount(newItems),
      };
    }),

  removeItem: (itemId) =>
    set((state) => {
      const newItems = state.items.filter((i) => i.id !== itemId);
      return {
        items: newItems,
        total: calculateSubtotal(newItems),
        itemCount: calculateItemCount(newItems),
      };
    }),

  updateQuantity: (itemId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        const newItems = state.items.filter((i) => i.id !== itemId);
        return {
          items: newItems,
          total: calculateSubtotal(newItems),
          itemCount: calculateItemCount(newItems),
        };
      }

      const newItems = state.items.map((i) =>
        i.id === itemId
          ? {
              ...i,
              quantity,
              subtotal: quantity * i.price,
            }
          : i
      );

      return {
        items: newItems,
        total: calculateSubtotal(newItems),
        itemCount: calculateItemCount(newItems),
      };
    }),

  clearCart: () =>
    set({
      items: [],
      total: 0,
      itemCount: 0,
      error: null,
    }),

  calculateTotals: () =>
    set((state) => ({
      total: calculateSubtotal(state.items),
      itemCount: calculateItemCount(state.items),
    })),
}));
