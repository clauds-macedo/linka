import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../../../../ui/components/card';
import {
  EColors,
  ENeonColors,
  ESpacing,
  EFontSize,
  EFontWeight,
  EBorderRadius,
  EGlassEffect,
} from '../../../../ui/tokens';
import { ERoomStatus } from '../../../../domain/room';
import { IRoomCardProps } from './room-card.types';

const getStatusLabel = (status: ERoomStatus): string => {
  const labels: Record<ERoomStatus, string> = {
    [ERoomStatus.LIVE]: 'AO VIVO',
    [ERoomStatus.UPCOMING]: 'EM BREVE',
    [ERoomStatus.ENDED]: 'ENCERRADO',
  };
  return labels[status];
};

const getStatusColor = (status: ERoomStatus): string => {
  const colors: Record<ERoomStatus, string> = {
    [ERoomStatus.LIVE]: 'rgba(239, 68, 68, 0.9)',
    [ERoomStatus.UPCOMING]: 'rgba(245, 158, 11, 0.9)',
    [ERoomStatus.ENDED]: EColors.MUTED,
  };
  return colors[status];
};

export const RoomCard: React.FC<IRoomCardProps> = ({ room, onPress }) => {
  const handlePress = () => {
    onPress(room.id);
  };

  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [pressed && styles.pressed]}>
      <Card style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: room.coverImage }} style={styles.coverImage} />
          <LinearGradient
            colors={['rgba(13, 14, 20, 0.9)', 'transparent', 'transparent']}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.imageOverlay}
          />
          {room.status === ERoomStatus.LIVE && (
            <View style={[styles.liveBadge, { backgroundColor: getStatusColor(room.status) }]}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>{getStatusLabel(room.status)}</Text>
            </View>
          )}
          {room.status !== ERoomStatus.LIVE && (
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(room.status) }]}>
              <Text style={styles.statusText}>{getStatusLabel(room.status)}</Text>
            </View>
          )}
        </View>

        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {room.title}
          </Text>

          <View style={styles.meta}>
            <Text style={styles.hostName}>{room.hostName}</Text>
            <View style={styles.viewerContainer}>
              <View style={styles.viewerIcon} />
              <Text style={styles.viewerCount}>{room.viewerCount.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressed: {
    transform: [{ scale: 1.02 }],
  },
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 16 / 9,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  liveBadge: {
    position: 'absolute',
    top: ESpacing.MD,
    left: ESpacing.MD,
    paddingHorizontal: ESpacing.SM,
    paddingVertical: ESpacing.XS,
    borderRadius: EBorderRadius.FULL,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  liveText: {
    color: '#ffffff',
    fontSize: EFontSize.XS,
    fontWeight: EFontWeight.SEMIBOLD,
  },
  statusBadge: {
    position: 'absolute',
    top: ESpacing.MD,
    left: ESpacing.MD,
    paddingHorizontal: ESpacing.SM,
    paddingVertical: ESpacing.XS,
    borderRadius: EBorderRadius.FULL,
  },
  statusText: {
    color: '#ffffff',
    fontSize: EFontSize.XS,
    fontWeight: EFontWeight.SEMIBOLD,
  },
  info: {
    padding: ESpacing.LG,
  },
  title: {
    color: EColors.FOREGROUND,
    fontSize: EFontSize.BASE,
    fontWeight: EFontWeight.SEMIBOLD,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: ESpacing.XS,
  },
  hostName: {
    color: EColors.MUTED_FOREGROUND,
    fontSize: EFontSize.SM,
  },
  viewerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewerIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: ENeonColors.GREEN,
    opacity: 0.6,
  },
  viewerCount: {
    color: EColors.MUTED_FOREGROUND,
    fontSize: EFontSize.SM,
  },
});
