import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { EColors } from '../src/ui/tokens';
import { AuthProvider, useAuth } from '../src/core/auth';
import { AbilityContext } from '../src/core/abilities';
import { I18nProvider } from '../src/core/i18n';

const AUTH_ROUTES = ['sign-in', 'sign-up'];

const AbilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { ability } = useAuth();
  return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>;
};

const NavigationGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const currentRoute = segments[0] ?? '';
    const isAuthRoute = AUTH_ROUTES.includes(currentRoute);

    if (isAuthenticated && isAuthRoute) {
      router.replace('/');
    } else if (!isAuthenticated && !isAuthRoute) {
      router.replace('/sign-in');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  return <>{children}</>;
};

export default function RootLayout() {
  return (
    <I18nProvider>
      <AuthProvider>
        <AbilityProvider>
          <NavigationGuard>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: EColors.BACKGROUND },
                animation: 'slide_from_right',
              }}
            />
          </NavigationGuard>
        </AbilityProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
