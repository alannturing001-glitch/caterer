/**
 * Event Types API Client
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface EventType {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  createdAt?: string;
}

/**
 * Fetch all event types
 */
export async function fetchEventTypes(): Promise<EventType[]> {
  const response = await fetch(`${API_BASE}/event-types`);
  if (!response.ok) throw new Error('Failed to fetch event types');
  return response.json();
}

/**
 * Fetch event type by ID
 */
export async function fetchEventTypeById(id: number): Promise<EventType> {
  const response = await fetch(`${API_BASE}/event-types/${id}`);
  if (!response.ok) throw new Error('Event type not found');
  return response.json();
}

/**
 * Create event type (admin only)
 */
export async function createEventType(
  name: string,
  icon: string,
  token: string
): Promise<EventType> {
  const response = await fetch(`${API_BASE}/event-types`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name, icon }),
  });

  if (!response.ok) throw new Error('Failed to create event type');
  return response.json();
}

/**
 * Update event type (admin only)
 */
export async function updateEventType(
  id: number,
  updates: { name?: string; icon?: string },
  token: string
): Promise<EventType> {
  const response = await fetch(`${API_BASE}/event-types/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) throw new Error('Failed to update event type');
  return response.json();
}

/**
 * Delete event type (admin only)
 */
export async function deleteEventType(id: number, token: string): Promise<void> {
  const response = await fetch(`${API_BASE}/event-types/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to delete event type');
}
