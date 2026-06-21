/**
 * Packages Store (Zustand)
 * Global state management for packages feature
 */

import { create } from 'zustand';
import { Package, PackageState } from '../types';

interface PackageStore extends PackageState {
  setPackages: (packages: Package[]) => void;
  setSelectedPackage: (pkg: Package | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addPackage: (pkg: Package) => void;
  removePackage: (id: number) => void;
  updatePackageInStore: (id: number, updates: Partial<Package>) => void;
  clearPackages: () => void;
}

export const usePackageStore = create<PackageStore>((set) => ({
  packages: [],
  selectedPackage: null,
  filters: {},
  loading: false,
  error: null,

  setPackages: (packages) => set({ packages }),
  setSelectedPackage: (pkg) => set({ selectedPackage: pkg }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  addPackage: (pkg) =>
    set((state) => ({
      packages: [...state.packages, pkg],
    })),

  removePackage: (id) =>
    set((state) => ({
      packages: state.packages.filter((pkg) => pkg.id !== id),
    })),

  updatePackageInStore: (id, updates) =>
    set((state) => ({
      packages: state.packages.map((pkg) =>
        pkg.id === id ? { ...pkg, ...updates } : pkg
      ),
      selectedPackage:
        state.selectedPackage?.id === id
          ? { ...state.selectedPackage, ...updates }
          : state.selectedPackage,
    })),

  clearPackages: () =>
    set({
      packages: [],
      selectedPackage: null,
      error: null,
    }),
}));
