import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Users, Radio } from 'lucide-react-native';
import { useRoomViewModel } from '../../../domain/room/view-models/use-room.vm';
import { useAuth } from '../../../core/auth';
import { useI18n } from '../../../core/i18n';
import { RoomControls } from '../components/room-controls';
import { RoomPlayer } from '../components/room-player';
import { RoomChat } from '../components/room-chat';
import { EBorderRadius, EColors, EFontSize, EFontWeight, ESpacing } from '../../tokens';

type TRoomScreenProps = {
  roomId: string;
};

export const RoomScreen: React.FC<TRoomScreenProps> = ({ roomId }) => {
  const router = useRouter();
  const { t } = useI18n();
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const userName = user?.name ?? 'Anônimo';
  const viewModel = useRoomViewModel(roomId, userId);

  if (!userId) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.message}>{t('room.screen.authRequired')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (viewModel.isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.message}>{t('room.screen.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (viewModel.error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.message}>{t('room.screen.error')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={EColors.FOREGROUND} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.roomTitle} numberOfLines={1}>
              Sala
            </Text>
            <View style={styles.statusRow}>
              <View style={styles.liveBadge}>
                <Radio size={10} color="#ef4444" />
                <Text style={styles.liveText}>AO VIVO</Text>
              </View>
              <View style={styles.participantBadge}>
                <Users size={12} color={EColors.MUTED_FOREGROUND} />
                <Text style={styles.participantCount}>{viewModel.participants.length}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.roleBadge, viewModel.isHost ? styles.hostBadge : styles.guestBadge]}>
            <Text style={styles.roleText}>
              {viewModel.isHost ? 'Host' : 'Viewer'}
            </Text>
          </View>
        </View>

        <View style={styles.playerSection}>
          <RoomPlayer
            videoId={viewModel.videoId}
            isPlaying={viewModel.isPlaying}
            onStateChange={viewModel.handlePlayerStateChange}
            onProgress={viewModel.handleProgress}
            playerRef={viewModel.playerRef}
          />
          <RoomControls
            isHost={viewModel.isHost}
            isPlaying={viewModel.isPlaying}
            onPlay={viewModel.play}
            onPause={viewModel.pause}
            onSeekBackward={() => viewModel.seekBy(-10)}
            onSeekForward={() => viewModel.seekBy(10)}
          />
        </View>

        <View style={styles.chatSection}>
          <RoomChat roomId={roomId} userId={userId} userName={userName} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: EColors.BACKGROUND,
  },
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: ESpacing.LG,
  },
  message: {
    fontSize: EFontSize.BASE,
    fontWeight: EFontWeight.MEDIUM,
    color: EColors.MUTED_FOREGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ESpacing.MD,
    paddingVertical: ESpacing.SM,
    gap: ESpacing.MD,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: EBorderRadius.MD,
    backgroundColor: EColors.CARD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  roomTitle: {
    fontSize: EFontSize.LG,
    fontWeight: EFontWeight.BOLD,
    color: EColors.FOREGROUND,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESpacing.MD,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: ESpacing.SM,
    paddingVertical: 2,
    borderRadius: EBorderRadius.SM,
  },
  liveText: {
    fontSize: 10,
    fontWeight: EFontWeight.BOLD,
    color: '#ef4444',
  },
  participantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  participantCount: {
    fontSize: EFontSize.XS,
    color: EColors.MUTED_FOREGROUND,
  },
  roleBadge: {
    paddingHorizontal: ESpacing.MD,
    paddingVertical: ESpacing.XS,
    borderRadius: EBorderRadius.FULL,
  },
  hostBadge: {
    backgroundColor: EColors.PRIMARY,
  },
  guestBadge: {
    backgroundColor: EColors.SECONDARY,
  },
  roleText: {
    fontSize: EFontSize.XS,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
  },
  playerSection: {
    paddingHorizontal: ESpacing.MD,
  },
  chatSection: {
    flex: 1,
    padding: ESpacing.MD,
  },
});
