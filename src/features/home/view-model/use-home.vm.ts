import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { TLiveRoom } from '../../../domain/room/types';
import { RoomRealtimeService } from '../../../domain/room/services/room-realtime.service';
import { TMovie, TSeriesEpisode, MovieService } from '../../../domain/movie';
import { useAuth } from '../../../core/auth';
import { useI18n } from '../../../core/i18n';

type TMovieSection = {
  id: string;
  label: string;
  icon: string;
  movies: TMovie[];
};

type THomeViewModelState = {
  rooms: TLiveRoom[];
  isLoading: boolean;
  error: string | null;
};

type THomeViewModel = THomeViewModelState & {
  isAuthenticated: boolean;
  featuredMovies: TMovie[];
  movieSections: TMovieSection[];
  isCreatingRoom: boolean;
  selectedSeries: TMovie | null;
  navigateToRoom: (roomId: string) => void;
  navigateToCreateRoom: () => void;
  navigateToMovie: (movie: TMovie) => void;
  navigateToSignIn: () => void;
  navigateToSignUp: () => void;
  refreshRooms: () => Promise<void>;
  closeEpisodePicker: () => void;
  onEpisodeSelect: (episode: TSeriesEpisode, series: TMovie) => void;
};

export const useHomeViewModel = (): THomeViewModel => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { t } = useI18n();
  const [state, setState] = useState<THomeViewModelState>({
    rooms: [],
    isLoading: true,
    error: null,
  });
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState<TMovie | null>(null);

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

  const createRoomWithVideo = useCallback(
    async (videoId: string, videoUrl: string) => {
      if (!user?.id) {
        router.push('/sign-in');
        return;
      }

      try {
        setIsCreatingRoom(true);
        const roomId = await RoomRealtimeService.createRoom({
          hostId: user.id,
          videoId,
          videoUrl,
        });

        if (roomId) {
          router.push(`/room/${roomId}`);
        }
      } catch {
        setState((prev) => ({
          ...prev,
          error: t('home.loadError'),
        }));
      } finally {
        setIsCreatingRoom(false);
      }
    },
    [user, router, t]
  );

  const navigateToMovie = useCallback(
    (movie: TMovie) => {
      if (!user?.id) {
        router.push('/sign-in');
        return;
      }

      if (movie.type === 'series' && movie.episodes) {
        setSelectedSeries(movie);
      } else {
        createRoomWithVideo(movie.id, movie.url);
      }
    },
    [user, router, createRoomWithVideo]
  );

  const closeEpisodePicker = useCallback(() => {
    setSelectedSeries(null);
  }, []);

  const onEpisodeSelect = useCallback(
    (episode: TSeriesEpisode, series: TMovie) => {
      setSelectedSeries(null);
      createRoomWithVideo(`${series.id}-${episode.id}`, episode.url);
    },
    [createRoomWithVideo]
  );

  const featuredMovies = useMemo(() => {
    return MovieService.getMoviesByCategory('acao', 10).movies.filter(
      (m) => m.tmdb?.rating && m.tmdb.rating >= 7
    );
  }, []);

  const movieSections = useMemo(() => {
    const categories = MovieService.getCategories().slice(0, 3);
    return categories.map((cat) => ({
      id: cat.id,
      label: cat.label,
      icon: cat.icon,
      movies: MovieService.getMoviesByCategory(cat.id, 10).movies,
    }));
  }, []);

  return {
    ...state,
    isAuthenticated,
    featuredMovies,
    movieSections,
    isCreatingRoom,
    selectedSeries,
    navigateToRoom,
    navigateToCreateRoom,
    navigateToMovie,
    navigateToSignIn,
    navigateToSignUp,
    refreshRooms,
    closeEpisodePicker,
    onEpisodeSelect,
  };
};
