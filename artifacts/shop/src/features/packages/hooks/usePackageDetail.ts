/**
 * usePackageDetail Hook
 * Custom hook to fetch a single package by ID or slug
 */

import { useState, useEffect } from 'react';
import { Package } from '../types';
import { fetchPackageById, fetchPackageBySlug } from '../api/packagesApi';

interface UsePackageDetailResult {
  package: Package | null;
  loading: boolean;
  error: string | null;
}

export function usePackageDetail(id?: number): UsePackageDetailResult {
  const [pkg, setPackage] = useState<Package | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPackageById(id);
        setPackage(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch package';
        setError(message);
        console.error('Error fetching package:', err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [id]);

  return { package: pkg, loading, error };
}

export function usePackageDetailBySlug(slug?: string): UsePackageDetailResult {
  const [pkg, setPackage] = useState<Package | null>(null);
  const [loading, setLoading] = useState(!!slug);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPackageBySlug(slug);
        setPackage(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch package';
        setError(message);
        console.error('Error fetching package:', err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [slug]);

  return { package: pkg, loading, error };
}
