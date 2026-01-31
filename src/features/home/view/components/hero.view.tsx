import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Button, EButtonSize, EButtonVariant } from '../../../../ui/components/button';
import {
  EColors,
  ENeonColors,
  EGlassEffect,
  ESpacing,
  EFontSize,
  EFontWeight,
  EBorderRadius,
} from '../../../../ui/tokens';

interface IHeroProps {
  onCreateRoom: () => void;
}

export const Hero: React.FC<IHeroProps> = ({ onCreateRoom }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Assista <Text style={styles.titleHighlight}>junto</Text>
      </Text>

      <Text style={styles.subtitle}>
        Crie salas, convide amigos e assista vídeos sincronizados em tempo real.
      </Text>

        <Button.Root variant={EButtonVariant.HERO} size={EButtonSize.DEFAULT} onPress={onCreateRoom}>
          <Button.Text>Criar Sala</Button.Text>
        </Button.Root>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: ESpacing.XXXXXL,
    alignItems: 'center',
    gap: ESpacing.XXL,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESpacing.SM,
    backgroundColor: EGlassEffect.BACKGROUND,
    borderWidth: 1,
    borderColor: EGlassEffect.BORDER,
    paddingHorizontal: ESpacing.LG,
    paddingVertical: ESpacing.SM,
    borderRadius: EBorderRadius.FULL,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ENeonColors.GREEN,
  },
  badgeText: {
    fontSize: EFontSize.SM,
    fontWeight: EFontWeight.MEDIUM,
    color: EColors.FOREGROUND,
  },
  badgeCount: {
    fontWeight: EFontWeight.BOLD,
    color: ENeonColors.GREEN,
  },
  title: {
    fontSize: EFontSize.XXXXXL,
    fontWeight: EFontWeight.BOLD,
    color: EColors.FOREGROUND,
    textAlign: 'center',
    lineHeight: 52,
  },
  titleHighlight: {
    color: EColors.PRIMARY,
  },
  subtitle: {
    fontSize: EFontSize.LG,
    color: EColors.MUTED_FOREGROUND,
    textAlign: 'center',
    maxWidth: 600,
  },
  searchBar: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 500,
    backgroundColor: EGlassEffect.BACKGROUND,
    borderWidth: 1,
    borderColor: EGlassEffect.BORDER,
    borderRadius: EBorderRadius.XL,
    padding: ESpacing.XS,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: ESpacing.LG,
    paddingVertical: ESpacing.MD,
    fontSize: EFontSize.BASE,
    color: EColors.FOREGROUND,
  },
});
