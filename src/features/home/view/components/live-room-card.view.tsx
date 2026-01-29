import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, Play, Pause, Radio, Clock } from 'lucide-react-native';
import { Card } from '../../../../ui/components/card';
import { TLiveRoom } from '../../../../domain/room/types';
import {
  EColors,
  ENeonColors,
  ESpacing,
  EFontSize,
  EFontWeight,
  EBorderRadius,
} from '../../../../ui/tokens';

type TLiveRoomCardProps = {
  room: TLiveRoom;
  onPress: (roomId: string) => void;
};

const getYouTubeThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
};

const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return 'agora';
  if (minutes < 60) return `${minutes}min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  return `${days}d`;
};

export const LiveRoomCard: React.FC<TLiveRoomCardProps> = ({ room, onPress }) => {
  const handlePress = () => {
    onPress(room.id);
  };

  const thumbnailUrl = getYouTubeThumbnail(room.videoId);

  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [pressed && styles.pressed]}>
      <Card style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: thumbnailUrl }} style={styles.coverImage} />
          <LinearGradient
            colors={['transparent', 'rgba(13, 14, 20, 0.8)']}
            style={styles.imageOverlay}
          />
          <View style={styles.liveBadge}>
            <Radio size={10} color="#ffffff" />
            <Text style={styles.liveText}>AO VIVO</Text>
          </View>
          <View style={styles.viewerBadge}>
            <Users size={12} color="#ffffff" />
            <Text style={styles.viewerCount}>{room.viewerCount}</Text>
          </View>
        </View>

        <View style={styles.info}>
          <View style={styles.row}>
            <View style={styles.playingIndicator}>
              {room.isPlaying ? (
                <Play size={12} color={ENeonColors.GREEN} fill={ENeonColors.GREEN} />
              ) : (
                <Pause size={12} color={EColors.MUTED_FOREGROUND} />
              )}
              <Text style={[styles.playingText, room.isPlaying && styles.playingTextActive]}>
                {room.isPlaying ? 'Reproduzindo' : 'Pausado'}
              </Text>
            </View>
            <View style={styles.timeContainer}>
              <Clock size={12} color={EColors.MUTED_FOREGROUND} />
              <Text style={styles.timeAgo}>{formatTimeAgo(room.createdAt)}</Text>
            </View>
          </View>
          <Text style={styles.roomId} numberOfLines={1}>
            Sala #{room.id.slice(-6)}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
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
    backgroundColor: EColors.CARD,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  liveBadge: {
    position: 'absolute',
    top: ESpacing.SM,
    left: ESpacing.SM,
    paddingHorizontal: ESpacing.SM,
    paddingVertical: 4,
    borderRadius: EBorderRadius.SM,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: EFontWeight.BOLD,
  },
  viewerBadge: {
    position: 'absolute',
    top: ESpacing.SM,
    right: ESpacing.SM,
    paddingHorizontal: ESpacing.SM,
    paddingVertical: 4,
    borderRadius: EBorderRadius.SM,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewerCount: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: EFontWeight.SEMIBOLD,
  },
  info: {
    padding: ESpacing.MD,
    gap: ESpacing.XS,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  playingText: {
    fontSize: EFontSize.XS,
    color: EColors.MUTED_FOREGROUND,
  },
  playingTextActive: {
    color: ENeonColors.GREEN,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeAgo: {
    fontSize: EFontSize.XS,
    color: EColors.MUTED_FOREGROUND,
  },
  roomId: {
    color: EColors.FOREGROUND,
    fontSize: EFontSize.SM,
    fontWeight: EFontWeight.MEDIUM,
  },
});
