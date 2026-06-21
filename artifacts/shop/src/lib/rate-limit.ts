/**
 * Rate limiting and security utilities
 * Prevents abuse and ensures fair API usage
 */

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // milliseconds
  message?: string;
}

export interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * Simple in-memory rate limiter (suitable for development and small deployments)
 * For production, consider Redis-based rate limiting
 */
class RateLimiter {
  private limits = new Map<string, RateLimitEntry>();

  /**
   * Check if request should be allowed
   */
  check(
    identifier: string,
    config: RateLimitConfig
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.limits.get(identifier);

    // Create new entry if doesn't exist or window expired
    if (!entry || now > entry.resetTime) {
      this.limits.set(identifier, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime: now + config.windowMs,
      };
    }

    // Check if limit exceeded
    if (entry.count >= config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    // Increment and allow
    entry.count++;
    return {
      allowed: true,
      remaining: config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  /**
   * Reset limit for identifier
   */
  reset(identifier: string): void {
    this.limits.delete(identifier);
  }

  /**
   * Clear all limits
   */
  clear(): void {
    this.limits.clear();
  }

  /**
   * Get current limit info
   */
  getInfo(identifier: string): RateLimitEntry | null {
    return this.limits.get(identifier) || null;
  }
}

// Singleton instance
const rateLimiter = new RateLimiter();

/**
 * Default rate limit configurations
 */
export const defaultRateLimits = {
  // API endpoints
  api: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },

  // Authentication endpoints (stricter)
  auth: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },

  // Quotation endpoints
  quotation: {
    maxRequests: 20,
    windowMs: 60 * 1000, // 1 minute
  },

  // Booking endpoints
  booking: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
  },

  // Upload endpoints (stricter due to file size)
  upload: {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
  },

  // Search/filter endpoints
  search: {
    maxRequests: 50,
    windowMs: 60 * 1000, // 1 minute
  },

  // Notification endpoints
  notification: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minute
  },
};

/**
 * Check if request is rate limited
 */
export function checkRateLimit(
  identifier: string,
  limitType: keyof typeof defaultRateLimits = 'api'
): { allowed: boolean; remaining: number; resetTime: number } {
  const config = defaultRateLimits[limitType];
  return rateLimiter.check(identifier, config);
}

/**
 * Custom rate limit check
 */
export function checkCustomRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  return rateLimiter.check(identifier, config);
}

/**
 * Reset rate limit for identifier
 */
export function resetRateLimit(identifier: string): void {
  rateLimiter.reset(identifier);
}

/**
 * Clear all rate limits (for testing)
 */
export function clearAllRateLimits(): void {
  rateLimiter.clear();
}

/**
 * Get time until rate limit resets in seconds
 */
export function getResetTimeInSeconds(resetTime: number): number {
  const now = Date.now();
  const remainingMs = Math.max(0, resetTime - now);
  return Math.ceil(remainingMs / 1000);
}

export default {
  checkRateLimit,
  checkCustomRateLimit,
  resetRateLimit,
  clearAllRateLimits,
  getResetTimeInSeconds,
  defaultRateLimits,
};
