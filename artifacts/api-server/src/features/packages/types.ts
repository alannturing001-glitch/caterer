/**
 * Package Feature Types
 * Type definitions for catering packages/products
 */

export interface Package {
  id: number;
  title: string;
  description?: string;
  price: number;
  category: string;
  slug: string;
  inStock: number; // 0 or 1
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePackageRequest {
  title: string;
  description?: string;
  price: number;
  category: string;
  slug: string;
  inStock?: number;
}

export interface UpdatePackageRequest {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  slug?: string;
  inStock?: number;
}

export interface PackageResponse {
  data: Package;
  timestamp: string;
}

export interface PackagesListResponse {
  data: Package[];
  count: number;
  timestamp: string;
}

export interface PackageErrorResponse {
  error: string;
  statusCode: number;
  timestamp: string;
}
