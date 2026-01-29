import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, EButtonVariant, EButtonSize } from '../../../../ui/components/button';
import {
  EColors,
  EGradients,
  ESpacing,
  EFontSize,
  EFontWeight,
  EBorderRadius,
} from '../../../../ui/tokens';

interface IHeaderProps {
  onCreateRoom?: () => void;
}

export const Header: React.FC<IHeaderProps> = ({ onCreateRoom }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <LinearGradient
          colors={[...EGradients.PRIMARY]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoIcon}
        >
          <Text style={styles.logoIconText}>L</Text>
        </LinearGradient>
        <Text style={styles.logoText}>Linka</Text>
      </View>

      <View style={styles.rightActions}>
        {onCreateRoom && (
          <Button.Root variant={EButtonVariant.HERO} size={EButtonSize.DEFAULT} onPress={onCreateRoom}>
            <Text style={styles.plusIcon}>+</Text>
            <Button.Text>Criar Sala</Button.Text>
          </Button.Root>
        )}
        <View style={styles.avatar}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=5' }}
            style={styles.avatarImage}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: ESpacing.LG,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESpacing.MD,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: EBorderRadius.LG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIconText: {
    fontSize: EFontSize.XL,
    fontWeight: EFontWeight.BOLD,
    color: '#ffffff',
  },
  logoText: {
    fontSize: EFontSize.XXL,
    fontWeight: EFontWeight.BOLD,
    color: EColors.FOREGROUND,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESpacing.MD,
  },
  plusIcon: {
    fontSize: EFontSize.LG,
    color: '#ffffff',
    fontWeight: EFontWeight.BOLD,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: EBorderRadius.FULL,
    borderWidth: 2,
    borderColor: EColors.PRIMARY,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
});
