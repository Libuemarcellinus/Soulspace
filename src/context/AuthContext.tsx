import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, AuthResponse } from '../lib/api';

interface User {
  id: number;
  username: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('soulspace_token');
    const storedUser = localStorage.getItem('soulspace_user');
    if (!storedToken || !storedUser) {
      setIsLoading(false);
      return;
    }
    // Restore from cache immediately so the app can proceed without waiting for the network
    try {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } catch {
      setIsLoading(false);
      return;
    }
    // Unblock the UI now — profile check runs in the background
    setIsLoading(false);
    // Verify token validity in the background; clear session only on explicit auth errors
    authApi.profile()
      .then((data) => {
        setUser({ id: data.id, username: data.username });
      })
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : '';
        if (/401|403|invalid token/i.test(msg)) {
          localStorage.removeItem('soulspace_token');
          localStorage.removeItem('soulspace_user');
          setToken(null);
          setUser(null);
        }
      });
  }, []);

  const persist = (data: AuthResponse) => {
    const u = { id: data.id, username: data.username };
    localStorage.setItem('soulspace_token', data.token);
    localStorage.setItem('soulspace_user', JSON.stringify(u));
    setToken(data.token);
    setUser(u);
  };

  const login = async (username: string, password: string) => {
    const data = await authApi.login(username, password);
    persist(data);
  };

  const register = async (username: string, password: string) => {
    const data = await authApi.register(username, password);
    persist(data);
  };

  const logout = () => {
    localStorage.removeItem('soulspace_token');
    localStorage.removeItem('soulspace_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
