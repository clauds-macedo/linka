import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, EButtonVariant, EButtonSize } from '../../components/button';
import { ESpacing } from '../../tokens';

type TRoomControlsProps = {
  isHost: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSeekBackward: () => void;
  onSeekForward: () => void;
};

enum ERoomControlLabel {
  SEEK_BACK = '⏪ 10s',
  SEEK_FORWARD = '10s ⏩',
  PLAY = 'Reproduzir',
  PAUSE = 'Pausar',
}

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
      <Button.Root
        variant={EButtonVariant.OUTLINE}
        size={EButtonSize.SM}
        onPress={onSeekBackward}
        disabled={!isHost}
      >
        <Button.Text>{ERoomControlLabel.SEEK_BACK}</Button.Text>
      </Button.Root>
      {isPlaying ? (
        <Button.Root
          variant={EButtonVariant.HERO}
          size={EButtonSize.DEFAULT}
          onPress={onPause}
          disabled={!isHost}
        >
          <Button.Text>{ERoomControlLabel.PAUSE}</Button.Text>
        </Button.Root>
      ) : (
        <Button.Root
          variant={EButtonVariant.HERO}
          size={EButtonSize.DEFAULT}
          onPress={onPlay}
          disabled={!isHost}
        >
          <Button.Text>{ERoomControlLabel.PLAY}</Button.Text>
        </Button.Root>
      )}
      <Button.Root
        variant={EButtonVariant.OUTLINE}
        size={EButtonSize.SM}
        onPress={onSeekForward}
        disabled={!isHost}
      >
        <Button.Text>{ERoomControlLabel.SEEK_FORWARD}</Button.Text>
      </Button.Root>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: ESpacing.SM,
  },
});
