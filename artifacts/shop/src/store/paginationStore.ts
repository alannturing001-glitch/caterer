import { create } from "zustand";
export const usePaginationStore = create<{ page: number; incrementPage: () => void; decrementPage: () => void }>((set) => ({
  page: 1,
  incrementPage: () => set((s) => ({ page: s.page + 1 })),
  decrementPage: () => set((s) => ({ page: s.page > 1 ? s.page - 1 : 1 })),
}));
