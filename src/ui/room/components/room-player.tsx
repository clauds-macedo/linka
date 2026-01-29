import React, { MutableRefObject } from 'react';
import { View, StyleSheet } from 'react-native';
import YoutubeIframe, { YoutubeIframeRef } from 'react-native-youtube-iframe';
import { EBorderRadius, EColors } from '../../tokens';

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
        height={220}
        videoId={videoId}
        play={isPlaying}
        onChangeState={onStateChange}
        onProgress={(data) => onProgress(data.currentTime)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: EBorderRadius.LG,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: EColors.BORDER,
  },
});
