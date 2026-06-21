/**
 * useWishlist Hook
 */

import { useCallback } from 'react';
import { useWishlistStore } from '../store/wishlistStore';

export function useWishlist() {
  const { items, itemCount, addItem, removeItem, isInWishlist, clearWishlist } =
    useWishlistStore();

  const toggleWishlist = useCallback(
    (packageId: number, packageTitle: string, packagePrice: number) => {
      if (isInWishlist(packageId)) {
        removeItem(packageId);
      } else {
        addItem({ packageId, packageTitle, packagePrice });
      }
    },
    [addItem, removeItem, isInWishlist]
  );

  const addToWishlist = useCallback(
    (packageId: number, packageTitle: string, packagePrice: number) => {
      if (!isInWishlist(packageId)) {
        addItem({ packageId, packageTitle, packagePrice });
      }
    },
    [addItem, isInWishlist]
  );

  const removeFromWishlist = useCallback(
    (packageId: number) => {
      if (isInWishlist(packageId)) {
        removeItem(packageId);
      }
    },
    [removeItem, isInWishlist]
  );

  return {
    items,
    itemCount,
    isInWishlist,
    toggleWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
  };
}
