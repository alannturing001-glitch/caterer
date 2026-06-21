const API_BASE = '';

function getAuthHeader(): Record<string, string> {
  try {
    const stored = localStorage.getItem('auth-session');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.user) {
        const token = btoa(JSON.stringify(parsed.user));
        return { Authorization: `Bearer ${token}` };
      }
    }
  } catch {}
  return {};
}

export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE}${endpoint}`;
    const authHeaders = getAuthHeader();
    const defaultOptions: RequestInit = {
      headers: { 'Content-Type': 'application/json', ...authHeaders, ...options.headers },
    };
    return fetch(url, { ...defaultOptions, ...options });
  },
  get: (endpoint: string, options?: RequestInit) =>
    apiClient.request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint: string, data?: any, options?: RequestInit) =>
    apiClient.request(endpoint, { ...options, method: 'POST', body: data ? JSON.stringify(data) : undefined }),
  put: (endpoint: string, data?: any, options?: RequestInit) =>
    apiClient.request(endpoint, { ...options, method: 'PUT', body: data ? JSON.stringify(data) : undefined }),
  delete: (endpoint: string, options?: RequestInit) =>
    apiClient.request(endpoint, { ...options, method: 'DELETE' }),
};

export default apiClient;
