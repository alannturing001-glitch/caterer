/**
 * Packages Feature Export
 * Central export point for all packages-related functionality
 */

export { usePackageStore } from './store/packageStore';
export { usePackages } from './hooks/usePackages';
export { usePackageDetail, usePackageDetailBySlug } from './hooks/usePackageDetail';
export { usePackageFilters } from './hooks/usePackageFilters';
export { fetchPackages, fetchPackageById, fetchPackageBySlug, searchPackages } from './api/packagesApi';
export type { Package, PackageFilters, PackageState } from './types';
