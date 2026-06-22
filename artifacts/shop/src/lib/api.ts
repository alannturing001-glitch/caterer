import { getStoredToken } from '@/hooks/useAuth';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Get authorization headers from stored token
 */
function getAuthHeader(): Record<string, string> {
  const token = getStoredToken();
  if (token) return { Authorization: `Bearer ${token}` };
  try {
    const stored = localStorage.getItem('auth-token');
    if (stored) return { Authorization: `Bearer ${stored}` };
  } catch {}
  return {};
}

/**
 * Enhanced API client with error handling and request/response interceptors
 */
export const apiClient = {
  baseUrl: API_BASE,

  /**
   * Generic request method with automatic auth header injection
   */
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const authHeaders = getAuthHeader();
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...(options.headers as Record<string, string> | undefined),
      },
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });

      // Handle 401 Unauthorized - redirect to login
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error('Unauthorized - Please login again');
      }

      // Handle 403 Forbidden
      if (response.status === 403) {
        throw new Error('Access denied');
      }

      return response;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  },

  /**
   * GET request
   */
  get: (endpoint: string, options?: RequestInit) =>
    apiClient.request(endpoint, { ...options, method: 'GET' }),

  /**
   * POST request
   */
  post: (endpoint: string, data?: unknown, options?: RequestInit) =>
    apiClient.request(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  /**
   * PUT request
   */
  put: (endpoint: string, data?: unknown, options?: RequestInit) =>
    apiClient.request(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  /**
   * PATCH request
   */
  patch: (endpoint: string, data?: unknown, options?: RequestInit) =>
    apiClient.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  /**
   * DELETE request
   */
  delete: (endpoint: string, options?: RequestInit) =>
    apiClient.request(endpoint, { ...options, method: 'DELETE' }),

  /**
   * Upload file via FormData
   */
  uploadFile: async (
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>,
    options?: RequestInit
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, JSON.stringify(value));
      });
    }

    const authHeaders = getAuthHeader();
    
    return fetch(`${apiClient.baseUrl}${endpoint}`, {
      ...options,
      method: 'POST',
      headers: { ...authHeaders },
      body: formData,
    });
  },
};

export default apiClient;
