import { create } from 'zustand';
import { User, UserRole } from '../types';
import { setAccessToken, setRefreshToken } from '../services/apiClient';

const USER_KEY = 'hms.user';

const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const storedUser = window.localStorage.getItem(USER_KEY);
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    window.localStorage.removeItem(USER_KEY);
    return null;
  }
};

const clearStoredSession = () => {
  if (typeof window !== 'undefined') window.localStorage.removeItem(USER_KEY);
  setAccessToken(null);
  setRefreshToken(null);
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  activeRole: UserRole | null;
  setUser: (user: User | null) => void;
  setRole: (role: UserRole | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  isAuthenticated: !!getStoredUser(),
  activeRole: getStoredUser()?.role || null,
  setUser: (user) => {
    if (typeof window !== 'undefined') {
      if (user) window.localStorage.setItem(USER_KEY, JSON.stringify(user));
      else window.localStorage.removeItem(USER_KEY);
    }
    set({ user, isAuthenticated: !!user, activeRole: user?.role || null });
  },
  setRole: (role) => set({ activeRole: role }),
  logout: () => {
    clearStoredSession();
    set({ user: null, isAuthenticated: false, activeRole: null });
  },
}));

if (typeof window !== 'undefined') {
  window.addEventListener('auth:unauthorized', () => useAuthStore.getState().logout());
}
