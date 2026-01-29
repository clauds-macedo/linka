import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { TUser, TAuthState } from '../../domain/user';
import { defineAbilitiesFor, TAppAbility } from '../abilities';

type TAuthContextValue = TAuthState & {
  login: (user: TUser) => void;
  logout: () => void;
  updateUser: (user: TUser) => void;
  ability: TAppAbility;
};

const AuthContext = createContext<TAuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<TAuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const ability = useMemo(() => defineAbilitiesFor(authState.user), [authState.user]);

  const login = useCallback((user: TUser) => {
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const updateUser = useCallback((user: TUser) => {
    setAuthState((prev) => ({
      ...prev,
      user,
    }));
  }, []);

  const value = useMemo(
    () => ({
      ...authState,
      login,
      logout,
      updateUser,
      ability,
    }),
    [authState, login, logout, updateUser, ability]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
