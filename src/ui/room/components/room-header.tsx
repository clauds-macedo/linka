import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EColors, EFontSize, EFontWeight, ESpacing } from '../../tokens';
import { useI18n } from '../../../core/i18n';

type TRoomHeaderProps = {
  title: string;
  subtitle: string;
  isHost: boolean;
};

export const RoomHeader: React.FC<TRoomHeaderProps> = ({ title, subtitle, isHost }) => {
  const { t } = useI18n();

  return (
    <View style={styles.container}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={[styles.badge, isHost ? styles.badgeHost : styles.badgeGuest]}>
        <Text style={styles.badgeText}>
          {isHost ? t('room.header.host') : t('room.header.participant')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textBlock: {
    gap: ESpacing.XS,
  },
  title: {
    fontSize: EFontSize.XL,
    fontWeight: EFontWeight.BOLD,
    color: EColors.FOREGROUND,
  },
  subtitle: {
    fontSize: EFontSize.SM,
    color: EColors.MUTED_FOREGROUND,
  },
  badge: {
    paddingHorizontal: ESpacing.MD,
    paddingVertical: ESpacing.XS,
    borderRadius: 999,
  },
  badgeHost: {
    backgroundColor: EColors.PRIMARY,
  },
  badgeGuest: {
    backgroundColor: EColors.CARD,
  },
  badgeText: {
    fontSize: EFontSize.XS,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
  },
});
