import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, EButtonVariant, EButtonSize } from '../../components/button';
import { ESpacing } from '../../tokens';
import { useI18n } from '../../../core/i18n';

type TRoomControlsProps = {
  isHost: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSeekBackward: () => void;
  onSeekForward: () => void;
};

export const RoomControls: React.FC<TRoomControlsProps> = ({
  isHost,
  isPlaying,
  onPlay,
  onPause,
  onSeekBackward,
  onSeekForward,
}) => {
  const { t } = useI18n();

  return (
    <View style={styles.container}>
      <Button.Root
        variant={EButtonVariant.OUTLINE}
        size={EButtonSize.SM}
        onPress={onSeekBackward}
        disabled={!isHost}
      >
        <Button.Text>{t('room.controls.seekBack')}</Button.Text>
      </Button.Root>
      {isPlaying ? (
        <Button.Root
          variant={EButtonVariant.HERO}
          size={EButtonSize.DEFAULT}
          onPress={onPause}
          disabled={!isHost}
        >
          <Button.Text>{t('room.controls.pause')}</Button.Text>
        </Button.Root>
      ) : (
        <Button.Root
          variant={EButtonVariant.HERO}
          size={EButtonSize.DEFAULT}
          onPress={onPlay}
          disabled={!isHost}
        >
          <Button.Text>{t('room.controls.play')}</Button.Text>
        </Button.Root>
      )}
      <Button.Root
        variant={EButtonVariant.OUTLINE}
        size={EButtonSize.SM}
        onPress={onSeekForward}
        disabled={!isHost}
      >
        <Button.Text>{t('room.controls.seekForward')}</Button.Text>
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
