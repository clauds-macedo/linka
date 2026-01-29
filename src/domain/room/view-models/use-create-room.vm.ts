import { useCallback, useState } from 'react';
import { RoomRealtimeService } from '../services/room-realtime.service';

enum ECreateRoomError {
  INVALID_USER = 'Usuário inválido',
  INVALID_VIDEO = 'Video inválido',
  CREATE_FAILED = 'Erro ao criar sala',
}

enum ECreateRoomValue {
  EMPTY = '',
}

type TCreateRoomViewModel = {
  videoIdInput: string;
  setVideoIdInput: (value: string) => void;
  isLoading: boolean;
  error: string | null;
  createRoom: () => Promise<string>;
};

export const useCreateRoomViewModel = (hostId: string): TCreateRoomViewModel => {
  const [videoIdInput, setVideoIdInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRoom = useCallback(async () => {
    try {
      setIsLoading(true);
      if (!hostId) {
        setError(ECreateRoomError.INVALID_USER);
        return ECreateRoomValue.EMPTY;
      }
      if (!videoIdInput) {
        setError(ECreateRoomError.INVALID_VIDEO);
        return ECreateRoomValue.EMPTY;
      }
      const roomId = await RoomRealtimeService.createRoom({
        hostId,
        videoId: videoIdInput,
      });
      if (!roomId) {
        setError(ECreateRoomError.CREATE_FAILED);
        return ECreateRoomValue.EMPTY;
      }
      setError(null);
      return roomId;
    } catch {
      setError(ECreateRoomError.CREATE_FAILED);
      return ECreateRoomValue.EMPTY;
    } finally {
      setIsLoading(false);
    }
  }, [hostId, videoIdInput]);

  return {
    videoIdInput,
    setVideoIdInput,
    isLoading,
    error,
    createRoom,
  };
};
