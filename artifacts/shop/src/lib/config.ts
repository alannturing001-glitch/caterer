/**
 * Application configuration for catering marketplace
 * Centralized settings for API, auth, features, and business logic
 */

export const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '',
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000,
  },

  // Authentication
  auth: {
    nextAuthUrl: '',
    sessionTimeout: 15 * 60 * 1000, // 15 minutes
  },

  // Business Logic: Quotations
  quotation: {
    defaultExpiryDays: 7,
    defaultDepositPercentage: 50,
    minDepositPercentage: 20,
    maxDepositPercentage: 100,
  },

  // Business Logic: Bookings
  booking: {
    guestCountFinalDeadlineDaysBefore: 7, // Must confirm final count 7 days before
    cancellationDeadlineDaysBefore: 14,
    eventMinimumGuestCount: 1,
    eventMaximumGuestCount: 10000,
  },

  // Business Logic: Events
  event: {
    minEventDateInFuture: 1, // days
    maxEventDateInFuture: 730, // days (2 years)
    minGuestCount: 1,
    maxGuestCount: 10000,
  },

  // Service Modes
  serviceModes: [
    { id: 'onsite', label: 'On-site Catering', description: 'Caterer prepares and serves at your venue' },
    { id: 'pickup', label: 'Pickup', description: 'You pick up prepared food from caterer' },
    { id: 'delivery', label: 'Delivery', description: 'Caterer delivers prepared food to your location' },
  ],

  // Cuisine Types
  cuisineTypes: [
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
  ],

  // Event Types
  eventTypes: [
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
  ],

  // Dietary Restrictions
  dietaryRestrictions: [
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
  ],

  // Notification Settings
  notifications: {
    pollIntervalMs: 30000, // 30 seconds
    showToast: true,
    soundEnabled: false,
  },

  // UI/UX Settings
  ui: {
    itemsPerPage: 10,
    searchDebounceMs: 300,
    toastDuration: 4000, // milliseconds
  },

  // Payment Settings
  payment: {
    supportedMethods: ['credit_card', 'bank_transfer', 'paypal'],
    minDepositAmount: 0,
    maxTransactionAmount: 1000000,
  },

  // Commission Settings (Marketplace)
  commission: {
    platformFeePercentage: 10,
    minCommission: 0,
    payoutDelay: 7, // days after event completion
  },

  // Feature Flags
  features: {
    enableESignatures: true,
    enableChatting: true,
    enableReviews: true,
    enableAnalytics: false,
    enableSubscriptions: false,
    enableWishlist: true,
  },
};

export default config;
