import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../api/client';
import { authenticateDemoUser, parseDemoToken } from '../api/demoAuth';
import { isMockModeEnabled, setMockModeEnabled } from '../api/mockMode';

const AUTH_TOKEN_KEY = 'authToken';

const NETWORK_ERROR_MESSAGE =
  'Cannot reach the FitForecast API. Start the backend (port 3000), or use a demo account (athena/boris/cora @example.com / password123) for offline mode.';

const isNetworkFailure = (error: unknown) => {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return (
    error.name === 'TypeError' ||
    message.includes('failed to fetch') ||
    message.includes('networkerror') ||
    message.includes('load failed') ||
    message.includes('network request failed')
  );
};

/** Vercel SPA/static hosts often return HTML or 404/405 for /api/* when no backend exists. */
const isUnreachableApiResponse = (response: Response) => {
  if ([404, 405, 501, 502, 503, 504].includes(response.status)) {
    return true;
  }

  const contentType = response.headers.get('content-type') ?? '';
  return contentType.includes('text/html');
};

const parseApiError = async (response: Response, fallbackMessage: string) => {
  try {
    const payload = await response.json();

    if (Array.isArray(payload?.errors) && payload.errors.length > 0) {
      const firstMessage = payload.errors[0]?.message;
      if (typeof firstMessage === 'string' && firstMessage.trim().length > 0) {
        return firstMessage;
      }
    }

    if (typeof payload?.message === 'string' && payload.message.trim().length > 0) {
      return payload.message;
    }
  } catch {
    // Ignore malformed/non-JSON error payloads and fall back to a generic message.
  }

  return fallbackMessage;
};

const decodeJwtExpiry = (tokenValue: string) => {
  try {
    const [, payload] = tokenValue.split('.');
    if (!payload) {
      return null;
    }

    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as { exp?: number };
    return typeof decoded.exp === 'number' ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
};

const isExpiredToken = (tokenValue: string) => {
  if (parseDemoToken(tokenValue)) {
    return false;
  }
  const expiryMs = decodeJwtExpiry(tokenValue);
  return expiryMs !== null && expiryMs <= Date.now();
};

const applyDemoSession = (
  email: string,
  password: string,
  setToken: (token: string) => void,
  setUser: (user: User) => void
) => {
  const demo = authenticateDemoUser(email, password);
  if (!demo) {
    return false;
  }

  setMockModeEnabled(true);
  setToken(demo.token);
  setUser(demo.user);
  localStorage.setItem(AUTH_TOKEN_KEY, demo.token);
  return true;
};

interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    if (storedToken) {
      if (isExpiredToken(storedToken)) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setMockModeEnabled(false);
        setIsLoading(false);
        return;
      }

      const demoUser = parseDemoToken(storedToken);
      if (demoUser) {
        setMockModeEnabled(true);
        setToken(storedToken);
        setUser(demoUser);
        setIsLoading(false);
        return;
      }

      setToken(storedToken);
      // Verify token and load user info
      fetchCurrentUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const response = await fetch(`${api.baseURL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      // Clear invalid token
      localStorage.removeItem(AUTH_TOKEN_KEY);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    // Frontend-only deploys (e.g. Vercel) and explicit mock mode: never hit the network.
    if (isMockModeEnabled()) {
      if (applyDemoSession(email, password, setToken, setUser)) {
        return;
      }
      throw new Error('Invalid email or password. Demo accounts use password123.');
    }

    try {
      const response = await fetch(`${api.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (isUnreachableApiResponse(response)) {
        if (applyDemoSession(email, password, setToken, setUser)) {
          return;
        }
        throw new Error(NETWORK_ERROR_MESSAGE);
      }

      if (!response.ok) {
        const message = await parseApiError(response, 'Login failed');
        throw new Error(message);
      }

      const data = await response.json();
      setMockModeEnabled(false);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    } catch (error) {
      console.error('Login error:', error);
      if (isNetworkFailure(error)) {
        if (applyDemoSession(email, password, setToken, setUser)) {
          return;
        }
        throw new Error(NETWORK_ERROR_MESSAGE);
      }
      throw error;
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    if (isMockModeEnabled()) {
      throw new Error(
        'Signup requires a live API. Use a demo account (athena/boris/cora @example.com / password123) instead.'
      );
    }

    try {
      const response = await fetch(`${api.baseURL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (isUnreachableApiResponse(response)) {
        throw new Error(NETWORK_ERROR_MESSAGE);
      }

      if (!response.ok) {
        const message = await parseApiError(response, 'Signup failed');
        throw new Error(message);
      }

      const data = await response.json();
      setMockModeEnabled(false);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    } catch (error) {
      console.error('Signup error:', error);
      if (isNetworkFailure(error)) {
        throw new Error(NETWORK_ERROR_MESSAGE);
      }
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    // Keep compile-time mock mode; only clear session fallback.
    if (import.meta.env.VITE_ENABLE_MOCK_DATA !== 'true') {
      setMockModeEnabled(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
