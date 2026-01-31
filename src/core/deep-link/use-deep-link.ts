import { useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { EDeepLinkType, TDeepLinkParams, TRoomDeepLink } from './types';

const SCHEME = 'linka';
const WEB_DOMAIN = 'linka.app';

export const useDeepLink = () => {
  const router = useRouter();

  const parseDeepLink = useCallback((url: string): TDeepLinkParams | null => {
    try {
      const parsed = Linking.parse(url);
      const path = parsed.path ?? '';
      const pathParts = path.split('/').filter(Boolean);

      if (pathParts[0] === 'room' && pathParts[1]) {
        return {
          type: EDeepLinkType.ROOM,
          id: pathParts[1],
          extra: parsed.queryParams as Record<string, string> | undefined,
        };
      }

      if (parsed.hostname === 'room' && pathParts[0]) {
        return {
          type: EDeepLinkType.ROOM,
          id: pathParts[0],
          extra: parsed.queryParams as Record<string, string> | undefined,
        };
      }

      return null;
    } catch {
      return null;
    }
  }, []);

  const handleDeepLink = useCallback(
    (url: string) => {
      const params = parseDeepLink(url);
      if (!params) return;

      switch (params.type) {
        case EDeepLinkType.ROOM:
          router.push(`/room/${params.id}`);
          break;
        default:
          break;
      }
    },
    [parseDeepLink, router]
  );

  useEffect(() => {
    const handleUrl = ({ url }: { url: string }) => {
      handleDeepLink(url);
    };

    const subscription = Linking.addEventListener('url', handleUrl);

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [handleDeepLink]);

  const createRoomLink = useCallback((roomId: string, inviteCode?: string): TRoomDeepLink & { urls: { scheme: string; web: string } } => {
    const baseScheme = `${SCHEME}://room/${roomId}`;
    const baseWeb = `https://${WEB_DOMAIN}/room/${roomId}`;
    
    const queryString = inviteCode ? `?invite=${inviteCode}` : '';
    
    return {
      roomId,
      inviteCode,
      urls: {
        scheme: `${baseScheme}${queryString}`,
        web: `${baseWeb}${queryString}`,
      },
    };
  }, []);

  return {
    parseDeepLink,
    handleDeepLink,
    createRoomLink,
  };
};
