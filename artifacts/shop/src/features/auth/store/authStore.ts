/**
 * Auth Store (Zustand)
 * Global state management for authentication
 */

import { create } from 'zustand';
import { AuthUser, AuthState } from '../types';

interface AuthStore extends AuthState {
  setUser: (user: AuthUser | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAuthenticated: (
    user: AuthUser | null,
    token: string | null
  ) => void;
  clear: () => void;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: false,
  error: null,
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,

  setUser: (user) =>
    set({
      user,
      isAdmin: user?.role === 'admin',
    }),

  setToken: (token) => set({ token }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setAuthenticated: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: !!user && !!token,
      isAdmin: user?.role === 'admin',
    }),

  clear: () => set(initialState),
}));
