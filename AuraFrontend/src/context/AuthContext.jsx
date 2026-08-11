/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getMe, login as apiLogin, logout as apiLogout, register as apiRegister } from '../api/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user from backend on mount if token exists
  const refetchUser = useCallback(async () => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return null;
    }

    try {
      const userData = await getMe();
      setUser(userData);
      return userData;
    } catch (err) {
      console.warn('AuthContext: failed to fetch current user profile, purging session.', err);
      apiLogout();
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetchUser();

    const handleLogout = () => {
      setUser(null);
    };
    window.addEventListener('aura_logout', handleLogout);
    return () => window.removeEventListener('aura_logout', handleLogout);
  }, [refetchUser]);

  const login = useCallback(async (email, password) => {
    const res = await apiLogin({ email, password });
    const userData = await refetchUser();
    return { response: res, user: userData };
  }, [refetchUser]);

  const register = useCallback(async (dto) => {
    return await apiRegister(dto);
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    register,
    logout,
    refetchUser,
  }), [user, isLoading, login, register, logout, refetchUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
