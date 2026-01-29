import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { EColors, EFontSize, EFontWeight } from '../../tokens';
import { useButtonContext } from './button-context';
import { EButtonSize, EButtonVariant, IButtonTextProps } from './button.types';

const getTextColor = (variant: EButtonVariant): string => {
  const colors: Record<EButtonVariant, string> = {
    [EButtonVariant.DEFAULT]: EColors.PRIMARY_FOREGROUND,
    [EButtonVariant.HERO]: EColors.PRIMARY_FOREGROUND,
    [EButtonVariant.SECONDARY]: EColors.SECONDARY_FOREGROUND,
    [EButtonVariant.OUTLINE]: EColors.FOREGROUND,
    [EButtonVariant.GHOST]: EColors.FOREGROUND,
    [EButtonVariant.DESTRUCTIVE]: EColors.DESTRUCTIVE_FOREGROUND,
  };
  return colors[variant];
};

const getTextSize = (size: EButtonSize): TextStyle => {
  const sizes: Record<EButtonSize, TextStyle> = {
    [EButtonSize.SM]: { fontSize: EFontSize.SM },
    [EButtonSize.DEFAULT]: { fontSize: EFontSize.SM },
    [EButtonSize.LG]: { fontSize: EFontSize.SM },
    [EButtonSize.ICON]: { fontSize: EFontSize.SM },
  };
  return sizes[size];
};

export const ButtonText: React.FC<IButtonTextProps> = ({ children, ...props }) => {
  const { variant, size } = useButtonContext();

  return (
    <Text
      style={[styles.text, { color: getTextColor(variant) }, getTextSize(size)]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontWeight: EFontWeight.SEMIBOLD,
  },
});
