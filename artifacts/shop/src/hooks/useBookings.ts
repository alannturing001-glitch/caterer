'use client';

import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { getErrorMessage, handleApiResponse } from '@/lib/error-handler';
import toast from 'react-hot-toast';

export interface Booking {
  id: string;
  eventId: string;
  quotationId: string;
  customerId: string;
  catererId: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  depositAmount: number;
  depositPaid: boolean;
  finalAmount: number;
  finalPaymentDue?: string;
  contractSignedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Custom hook for managing bookings
 */
export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all bookings for current user
   */
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.get('/api/bookings');
      const result = await handleApiResponse<Booking[]>(res);

      if (result.success && result.data) {
        setBookings(result.data);
      } else {
        throw new Error(result.error?.message || 'Failed to fetch bookings');
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
   * Get a specific booking by ID
   */
  const getBooking = useCallback(async (bookingId: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.get(`/api/bookings/${bookingId}`);
      const result = await handleApiResponse<Booking>(res);

      if (result.success && result.data) {
        setCurrentBooking(result.data);
        return result.data;
      } else {
        throw new Error(result.error?.message || 'Failed to fetch booking');
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
   * Create booking from accepted quotation
   */
  const createBooking = useCallback(async (quotationId: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.post('/api/bookings', { quotationId });
      const result = await handleApiResponse<Booking>(res);

      if (result.success && result.data) {
        setBookings((prev) => [...prev, result.data]);
        toast.success('Booking created successfully');
        return result.data;
      } else {
        throw new Error(result.error?.message || 'Failed to create booking');
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
   * Cancel booking
   */
  const cancelBooking = useCallback(async (bookingId: string, reason?: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.put(`/api/bookings/${bookingId}`, {
        status: 'cancelled',
        cancellationReason: reason,
      });
      const result = await handleApiResponse<Booking>(res);

      if (result.success && result.data) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? result.data : b))
        );
        setCurrentBooking(null);
        toast.success('Booking cancelled');
        return result.data;
      } else {
        throw new Error(result.error?.message || 'Failed to cancel booking');
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
   * Pay deposit for booking
   */
  const payDeposit = useCallback(async (bookingId: string, paymentMethodId: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.post(`/api/bookings/${bookingId}/pay-deposit`, {
        paymentMethodId,
      });
      const result = await handleApiResponse<Booking>(res);

      if (result.success && result.data) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? result.data : b))
        );
        setCurrentBooking(result.data);
        toast.success('Deposit payment successful');
        return result.data;
      } else {
        throw new Error(result.error?.message || 'Failed to process payment');
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
   * Pay final balance
   */
  const payFinalBalance = useCallback(
    async (bookingId: string, paymentMethodId: string) => {
      setLoading(true);
      setError(null);

      try {
        const res = await apiClient.post(`/api/bookings/${bookingId}/pay-final`, {
          paymentMethodId,
        });
        const result = await handleApiResponse<Booking>(res);

        if (result.success && result.data) {
          setBookings((prev) =>
            prev.map((b) => (b.id === bookingId ? result.data : b))
          );
          setCurrentBooking(result.data);
          toast.success('Final payment successful');
          return result.data;
        } else {
          throw new Error(result.error?.message || 'Failed to process payment');
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
   * Update final guest count
   */
  const updateGuestCount = useCallback(async (bookingId: string, guestCount: number) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.put(`/api/bookings/${bookingId}`, { guestCount });
      const result = await handleApiResponse<Booking>(res);

      if (result.success && result.data) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? result.data : b))
        );
        setCurrentBooking(result.data);
        toast.success('Guest count updated');
        return result.data;
      } else {
        throw new Error(result.error?.message || 'Failed to update guest count');
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
   * Get bookings for specific event
   */
  const getBookingsByEvent = useCallback(
    (eventId: string) => {
      return bookings.filter((b) => b.eventId === eventId);
    },
    [bookings]
  );

  /**
   * Get upcoming bookings (next 30 days)
   */
  const getUpcomingBookings = useCallback(() => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    return bookings.filter((b) => {
      const bookingDate = new Date(b.createdAt);
      return bookingDate <= thirtyDaysFromNow && b.status !== 'cancelled';
    });
  }, [bookings]);

  return {
    bookings,
    currentBooking,
    loading,
    error,
    fetchBookings,
    getBooking,
    createBooking,
    cancelBooking,
    payDeposit,
    payFinalBalance,
    updateGuestCount,
    getBookingsByEvent,
    getUpcomingBookings,
  };
};

export default useBookings;
