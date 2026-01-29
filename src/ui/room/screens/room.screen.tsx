import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoomViewModel } from '../../../domain/room/view-models/use-room.vm';
import { useAuth } from '../../../core/auth';
import { RoomControls } from '../components/room-controls';
import { RoomHeader } from '../components/room-header';
import { RoomParticipants } from '../components/room-participants';
import { RoomPlayer } from '../components/room-player';
import { RoomRoot } from '../components/room-root';
import { RoomVideoInput } from '../components/room-video-input';
import { EColors, EFontSize, EFontWeight, ESpacing } from '../../tokens';

enum ERoomScreenLabel {
  TITLE_PREFIX = 'Sala',
  SUBTITLE = 'Sincronização em tempo real',
  AUTH_REQUIRED = 'Faça login para entrar na sala',
  LOADING = 'Carregando...',
  ERROR = 'Erro ao carregar sala',
}

type TRoomScreenProps = {
  roomId: string;
};

export const RoomScreen: React.FC<TRoomScreenProps> = ({ roomId }) => {
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const viewModel = useRoomViewModel(roomId, userId);

  if (!userId) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <RoomRoot>
          <Text style={styles.message}>{ERoomScreenLabel.AUTH_REQUIRED}</Text>
        </RoomRoot>
      </SafeAreaView>
    );
  }

  if (viewModel.isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <RoomRoot>
          <Text style={styles.message}>{ERoomScreenLabel.LOADING}</Text>
        </RoomRoot>
      </SafeAreaView>
    );
  }

  if (viewModel.error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <RoomRoot>
          <Text style={styles.message}>{ERoomScreenLabel.ERROR}</Text>
        </RoomRoot>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <RoomRoot>
          <RoomHeader
            title={`${ERoomScreenLabel.TITLE_PREFIX} ${roomId}`}
            subtitle={ERoomScreenLabel.SUBTITLE}
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
