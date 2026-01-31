import React, { useEffect, useCallback } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type TFloatingReaction = {
  id: string;
  emoji: string;
  x: number;
};

type TFloatingReactionsProps = {
  reactions: TFloatingReaction[];
  onReactionComplete: (id: string) => void;
};

type TFloatingEmojiProps = {
  reaction: TFloatingReaction;
  onComplete: () => void;
};

const FloatingEmoji: React.FC<TFloatingEmojiProps> = ({ reaction, onComplete }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    scale.value = withTiming(1.2, { duration: 200 });
    translateY.value = withTiming(-SCREEN_HEIGHT * 0.4, {
      duration: 2500,
      easing: Easing.out(Easing.quad),
    });
    opacity.value = withDelay(
      1800,
      withTiming(0, { duration: 700 }, (finished) => {
        if (finished) {
          runOnJS(onComplete)();
        }
      })
    );
  }, [translateY, opacity, scale, onComplete]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: reaction.x },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text style={[styles.floatingEmoji, animatedStyle]}>
      {reaction.emoji}
    </Animated.Text>
  );
};

export const FloatingReactions: React.FC<TFloatingReactionsProps> = ({
  reactions,
  onReactionComplete,
}) => {
  const handleComplete = useCallback(
    (id: string) => {
      onReactionComplete(id);
    },
    [onReactionComplete]
  );

  return (
    <>
      {reactions.map((reaction) => (
        <FloatingEmoji
          key={reaction.id}
          reaction={reaction}
          onComplete={() => handleComplete(reaction.id)}
        />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  floatingEmoji: {
    position: 'absolute',
    bottom: 150,
    fontSize: 36,
    zIndex: 999,
  },
});
