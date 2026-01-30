export type TFriendStatus = 'pending' | 'accepted' | 'rejected';

export type TFriend = {
  id: string;
  name: string;
  avatar: string | null;
  status: 'online' | 'offline' | 'watching';
  currentRoomId?: string;
  addedAt: number;
};

export type TFriendRequest = {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string | null;
  toUserId: string;
  status: TFriendStatus;
  createdAt: number;
};

export type TFriendship = {
  usersKey: string;
  users: string[];
  createdAt: number;
};
