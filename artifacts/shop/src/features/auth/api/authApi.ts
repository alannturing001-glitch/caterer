/**
 * Auth API Client
 * Handles authentication API calls
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface AuthUser {
  id: number;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

/**
 * Register new user
 */
export async function registerUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  }

  return response.json();
}

/**
 * Login user
 */
export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  return response.json();
}

/**
 * Get current user (if token is valid)
 */
export async function getCurrentUser(token: string): Promise<AuthUser> {
  const response = await fetch(`${API_BASE}/users/email/current`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }

  return response.json();
}

/**
 * Logout (client-side only, clears token)
 */
export function logout(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}
