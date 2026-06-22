/**
 * Error handling and response utilities
 * Standardized error handling for API responses and client-side operations
 */

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: any;
  timestamp?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

/**
 * Parse API error responses with fallback
 */
export function parseApiError(error: any): ApiError {
  if (error instanceof Response) {
    return {
      status: error.status,
      message: error.statusText || 'API Error',
      timestamp: new Date().toISOString(),
    };
  }

  if (typeof error === 'string') {
    return {
      status: 500,
      message: error,
      timestamp: new Date().toISOString(),
    };
  }

  if (error?.message) {
    return {
      status: error.status || 500,
      message: error.message,
      code: error.code,
      details: error.details,
      timestamp: new Date().toISOString(),
    };
  }

  return {
    status: 500,
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Handle API response with consistent error format
 */
export async function handleApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  try {
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: {
          status: response.status,
          message: data.message || response.statusText,
          code: data.code,
          details: data.details,
        },
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: parseApiError(error),
    };
  }
}

/**
 * Generate user-friendly error messages
 */
export function getErrorMessage(error: ApiError | Error | string): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  const apiError = error as ApiError;

  const errorMessages: Record<number, string> = {
    400: 'Invalid request. Please check your input.',
    401: 'You are not authenticated. Please log in.',
    403: 'You do not have permission to access this resource.',
    404: 'The requested resource was not found.',
    409: 'There was a conflict with your request. Please try again.',
    422: 'Invalid data provided. Please check your input.',
    429: 'Too many requests. Please wait and try again.',
    500: 'Server error. Please try again later.',
    503: 'Service unavailable. Please try again later.',
  };

  return errorMessages[apiError.status] || apiError.message || 'An unexpected error occurred.';
}

/**
 * Retry failed API calls with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelayMs: number = 1000
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < maxAttempts - 1) {
        const delayMs = baseDelayMs * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError;
}

/**
 * Debounce API calls to reduce server load
 */
export function debounceApiCall<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  delayMs: number = 500
) {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: T): Promise<R> => {
    return new Promise((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(async () => {
        try {
          const result = await fn(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delayMs);
    });
  };
}

/**
 * Validate API response structure
 */
export function validateResponse<T>(
  data: any,
  requiredFields: (keyof T)[]
): data is T {
  if (!data || typeof data !== 'object') {
    return false;
  }

  return requiredFields.every((field) => field in data);
}

export default {
  parseApiError,
  handleApiResponse,
  getErrorMessage,
  retryWithBackoff,
  debounceApiCall,
  validateResponse,
};
