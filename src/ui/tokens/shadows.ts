import { ViewStyle } from 'react-native';

export const EShadows: Record<string, ViewStyle> = {
  GLOW_PRIMARY: {
    shadowColor: 'hsl(262, 83%, 58%)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 20,
  },
  GLOW_ACCENT: {
    shadowColor: 'hsl(199, 89%, 48%)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 20,
  },
  GLOW_DESTRUCTIVE: {
    shadowColor: 'hsl(0, 84%, 60%)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
} as const;

export type TShadowKey = keyof typeof EShadows;
