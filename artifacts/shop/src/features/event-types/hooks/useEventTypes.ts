/**
 * Event Types Hook
 */

import { useState, useEffect } from 'react';
import { EventType } from '../types';
import { fetchEventTypes } from '../api/eventTypesApi';

interface UseEventTypesResult {
  eventTypes: EventType[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useEventTypes(): UseEventTypesResult {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEventTypes();
      setEventTypes(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch event types';
      setError(message);
      console.error('Error fetching event types:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { eventTypes, loading, error, refetch };
}
