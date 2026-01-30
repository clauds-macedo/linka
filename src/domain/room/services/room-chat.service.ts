import database from '@react-native-firebase/database';
import { TChatMessage, TChatMessageType } from '../types';

type TSendMessageInput = {
  roomId: string;
  userId: string;
  userName: string;
  text: string;
};

type TSendSystemMessageInput = {
  roomId: string;
  userId: string;
  userName: string;
  type: 'join' | 'leave';
};

type TChatListener = (messages: TChatMessage[]) => void;

const getChatPath = (roomId: string) => `chats/${roomId}/messages`;

const generateMessageId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `${timestamp}-${random}`;
};

export class RoomChatService {
  static async sendMessage(input: TSendMessageInput): Promise<void> {
    const messageId = generateMessageId();
    const message: TChatMessage = {
      id: messageId,
      roomId: input.roomId,
      userId: input.userId,
      userName: input.userName,
      text: input.text,
      timestamp: Date.now(),
      type: 'message',
    };

    await database().ref(`${getChatPath(input.roomId)}/${messageId}`).set(message);
  }

  static async sendSystemMessage(input: TSendSystemMessageInput): Promise<void> {
    const messageId = generateMessageId();
    const text = input.type === 'join' ? 'entrou na sala' : 'saiu da sala';
    const message: TChatMessage = {
      id: messageId,
      roomId: input.roomId,
      userId: input.userId,
      userName: input.userName,
      text,
      timestamp: Date.now(),
      type: input.type,
    };

    await database().ref(`${getChatPath(input.roomId)}/${messageId}`).set(message);
  }

  static subscribeToChat(roomId: string, onChange: TChatListener): () => void {
    const chatRef = database().ref(getChatPath(roomId)).orderByChild('timestamp').limitToLast(100);

    const onValueChange = (snapshot: { val: () => Record<string, TChatMessage> | null }) => {
      const data = snapshot.val();
      if (!data) {
        onChange([]);
        return;
      }
      const messages = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
      onChange(messages);
    };

    chatRef.on('value', onValueChange);
    return () => chatRef.off('value', onValueChange);
  }
}
