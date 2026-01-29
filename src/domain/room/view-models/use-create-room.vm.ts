import { useCallback, useState } from 'react';
import { RoomRealtimeService } from '../services/room-realtime.service';
import { t } from '../../../core/i18n';

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
        setError(t('errors.invalidUser'));
        return '';
      }
      if (!videoIdInput) {
        setError(t('errors.invalidVideo'));
        return '';
      }
      const roomId = await RoomRealtimeService.createRoom({
        hostId,
        videoId: videoIdInput,
      });
      if (!roomId) {
        setError(t('errors.createFailed'));
        return '';
      }
      setError(null);
      return roomId;
    } catch {
      setError(t('errors.createFailed'));
      return '';
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
