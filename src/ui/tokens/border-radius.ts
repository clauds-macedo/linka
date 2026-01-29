export const EBorderRadius = {
  SM: 6,
  MD: 8,
  LG: 12,
  XL: 16,
  XXL: 20,
  FULL: 9999,
} as const;

export type TBorderRadiusKey = keyof typeof EBorderRadius;
