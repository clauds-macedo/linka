import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { EColors } from '../src/ui/tokens';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: EColors.BACKGROUND },
          animation: 'slide_from_right',
        }}
      />
    </>
  );
}
