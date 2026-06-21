/**
 * Packages Types
 * Type definitions for the packages feature
 */

export interface Package {
  id: number;
  title: string;
  description?: string;
  price: number;
  category: string;
  slug: string;
  inStock: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PackageFilters {
  sort?: string;
  price?: number;
  category?: string;
  inStock?: boolean;
  outOfStock?: boolean;
  page?: number;
}

export interface PackageState {
  packages: Package[];
  selectedPackage: Package | null;
  filters: PackageFilters;
  loading: boolean;
  error: string | null;
}
