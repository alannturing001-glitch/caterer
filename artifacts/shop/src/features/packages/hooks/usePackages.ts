/**
 * usePackages Hook
 * Custom hook to fetch and manage packages
 */

import { useState, useEffect } from 'react';
import { Package, PackageFilters } from '../types';
import { fetchPackages } from '../api/packagesApi';

interface UsePackagesResult {
  packages: Package[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePackages(filters?: PackageFilters): UsePackagesResult {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPackages(filters);
      setPackages(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch packages';
      setError(message);
      console.error('Error fetching packages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [filters?.sort, filters?.price, filters?.category, filters?.inStock, filters?.page]);

  return { packages, loading, error, refetch };
}
