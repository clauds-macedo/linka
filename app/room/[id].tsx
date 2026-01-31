import React from 'react';
import { useLocalSearchParams, Redirect } from 'expo-router';
import { useAuth } from '../../src/core/auth';
import { RoomScreen as RoomView } from '../../src/ui/room/screens/room.screen';

export default function RoomRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated, isLoading } = useAuth();
  const roomId = typeof id === 'string' ? id : '';

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href={`/sign-in?redirect=/room/${roomId}`} />;
  }

  return <RoomView roomId={roomId} />;
}
