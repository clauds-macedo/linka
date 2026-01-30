import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Minimize2,
  ChevronLeft,
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { EBorderRadius, EColors, EFontSize, EFontWeight, ESpacing } from '../../tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type TFullscreenControlsProps = {
  isPlaying: boolean;
  isHost: boolean;
  currentTime: number;
  onPlay: () => void;
  onPause: () => void;
  onSeekBackward: () => void;
  onSeekForward: () => void;
  onExitFullscreen: () => void;
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const FullscreenControls: React.FC<TFullscreenControlsProps> = ({
  isPlaying,
  isHost,
  currentTime,
  onPlay,
  onPause,
  onSeekBackward,
  onSeekForward,
  onExitFullscreen,
}) => {
  const [visible, setVisible] = useState(true);
  const opacity = useSharedValue(1);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (visible && isPlaying) {
      timeout = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 });
        setVisible(false);
      }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [visible, isPlaying, opacity]);

  const handleTap = useCallback(() => {
    if (visible) {
      opacity.value = withTiming(0, { duration: 300 });
      setVisible(false);
    } else {
      opacity.value = withTiming(1, { duration: 300 });
      setVisible(true);
    }
  }, [visible, opacity]);

  const handleControlPress = useCallback((action: () => void) => {
    action();
    opacity.value = withTiming(1, { duration: 300 });
    setVisible(true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <View style={styles.container}>
        <Animated.View style={[styles.overlay, animatedStyle]} pointerEvents={visible ? 'auto' : 'none'}>
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'transparent', 'transparent', 'rgba(0,0,0,0.7)']}
            locations={[0, 0.3, 0.7, 1]}
            style={styles.gradient}
          >
            <View style={styles.topBar}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => handleControlPress(onExitFullscreen)}
              >
                <ChevronLeft size={28} color={EColors.FOREGROUND} />
              </TouchableOpacity>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
              </View>
              <TouchableOpacity
                style={styles.minimizeButton}
                onPress={() => handleControlPress(onExitFullscreen)}
              >
                <Minimize2 size={24} color={EColors.FOREGROUND} />
              </TouchableOpacity>
            </View>

            <View style={styles.centerControls}>
              <TouchableOpacity
                style={[styles.seekButton, !isHost && styles.disabled]}
                onPress={() => isHost && handleControlPress(onSeekBackward)}
                disabled={!isHost}
              >
                <SkipBack size={32} color={EColors.FOREGROUND} />
                <Text style={styles.seekText}>10</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.playButton, !isHost && styles.disabledPlay]}
                onPress={() => isHost && handleControlPress(isPlaying ? onPause : onPlay)}
                disabled={!isHost}
              >
                {isPlaying ? (
                  <Pause size={40} color={EColors.FOREGROUND} fill={EColors.FOREGROUND} />
                ) : (
                  <Play size={40} color={EColors.FOREGROUND} fill={EColors.FOREGROUND} style={styles.playIcon} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.seekButton, !isHost && styles.disabled]}
                onPress={() => isHost && handleControlPress(onSeekForward)}
                disabled={!isHost}
              >
                <SkipForward size={32} color={EColors.FOREGROUND} />
                <Text style={styles.seekText}>10</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomBar}>
              {!isHost && (
                <View style={styles.viewerBadge}>
                  <Text style={styles.viewerText}>Viewer</Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  overlay: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ESpacing.LG,
    paddingTop: ESpacing.XL,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: ESpacing.MD,
    paddingVertical: ESpacing.XS,
    borderRadius: EBorderRadius.SM,
  },
  timeText: {
    fontSize: EFontSize.SM,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
  },
  minimizeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ESpacing.XXXL,
  },
  seekButton: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seekText: {
    fontSize: 12,
    fontWeight: EFontWeight.BOLD,
    color: EColors.FOREGROUND,
    marginTop: -8,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(139, 92, 246, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledPlay: {
    backgroundColor: 'rgba(100, 100, 100, 0.5)',
  },
  playIcon: {
    marginLeft: 4,
  },
  disabled: {
    opacity: 0.4,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: ESpacing.LG,
    paddingBottom: ESpacing.XL,
  },
  viewerBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: ESpacing.MD,
    paddingVertical: ESpacing.XS,
    borderRadius: EBorderRadius.SM,
  },
  viewerText: {
    fontSize: EFontSize.XS,
    color: EColors.MUTED_FOREGROUND,
  },
});
