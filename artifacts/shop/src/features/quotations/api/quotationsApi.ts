/**
 * Quotations API Client
 * Handles quotation-related API calls
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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

export interface CreateQuotationRequest {
  packageId?: number;
  eventDate?: string;
  guestCount?: number;
  specialRequests?: string;
  totalPrice?: number;
}

/**
 * Create new quotation
 */
export async function createQuotation(
  data: CreateQuotationRequest
): Promise<Quotation> {
  const response = await fetch(`${API_BASE}/quotations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create quotation');
  }

  return response.json();
}

/**
 * Get user's quotations
 */
export async function getUserQuotations(token: string): Promise<Quotation[]> {
  const response = await fetch(`${API_BASE}/users/quotations`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch quotations');
  return response.json();
}

/**
 * Get quotation by ID (admin)
 */
export async function getQuotationById(
  id: number,
  token: string
): Promise<Quotation> {
  const response = await fetch(`${API_BASE}/quotations/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch quotation');
  return response.json();
}
