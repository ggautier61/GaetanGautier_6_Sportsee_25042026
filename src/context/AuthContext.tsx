'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { apiService, UserInfoResponse, ActivitySession } from '@/services/api';

interface AuthUser {
  userId: string;
  info?: UserInfoResponse;
  activity?: ActivitySession[];
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refetchUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userInfo = await apiService.getUserInfo();

      const startDate = userInfo.profile.createdAt || new Date(2025, 0, 1).toISOString().split('T')[0];
      const endDate = new Date().toISOString().split('T')[0];

      const userActivity = await apiService.getUserActivity(startDate, endDate);

      setUser({
        userId: userInfo.profile.firstName.toLowerCase() + userInfo.profile.lastName.toLowerCase(),
        info: userInfo,
        activity: userActivity,
      });
    } catch (err) {
      setUser(null);
      apiService.logout();
      setError('Session expirée');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = apiService.getToken();
    if (token) {
      loadUserData();
    } else {
      setIsLoading(false);
    }
  }, [loadUserData]);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.login({ username, password });
      setUser({ userId: response.userId });
      await loadUserData();
    } catch (err) {
      setError('Identifiants incorrects');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  const refetchUserData = async () => {
    if (user) {
      await loadUserData();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
        refetchUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
