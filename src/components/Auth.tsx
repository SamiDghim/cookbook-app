import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';

type User = { id: string; username: string } | null;

const AuthContext = createContext<{
  user: User;
  token: string | null;
  setToken: (t: string | null) => void;
  logout: () => void;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem('token', token);
      // optionally fetch profile
      api.get('/api/profile').then(r => setUser(r.data.user)).catch(() => setUser(null));
    } else {
      delete api.defaults.headers.common.Authorization;
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  function logout() {
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
