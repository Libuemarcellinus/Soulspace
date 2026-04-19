import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, AuthResponse } from '../lib/api';
import { clearAllLikes } from '../lib/likeStorage';

interface User {
  id: string;
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
    // No token = logged out; soulspace_user may still exist (kept for login ID comparison)
    if (!storedToken) {
      setIsLoading(false);
      return;
    }
    if (!storedUser) {
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
    setIsLoading(false);
  }, []);

  const persist = (data: AuthResponse) => {
    const u = { id: data.data.user_id, username: data.data.username };
    localStorage.setItem('soulspace_token', data.token);
    localStorage.setItem('soulspace_user', JSON.stringify(u));
    setToken(data.token);
    setUser(u);
  };

  const login = async (username: string, password: string) => {
    // Only wipe likes if a different user is logging in
    const storedUser = localStorage.getItem('soulspace_user');
    let storedId: string | null = null;
    try { storedId = storedUser ? JSON.parse(storedUser)?.id : null; } catch { /* */ }
    const data = await authApi.login(username, password);
    if (storedId !== data.data.user_id) clearAllLikes();
    persist(data);
  };

  const register = async (username: string, password: string) => {
    clearAllLikes(); // always fresh for a brand-new account
    const data = await authApi.register(username, password);
    persist(data);
  };

  const logout = () => {
    // Keep soulspace_user so the next login can compare IDs and preserve likes for same user
    localStorage.removeItem('soulspace_token');
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
