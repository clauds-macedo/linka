import { ReactNode } from 'react';
import { PressableProps, TextProps, ViewStyle } from 'react-native';

export enum EButtonVariant {
  DEFAULT = 'default',
  HERO = 'hero',
  SECONDARY = 'secondary',
  GHOST = 'ghost',
  OUTLINE = 'outline',
  DESTRUCTIVE = 'destructive',
}

export enum EButtonSize {
  SM = 'sm',
  DEFAULT = 'default',
  LG = 'lg',
  ICON = 'icon',
}

export interface IButtonContext {
  variant: EButtonVariant;
  size: EButtonSize;
  disabled: boolean;
}

export interface IButtonRootProps extends Omit<PressableProps, 'style'> {
  variant?: EButtonVariant;
  size?: EButtonSize;
  disabled?: boolean;
  children: ReactNode;
  style?: ViewStyle;
}

export interface IButtonTextProps extends Omit<TextProps, 'style'> {
  children: ReactNode;
}

export interface IButtonIconProps {
  children: ReactNode;
}
