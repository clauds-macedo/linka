import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { EBorderRadius, EColors, ESpacing } from '../../tokens';

type TReaction = {
  emoji: string;
  label: string;
};

const REACTIONS: TReaction[] = [
  { emoji: '😂', label: 'LOL' },
  { emoji: '😱', label: 'OMG' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '❤️', label: 'Love' },
  { emoji: '👏', label: 'Clap' },
  { emoji: '😢', label: 'Sad' },
];

type TQuickReactionsProps = {
  onReact: (emoji: string) => void;
  disabled?: boolean;
};

type TReactionButtonProps = {
  reaction: TReaction;
  onPress: () => void;
  disabled?: boolean;
};

const ReactionButton: React.FC<TReactionButtonProps> = ({ reaction, onPress, disabled }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    scale.value = withSequence(
      withSpring(1.4, { damping: 4 }),
      withSpring(1, { damping: 6 })
    );
    onPress();
  }, [onPress, scale]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.reactionButton, animatedStyle]}>
        <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export const QuickReactions: React.FC<TQuickReactionsProps> = ({ onReact, disabled }) => {
  return (
    <View style={styles.container}>
      {REACTIONS.map((reaction) => (
        <ReactionButton
          key={reaction.emoji}
          reaction={reaction}
          onPress={() => onReact(reaction.emoji)}
          disabled={disabled}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: ESpacing.SM,
    paddingHorizontal: ESpacing.XS,
    backgroundColor: EColors.CARD,
    borderRadius: EBorderRadius.LG,
    borderWidth: 1,
    borderColor: EColors.BORDER,
  },
  reactionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: EColors.SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactionEmoji: {
    fontSize: 22,
  },
});
