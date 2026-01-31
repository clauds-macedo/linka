import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { YoutubeIframeRef } from 'react-native-youtube-iframe';
import { RoomRealtimeService } from '../services/room-realtime.service';
import { TRoomRealtimeState, TRoomSeriesState, TRoomVisibility } from '../types';
import { TMovie, TSeriesEpisode } from '../../movie/types';
import { t } from '../../../core/i18n';
import { TStreamPlayerRef } from '../../../ui/room/components/stream-player';
import { FriendsService } from '../../friends/services/friends.service';

export enum EPlayerState {
  PLAYING = 'playing',
  PAUSED = 'paused',
  BUFFERING = 'buffering',
  ENDED = 'ended',
  UNSTARTED = 'unstarted',
}

export enum ERoomSyncConfig {
  DRIFT_THRESHOLD = 2,
  RESYNC_INTERVAL = 5000,
}

type TRoomViewModelState = {
  roomId: string;
  userId: string;
  videoId: string;
  videoUrl: string;
  isPlaying: boolean;
  currentTime: number;
  lastUpdate: number;
  participants: string[];
  hostId: string;
  isHost: boolean;
  isLoading: boolean;
  error: string | null;
  visibility: TRoomVisibility;
  seriesState: TRoomSeriesState | null;
  autoplayCountdown: number | null;
};

type TRoomViewModel = TRoomViewModelState & {
  playerRef: MutableRefObject<YoutubeIframeRef | null>;
  streamPlayerRef: MutableRefObject<TStreamPlayerRef | null>;
  isStreamVideo: boolean;
  joinRoom: () => Promise<void>;
  leaveRoom: () => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  seekTo: (time: number) => Promise<void>;
  seekBy: (delta: number) => Promise<void>;
  handlePlayerStateChange: (state: string) => void;
  handleProgress: (time: number) => void;
  videoIdInput: string;
  setVideoIdInput: (value: string) => void;
  submitVideoId: () => Promise<void>;
  updateVisibility: (visibility: TRoomVisibility) => Promise<void>;
  changeEpisode: (episode: TSeriesEpisode, season: string) => Promise<void>;
  toggleAutoplay: () => Promise<void>;
  cancelAutoplay: () => void;
};

export const useRoomViewModel = (roomId: string, userId: string, userName?: string): TRoomViewModel => {
  const playerRef = useRef<YoutubeIframeRef | null>(null);
  const streamPlayerRef = useRef<TStreamPlayerRef | null>(null);
  const hasSetVideoId = useRef(false);
  const isSeekingRef = useRef(false);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const changeEpisodeRef = useRef<((episode: TSeriesEpisode, season: string) => Promise<void>) | null>(null);
  const [roomState, setRoomState] = useState<TRoomRealtimeState | null>(null);
  const [localIsPlaying, setLocalIsPlaying] = useState(false);
  const [localTime, setLocalTime] = useState(0);
  const [videoIdInput, setVideoIdInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoplayCountdown, setAutoplayCountdown] = useState<number | null>(null);

  const isHost = useMemo(() => roomState?.hostId === userId, [roomState, userId]);

  const videoUrl = useMemo(() => roomState?.videoUrl ?? '', [roomState]);

  const isStreamVideo = useMemo(() => {
    if (!videoUrl) return false;
    return videoUrl.includes('.mp4') || videoUrl.includes('.m3u8') || videoUrl.startsWith('http://') && !videoUrl.includes('youtube');
  }, [videoUrl]);

  const participants = useMemo(() => {
    const users = roomState?.users ?? {};
    return Object.keys(users);
  }, [roomState]);

  const seriesState = useMemo(() => roomState?.seriesState ?? null, [roomState]);

  const getNextEpisode = useCallback((): { episode: TSeriesEpisode; season: string } | null => {
    if (!seriesState?.series?.episodes) return null;
    
    const seasons = Object.keys(seriesState.series.episodes).sort((a, b) => Number(a) - Number(b));
    let foundCurrent = false;
    
    for (const season of seasons) {
      const episodes = seriesState.series.episodes[season] || [];
      for (const ep of episodes) {
        if (season === seriesState.currentSeason && ep.episode === seriesState.currentEpisode) {
          foundCurrent = true;
          continue;
        }
        if (foundCurrent) {
          return { episode: ep, season };
        }
      }
    }
    
    return null;
  }, [seriesState]);

  const cancelAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
    setAutoplayCountdown(null);
  }, []);

  const joinRoom = useCallback(async () => {
    try {
      setIsLoading(true);
      if (!roomId || !userId) {
        setError(t('errors.invalidUser'));
        return;
      }
      await RoomRealtimeService.joinRoom({ roomId, userId, userName });
      await FriendsService.updatePresence(userId, 'watching', roomId);
      setError(null);
    } catch {
      setError(t('errors.joinFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [roomId, userId, userName]);

  const leaveRoom = useCallback(async () => {
    await FriendsService.updatePresence(userId, 'online');
    await RoomRealtimeService.leaveRoom({ roomId, userId, userName });
  }, [roomId, userId, userName]);

  useEffect(() => {
    let unsubscribe = () => {};
    const start = async () => {
      if (!roomId || !userId) {
        setIsLoading(false);
        return;
      }
      await joinRoom();
      unsubscribe = RoomRealtimeService.subscribeToRoom(roomId, (state) => {
        setRoomState(state);
        if (state?.videoId && !hasSetVideoId.current) {
          hasSetVideoId.current = true;
          setVideoIdInput(state.videoId);
        }
      });
    };
    start();
    return () => {
      unsubscribe();
      leaveRoom();
    };
  }, [roomId, joinRoom, leaveRoom]);

  useEffect(() => {
    if (!roomState || isHost) return;
    if (Math.abs(roomState.currentTime - localTime) > ERoomSyncConfig.DRIFT_THRESHOLD) {
      if (isStreamVideo) {
        streamPlayerRef.current?.seekTo(roomState.currentTime);
      } else {
        playerRef.current?.seekTo(roomState.currentTime, true);
      }
    }
  }, [roomState, localIsPlaying, localTime, isHost, isStreamVideo]);

  useEffect(() => {
    if (!roomState || isHost) return;
    const interval = setInterval(() => {
      if (Math.abs(roomState.currentTime - localTime) > ERoomSyncConfig.DRIFT_THRESHOLD) {
        if (isStreamVideo) {
          streamPlayerRef.current?.seekTo(roomState.currentTime);
        } else {
          playerRef.current?.seekTo(roomState.currentTime, true);
        }
      }
    }, ERoomSyncConfig.RESYNC_INTERVAL);
    return () => clearInterval(interval);
  }, [roomState, localTime, isHost, isStreamVideo]);

  const updatePlayback = useCallback(
    async (changes: Partial<TRoomRealtimeState>) => {
      if (!isHost || !roomState) return;
      await RoomRealtimeService.updatePlayback({
        roomId,
        state: {
          isPlaying: changes.isPlaying ?? roomState.isPlaying,
          currentTime: changes.currentTime ?? roomState.currentTime,
          videoId: changes.videoId ?? roomState.videoId,
        },
      });
    },
    [isHost, roomId, roomState]
  );

  const play = useCallback(async () => {
    await updatePlayback({ isPlaying: true, currentTime: localTime });
  }, [updatePlayback, localTime]);

  const pause = useCallback(async () => {
    await updatePlayback({ isPlaying: false, currentTime: localTime });
  }, [updatePlayback, localTime]);

  const seekTo = useCallback(
    async (time: number) => {
      isSeekingRef.current = true;
      if (isStreamVideo) {
        await streamPlayerRef.current?.seekTo(time);
      } else {
        playerRef.current?.seekTo(time, true);
      }
      await updatePlayback({ currentTime: time, isPlaying: roomState?.isPlaying ?? true });
      setTimeout(() => {
        isSeekingRef.current = false;
      }, 500);
    },
    [updatePlayback, isStreamVideo, roomState?.isPlaying]
  );

  const seekBy = useCallback(
    async (delta: number) => {
      const nextTime = Math.max(0, localTime + delta);
      await seekTo(nextTime);
    },
    [localTime, seekTo]
  );

  const changeEpisode = useCallback(async (episode: TSeriesEpisode, season: string) => {
    if (!isHost || !seriesState?.series) return;
    
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
    setAutoplayCountdown(null);
    
    const newSeriesState: TRoomSeriesState = {
      ...seriesState,
      currentSeason: season,
      currentEpisode: episode.episode,
    };
    
    await RoomRealtimeService.updateSeriesState(roomId, newSeriesState);
    await RoomRealtimeService.updatePlayback({
      roomId,
      state: {
        videoUrl: episode.url,
        videoId: episode.id,
        currentTime: 0,
        isPlaying: true,
      },
    });
    
    if (isStreamVideo) {
      streamPlayerRef.current?.seekTo(0);
    }
  }, [isHost, roomId, seriesState, isStreamVideo]);

  useEffect(() => {
    changeEpisodeRef.current = changeEpisode;
  }, [changeEpisode]);

  const handleVideoEnded = useCallback(() => {
    if (!isHost || !seriesState?.autoplayEnabled) return;
    
    const nextEpisode = getNextEpisode();
    if (!nextEpisode) return;
    
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
    setAutoplayCountdown(10);
    
    autoplayTimerRef.current = setInterval(() => {
      setAutoplayCountdown((prev) => {
        if (prev === null || prev <= 1) {
          if (autoplayTimerRef.current) {
            clearInterval(autoplayTimerRef.current);
            autoplayTimerRef.current = null;
          }
          changeEpisodeRef.current?.(nextEpisode.episode, nextEpisode.season);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, [isHost, seriesState?.autoplayEnabled, getNextEpisode]);

  const handlePlayerStateChange = useCallback(
    (state: string) => {
      const isPlayingNow = state === EPlayerState.PLAYING;
      setLocalIsPlaying(isPlayingNow);
      
      if (state === EPlayerState.ENDED && isHost) {
        handleVideoEnded();
        return;
      }
      
      if (!isHost || isSeekingRef.current) return;
      if (state === EPlayerState.PLAYING) {
        updatePlayback({ isPlaying: true, currentTime: localTime });
      }
      if (state === EPlayerState.PAUSED) {
        updatePlayback({ isPlaying: false, currentTime: localTime });
      }
    },
    [isHost, updatePlayback, localTime, handleVideoEnded]
  );

  const handleProgress = useCallback((time: number) => {
    setLocalTime(time);
  }, []);

  const submitVideoId = useCallback(async () => {
    if (!isHost || !videoIdInput) return;
    await updatePlayback({ videoId: videoIdInput, currentTime: 0, isPlaying: false });
    if (isStreamVideo) {
      streamPlayerRef.current?.seekTo(0);
    } else {
      playerRef.current?.seekTo(0, true);
    }
  }, [isHost, updatePlayback, videoIdInput, isStreamVideo]);

  const updateVisibility = useCallback(async (visibility: TRoomVisibility) => {
    if (!isHost) return;
    await RoomRealtimeService.updateVisibility(roomId, visibility);
  }, [isHost, roomId]);

  const toggleAutoplay = useCallback(async () => {
    if (!isHost || !seriesState) return;
    const newAutoplay = !seriesState.autoplayEnabled;
    await RoomRealtimeService.updateAutoplay(roomId, newAutoplay);
  }, [isHost, roomId, seriesState]);

  useEffect(() => {
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, []);

  return {
    roomId,
    userId,
    videoId: roomState?.videoId ?? '',
    videoUrl,
    isPlaying: roomState?.isPlaying ?? false,
    currentTime: roomState?.currentTime ?? 0,
    lastUpdate: roomState?.lastUpdate ?? 0,
    participants,
    hostId: roomState?.hostId ?? '',
    isHost,
    isLoading,
    error,
    visibility: roomState?.visibility ?? 'public',
    seriesState,
    autoplayCountdown,
    playerRef,
    streamPlayerRef,
    isStreamVideo,
    joinRoom,
    leaveRoom,
    play,
    pause,
    seekTo,
    seekBy,
    handlePlayerStateChange,
    handleProgress,
    videoIdInput,
    setVideoIdInput,
    submitVideoId,
    updateVisibility,
    changeEpisode,
    toggleAutoplay,
    cancelAutoplay,
  };
};
