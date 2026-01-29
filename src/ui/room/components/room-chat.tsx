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
} from 'react-native';
import { MessageCircle, Send, Radio } from 'lucide-react-native';
import { TChatMessage } from '../../../domain/room/types';
import { RoomChatService } from '../../../domain/room/services/room-chat.service';
import { EBorderRadius, EColors, EFontSize, EFontWeight, ESpacing } from '../../tokens';

type TRoomChatProps = {
  roomId: string;
  userId: string;
  userName: string;
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

export const RoomChat: React.FC<TRoomChatProps> = ({ roomId, userId, userName }) => {
  const [messages, setMessages] = useState<TChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const unsubscribe = RoomChatService.subscribeToChat(roomId, setMessages);
    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <MessageCircle size={18} color={EColors.FOREGROUND} />
          <Text style={styles.headerTitle}>Chat</Text>
        </View>
        <View style={styles.onlineBadge}>
          <Radio size={10} color="#4ade80" />
          <Text style={styles.onlineText}>ao vivo</Text>
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MessageCircle size={32} color={EColors.MUTED_FOREGROUND} />
            <Text style={styles.emptyText}>Nenhuma mensagem ainda</Text>
            <Text style={styles.emptySubtext}>Seja o primeiro a enviar!</Text>
          </View>
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Digite uma mensagem..."
          placeholderTextColor={EColors.MUTED_FOREGROUND}
          multiline
          maxLength={500}
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
    minHeight: 300,
    maxHeight: 400,
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
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: ESpacing.SM,
    gap: ESpacing.XS,
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
  },
  input: {
    flex: 1,
    backgroundColor: EColors.SECONDARY,
    borderRadius: EBorderRadius.LG,
    paddingHorizontal: ESpacing.MD,
    paddingVertical: ESpacing.SM,
    color: EColors.FOREGROUND,
    fontSize: EFontSize.SM,
    maxHeight: 80,
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
