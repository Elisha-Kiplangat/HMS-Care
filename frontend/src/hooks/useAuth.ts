import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, isAuthenticated, activeRole, setUser, logout } = useAuthStore();
  return {
    user,
    isAuthenticated,
    role: activeRole,
    setUser,
    logout,
  };
};
