import database from '@react-native-firebase/database';
import { TLiveRoom, TRoomPlaybackState, TRoomRealtimeState, TRoomUserPresence } from '../types';

export enum ERoomDbKey {
  ROOMS = 'rooms',
  USERS = 'users',
}

type TCreateRoomInput = {
  roomId?: string;
  hostId: string;
  videoId: string;
  videoUrl?: string;
};

type TJoinRoomInput = {
  roomId: string;
  userId: string;
};

type TUpdatePlaybackInput = {
  roomId: string;
  state: Partial<TRoomPlaybackState>;
};

type TRoomListener = (state: TRoomRealtimeState | null) => void;

type TPresence = TRoomUserPresence;

const getRoomPath = (roomId: string) => `${ERoomDbKey.ROOMS}/${roomId}`;

const getUsersPath = (roomId: string) => `${getRoomPath(roomId)}/${ERoomDbKey.USERS}`;

const getUserPath = (roomId: string, userId: string) => `${getUsersPath(roomId)}/${userId}`;

const generateRoomId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`;
};

export class RoomRealtimeService {
  static async createRoom(input: TCreateRoomInput): Promise<string> {
    const roomId = input.roomId ?? generateRoomId();

    const now = Date.now();
    const roomState: TRoomRealtimeState & { createdAt: number; videoUrl?: string } = {
      hostId: input.hostId,
      videoId: input.videoId,
      videoUrl: input.videoUrl,
      isPlaying: false,
      currentTime: 0,
      lastUpdate: now,
      createdAt: now,
      users: {
        [input.hostId]: {
          userId: input.hostId,
          joinedAt: now,
        },
      },
    };

    await database().ref(getRoomPath(roomId)).set(roomState);
    await RoomRealtimeService.joinRoom({ roomId, userId: input.hostId });

    return roomId;
  }

  static async joinRoom(input: TJoinRoomInput): Promise<void> {
    const joinedAt = Date.now();
    const presence: TPresence = { userId: input.userId, joinedAt };
    await database().ref(getUserPath(input.roomId, input.userId)).set(presence);
  }

  static async leaveRoom(input: TJoinRoomInput): Promise<void> {
    await database().ref(getUserPath(input.roomId, input.userId)).remove();

    const usersSnapshot = await database().ref(getUsersPath(input.roomId)).once('value');
    const users = usersSnapshot.val();

    if (!users || Object.keys(users).length === 0) {
      await RoomRealtimeService.deleteRoom(input.roomId);
    }
  }

  static async deleteRoom(roomId: string): Promise<void> {
    await database().ref(getRoomPath(roomId)).remove();
    await database().ref(`chats/${roomId}`).remove();
  }

  static subscribeToRoom(roomId: string, onChange: TRoomListener): () => void {
    const roomRef = database().ref(getRoomPath(roomId));
    const onValueChange = (snapshot: { val: () => TRoomRealtimeState | null }) => {
      const value = snapshot.val();
      onChange(value);
    };
    roomRef.on('value', onValueChange);
    return () => roomRef.off('value', onValueChange);
  }

  static async updatePlayback(input: TUpdatePlaybackInput): Promise<void> {
    await database().ref(getRoomPath(input.roomId)).update({
      ...input.state,
      lastUpdate: Date.now(),
    });
  }

  static subscribeToRooms(onChange: (rooms: TLiveRoom[]) => void): () => void {
    const roomsRef = database().ref(ERoomDbKey.ROOMS).orderByChild('createdAt').limitToLast(20);

    type TRoomData = TRoomRealtimeState & { createdAt?: number };

    const onValueChange = (snapshot: { val: () => Record<string, TRoomData> | null }) => {
      const data = snapshot.val();
      if (!data) {
        onChange([]);
        return;
      }

      const rooms: TLiveRoom[] = Object.entries(data)
        .map(([id, room]) => ({
          id,
          hostId: room.hostId,
          videoId: room.videoId,
          viewerCount: room.users ? Object.keys(room.users).length : 0,
          isPlaying: room.isPlaying,
          createdAt: room.createdAt ?? room.lastUpdate,
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

      onChange(rooms);
    };

    roomsRef.on('value', onValueChange);
    return () => roomsRef.off('value', onValueChange);
  }
}
