import React, { MutableRefObject } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import YoutubeIframe, { YoutubeIframeRef } from 'react-native-youtube-iframe';
import { EBorderRadius, EColors } from '../../tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PLAYER_WIDTH = SCREEN_WIDTH - 32;
const PLAYER_HEIGHT = (PLAYER_WIDTH * 9) / 16;

export type TRoomPlayerProps = {
  videoId: string;
  isPlaying: boolean;
  onStateChange: (state: string) => void;
  onProgress: (time: number) => void;
  playerRef: MutableRefObject<YoutubeIframeRef | null>;
};

export const RoomPlayer: React.FC<TRoomPlayerProps> = ({
  videoId,
  isPlaying,
  onStateChange,
  onProgress,
  playerRef,
}) => {
  return (
    <View style={styles.container}>
      <YoutubeIframe
        ref={playerRef}
        width={PLAYER_WIDTH}
        height={PLAYER_HEIGHT}
        videoId={videoId}
        play={isPlaying}
        onChangeState={onStateChange}
        onProgress={(data) => onProgress(data.currentTime)}
        webViewProps={{
          androidLayerType: 'hardware',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: EBorderRadius.XL,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: EColors.BORDER,
    backgroundColor: EColors.CARD,
    alignSelf: 'center',
  },
});
