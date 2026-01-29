import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { RoomScreen as RoomView } from '../../src/ui/room/screens/room.screen';

export default function RoomRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const roomId = typeof id === 'string' ? id : '';

  return <RoomView roomId={roomId} />;
}
