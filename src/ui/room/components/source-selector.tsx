import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Youtube } from 'lucide-react-native';
import { EVideoSource } from '../../../domain/room/enums';
import { EBorderRadius, EColors, EFontSize, EFontWeight, ESpacing } from '../../tokens';

type TSourceSelectorProps = {
  onSelect: (source: EVideoSource) => void;
};

export const SourceSelector: React.FC<TSourceSelectorProps> = ({ onSelect }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.option}
        onPress={() => onSelect(EVideoSource.YOUTUBE)}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Youtube size={32} color="#FFFFFF" />
        </View>
        <Text style={styles.label}>YouTube</Text>
        <Text style={styles.description}>Assista vídeos juntos</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ESpacing.MD,
  },
  option: {
    alignItems: 'center',
    backgroundColor: EColors.CARD,
    borderRadius: EBorderRadius.XL,
    borderWidth: 1,
    borderColor: EColors.BORDER,
    padding: ESpacing.XL,
    minWidth: 140,
    gap: ESpacing.SM,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: EBorderRadius.LG,
    backgroundColor: '#FF0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: EFontSize.BASE,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
  },
  description: {
    fontSize: EFontSize.XS,
    color: EColors.MUTED_FOREGROUND,
    textAlign: 'center',
  },
});
