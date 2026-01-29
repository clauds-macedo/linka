import { TextStyle } from 'react-native';

export const EFontFamily = {
  DISPLAY: 'SpaceGrotesk-Bold',
  DISPLAY_SEMIBOLD: 'SpaceGrotesk-SemiBold',
  DISPLAY_MEDIUM: 'SpaceGrotesk-Medium',
  BODY: 'Inter-Regular',
  BODY_MEDIUM: 'Inter-Medium',
  BODY_SEMIBOLD: 'Inter-SemiBold',
  BODY_BOLD: 'Inter-Bold',
} as const;

export const EFontSize = {
  XS: 12,
  SM: 14,
  BASE: 16,
  LG: 18,
  XL: 20,
  XXL: 24,
  XXXL: 30,
  XXXXL: 36,
  XXXXXL: 48,
  XXXXXXL: 60,
} as const;

export const ELineHeight = {
  XS: 16,
  SM: 20,
  BASE: 24,
  LG: 28,
  XL: 28,
  XXL: 32,
  XXXL: 36,
  XXXXL: 40,
  XXXXXL: 48,
  XXXXXXL: 60,
} as const;

export const EFontWeight: Record<string, TextStyle['fontWeight']> = {
  LIGHT: '300',
  REGULAR: '400',
  MEDIUM: '500',
  SEMIBOLD: '600',
  BOLD: '700',
  EXTRABOLD: '800',
} as const;

export type TFontSizeKey = keyof typeof EFontSize;
