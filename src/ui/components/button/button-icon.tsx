import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IButtonIconProps } from './button.types';

export const ButtonIcon: React.FC<IButtonIconProps> = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
