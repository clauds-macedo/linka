import { ERoomCategory, ERoomStatus } from './enums';
import { TMovie } from '../movie/types';

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

export type TRoomVisibility = 'public' | 'friends' | 'private';

export type TRoomSeriesState = {
  series: TMovie;
  currentSeason: string;
  currentEpisode: number;
  autoplayEnabled: boolean;
};

export type TRoomPlaybackState = {
  hostId: string;
  videoId: string;
  videoUrl?: string;
  isPlaying: boolean;
  currentTime: number;
  lastUpdate: number;
  visibility?: TRoomVisibility;
  seriesState?: TRoomSeriesState;
};

export type TRoomRealtimeState = TRoomPlaybackState & {
  users: Record<string, TRoomUserPresence>;
};

export type TChatMessageType = 'message' | 'join' | 'leave';

export type TChatMessage = {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
  type?: TChatMessageType;
};

export type TLiveRoom = {
  id: string;
  hostId: string;
  videoId: string;
  viewerCount: number;
  isPlaying: boolean;
  createdAt: number;
};
