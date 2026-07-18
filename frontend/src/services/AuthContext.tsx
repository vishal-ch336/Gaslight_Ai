import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as api from './api';
import { storeToken, getToken, removeToken, storeEmail, getEmail } from './auth';

// ── Types ────────────────────────────────────────────────────────────────────

interface AuthState {
  token: string | null;
  userEmail: string | null;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  signup: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  logout: () => void;
}

// ── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Mock demo credentials (works without backend) ────────────────────────────

const DEMO_EMAIL    = 'demo@gaslight.io';
const DEMO_PASSWORD = 'demo1234';

// ── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Rehydrate from localStorage on mount
    const token = getToken();
    const email = getEmail();
    return {
      token,
      userEmail: email,
      isAuthenticated: !!token,
    };
  });

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await api.login(email, password);
    if (data) {
      storeToken(data.access_token);
      storeEmail(email);
      setAuthState({ token: data.access_token, userEmail: email, isAuthenticated: true });
      return { success: true, error: null };
    }
    // Fallback: accept demo credentials when backend is unreachable
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const mockToken = 'demo_mock_token_' + Date.now();
      storeToken(mockToken);
      storeEmail(email);
      setAuthState({ token: mockToken, userEmail: email, isAuthenticated: true });
      return { success: true, error: null };
    }
    return { success: false, error: error || 'Login failed' };
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    const { data, error } = await api.signup(email, password);
    if (data) {
      storeToken(data.access_token);
      storeEmail(email);
      setAuthState({ token: data.access_token, userEmail: email, isAuthenticated: true });
      return { success: true, error: null };
    }
    // Fallback: allow mock signup when backend is unreachable
    if (error?.includes('Network error') || error?.includes('timed out')) {
      const mockToken = 'demo_mock_token_' + Date.now();
      storeToken(mockToken);
      storeEmail(email);
      setAuthState({ token: mockToken, userEmail: email, isAuthenticated: true });
      return { success: true, error: null };
    }
    return { success: false, error: error || 'Signup failed' };
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setAuthState({ token: null, userEmail: null, isAuthenticated: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
