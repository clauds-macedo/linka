export enum EDeepLinkType {
  ROOM = 'room',
  PROFILE = 'profile',
  INVITE = 'invite',
}

export type TDeepLinkParams = {
  type: EDeepLinkType;
  id: string;
  extra?: Record<string, string>;
};

export type TRoomDeepLink = {
  roomId: string;
  inviteCode?: string;
};
