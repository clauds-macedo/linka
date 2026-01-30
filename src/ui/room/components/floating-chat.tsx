import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { TChatMessage } from '../../../domain/room/types';
import { EBorderRadius, EColors, EFontSize, EFontWeight, ESpacing } from '../../tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type TFloatingMessageProps = {
  message: TChatMessage;
  onComplete: () => void;
};

const FloatingMessage: React.FC<TFloatingMessageProps> = ({ message, onComplete }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -20,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => onComplete());
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[
        styles.floatingMessage,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.floatingAuthor}>{message.userName}</Text>
      <Text style={styles.floatingText} numberOfLines={2}>
        {message.text}
      </Text>
    </Animated.View>
  );
};

type TFloatingChatProps = {
  messages: TChatMessage[];
  visible: boolean;
};

export const FloatingChat: React.FC<TFloatingChatProps> = ({ messages, visible }) => {
  const [visibleMessages, setVisibleMessages] = useState<TChatMessage[]>([]);
  const lastMessageIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!visible || messages.length === 0) return;

    const latestMessage = messages[messages.length - 1];
    if (latestMessage && latestMessage.id !== lastMessageIdRef.current) {
      lastMessageIdRef.current = latestMessage.id;
      setVisibleMessages((prev) => [...prev.slice(-2), latestMessage]);
    }
  }, [messages, visible]);

  const handleMessageComplete = (messageId: string) => {
    setVisibleMessages((prev) => prev.filter((m) => m.id !== messageId));
  };

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {visibleMessages.map((message) => (
        <FloatingMessage
          key={message.id}
          message={message}
          onComplete={() => handleMessageComplete(message.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    left: ESpacing.MD,
    right: ESpacing.MD,
    gap: ESpacing.SM,
  },
  floatingMessage: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: EBorderRadius.LG,
    paddingHorizontal: ESpacing.MD,
    paddingVertical: ESpacing.SM,
    maxWidth: SCREEN_WIDTH * 0.7,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  floatingAuthor: {
    fontSize: EFontSize.XS,
    fontWeight: EFontWeight.BOLD,
    color: EColors.PRIMARY,
    marginBottom: 2,
  },
  floatingText: {
    fontSize: EFontSize.SM,
    color: EColors.FOREGROUND,
    lineHeight: 18,
  },
});
