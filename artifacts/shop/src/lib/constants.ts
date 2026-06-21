/**
 * Catering Marketplace Constants
 * Centralized data for enums, lists, and mappings used throughout the app
 */

export const CUISINE_TYPES = [
  'Italian',
  'Mexican',
  'Asian',
  'Indian',
  'Mediterranean',
  'French',
  'American',
  'Middle Eastern',
  'Japanese',
  'Thai',
  'Vietnamese',
  'Korean',
  'Chinese',
  'Spanish',
  'Portuguese',
  'Greek',
  'Turkish',
  'Brazilian',
  'Fusion',
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Other',
] as const;

export const EVENT_TYPES = [
  { id: 'wedding', label: 'Wedding', icon: '💒' },
  { id: 'birthday', label: 'Birthday Party', icon: '🎂' },
  { id: 'corporate', label: 'Corporate Event', icon: '🏢' },
  { id: 'conference', label: 'Conference', icon: '🎤' },
  { id: 'wedding_reception', label: 'Wedding Reception', icon: '🍾' },
  { id: 'engagement', label: 'Engagement Party', icon: '💍' },
  { id: 'anniversary', label: 'Anniversary', icon: '🎉' },
  { id: 'graduation', label: 'Graduation', icon: '🎓' },
  { id: 'baby_shower', label: 'Baby Shower', icon: '👶' },
  { id: 'bridal_shower', label: 'Bridal Shower', icon: '👰' },
  { id: 'retirement', label: 'Retirement Party', icon: '🏖️' },
  { id: 'holiday', label: 'Holiday Party', icon: '🎄' },
  { id: 'fundraiser', label: 'Fundraiser', icon: '💰' },
  { id: 'networking', label: 'Networking Event', icon: '🤝' },
  { id: 'training', label: 'Training Session', icon: '📚' },
  { id: 'product_launch', label: 'Product Launch', icon: '🚀' },
  { id: 'other', label: 'Other', icon: '✨' },
] as const;

export const SERVICE_MODES = [
  { id: 'onsite', label: 'On-site Catering', description: 'Caterer prepares and serves at your venue' },
  { id: 'pickup', label: 'Pickup', description: 'You pick up prepared food from caterer' },
  { id: 'delivery', label: 'Delivery', description: 'Caterer delivers prepared food to your location' },
] as const;

export const DIETARY_RESTRICTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Kosher',
  'Halal',
  'Low-Sodium',
  'Low-Sugar',
  'Keto',
  'Paleo',
  'Organic',
] as const;

export const QUOTATION_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
} as const;

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  DEPOSIT_PAID: 'deposit_paid',
  PARTIAL: 'partial',
  PAID: 'paid',
  REFUNDED: 'refunded',
  FAILED: 'failed',
} as const;

export const NOTIFICATION_TYPES = {
  QUOTATION_RECEIVED: 'QUOTATION_RECEIVED',
  QUOTATION_REQUESTED: 'QUOTATION_REQUESTED',
  BOOKING_CONFIRMED: 'BOOKING_CONFIRMED',
  BOOKING_CANCELLED: 'BOOKING_CANCELLED',
  PAYMENT_DUE: 'PAYMENT_DUE',
  EVENT_REMINDER: 'EVENT_REMINDER',
  REVIEW_REQUEST: 'REVIEW_REQUEST',
  MESSAGE: 'MESSAGE',
  SYSTEM_ALERT: 'SYSTEM_ALERT',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  CATERER: 'caterer',
  CUSTOMER: 'customer',
  VENDOR_ADMIN: 'vendor_admin',
} as const;

export const SORT_OPTIONS = [
  { id: 'price_low_high', label: 'Price: Low to High' },
  { id: 'price_high_low', label: 'Price: High to Low' },
  { id: 'rating_high_low', label: 'Rating: High to Low' },
  { id: 'distance_near_far', label: 'Distance: Nearest First' },
  { id: 'reviews_most', label: 'Most Reviewed' },
] as const;

export const PRICE_RANGES = [
  { id: 'under_25', label: 'Under $25 per guest', min: 0, max: 25 },
  { id: '25_50', label: '$25 - $50 per guest', min: 25, max: 50 },
  { id: '50_100', label: '$50 - $100 per guest', min: 50, max: 100 },
  { id: '100_150', label: '$100 - $150 per guest', min: 100, max: 150 },
  { id: 'above_150', label: 'Above $150 per guest', min: 150, max: Infinity },
] as const;

export const AVAILABILITY_STATUSES = {
  AVAILABLE: 'available',
  PARTIAL: 'partial',
  BOOKED: 'booked',
  UNAVAILABLE: 'unavailable',
} as const;

export const REVIEW_RATINGS = [
  { value: 1, label: 'Poor', color: 'red' },
  { value: 2, label: 'Fair', color: 'orange' },
  { value: 3, label: 'Good', color: 'yellow' },
  { value: 4, label: 'Very Good', color: 'light-green' },
  { value: 5, label: 'Excellent', color: 'green' },
] as const;

export const PORTION_SIZES = [
  { id: 'individual', label: 'Individual', multiplier: 1 },
  { id: 'half_serving', label: 'Half Serving', multiplier: 0.5 },
  { id: 'double_serving', label: 'Double Serving', multiplier: 2 },
  { id: 'family_size', label: 'Family Size', multiplier: 3 },
] as const;

export const PAYMENT_METHODS = [
  { id: 'credit_card', label: 'Credit Card', icon: '💳' },
  { id: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
  { id: 'paypal', label: 'PayPal', icon: '🅿️' },
] as const;

// Helper functions to get labels from IDs
export const getCuisineLabel = (id: string): string => {
  return CUISINE_TYPES.find(c => c === id) || id;
};

export const getEventTypeLabel = (id: string): string => {
  return EVENT_TYPES.find(e => e.id === id)?.label || id;
};

export const getEventTypeIcon = (id: string): string => {
  return EVENT_TYPES.find(e => e.id === id)?.icon || '✨';
};

export const getServiceModeLabel = (id: string): string => {
  return SERVICE_MODES.find(s => s.id === id)?.label || id;
};

export const getQuotationStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    draft: 'Draft',
    sent: 'Sent',
    accepted: 'Accepted',
    rejected: 'Rejected',
    expired: 'Expired',
  };
  return labels[status] || status;
};

export const getBookingStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return labels[status] || status;
};

export default {
  CUISINE_TYPES,
  EVENT_TYPES,
  SERVICE_MODES,
  DIETARY_RESTRICTIONS,
  QUOTATION_STATUS,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  NOTIFICATION_TYPES,
  USER_ROLES,
  SORT_OPTIONS,
  PRICE_RANGES,
  AVAILABILITY_STATUSES,
  REVIEW_RATINGS,
  PORTION_SIZES,
  PAYMENT_METHODS,
  getCuisineLabel,
  getEventTypeLabel,
  getEventTypeIcon,
  getServiceModeLabel,
  getQuotationStatusLabel,
  getBookingStatusLabel,
};
