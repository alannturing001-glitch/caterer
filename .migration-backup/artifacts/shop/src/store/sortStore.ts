import { create } from "zustand";
export const useSortStore = create<{ sortBy: string; changeSortBy: (mode: string) => void }>((set) => ({
  sortBy: "defaultSort",
  changeSortBy: (mode) => set({ sortBy: mode }),
}));
