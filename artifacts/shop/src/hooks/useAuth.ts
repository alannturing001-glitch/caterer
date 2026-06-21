import { useState, useEffect } from 'react';

type User = {
  id: string;
  email: string;
  role?: string;
} | null;

const SESSION_KEY = 'auth-token';

let globalUser: User = null;
let globalToken: string | null = null;
const listeners: Array<(user: User) => void> = [];

export function getStoredToken(): string | null {
  return globalToken;
}

export function setUser(user: User, token?: string) {
  globalUser = user;
  globalToken = token ?? null;
  listeners.forEach((l) => l(user));
}

export function useAuth() {
  const [user, setLocalUser] = useState<User>(globalUser);

  useEffect(() => {
    const handler = (u: User) => setLocalUser(u);
    listeners.push(handler);
    if (!globalUser) {
      const storedToken = localStorage.getItem(SESSION_KEY);
      if (storedToken) {
        try {
          const parts = storedToken.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            if (payload && payload.id && payload.email && payload.role && payload.exp) {
              if (payload.exp * 1000 > Date.now()) {
                globalUser = { id: payload.id, email: payload.email, role: payload.role };
                globalToken = storedToken;
                setLocalUser(globalUser);
              } else {
                localStorage.removeItem(SESSION_KEY);
              }
            }
          }
        } catch {}
      }
    }
    return () => {
      const idx = listeners.indexOf(handler);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data = await res.json();
      const token: string = data.token;
      localStorage.setItem(SESSION_KEY, token);
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1]));
      const user = { id: String(payload.id), email: payload.email, role: payload.role };
      setUser(user, token);
      return { ok: true };
    }
    const err = await res.json().catch(() => ({}));
    return { ok: false, error: err.error || 'Invalid credentials' };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const register = async (email: string, password: string) => {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) return { ok: true };
    return { ok: false, error: data.error || 'Registration failed' };
  };

  return { user, login, logout, register, isAdmin: user?.role === 'admin' };
}
