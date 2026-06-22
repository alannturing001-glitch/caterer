/**
 * Shopping Cart Types
 */

export interface CartItem {
  id: string; // Unique item ID (uuid or packageId_variant)
  packageId: number;
  packageTitle: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  loading: boolean;
  error: string | null;
}
