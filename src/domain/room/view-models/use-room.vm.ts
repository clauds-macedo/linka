import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { YoutubeIframeRef } from 'react-native-youtube-iframe';
import { RoomRealtimeService } from '../services/room-realtime.service';
import { TRoomRealtimeState } from '../types';

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

enum ERoomError {
  INVALID_USER = 'Usuário inválido',
  JOIN_FAILED = 'Erro ao entrar na sala',
}

type TRoomViewModelState = {
  roomId: string;
  userId: string;
  videoId: string;
  isPlaying: boolean;
  currentTime: number;
  lastUpdate: number;
  participants: string[];
  isHost: boolean;
  isLoading: boolean;
  error: string | null;
};

type TRoomViewModel = TRoomViewModelState & {
  playerRef: MutableRefObject<YoutubeIframeRef | null>;
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
};

export const useRoomViewModel = (roomId: string, userId: string): TRoomViewModel => {
  const playerRef = useRef<YoutubeIframeRef | null>(null);
  const hasSetVideoId = useRef(false);
  const [roomState, setRoomState] = useState<TRoomRealtimeState | null>(null);
  const [localIsPlaying, setLocalIsPlaying] = useState(false);
  const [localTime, setLocalTime] = useState(0);
  const [videoIdInput, setVideoIdInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isHost = useMemo(() => roomState?.hostId === userId, [roomState, userId]);

  const participants = useMemo(() => {
    const users = roomState?.users ?? {};
    return Object.keys(users);
  }, [roomState]);

  const joinRoom = useCallback(async () => {
    try {
      setIsLoading(true);
      if (!roomId || !userId) {
        setError(ERoomError.INVALID_USER);
        return;
      }
      await RoomRealtimeService.joinRoom({ roomId, userId });
      setError(null);
    } catch {
      setError(ERoomError.JOIN_FAILED);
    } finally {
      setIsLoading(false);
    }
  }, [roomId, userId]);

  const leaveRoom = useCallback(async () => {
    await RoomRealtimeService.leaveRoom({ roomId, userId });
  }, [roomId, userId]);

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
      playerRef.current?.seekTo(roomState.currentTime, true);
    }
  }, [roomState, localIsPlaying, localTime, isHost]);

  useEffect(() => {
    if (!roomState || isHost) return;
    const interval = setInterval(() => {
      if (Math.abs(roomState.currentTime - localTime) > ERoomSyncConfig.DRIFT_THRESHOLD) {
        playerRef.current?.seekTo(roomState.currentTime, true);
      }
    }, ERoomSyncConfig.RESYNC_INTERVAL);
    return () => clearInterval(interval);
  }, [roomState, localTime, isHost]);

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
      playerRef.current?.seekTo(time, true);
      await updatePlayback({ currentTime: time });
    },
    [updatePlayback]
  );

  const seekBy = useCallback(
    async (delta: number) => {
      const nextTime = Math.max(0, localTime + delta);
      await seekTo(nextTime);
    },
    [localTime, seekTo]
  );

  const handlePlayerStateChange = useCallback(
    (state: string) => {
      const isPlayingNow = state === EPlayerState.PLAYING;
      setLocalIsPlaying(isPlayingNow);
      if (!isHost) return;
      if (state === EPlayerState.PLAYING) {
        updatePlayback({ isPlaying: true, currentTime: localTime });
      }
      if (state === EPlayerState.PAUSED) {
        updatePlayback({ isPlaying: false, currentTime: localTime });
      }
    },
    [isHost, updatePlayback, localTime]
  );

  const handleProgress = useCallback((time: number) => {
    setLocalTime(time);
  }, []);

  const submitVideoId = useCallback(async () => {
    if (!isHost || !videoIdInput) return;
    await updatePlayback({ videoId: videoIdInput, currentTime: 0, isPlaying: false });
    playerRef.current?.seekTo(0, true);
  }, [isHost, updatePlayback, videoIdInput]);

  return {
    roomId,
    userId,
    videoId: roomState?.videoId ?? '',
    isPlaying: roomState?.isPlaying ?? false,
    currentTime: roomState?.currentTime ?? 0,
    lastUpdate: roomState?.lastUpdate ?? 0,
    participants,
    isHost,
    isLoading,
    error,
    playerRef,
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
  };
};
