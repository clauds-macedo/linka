import database from '@react-native-firebase/database';
import { TChatMessage } from '../types';

type TSendMessageInput = {
  roomId: string;
  userId: string;
  userName: string;
  text: string;
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
