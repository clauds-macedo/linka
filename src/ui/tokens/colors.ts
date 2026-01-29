export const EColors = {
  BACKGROUND: '#0d0e14',
  FOREGROUND: '#fafafa',

  CARD: '#16171f',
  CARD_FOREGROUND: '#fafafa',

  PRIMARY: '#8b5cf6',
  PRIMARY_FOREGROUND: '#ffffff',

  SECONDARY: '#202128',
  SECONDARY_FOREGROUND: '#fafafa',

  MUTED: '#2a2b33',
  MUTED_FOREGROUND: '#9d9ea8',

  ACCENT: '#0ea5e9',
  ACCENT_FOREGROUND: '#ffffff',

  DESTRUCTIVE: '#ef4444',
  DESTRUCTIVE_FOREGROUND: '#ffffff',

  BORDER: '#2a2b33',
  INPUT: '#2a2b33',
  RING: '#8b5cf6',
} as const;

export const ENeonColors = {
  PURPLE: '#8b5cf6',
  BLUE: '#0ea5e9',
  PINK: '#ec4899',
  GREEN: '#4ade80',
} as const;

export const EGradients = {
  PRIMARY: ['#8b5cf6', '#0ea5e9'] as const,
  ACCENT: ['#ec4899', '#8b5cf6'] as const,
  GLOW: ['rgba(139, 92, 246, 0.3)', 'rgba(14, 165, 233, 0.3)'] as const,
} as const;

export const EGlassEffect = {
  BACKGROUND: 'rgba(22, 23, 31, 0.8)',
  BORDER: 'rgba(255, 255, 255, 0.1)',
  BACKDROP_BLUR: 20,
} as const;

export type TColorKey = keyof typeof EColors;
export type TNeonColorKey = keyof typeof ENeonColors;
