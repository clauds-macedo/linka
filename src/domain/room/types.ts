import { ERoomCategory, ERoomStatus } from './enums';

export type TRoom = {
  id: string;
  title: string;
  description: string;
  hostName: string;
  hostAvatar: string;
  coverImage: string;
  status: ERoomStatus;
  category: ERoomCategory;
  viewerCount: number;
  scheduledAt?: string;
};

export type TRoomListResponse = {
  rooms: TRoom[];
  total: number;
  page: number;
};

export type TRoomUserPresence = {
  userId: string;
  joinedAt: number;
};

export type TRoomPlaybackState = {
  hostId: string;
  videoId: string;
  isPlaying: boolean;
  currentTime: number;
  lastUpdate: number;
};

export type TRoomRealtimeState = TRoomPlaybackState & {
  users: Record<string, TRoomUserPresence>;
};

export type TChatMessage = {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
};

export type TLiveRoom = {
  id: string;
  hostId: string;
  videoId: string;
  viewerCount: number;
  isPlaying: boolean;
  createdAt: number;
};
