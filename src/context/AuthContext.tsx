import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, getStoredToken, setStoredToken } from '../api/client.ts';
import { User } from '../types/index.ts';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; role?: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  demoLogin: (role: 'customer' | 'admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      const token = getStoredToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.getMe();
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          setStoredToken(null);
        }
      } catch {
        setStoredToken(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await api.login(credentials);
    if (res.success) {
      setStoredToken(res.token);
      setUser(res.user);
    }
  };

  const register = async (payload: { name: string; email: string; password: string; role?: string }) => {
    const res = await api.register(payload);
    if (res.success) {
      setStoredToken(res.token);
      setUser(res.user);
    }
  };

  const logout = () => {
    setStoredToken(null);
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    const res = await api.updateProfile(updates);
    if (res.success && res.user) {
      setUser(res.user);
    }
  };

  const demoLogin = async (role: 'customer' | 'admin') => {
    const credentials =
      role === 'admin'
        ? { email: 'admin@vestra.com', password: 'admin123' }
        : { email: 'customer@vestra.com', password: 'user123' };
    await login(credentials);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
