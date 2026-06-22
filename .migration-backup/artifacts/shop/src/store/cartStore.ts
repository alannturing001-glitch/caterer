import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ProductInCart = {
  id: string;
  title: string;
  price: number;
  image: string;
  amount: number;
};

export type State = {
  products: ProductInCart[];
  allQuantity: number;
  total: number;
};

export type Actions = {
  addToCart: (newProduct: ProductInCart) => void;
  removeFromCart: (id: string) => void;
  updateCartAmount: (id: string, quantity: number) => void;
  calculateTotals: () => void;
  clearCart: () => void;
};

export const useProductStore = create<State & Actions>()(
  persist(
    (set) => ({
      products: [],
      allQuantity: 0,
      total: 0,
      addToCart: (newProduct) => {
        set((state) => {
          const cartItem = state.products.find((item) => item.id === newProduct.id);
          if (!cartItem) {
            return { products: [...state.products, newProduct] };
          } else {
            const updated = state.products.map((p) =>
              p.id === newProduct.id ? { ...p, amount: p.amount + newProduct.amount } : p
            );
            return { products: updated };
          }
        });
      },
      clearCart: () => set({ products: [], allQuantity: 0, total: 0 }),
      removeFromCart: (id) => {
        set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
      },
      calculateTotals: () => {
        set((state) => {
          let amount = 0, total = 0;
          state.products.forEach((item) => { amount += item.amount; total += item.amount * item.price; });
          return { allQuantity: amount, total };
        });
      },
      updateCartAmount: (id, amount) => {
        set((state) => ({
          products: state.products.map((p) => p.id === id ? { ...p, amount } : p),
        }));
      },
    }),
    { name: "products-storage", storage: createJSONStorage(() => sessionStorage) }
  )
);
