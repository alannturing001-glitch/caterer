/**
 * Packages API Client
 * Handles all API calls related to packages/products
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface Package {
  id: number;
  title: string;
  description?: string;
  price: number;
  category: string;
  slug: string;
  inStock: number;
  createdAt?: string;
}

export interface PackageFilters {
  sort?: string;
  price?: number;
  category?: string;
  inStock?: boolean;
  outOfStock?: boolean;
  page?: number;
}

/**
 * Fetch all packages with optional filters
 */
export async function fetchPackages(filters?: PackageFilters): Promise<Package[]> {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.price) params.append('price', filters.price.toString());
    if (filters.category) params.append('category', filters.category);
    if (filters.inStock !== undefined) params.append('inStock', filters.inStock.toString());
    if (filters.outOfStock !== undefined) params.append('outOfStock', filters.outOfStock.toString());
    if (filters.page) params.append('page', filters.page.toString());
  }

  const response = await fetch(
    `${API_BASE}/packages${params.size > 0 ? '?' + params : ''}`
  );
  if (!response.ok) throw new Error('Failed to fetch packages');
  return response.json();
}

/**
 * Fetch single package by ID
 */
export async function fetchPackageById(id: number): Promise<Package> {
  const response = await fetch(`${API_BASE}/packages/${id}`);
  if (!response.ok) throw new Error('Package not found');
  return response.json();
}

/**
 * Fetch package by slug
 */
export async function fetchPackageBySlug(slug: string): Promise<Package> {
  const response = await fetch(`${API_BASE}/packages/slug/${slug}`);
  if (!response.ok) throw new Error('Package not found');
  return response.json();
}

/**
 * Search packages by term
 */
export async function searchPackages(term: string): Promise<Package[]> {
  if (!term || term.length < 2) return [];
  const response = await fetch(`${API_BASE}/packages/search/${term}`);
  if (!response.ok) throw new Error('Search failed');
  return response.json();
}

/**
 * Create new package (admin only)
 */
export async function createPackage(
  data: Partial<Package>,
  token: string
): Promise<Package> {
  const response = await fetch(`${API_BASE}/packages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create package');
  return response.json();
}

/**
 * Update package (admin only)
 */
export async function updatePackage(
  id: number,
  data: Partial<Package>,
  token: string
): Promise<Package> {
  const response = await fetch(`${API_BASE}/packages/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update package');
  return response.json();
}

/**
 * Delete package (admin only)
 */
export async function deletePackage(id: number, token: string): Promise<void> {
  const response = await fetch(`${API_BASE}/packages/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to delete package');
}
