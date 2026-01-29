import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react-native';
import { EBorderRadius, EColors, EGradients, ESpacing } from '../../tokens';

type TRoomControlsProps = {
  isHost: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSeekBackward: () => void;
  onSeekForward: () => void;
};

type TControlButtonProps = {
  onPress: () => void;
  disabled: boolean;
  children: React.ReactNode;
  size?: 'small' | 'large';
};

const ControlButton: React.FC<TControlButtonProps> = ({
  onPress,
  disabled,
  children,
  size = 'small',
}) => {
  const buttonStyle = size === 'large' ? styles.largeButton : styles.smallButton;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[buttonStyle, disabled && styles.disabled]}
    >
      {children}
    </TouchableOpacity>
  );
};

export const RoomControls: React.FC<TRoomControlsProps> = ({
  isHost,
  isPlaying,
  onPlay,
  onPause,
  onSeekBackward,
  onSeekForward,
}) => {
  return (
    <View style={styles.container}>
      <ControlButton onPress={onSeekBackward} disabled={!isHost}>
        <View style={styles.seekButton}>
          <SkipBack size={24} color={EColors.FOREGROUND} />
        </View>
        <Text style={styles.seekLabel}>10s</Text>
      </ControlButton>

      <ControlButton
        onPress={isPlaying ? onPause : onPlay}
        disabled={!isHost}
        size="large"
      >
        <LinearGradient
          colors={isHost ? EGradients.PRIMARY : [EColors.MUTED, EColors.MUTED]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.playButtonGradient}
        >
          {isPlaying ? (
            <Pause size={32} color={EColors.FOREGROUND} fill={EColors.FOREGROUND} />
          ) : (
            <Play size={32} color={EColors.FOREGROUND} fill={EColors.FOREGROUND} style={styles.playIcon} />
          )}
        </LinearGradient>
      </ControlButton>

      <ControlButton onPress={onSeekForward} disabled={!isHost}>
        <View style={styles.seekButton}>
          <SkipForward size={24} color={EColors.FOREGROUND} />
        </View>
        <Text style={styles.seekLabel}>10s</Text>
      </ControlButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: ESpacing.XL,
    paddingVertical: ESpacing.MD,
  },
  smallButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: ESpacing.SM,
  },
  largeButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
  seekButton: {
    width: 48,
    height: 48,
    borderRadius: EBorderRadius.FULL,
    backgroundColor: EColors.CARD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seekLabel: {
    fontSize: 12,
    color: EColors.MUTED_FOREGROUND,
    marginTop: 4,
  },
  playButtonGradient: {
    width: 72,
    height: 72,
    borderRadius: EBorderRadius.FULL,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: EColors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  playIcon: {
    marginLeft: 4,
  },
});
