import { useCallback, useState } from 'react';
import { Share, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useDeepLink } from './use-deep-link';

export type TShareResult = {
  success: boolean;
  action?: 'shared' | 'copied' | 'dismissed';
};

export const useShareRoom = () => {
  const { createRoomLink } = useDeepLink();
  const [isSharing, setIsSharing] = useState(false);

  const shareRoom = useCallback(
    async (roomId: string, roomName?: string, inviteCode?: string): Promise<TShareResult> => {
      setIsSharing(true);

      try {
        const links = createRoomLink(roomId, inviteCode);
        const shareUrl = links.urls.web;
        const title = roomName ? `Assista comigo: ${roomName}` : 'Venha assistir comigo no Linka!';
        const message = Platform.select({
          ios: title,
          android: `${title}\n${shareUrl}`,
          default: `${title}\n${shareUrl}`,
        });

        const result = await Share.share(
          {
            message,
            url: shareUrl,
            title,
          },
          {
            dialogTitle: 'Compartilhar sala',
            subject: title,
          }
        );

        if (result.action === Share.sharedAction) {
          return { success: true, action: 'shared' };
        }

        return { success: false, action: 'dismissed' };
      } catch {
        return { success: false };
      } finally {
        setIsSharing(false);
      }
    },
    [createRoomLink]
  );

  const copyRoomLink = useCallback(
    async (roomId: string, inviteCode?: string): Promise<TShareResult> => {
      try {
        const links = createRoomLink(roomId, inviteCode);
        await Clipboard.setStringAsync(links.urls.web);
        return { success: true, action: 'copied' };
      } catch {
        return { success: false };
      }
    },
    [createRoomLink]
  );

  const getRoomLinks = useCallback(
    (roomId: string, inviteCode?: string) => {
      return createRoomLink(roomId, inviteCode);
    },
    [createRoomLink]
  );

  return {
    shareRoom,
    copyRoomLink,
    getRoomLinks,
    isSharing,
  };
};
