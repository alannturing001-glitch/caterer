const API_BASE = '';

export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE}${endpoint}`;
    const defaultOptions: RequestInit = {
      headers: { 'Content-Type': 'application/json', ...options.headers },
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
