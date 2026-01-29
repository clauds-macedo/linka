import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoomViewModel } from '../../../domain/room/view-models/use-room.vm';
import { useAuth } from '../../../core/auth';
import { useI18n } from '../../../core/i18n';
import { RoomControls } from '../components/room-controls';
import { RoomHeader } from '../components/room-header';
import { RoomParticipants } from '../components/room-participants';
import { RoomPlayer } from '../components/room-player';
import { RoomRoot } from '../components/room-root';
import { RoomVideoInput } from '../components/room-video-input';
import { EColors, EFontSize, EFontWeight, ESpacing } from '../../tokens';

type TRoomScreenProps = {
  roomId: string;
};

export const RoomScreen: React.FC<TRoomScreenProps> = ({ roomId }) => {
  const { t } = useI18n();
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const viewModel = useRoomViewModel(roomId, userId);

  if (!userId) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <RoomRoot>
          <Text style={styles.message}>{t('room.screen.authRequired')}</Text>
        </RoomRoot>
      </SafeAreaView>
    );
  }

  if (viewModel.isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <RoomRoot>
          <Text style={styles.message}>{t('room.screen.loading')}</Text>
        </RoomRoot>
      </SafeAreaView>
    );
  }

  if (viewModel.error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <RoomRoot>
          <Text style={styles.message}>{t('room.screen.error')}</Text>
        </RoomRoot>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <RoomRoot>
          <RoomHeader
            title={`${t('room.screen.titlePrefix')} ${roomId}`}
            subtitle={t('room.screen.subtitle')}
            isHost={viewModel.isHost}
          />
          <RoomVideoInput
            value={viewModel.videoIdInput}
            onChange={viewModel.setVideoIdInput}
            onSubmit={viewModel.submitVideoId}
            disabled={!viewModel.isHost}
          />
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
          <RoomParticipants participants={viewModel.participants} />
        </RoomRoot>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: EColors.BACKGROUND,
  },
  content: {
    padding: ESpacing.LG,
  },
  message: {
    fontSize: EFontSize.BASE,
    fontWeight: EFontWeight.MEDIUM,
    color: EColors.MUTED_FOREGROUND,
  },
});
