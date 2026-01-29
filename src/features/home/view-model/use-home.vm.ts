import { useState, useEffect, useCallback } from 'react';
import { subject } from '@casl/ability';
import { useRouter } from 'expo-router';
import { TRoom, ERoomStatus, ERoomCategory } from '../../../domain/room';
import { TContent } from '../../../domain/content';
import { useAuth } from '../../../core/auth';
import { EAction, ESubject } from '../../../core/abilities';
import { PremiumContentService } from '../../content';

type THomeViewModelState = {
  rooms: TRoom[];
  premiumContent: TContent[];
  isLoading: boolean;
  error: string | null;
};

type THomeViewModel = THomeViewModelState & {
  navigateToRoom: (roomId: string) => void;
  navigateToCreateRoom: () => void;
  navigateToContent: (contentId: string) => void;
  refreshRooms: () => Promise<void>;
  canAccessContent: (content: TContent) => boolean;
};

const MOCK_ROOMS: TRoom[] = [
  {
    id: '1',
    title: 'Tech Talk: React Native em 2024',
    description: 'Discussão sobre as novidades do React Native e o futuro do desenvolvimento mobile.',
    hostName: 'João Silva',
    hostAvatar: 'https://i.pravatar.cc/150?img=1',
    coverImage: 'https://picsum.photos/seed/room1/400/200',
    status: ERoomStatus.LIVE,
    category: ERoomCategory.EDUCATION,
    viewerCount: 1234,
  },
  {
    id: '2',
    title: 'Podcast: Empreendedorismo Digital',
    description: 'Histórias de sucesso e dicas para quem quer empreender no mundo digital.',
    hostName: 'Maria Santos',
    hostAvatar: 'https://i.pravatar.cc/150?img=2',
    coverImage: 'https://picsum.photos/seed/room2/400/200',
    status: ERoomStatus.LIVE,
    category: ERoomCategory.PODCAST,
    viewerCount: 856,
  },
  {
    id: '3',
    title: 'Live Coding: Construindo uma API',
    description: 'Vamos construir uma API REST completa do zero usando Node.js e TypeScript.',
    hostName: 'Pedro Costa',
    hostAvatar: 'https://i.pravatar.cc/150?img=3',
    coverImage: 'https://picsum.photos/seed/room3/400/200',
    status: ERoomStatus.UPCOMING,
    category: ERoomCategory.EDUCATION,
    viewerCount: 0,
    scheduledAt: '2024-03-15T19:00:00Z',
  },
  {
    id: '4',
    title: 'Música ao Vivo: Acústico',
    description: 'Uma noite especial com músicas acústicas e bate-papo com os fãs.',
    hostName: 'Ana Oliveira',
    hostAvatar: 'https://i.pravatar.cc/150?img=4',
    coverImage: 'https://picsum.photos/seed/room4/400/200',
    status: ERoomStatus.LIVE,
    category: ERoomCategory.MUSIC,
    viewerCount: 2341,
  },
];

export const useHomeViewModel = (): THomeViewModel => {
  const router = useRouter();
  const { user, ability } = useAuth();
  const [state, setState] = useState<THomeViewModelState>({
    rooms: [],
    premiumContent: [],
    isLoading: true,
    error: null,
  });

  const fetchRooms = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Fetch premium content based on user subscription
      const subscriptionPlan = user?.subscription.plan;
      const contentResponse = await PremiumContentService.getPremiumContent(subscriptionPlan);
      
      setState({
        rooms: MOCK_ROOMS,
        premiumContent: contentResponse.content,
        isLoading: false,
        error: null,
      });
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao carregar as salas',
      }));
    }
  }, [user]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const navigateToRoom = useCallback(
    (roomId: string) => {
      router.push(`/room/${roomId}`);
    },
    [router]
  );

  const navigateToCreateRoom = useCallback(() => {
    router.push('/create-room');
  }, [router]);

  const refreshRooms = useCallback(async () => {
    await fetchRooms();
  }, [fetchRooms]);

  const navigateToContent = useCallback(
    (contentId: string) => {
      console.log('Navigate to content:', contentId);
    },
    []
  );

  const canAccessContent = useCallback(
    (content: TContent) => {
      return ability.can(EAction.VIEW, subject(ESubject.CONTENT, content));
    },
    [ability]
  );

  return {
    ...state,
    navigateToRoom,
    navigateToCreateRoom,
    navigateToContent,
    refreshRooms,
    canAccessContent,
  };
};
