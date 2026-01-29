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
