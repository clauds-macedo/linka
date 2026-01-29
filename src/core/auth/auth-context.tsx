import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { TAuthState } from '../../domain/user';
import { defineAbilitiesFor, TAppAbility } from '../abilities';
import { AuthService } from './auth-service';

type TAuthContextValue = TAuthState & {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  ability: TAppAbility;
};

const AuthContext = createContext<TAuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<TAuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const ability = useMemo(() => defineAbilitiesFor(authState.user), [authState.user]);

  useEffect(() => {
    const unsubscribe = AuthService.subscribe((user) => {
      setAuthState({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      });
    });
    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    await AuthService.signIn({ email, password });
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    await AuthService.signUp({ email, password });
  }, []);

  const signOut = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    await AuthService.signOut();
  }, []);

  const value = useMemo(
    () => ({
      ...authState,
      signIn,
      signUp,
      signOut,
      ability,
    }),
    [authState, signIn, signUp, signOut, ability]
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
