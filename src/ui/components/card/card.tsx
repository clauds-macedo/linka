import React from 'react';
import { View, StyleSheet } from 'react-native';
import { EGlassEffect, EBorderRadius, ESpacing } from '../../tokens';
import { ICardProps } from './card.types';

export const Card: React.FC<ICardProps> = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: EBorderRadius.XL,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: EGlassEffect.BORDER,
    backgroundColor: EGlassEffect.BACKGROUND,
  },
  content: {
    padding: ESpacing.LG,
  },
});
