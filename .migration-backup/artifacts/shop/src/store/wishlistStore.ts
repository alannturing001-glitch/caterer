import { create } from "zustand";

export type ProductInWishlist = {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  stockAvailabillity: number;
};

export type State = { wishlist: ProductInWishlist[]; wishQuantity: number; };
export type Actions = {
  addToWishlist: (product: ProductInWishlist) => void;
  removeFromWishlist: (id: string) => void;
  setWishlist: (wishlist: ProductInWishlist[]) => void;
};

export const useWishlistStore = create<State & Actions>((set) => ({
  wishlist: [],
  wishQuantity: 0,
  addToWishlist: (product) => {
    set((state) => {
      const exists = state.wishlist.find((item) => product.id === item.id);
      if (!exists) return { wishlist: [...state.wishlist, product], wishQuantity: state.wishlist.length + 1 };
      return state;
    });
  },
  removeFromWishlist: (id) => {
    set((state) => {
      const newList = state.wishlist.filter((item) => item.id !== id);
      return { wishlist: newList, wishQuantity: newList.length };
    });
  },
  setWishlist: (wishlist) => set({ wishlist, wishQuantity: wishlist.length }),
}));
