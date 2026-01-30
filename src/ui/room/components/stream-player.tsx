import React, { useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEventListener } from 'expo';
import { EBorderRadius, EColors } from '../../tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PLAYER_WIDTH = SCREEN_WIDTH - 32;
const PLAYER_HEIGHT = (PLAYER_WIDTH * 9) / 16;

export type TStreamPlayerProps = {
  videoUrl: string;
  isPlaying: boolean;
  currentTime?: number;
  onStateChange: (state: string) => void;
  onProgress: (time: number) => void;
  onFullscreenEnter?: () => void;
  onFullscreenExit?: () => void;
};

export type TStreamPlayerRef = {
  seekTo: (time: number) => Promise<void>;
  getCurrentTime: () => Promise<number>;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
};

export const StreamPlayer = React.forwardRef<TStreamPlayerRef, TStreamPlayerProps>(
  ({ videoUrl, isPlaying, currentTime, onStateChange, onProgress, onFullscreenEnter, onFullscreenExit }, ref) => {
    const lastReportedTime = useRef(0);
    const videoViewRef = useRef<VideoView>(null);
    
    const player = useVideoPlayer(videoUrl, (p) => {
      p.loop = false;
    });

    React.useImperativeHandle(ref, () => ({
      seekTo: async (time: number) => {
        player.currentTime = time;
      },
      getCurrentTime: async () => {
        return player.currentTime;
      },
      enterFullscreen: () => {
        videoViewRef.current?.enterFullscreen();
      },
      exitFullscreen: () => {
        videoViewRef.current?.exitFullscreen();
      },
    }));

    useEffect(() => {
      if (isPlaying) {
        player.play();
      } else {
        player.pause();
      }
    }, [isPlaying, player]);

    useEffect(() => {
      if (currentTime !== undefined) {
        const currentPos = player.currentTime;
        const diff = Math.abs(currentPos - currentTime);
        if (diff > 2) {
          player.currentTime = currentTime;
        }
      }
    }, [currentTime, player]);

    useEventListener(player, 'statusChange', ({ status }) => {
      if (status === 'loading') {
        onStateChange('buffering');
      } else if (status === 'readyToPlay') {
        onStateChange(player.playing ? 'playing' : 'paused');
      } else if (status === 'error') {
        onStateChange('error');
      }
    });

    useEventListener(player, 'playingChange', ({ isPlaying: playing }) => {
      onStateChange(playing ? 'playing' : 'paused');
    });

    const handleTimeUpdate = useCallback(() => {
      const currentTimeSeconds = player.currentTime;
      if (Math.abs(currentTimeSeconds - lastReportedTime.current) >= 1) {
        lastReportedTime.current = currentTimeSeconds;
        onProgress(currentTimeSeconds);
      }
    }, [player, onProgress]);

    useEffect(() => {
      const interval = setInterval(handleTimeUpdate, 500);
      return () => clearInterval(interval);
    }, [handleTimeUpdate]);

    const handleFullscreenEnter = useCallback(() => {
      onFullscreenEnter?.();
    }, [onFullscreenEnter]);

    const handleFullscreenExit = useCallback(() => {
      onFullscreenExit?.();
    }, [onFullscreenExit]);

    return (
      <View style={styles.container}>
        <VideoView
          ref={videoViewRef}
          player={player}
          style={styles.video}
          contentFit="contain"
          nativeControls={false}
          allowsFullscreen
          onFullscreenEnter={handleFullscreenEnter}
          onFullscreenExit={handleFullscreenExit}
        />
      </View>
    );
  }
);

StreamPlayer.displayName = 'StreamPlayer';

const styles = StyleSheet.create({
  container: {
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    borderRadius: EBorderRadius.XL,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: EColors.BORDER,
    backgroundColor: EColors.CARD,
    alignSelf: 'center',
  },
  video: {
    flex: 1,
  },
});
