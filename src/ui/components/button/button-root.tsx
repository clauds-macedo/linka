import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { EColors, EGradients, ESpacing, EBorderRadius, EShadows } from '../../tokens';
import { ButtonProvider } from './button-context';
import { EButtonSize, EButtonVariant, IButtonRootProps } from './button.types';

const getSizeStyles = (size: EButtonSize): ViewStyle => {
  const styles: Record<EButtonSize, ViewStyle> = {
    [EButtonSize.SM]: {
      height: 36,
      paddingHorizontal: ESpacing.MD,
      borderRadius: EBorderRadius.MD,
    },
    [EButtonSize.DEFAULT]: {
      height: 40,
      paddingHorizontal: ESpacing.LG,
      borderRadius: EBorderRadius.MD,
    },
    [EButtonSize.LG]: {
      height: 44,
      paddingHorizontal: ESpacing.XXXL,
      borderRadius: EBorderRadius.MD,
    },
    [EButtonSize.ICON]: {
      height: 40,
      width: 40,
      paddingHorizontal: 0,
      borderRadius: EBorderRadius.MD,
    },
  };
  return styles[size];
};

const isGradientVariant = (variant: EButtonVariant): boolean => {
  return variant === EButtonVariant.DEFAULT || variant === EButtonVariant.HERO;
};

const getVariantStyles = (variant: EButtonVariant, pressed: boolean): ViewStyle => {
  const pressedOpacity = pressed ? 0.8 : 1;

  const styles: Record<EButtonVariant, ViewStyle> = {
    [EButtonVariant.DEFAULT]: {
      opacity: pressedOpacity,
    },
    [EButtonVariant.HERO]: {
      opacity: pressedOpacity,
      ...EShadows.GLOW_PRIMARY,
    },
    [EButtonVariant.SECONDARY]: {
      backgroundColor: pressed ? EColors.MUTED : EColors.SECONDARY,
    },
    [EButtonVariant.OUTLINE]: {
      backgroundColor: pressed ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
      borderWidth: 1,
      borderColor: EColors.INPUT,
    },
    [EButtonVariant.GHOST]: {
      backgroundColor: pressed ? 'rgba(14, 165, 233, 0.1)' : 'transparent',
    },
    [EButtonVariant.DESTRUCTIVE]: {
      backgroundColor: pressed ? '#dc2626' : EColors.DESTRUCTIVE,
    },
  };
  return styles[variant];
};

const getHeroSizeOverrides = (size: EButtonSize): ViewStyle => {
  if (size === EButtonSize.LG) {
    return {
      paddingHorizontal: ESpacing.XXXL,
      paddingVertical: ESpacing.XXL,
      borderRadius: EBorderRadius.XL,
    };
  }
  return {};
};

export const ButtonRoot: React.FC<IButtonRootProps> = ({
  variant = EButtonVariant.DEFAULT,
  size = EButtonSize.DEFAULT,
  disabled = false,
  children,
  style,
  ...props
}) => {
  const sizeStyles = getSizeStyles(size);
  const heroOverrides = variant === EButtonVariant.HERO ? getHeroSizeOverrides(size) : {};

  return (
    <ButtonProvider value={{ variant, size, disabled }}>
      <Pressable
        disabled={disabled}
        style={({ pressed }) => [
          styles.base,
          !isGradientVariant(variant) && getVariantStyles(variant, pressed),
          !isGradientVariant(variant) && sizeStyles,
          !isGradientVariant(variant) && heroOverrides,
          disabled && styles.disabled,
          !isGradientVariant(variant) && style,
        ]}
        {...props}
      >
        {({ pressed }) =>
          isGradientVariant(variant) ? (
            <LinearGradient
              colors={[...EGradients.PRIMARY]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.gradient,
                sizeStyles,
                heroOverrides,
                getVariantStyles(variant, pressed),
                style,
              ]}
            >
              {children}
            </LinearGradient>
          ) : (
            <View style={styles.content}>{children}</View>
          )
        }
      </Pressable>
    </ButtonProvider>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ESpacing.SM,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ESpacing.SM,
  },
  disabled: {
    opacity: 0.5,
  },
});
