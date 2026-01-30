import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { MessageCircle, Send, Radio, X, ChevronUp } from 'lucide-react-native';
import { TChatMessage } from '../../../domain/room/types';
import { RoomChatService } from '../../../domain/room/services/room-chat.service';
import { EBorderRadius, EColors, EFontSize, EFontWeight, ESpacing } from '../../tokens';

type TRoomChatProps = {
  roomId: string;
  userId: string;
  userName: string;
  isFullscreen?: boolean;
  onMessagesUpdate?: (messages: TChatMessage[]) => void;
};

type TChatMessageItemProps = {
  message: TChatMessage;
  isOwn: boolean;
};

const ChatMessageItem: React.FC<TChatMessageItemProps> = ({ message, isOwn }) => {
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={[styles.messageContainer, isOwn && styles.messageContainerOwn]}>
      <View style={[styles.messageBubble, isOwn ? styles.messageBubbleOwn : styles.messageBubbleOther]}>
        {!isOwn && <Text style={styles.messageAuthor}>{message.userName}</Text>}
        <Text style={styles.messageText}>{message.text}</Text>
        <Text style={styles.messageTime}>{time}</Text>
      </View>
    </View>
  );
};

export const RoomChat: React.FC<TRoomChatProps> = ({
  roomId,
  userId,
  userName,
  isFullscreen = false,
  onMessagesUpdate,
}) => {
  const [messages, setMessages] = useState<TChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!isFullscreen);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const unsubscribe = RoomChatService.subscribeToChat(roomId, (newMessages) => {
      setMessages(newMessages);
      onMessagesUpdate?.(newMessages);
    });
    return () => unsubscribe();
  }, [roomId, onMessagesUpdate]);

  useEffect(() => {
    if (messages.length > 0 && isExpanded) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isExpanded]);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || isSending) return;

    setIsSending(true);
    setInputText('');

    try {
      await RoomChatService.sendMessage({
        roomId,
        userId,
        userName,
        text,
      });
    } finally {
      setIsSending(false);
    }
  }, [inputText, isSending, roomId, userId, userName]);

  const renderMessage = useCallback(
    ({ item }: { item: TChatMessage }) => (
      <ChatMessageItem message={item} isOwn={item.userId === userId} />
    ),
    [userId]
  );

  const keyExtractor = useCallback((item: TChatMessage) => item.id, []);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  if (isFullscreen && !isExpanded) {
    return (
      <TouchableOpacity
        style={styles.minimizedChat}
        onPress={() => setIsExpanded(true)}
        activeOpacity={0.8}
      >
        <MessageCircle size={20} color={EColors.FOREGROUND} />
        {messages.length > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{messages.length > 99 ? '99+' : messages.length}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, isFullscreen && styles.containerFullscreen]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <MessageCircle size={18} color={EColors.FOREGROUND} />
              <Text style={styles.headerTitle}>Chat</Text>
            </View>
            <View style={styles.headerRight}>
              <View style={styles.onlineBadge}>
                <Radio size={10} color="#4ade80" />
                <Text style={styles.onlineText}>ao vivo</Text>
              </View>
              {isFullscreen && (
                <TouchableOpacity onPress={() => setIsExpanded(false)} style={styles.closeButton}>
                  <X size={18} color={EColors.MUTED_FOREGROUND} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={keyExtractor}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MessageCircle size={32} color={EColors.MUTED_FOREGROUND} />
                <Text style={styles.emptyText}>Nenhuma mensagem ainda</Text>
                <Text style={styles.emptySubtext}>Seja o primeiro a enviar!</Text>
              </View>
            }
          />

          <View style={[styles.inputContainer, isKeyboardVisible && styles.inputContainerFocused]}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Digite uma mensagem..."
              placeholderTextColor={EColors.MUTED_FOREGROUND}
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={handleSend}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={[styles.sendButton, (!inputText.trim() || isSending) && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!inputText.trim() || isSending}
              activeOpacity={0.7}
            >
              <Send size={20} color={EColors.FOREGROUND} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: EColors.CARD,
    borderRadius: EBorderRadius.XL,
    borderWidth: 1,
    borderColor: EColors.BORDER,
    overflow: 'hidden',
  },
  containerFullscreen: {
    position: 'absolute',
    bottom: ESpacing.MD,
    right: ESpacing.MD,
    width: 300,
    height: 350,
    borderRadius: EBorderRadius.XL,
  },
  innerContainer: {
    flex: 1,
  },
  minimizedChat: {
    position: 'absolute',
    bottom: ESpacing.MD,
    right: ESpacing.MD,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: EColors.CARD,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: EColors.BORDER,
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: EColors.PRIMARY,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  unreadText: {
    fontSize: 10,
    fontWeight: EFontWeight.BOLD,
    color: EColors.PRIMARY_FOREGROUND,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ESpacing.MD,
    paddingVertical: ESpacing.SM,
    borderBottomWidth: 1,
    borderBottomColor: EColors.BORDER,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESpacing.XS,
  },
  headerTitle: {
    fontSize: EFontSize.BASE,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESpacing.SM,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESpacing.XS,
    backgroundColor: EColors.SECONDARY,
    paddingHorizontal: ESpacing.SM,
    paddingVertical: ESpacing.XS,
    borderRadius: EBorderRadius.FULL,
  },
  onlineText: {
    fontSize: EFontSize.XS,
    color: EColors.MUTED_FOREGROUND,
  },
  closeButton: {
    padding: ESpacing.XS,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: ESpacing.SM,
    gap: ESpacing.XS,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ESpacing.XXXL,
    gap: ESpacing.SM,
  },
  emptyText: {
    fontSize: EFontSize.SM,
    color: EColors.MUTED_FOREGROUND,
  },
  emptySubtext: {
    fontSize: EFontSize.XS,
    color: EColors.MUTED_FOREGROUND,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  messageContainerOwn: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: ESpacing.MD,
    paddingVertical: ESpacing.SM,
    borderRadius: EBorderRadius.LG,
  },
  messageBubbleOwn: {
    backgroundColor: EColors.PRIMARY,
    borderBottomRightRadius: EBorderRadius.XS,
  },
  messageBubbleOther: {
    backgroundColor: EColors.SECONDARY,
    borderBottomLeftRadius: EBorderRadius.XS,
  },
  messageAuthor: {
    fontSize: EFontSize.XS,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.ACCENT,
    marginBottom: 2,
  },
  messageText: {
    fontSize: EFontSize.SM,
    color: EColors.FOREGROUND,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: ESpacing.SM,
    gap: ESpacing.SM,
    borderTopWidth: 1,
    borderTopColor: EColors.BORDER,
    backgroundColor: EColors.CARD,
  },
  inputContainerFocused: {
    borderTopColor: EColors.PRIMARY,
  },
  input: {
    flex: 1,
    backgroundColor: EColors.SECONDARY,
    borderRadius: EBorderRadius.LG,
    paddingHorizontal: ESpacing.MD,
    paddingVertical: Platform.OS === 'ios' ? ESpacing.SM : ESpacing.XS,
    paddingTop: Platform.OS === 'ios' ? ESpacing.SM : ESpacing.XS,
    color: EColors.FOREGROUND,
    fontSize: EFontSize.SM,
    maxHeight: 100,
    minHeight: 40,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: EBorderRadius.FULL,
    backgroundColor: EColors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: EColors.MUTED,
  },
});
