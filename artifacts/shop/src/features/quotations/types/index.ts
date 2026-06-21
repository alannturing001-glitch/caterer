/**
 * Quotations Types
 */

export interface Quotation {
  id: number;
  userId?: number;
  packageId?: number;
  eventDate?: string;
  guestCount?: number;
  specialRequests?: string;
  totalPrice?: number;
  status?: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt?: string;
  updatedAt?: string;
}

export interface QuotationState {
  quotations: Quotation[];
  selectedQuotation: Quotation | null;
  loading: boolean;
  error: string | null;
}
