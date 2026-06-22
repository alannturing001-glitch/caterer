/**
 * usePackageFilters Hook
 * Custom hook to manage package filters state
 */

import { useState, useCallback } from 'react';
import { PackageFilters } from '../types';

interface UsePackageFiltersResult {
  filters: PackageFilters;
  setSort: (sort: string) => void;
  setPrice: (price: number | undefined) => void;
  setCategory: (category: string | undefined) => void;
  setStockStatus: (inStock?: boolean, outOfStock?: boolean) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: PackageFilters = {
  sort: undefined,
  price: undefined,
  category: undefined,
  inStock: undefined,
  outOfStock: undefined,
  page: 1,
};

export function usePackageFilters(): UsePackageFiltersResult {
  const [filters, setFilters] = useState<PackageFilters>(DEFAULT_FILTERS);

  const setSort = useCallback((sort: string) => {
    setFilters((prev) => ({ ...prev, sort, page: 1 }));
  }, []);

  const setPrice = useCallback((price: number | undefined) => {
    setFilters((prev) => ({ ...prev, price, page: 1 }));
  }, []);

  const setCategory = useCallback((category: string | undefined) => {
    setFilters((prev) => ({ ...prev, category, page: 1 }));
  }, []);

  const setStockStatus = useCallback((inStock?: boolean, outOfStock?: boolean) => {
    setFilters((prev) => ({ ...prev, inStock, outOfStock, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return {
    filters,
    setSort,
    setPrice,
    setCategory,
    setStockStatus,
    setPage,
    resetFilters,
  };
}
