import { onDisconnect, onValue, push, ref, remove, set, update } from 'firebase/database';
import { firebaseDatabase } from '../../../core/firebase';
import { TRoomPlaybackState, TRoomRealtimeState, TRoomUserPresence } from '../types';

export enum ERoomDbKey {
  ROOMS = 'rooms',
  USERS = 'users',
}

enum ERoomServiceValue {
  EMPTY_ROOM_ID = '',
}

type TCreateRoomInput = {
  roomId?: string;
  hostId: string;
  videoId: string;
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

export class RoomRealtimeService {
  static async createRoom(input: TCreateRoomInput): Promise<string> {
    const roomId = input.roomId ?? push(ref(firebaseDatabase, ERoomDbKey.ROOMS)).key;
    if (!roomId) return ERoomServiceValue.EMPTY_ROOM_ID;

    const now = Date.now();
    const roomState: TRoomRealtimeState = {
      hostId: input.hostId,
      videoId: input.videoId,
      isPlaying: false,
      currentTime: 0,
      lastUpdate: now,
      users: {
        [input.hostId]: {
          userId: input.hostId,
          joinedAt: now,
        },
      },
    };

    await set(ref(firebaseDatabase, getRoomPath(roomId)), roomState);
    await RoomRealtimeService.joinRoom({ roomId, userId: input.hostId });

    return roomId;
  }

  static async joinRoom(input: TJoinRoomInput): Promise<void> {
    const joinedAt = Date.now();
    const presence: TPresence = { userId: input.userId, joinedAt };
    const userRef = ref(firebaseDatabase, getUserPath(input.roomId, input.userId));
    await set(userRef, presence);
    await onDisconnect(userRef).remove();
  }

  static async leaveRoom(input: TJoinRoomInput): Promise<void> {
    const userRef = ref(firebaseDatabase, getUserPath(input.roomId, input.userId));
    await remove(userRef);
  }

  static subscribeToRoom(roomId: string, onChange: TRoomListener): () => void {
    const roomRef = ref(firebaseDatabase, getRoomPath(roomId));
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const value = snapshot.val() as TRoomRealtimeState | null;
      onChange(value);
    });
    return () => unsubscribe();
  }

  static async updatePlayback(input: TUpdatePlaybackInput): Promise<void> {
    const roomRef = ref(firebaseDatabase, getRoomPath(input.roomId));
    await update(roomRef, {
      ...input.state,
      lastUpdate: Date.now(),
    });
  }
}
