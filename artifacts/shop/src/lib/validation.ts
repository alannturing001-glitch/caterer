import { z } from "zod";

// Common validation patterns for catering marketplace
export const commonValidations = {
  // Email validation with comprehensive checks
  email: z
    .string()
    .min(1, "Email is required")
    .max(254, "Email must be no more than 254 characters")
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim()
    .refine(
      (email) => {
        const suspiciousPatterns = [
          /<script/i,
          /javascript:/i,
          /on\w+\s*=/i,
          /data:/i,
        ];
        return !suspiciousPatterns.some(pattern => pattern.test(email));
      },
      "Email contains invalid characters"
    ),

  // Strong password validation
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must be no more than 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .refine(
      (password) => {
        const commonPasswords = [
          "password", "123456", "qwerty", "abc123", "password123",
          "admin", "letmein", "welcome", "monkey", "dragon"
        ];
        return !commonPasswords.includes(password.toLowerCase());
      },
      "Password is too common, please choose a stronger password"
    ),

  // Request size validation
  validateRequestSize: (contentLength: number | null) => {
    const MAX_REQUEST_SIZE = 1024 * 1024; // 1MB limit
    return contentLength === null || contentLength <= MAX_REQUEST_SIZE;
  },

  // Phone number validation (international format support)
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must not exceed 20 characters")
    .regex(/^\+?[\d\s\-\(\)]{10,}$/, "Please provide a valid phone number"),

  // Company name validation
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(255, "Company name must not exceed 255 characters")
    .trim(),

  // Description/bio validation
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must not exceed 5000 characters")
    .trim(),

  // URL validation
  url: z
    .string()
    .url("Please provide a valid URL")
    .or(z.literal("")),

  // Guest count validation
  guestCount: z
    .number()
    .min(1, "Guest count must be at least 1")
    .max(10000, "Guest count cannot exceed 10000")
    .int("Guest count must be a whole number"),

  // Event date validation
  eventDate: z
    .date()
    .refine(
      (date) => date > new Date(),
      "Event date must be in the future"
    )
    .refine(
      (date) => {
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 2);
        return date <= maxDate;
      },
      "Event date cannot be more than 2 years in the future"
    ),

  // Price validation (per guest or total)
  price: z
    .number()
    .min(0, "Price cannot be negative")
    .max(1000000, "Price is too high")
    .refine(
      (price) => price % 0.01 === 0 || Math.abs(price % 0.01 - 0.01) < 1e-9,
      "Price must have at most 2 decimal places"
    ),

  // Cuisine type validation
  cuisineType: z
    .string()
    .min(1, "Cuisine type is required")
    .max(100, "Cuisine type must not exceed 100 characters"),

  // Service mode validation
  serviceMode: z.enum(["onsite", "pickup", "delivery"], {
    errorMap: () => ({ message: "Service mode must be onsite, pickup, or delivery" })
  }),
};

// Catering marketplace schemas
export const schemas = {
  // Customer event creation
  createEvent: z.object({
    eventName: z.string().min(2, "Event name is required").max(255),
    eventDate: commonValidations.eventDate,
    eventTime: z.string().regex(/^\d{2}:\d{2}$/, "Please provide a valid time"),
    eventType: z.string().min(1, "Event type is required"),
    guestCount: commonValidations.guestCount,
    location: z.string().min(5, "Location is required"),
    cuisinePreferences: z.array(commonValidations.cuisineType).min(1, "Select at least one cuisine"),
    budgetPerGuest: commonValidations.price.optional(),
    dietaryRestrictions: z.string().max(1000, "Dietary restrictions must not exceed 1000 characters").optional(),
    specialRequests: z.string().max(5000, "Special requests must not exceed 5000 characters").optional(),
    serviceMode: commonValidations.serviceMode,
  }),

  // Caterer profile
  caterProfile: z.object({
    companyName: commonValidations.companyName,
    cuisineTypes: z.array(commonValidations.cuisineType).min(1, "Select at least one cuisine type"),
    bio: commonValidations.description,
    phone: commonValidations.phone,
    serviceArea: z.string().min(1, "Service area is required"),
    minGuests: z.number().min(1, "Minimum guests must be at least 1"),
    maxGuests: z.number().min(1, "Maximum guests must be at least 1"),
    website: commonValidations.url,
    licenses: z.string().optional(),
  }),

  // Quotation creation
  createQuotation: z.object({
    eventId: z.string().min(1, "Event ID is required"),
    catererId: z.string().min(1, "Caterer ID is required"),
    items: z.array(z.object({
      menuItemId: z.string(),
      portionSize: z.string(),
      quantity: z.number().min(1),
      pricePerGuest: commonValidations.price,
    })).min(1, "At least one menu item is required"),
    depositPercentage: z.number().min(0, "Deposit must be at least 0%").max(100, "Deposit cannot exceed 100%"),
    depositAmount: commonValidations.price,
    totalAmount: commonValidations.price,
    expiresAt: z.date().refine(
      (date) => date > new Date(),
      "Quote expiry date must be in the future"
    ),
  }),

  // Menu item creation
  createMenuItem: z.object({
    name: z.string().min(2, "Menu item name is required").max(255),
    description: z.string().min(10, "Description must be at least 10 characters").max(1000),
    category: z.string().min(1, "Category is required"),
    basePrice: commonValidations.price,
    portionSizes: z.array(z.object({
      size: z.string().min(1),
      multiplier: z.number().min(0.5).max(2),
    })).min(1, "At least one portion size is required"),
    ingredients: z.string().max(1000, "Ingredients description must not exceed 1000 characters").optional(),
    allergens: z.array(z.string()).optional(),
    preparationTime: z.number().min(15, "Preparation time must be at least 15 minutes"),
    available: z.boolean().default(true),
  }),

  // User signup
  signup: z.object({
    email: commonValidations.email,
    password: commonValidations.password,
    firstName: z.string().min(1, "First name is required").max(100),
    lastName: z.string().min(1, "Last name is required").max(100),
    userType: z.enum(["customer", "caterer"], {
      errorMap: () => ({ message: "User type must be customer or caterer" })
    }),
  }),

  // User login
  login: z.object({
    email: commonValidations.email,
    password: z.string().min(1, "Password is required"),
  }),
};

export type CreateEventInput = z.infer<typeof schemas.createEvent>;
export type CaterProfileInput = z.infer<typeof schemas.caterProfile>;
export type CreateQuotationInput = z.infer<typeof schemas.createQuotation>;
export type CreateMenuItemInput = z.infer<typeof schemas.createMenuItem>;
export type SignupInput = z.infer<typeof schemas.signup>;
export type LoginInput = z.infer<typeof schemas.login>;
