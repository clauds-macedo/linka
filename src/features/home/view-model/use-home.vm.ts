import { useState, useEffect, useCallback } from 'react';
import { subject } from '@casl/ability';
import { useRouter } from 'expo-router';
import { TLiveRoom } from '../../../domain/room/types';
import { RoomRealtimeService } from '../../../domain/room/services/room-realtime.service';
import { TContent } from '../../../domain/content';
import { useAuth } from '../../../core/auth';
import { EAction, ESubject } from '../../../core/abilities';
import { PremiumContentService } from '../../content';
import { useI18n } from '../../../core/i18n';

type THomeViewModelState = {
  rooms: TLiveRoom[];
  premiumContent: TContent[];
  isLoading: boolean;
  error: string | null;
};

type THomeViewModel = THomeViewModelState & {
  isAuthenticated: boolean;
  navigateToRoom: (roomId: string) => void;
  navigateToCreateRoom: () => void;
  navigateToContent: (contentId: string) => void;
  navigateToSignIn: () => void;
  navigateToSignUp: () => void;
  refreshRooms: () => Promise<void>;
  canAccessContent: (content: TContent) => boolean;
};

export const useHomeViewModel = (): THomeViewModel => {
  const router = useRouter();
  const { user, ability, isAuthenticated } = useAuth();
  const { t } = useI18n();
  const [state, setState] = useState<THomeViewModelState>({
    rooms: [],
    premiumContent: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = RoomRealtimeService.subscribeToRooms((rooms) => {
      setState((prev) => ({
        ...prev,
        rooms,
        isLoading: false,
      }));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const subscriptionPlan = user?.subscription.plan;
        const contentResponse = await PremiumContentService.getPremiumContent(subscriptionPlan);
        setState((prev) => ({
          ...prev,
          premiumContent: contentResponse.content,
        }));
      } catch {
        setState((prev) => ({
          ...prev,
          error: t('home.loadError'),
        }));
      }
    };

    fetchContent();
  }, [user, t]);

  const navigateToRoom = useCallback(
    (roomId: string) => {
      router.push(`/room/${roomId}`);
    },
    [router]
  );

  const navigateToCreateRoom = useCallback(() => {
    router.push('/create-room');
  }, [router]);

  const navigateToSignIn = useCallback(() => {
    router.push('/sign-in');
  }, [router]);

  const navigateToSignUp = useCallback(() => {
    router.push('/sign-up');
  }, [router]);

  const refreshRooms = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    await new Promise((resolve) => setTimeout(resolve, 500));
    setState((prev) => ({ ...prev, isLoading: false }));
  }, []);

  const navigateToContent = useCallback((contentId: string) => {
    void contentId;
  }, []);

  const canAccessContent = useCallback(
    (content: TContent) => {
      return ability.can(EAction.VIEW, subject(ESubject.CONTENT, content));
    },
    [ability]
  );

  return {
    ...state,
    isAuthenticated,
    navigateToRoom,
    navigateToCreateRoom,
    navigateToContent,
    navigateToSignIn,
    navigateToSignUp,
    refreshRooms,
    canAccessContent,
  };
};
