import { getStoredToken } from '@/hooks/useAuth';

const API_BASE = '';

function getAuthHeader(): Record<string, string> {
  const token = getStoredToken();
  if (token) return { Authorization: `Bearer ${token}` };
  try {
    const stored = localStorage.getItem('auth-token');
    if (stored) return { Authorization: `Bearer ${stored}` };
  } catch {}
  return {};
}

export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE}${endpoint}`;
    const authHeaders = getAuthHeader();
    const defaultOptions: RequestInit = {
      headers: { 'Content-Type': 'application/json', ...authHeaders, ...(options.headers as Record<string, string> | undefined) },
    };
    return fetch(url, { ...defaultOptions, ...options });
  },
  get: (endpoint: string, options?: RequestInit) =>
    apiClient.request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint: string, data?: unknown, options?: RequestInit) =>
    apiClient.request(endpoint, { ...options, method: 'POST', body: data ? JSON.stringify(data) : undefined }),
  put: (endpoint: string, data?: unknown, options?: RequestInit) =>
    apiClient.request(endpoint, { ...options, method: 'PUT', body: data ? JSON.stringify(data) : undefined }),
  delete: (endpoint: string, options?: RequestInit) =>
    apiClient.request(endpoint, { ...options, method: 'DELETE' }),
};

export default apiClient;
