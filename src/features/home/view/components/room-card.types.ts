import { TRoom } from '../../../../domain/room';

export interface IRoomCardProps {
  room: TRoom;
  onPress: (roomId: string) => void;
}
