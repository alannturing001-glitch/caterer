'use client';

import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { getErrorMessage, handleApiResponse } from '@/lib/error-handler';
import toast from 'react-hot-toast';

export interface Quotation {
  id: string;
  eventId: string;
  catererId: string;
  caterName: string;
  items: any[];
  depositPercentage: number;
  depositAmount: number;
  totalAmount: number;
  expiresAt: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  receivedAt: string;
}

/**
 * Custom hook for managing quotations
 */
export const useQuotations = (eventId?: string) => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch quotations for an event
   */
  const fetchQuotations = useCallback(
    async (id?: string) => {
      const targetId = id || eventId;
      if (!targetId) {
        setError('Event ID is required');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await apiClient.get(`/api/events/${targetId}/quotations`);
        const result = await handleApiResponse<Quotation[]>(res);

        if (result.success && result.data) {
          setQuotations(result.data);
        } else {
          throw new Error(result.error?.message || 'Failed to fetch quotations');
        }
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [eventId]
  );

  /**
   * Create a quotation
   */
  const createQuotation = useCallback(
    async (data: Partial<Quotation>) => {
      setLoading(true);
      setError(null);

      try {
        const res = await apiClient.post('/api/quotations', data);
        const result = await handleApiResponse<Quotation>(res);

        if (result.success && result.data) {
          setQuotations((prev) => [...prev, result.data]);
          toast.success('Quotation created successfully');
          return result.data;
        } else {
          throw new Error(result.error?.message || 'Failed to create quotation');
        }
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Accept a quotation
   */
  const acceptQuotation = useCallback(async (quotationId: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.put(`/api/quotations/${quotationId}`, { status: 'accepted' });
      const result = await handleApiResponse<Quotation>(res);

      if (result.success && result.data) {
        setQuotations((prev) =>
          prev.map((q) => (q.id === quotationId ? result.data : q))
        );
        toast.success('Quotation accepted');
        return result.data;
      } else {
        throw new Error(result.error?.message || 'Failed to accept quotation');
      }
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reject a quotation
   */
  const rejectQuotation = useCallback(async (quotationId: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.put(`/api/quotations/${quotationId}`, { status: 'rejected' });
      const result = await handleApiResponse<Quotation>(res);

      if (result.success && result.data) {
        setQuotations((prev) =>
          prev.map((q) => (q.id === quotationId ? result.data : q))
        );
        toast.success('Quotation rejected');
        return result.data;
      } else {
        throw new Error(result.error?.message || 'Failed to reject quotation');
      }
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get best (lowest) quotation
   */
  const getBestQuotation = useCallback((): Quotation | null => {
    if (quotations.length === 0) return null;
    return quotations.reduce((best, current) =>
      current.totalAmount < best.totalAmount ? current : best
    );
  }, [quotations]);

  /**
   * Filter quotations by caterer
   */
  const getQuotationsByCaterer = useCallback(
    (catererId: string) => {
      return quotations.filter((q) => q.catererId === catererId);
    },
    [quotations]
  );

  /**
   * Sort quotations by price
   */
  const getSortedByPrice = useCallback((): Quotation[] => {
    return [...quotations].sort((a, b) => a.totalAmount - b.totalAmount);
  }, [quotations]);

  return {
    quotations,
    loading,
    error,
    fetchQuotations,
    createQuotation,
    acceptQuotation,
    rejectQuotation,
    getBestQuotation,
    getQuotationsByCaterer,
    getSortedByPrice,
  };
};

export default useQuotations;
