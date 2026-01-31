import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Smile, X } from 'lucide-react-native';
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

type TReactionsFabProps = {
  onReact: (emoji: string) => void;
  disabled?: boolean;
};

type TReactionButtonProps = {
  reaction: TReaction;
  index: number;
  isOpen: boolean;
  onPress: () => void;
  disabled?: boolean;
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const ReactionButton: React.FC<TReactionButtonProps> = ({
  reaction,
  index,
  isOpen,
  onPress,
  disabled,
}) => {
  const scale = useSharedValue(1);
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withSpring(isOpen ? 1 : 0, {
      damping: 12,
      stiffness: 120,
      mass: 0.8,
    });
  }, [isOpen, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const angle = interpolate(
      index,
      [0, REACTIONS.length - 1],
      [-60, 60],
      Extrapolation.CLAMP
    );
    const radians = (angle * Math.PI) / 180;
    const radius = 90;
    const translateX = Math.sin(radians) * radius * progress.value;
    const translateY = -Math.cos(radians) * radius * progress.value;

    return {
      transform: [
        { translateX },
        { translateY },
        { scale: scale.value * progress.value },
      ],
      opacity: progress.value,
    };
  });

  const handlePress = useCallback(() => {
    scale.value = withSequence(
      withSpring(1.5, { damping: 4 }),
      withSpring(1, { damping: 6 })
    );
    onPress();
  }, [onPress, scale]);

  return (
    <AnimatedTouchable
      onPress={handlePress}
      disabled={disabled || !isOpen}
      activeOpacity={0.7}
      style={[styles.reactionButton, animatedStyle]}
    >
      <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
    </AnimatedTouchable>
  );
};

export const ReactionsFab: React.FC<TReactionsFabProps> = ({ onReact, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const rotation = useSharedValue(0);
  const fabScale = useSharedValue(1);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
    rotation.value = withSpring(isOpen ? 0 : 45, { damping: 12 });
  }, [isOpen, rotation]);

  const handleReaction = useCallback(
    (emoji: string) => {
      onReact(emoji);
      fabScale.value = withSequence(
        withSpring(1.2, { damping: 4 }),
        withSpring(1, { damping: 6 })
      );
      setTimeout(() => {
        setIsOpen(false);
        rotation.value = withSpring(0, { damping: 12 });
      }, 200);
    },
    [onReact, fabScale, rotation]
  );

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      {isOpen && (
        <Pressable style={styles.backdrop} onPress={toggleOpen} />
      )}
      
      <View style={styles.reactionsContainer}>
        {REACTIONS.map((reaction, index) => (
          <ReactionButton
            key={reaction.emoji}
            reaction={reaction}
            index={index}
            isOpen={isOpen}
            onPress={() => handleReaction(reaction.emoji)}
            disabled={disabled}
          />
        ))}
      </View>

      <AnimatedTouchable
        style={[styles.fab, fabAnimatedStyle, isOpen && styles.fabOpen]}
        onPress={toggleOpen}
        activeOpacity={0.8}
        disabled={disabled}
      >
        <Animated.View style={iconAnimatedStyle}>
          {isOpen ? (
            <X size={24} color={EColors.FOREGROUND} />
          ) : (
            <Smile size={24} color={EColors.FOREGROUND} />
          )}
        </Animated.View>
      </AnimatedTouchable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 70,
    right: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    top: -1000,
    left: -1000,
    right: -1000,
    bottom: -1000,
  },
  reactionsContainer: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: EColors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabOpen: {
    backgroundColor: EColors.DESTRUCTIVE,
  },
  reactionButton: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: EColors.CARD,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: EColors.BORDER,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  reactionEmoji: {
    fontSize: 24,
  },
});
