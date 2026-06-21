/**
 * Format utilities for displaying data in the UI
 * Handles dates, prices, guest counts, statuses, etc.
 */

/**
 * Format price for display (USD, with commas)
 */
export function formatPrice(price: number, currency: string = 'USD'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return formatter.format(price);
}

/**
 * Format price per guest
 */
export function formatPricePerGuest(price: number, guestCount: number): string {
  const perGuest = price / guestCount;
  return `${formatPrice(perGuest)} per guest`;
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string, includeTime: boolean = false): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return d.toLocaleDateString('en-US', options);
}

/**
 * Format date for input field (YYYY-MM-DD)
 */
export function formatDateForInput(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

/**
 * Format time for display (HH:MM)
 */
export function formatTime(time: string): string {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
}

/**
 * Get relative time (e.g., "2 days from now")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 0) {
    const absDiffMins = Math.abs(diffMins);
    if (absDiffMins < 60) return `${absDiffMins} minute${absDiffMins !== 1 ? 's' : ''} ago`;
    if (absDiffMins < 1440) {
      const h = Math.floor(absDiffMins / 60);
      return `${h} hour${h !== 1 ? 's' : ''} ago`;
    }
    const d = Math.floor(absDiffMins / 1440);
    return `${d} day${d !== 1 ? 's' : ''} ago`;
  }

  if (diffMins < 60) return `in ${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
  if (diffHours < 24) return `in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  return `in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
}

/**
 * Format quotation status
 */
export function formatQuotationStatus(status: string): { label: string; color: string } {
  const statuses: Record<string, { label: string; color: string }> = {
    draft: { label: 'Draft', color: 'gray' },
    sent: { label: 'Sent', color: 'blue' },
    accepted: { label: 'Accepted', color: 'green' },
    rejected: { label: 'Rejected', color: 'red' },
    expired: { label: 'Expired', color: 'orange' },
  };
  return statuses[status] || { label: status, color: 'gray' };
}

/**
 * Format booking status
 */
export function formatBookingStatus(status: string): { label: string; color: string } {
  const statuses: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pending', color: 'yellow' },
    confirmed: { label: 'Confirmed', color: 'green' },
    in_progress: { label: 'In Progress', color: 'blue' },
    completed: { label: 'Completed', color: 'green' },
    cancelled: { label: 'Cancelled', color: 'red' },
  };
  return statuses[status] || { label: status, color: 'gray' };
}

/**
 * Format payment status
 */
export function formatPaymentStatus(status: string): { label: string; color: string } {
  const statuses: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pending', color: 'yellow' },
    deposit_paid: { label: 'Deposit Paid', color: 'blue' },
    partial: { label: 'Partial', color: 'orange' },
    paid: { label: 'Paid', color: 'green' },
    refunded: { label: 'Refunded', color: 'purple' },
    failed: { label: 'Failed', color: 'red' },
  };
  return statuses[status] || { label: status, color: 'gray' };
}

/**
 * Format guest count with proper grammar
 */
export function formatGuestCount(count: number): string {
  if (count === 1) return '1 guest';
  return `${count} guests`;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

/**
 * Format company name with truncation
 */
export function formatCatererName(name: string, maxLength: number = 30): string {
  return truncateText(name, maxLength);
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format rating with stars
 */
export function formatRating(rating: number): { stars: string; label: string } {
  const star = '★';
  const emptyStar = '☆';
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  let stars = star.repeat(fullStars);
  if (hasHalfStar && fullStars < 5) {
    stars += '½';
  }
  stars += emptyStar.repeat(5 - Math.ceil(rating));

  const labels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  };

  return {
    stars,
    label: labels[Math.round(rating)] || 'Unknown',
  };
}

export default {
  formatPrice,
  formatPricePerGuest,
  formatDate,
  formatDateForInput,
  formatTime,
  formatRelativeTime,
  formatQuotationStatus,
  formatBookingStatus,
  formatPaymentStatus,
  formatGuestCount,
  truncateText,
  formatPhoneNumber,
  formatCatererName,
  getInitials,
  formatRating,
};
