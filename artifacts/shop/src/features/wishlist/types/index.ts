/**
 * Wishlist Types
 */

export interface WishlistItem {
  id: string;
  packageId: number;
  packageTitle: string;
  packagePrice: number;
  addedAt: string;
}

export interface WishlistState {
  items: WishlistItem[];
  itemCount: number;
  loading: boolean;
  error: string | null;
}
