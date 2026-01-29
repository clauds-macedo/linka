import React from 'react';
import { View, StyleSheet } from 'react-native';
import { EColors, ESpacing } from '../../tokens';

type TRoomRootProps = {
  children: React.ReactNode;
};

export const RoomRoot: React.FC<TRoomRootProps> = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: EColors.BACKGROUND,
    padding: ESpacing.LG,
    gap: ESpacing.LG,
  },
});
