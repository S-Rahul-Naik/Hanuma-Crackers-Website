import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMe = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.success !== false && data.user) {
          setUser(data.user);
          setError(null);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (e: any) {
      setUser(null);
      setError(e.message || 'Failed to load auth user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const logout = useCallback(async () => {
    try { await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }); } catch (_) {}
    setUser(null);
  }, []);

  const value: AuthContextValue = { user, loading, error, refresh: fetchMe, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}