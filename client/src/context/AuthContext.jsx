import { createContext, useContext, useEffect, useState } from 'react';
import request from '../api/client';

// Now backed by the Express API (see tasky-server). The JWT and a cached
// copy of the user are kept in localStorage so a refresh doesn't log you
// out, but the source of truth is always the server: on load we call
// /auth/me to make sure the token is still valid.

const AuthContext = createContext(null);
const TOKEN_KEY = 'tasky_token';
const USER_KEY = 'tasky_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    request('/auth/me')
      .then(({ user }) => {
        setUser(user);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  function persistSession({ user, token }) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setUser(user);
  }

  async function signup({ name, email, password }) {
    try {
      const data = await request('/auth/signup', {
        method: 'POST',
        body: { name, email, password },
        auth: false,
      });
      persistSession(data);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  async function login({ email, password }) {
    try {
      const data = await request('/auth/login', {
        method: 'POST',
        body: { email, password },
        auth: false,
      });
      persistSession(data);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  async function updateProfile(updates) {
    const data = await request('/auth/profile', { method: 'PUT', body: updates });
    setUser(data.user);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }

  const value = { user, isAuthenticated: !!user, loading, login, signup, logout, updateProfile };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
