export const ESpacing = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  XXL: 24,
  XXXL: 32,
  XXXXL: 40,
  XXXXXL: 48,
  XXXXXXL: 64,
} as const;

export type TSpacingKey = keyof typeof ESpacing;
