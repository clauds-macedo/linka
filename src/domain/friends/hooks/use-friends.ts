import { useCallback, useEffect, useState } from 'react';
import { FriendsService, TFriend, TFriendRequest } from '../index';

type TUseFriendsReturn = {
  friends: TFriend[];
  friendRequests: TFriendRequest[];
  isLoading: boolean;
  sendFriendRequest: (toUserId: string) => Promise<void>;
  acceptFriendRequest: (request: TFriendRequest) => Promise<void>;
  rejectFriendRequest: (request: TFriendRequest) => Promise<void>;
  removeFriend: (friendId: string) => Promise<void>;
};

export const useFriends = (
  userId: string,
  userName: string,
  userAvatar: string | null
): TUseFriendsReturn => {
  const [friends, setFriends] = useState<TFriend[]>([]);
  const [friendRequests, setFriendRequests] = useState<TFriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const unsubFriends = FriendsService.subscribeToFriends(userId, (newFriends) => {
      setFriends(newFriends);
      setIsLoading(false);
    });

    const unsubRequests = FriendsService.subscribeToFriendRequests(userId, setFriendRequests);

    FriendsService.updatePresence(userId, 'online');
    FriendsService.setOfflineOnDisconnect(userId);

    return () => {
      unsubFriends();
      unsubRequests();
      FriendsService.updatePresence(userId, 'offline');
    };
  }, [userId]);

  const sendFriendRequest = useCallback(async (toUserId: string) => {
    await FriendsService.sendFriendRequest({
      fromUserId: userId,
      fromUserName: userName,
      fromUserAvatar: userAvatar,
      toUserId,
    });
  }, [userId, userName, userAvatar]);

  const acceptFriendRequest = useCallback(async (request: TFriendRequest) => {
    await FriendsService.acceptFriendRequest(request, userName, userAvatar);
  }, [userName, userAvatar]);

  const rejectFriendRequest = useCallback(async (request: TFriendRequest) => {
    await FriendsService.rejectFriendRequest(request);
  }, []);

  const removeFriend = useCallback(async (friendId: string) => {
    await FriendsService.removeFriend(userId, friendId);
  }, [userId]);

  return {
    friends,
    friendRequests,
    isLoading,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
  };
};
