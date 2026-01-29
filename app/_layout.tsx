import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { EColors } from '../src/ui/tokens';
import { AuthProvider, useAuth } from '../src/core/auth';
import { AbilityContext } from '../src/core/abilities';
import { I18nProvider } from '../src/core/i18n';

const AbilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { ability } = useAuth();
  return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>;
};

export default function RootLayout() {
  return (
    <I18nProvider>
      <AuthProvider>
        <AbilityProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: EColors.BACKGROUND },
              animation: 'slide_from_right',
            }}
          />
        </AbilityProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
