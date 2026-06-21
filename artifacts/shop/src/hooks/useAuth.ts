import { useState, useEffect } from 'react';

type User = {
  id: string;
  email: string;
  role?: string;
} | null;

let globalUser: User = null;
const listeners: Array<(user: User) => void> = [];

export function setUser(user: User) {
  globalUser = user;
  listeners.forEach((l) => l(user));
}

export function useAuth() {
  const [user, setLocalUser] = useState<User>(globalUser);

  useEffect(() => {
    const handler = (u: User) => setLocalUser(u);
    listeners.push(handler);
    // Try to restore session from localStorage
    const stored = localStorage.getItem('auth-session');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.user) {
          globalUser = parsed.user;
          setLocalUser(parsed.user);
        }
      } catch {}
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
      localStorage.setItem('auth-session', JSON.stringify(data));
      setUser(data.user);
      return { ok: true };
    }
    return { ok: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    localStorage.removeItem('auth-session');
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
