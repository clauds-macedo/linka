import database from '@react-native-firebase/database';
import { TFriend, TFriendRequest, TFriendship } from '../types';

type TUserPresence = {
  status: 'online' | 'offline' | 'watching';
  currentRoomId?: string;
  lastSeen: number;
};

const getFriendsPath = (userId: string) => `friends/${userId}`;
const getFriendRequestsPath = (userId: string) => `friendRequests/${userId}`;
const getFriendshipsPath = () => 'friendships';
const getUserPresencePath = (userId: string) => `presence/${userId}`;

const createFriendshipKey = (userId1: string, userId2: string): string => {
  return [userId1, userId2].sort().join('_');
};

export class FriendsService {
  static async sendFriendRequest(input: {
    fromUserId: string;
    fromUserName: string;
    fromUserAvatar: string | null;
    toUserId: string;
  }): Promise<void> {
    const requestId = `${input.fromUserId}_${input.toUserId}`;
    const request: TFriendRequest = {
      id: requestId,
      fromUserId: input.fromUserId,
      fromUserName: input.fromUserName,
      fromUserAvatar: input.fromUserAvatar,
      toUserId: input.toUserId,
      status: 'pending',
      createdAt: Date.now(),
    };

    await database().ref(`${getFriendRequestsPath(input.toUserId)}/${requestId}`).set(request);
  }

  static async acceptFriendRequest(request: TFriendRequest, acceptingUserName: string, acceptingUserAvatar: string | null): Promise<void> {
    const friendshipKey = createFriendshipKey(request.fromUserId, request.toUserId);
    const friendship: TFriendship = {
      usersKey: friendshipKey,
      users: [request.fromUserId, request.toUserId],
      createdAt: Date.now(),
    };

    await database().ref(`${getFriendshipsPath()}/${friendshipKey}`).set(friendship);

    const fromUserFriend: Omit<TFriend, 'status' | 'currentRoomId'> = {
      id: request.toUserId,
      name: acceptingUserName,
      avatar: acceptingUserAvatar,
      addedAt: Date.now(),
    };

    const toUserFriend: Omit<TFriend, 'status' | 'currentRoomId'> = {
      id: request.fromUserId,
      name: request.fromUserName,
      avatar: request.fromUserAvatar,
      addedAt: Date.now(),
    };

    await database().ref(`${getFriendsPath(request.fromUserId)}/${request.toUserId}`).set(fromUserFriend);
    await database().ref(`${getFriendsPath(request.toUserId)}/${request.fromUserId}`).set(toUserFriend);

    await database().ref(`${getFriendRequestsPath(request.toUserId)}/${request.id}`).remove();
  }

  static async rejectFriendRequest(request: TFriendRequest): Promise<void> {
    await database().ref(`${getFriendRequestsPath(request.toUserId)}/${request.id}`).remove();
  }

  static async removeFriend(userId: string, friendId: string): Promise<void> {
    const friendshipKey = createFriendshipKey(userId, friendId);
    await database().ref(`${getFriendshipsPath()}/${friendshipKey}`).remove();
    await database().ref(`${getFriendsPath(userId)}/${friendId}`).remove();
    await database().ref(`${getFriendsPath(friendId)}/${userId}`).remove();
  }

  static subscribeToFriends(userId: string, onChange: (friends: TFriend[]) => void): () => void {
    const friendsRef = database().ref(getFriendsPath(userId));
    const presenceRef = database().ref('presence');

    let friendsData: Record<string, Omit<TFriend, 'status' | 'currentRoomId'>> = {};
    let presenceData: Record<string, TUserPresence> = {};

    const mergeFriendsWithPresence = () => {
      const friends: TFriend[] = Object.values(friendsData).map((friend) => {
        const presence = presenceData[friend.id];
        return {
          ...friend,
          status: presence?.status ?? 'offline',
          currentRoomId: presence?.currentRoomId,
        };
      });
      onChange(friends.sort((a, b) => {
        const statusOrder = { watching: 0, online: 1, offline: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      }));
    };

    const friendsListener = (snapshot: { val: () => Record<string, Omit<TFriend, 'status' | 'currentRoomId'>> | null }) => {
      friendsData = snapshot.val() ?? {};
      mergeFriendsWithPresence();
    };

    const presenceListener = (snapshot: { val: () => Record<string, TUserPresence> | null }) => {
      presenceData = snapshot.val() ?? {};
      mergeFriendsWithPresence();
    };

    friendsRef.on('value', friendsListener);
    presenceRef.on('value', presenceListener);

    return () => {
      friendsRef.off('value', friendsListener);
      presenceRef.off('value', presenceListener);
    };
  }

  static subscribeToFriendRequests(userId: string, onChange: (requests: TFriendRequest[]) => void): () => void {
    const requestsRef = database().ref(getFriendRequestsPath(userId));

    const onValueChange = (snapshot: { val: () => Record<string, TFriendRequest> | null }) => {
      const data = snapshot.val();
      if (!data) {
        onChange([]);
        return;
      }
      const requests = Object.values(data)
        .filter((r) => r.status === 'pending')
        .sort((a, b) => b.createdAt - a.createdAt);
      onChange(requests);
    };

    requestsRef.on('value', onValueChange);
    return () => requestsRef.off('value', onValueChange);
  }

  static async updatePresence(userId: string, status: 'online' | 'offline' | 'watching', currentRoomId?: string): Promise<void> {
    const presence: TUserPresence = {
      status,
      currentRoomId,
      lastSeen: Date.now(),
    };
    await database().ref(getUserPresencePath(userId)).set(presence);
  }

  static async setOfflineOnDisconnect(userId: string): Promise<void> {
    const presenceRef = database().ref(getUserPresencePath(userId));
    await presenceRef.onDisconnect().set({
      status: 'offline',
      lastSeen: database.ServerValue.TIMESTAMP,
    });
  }

  static async getFriendIds(userId: string): Promise<string[]> {
    const snapshot = await database().ref(getFriendsPath(userId)).once('value');
    const data = snapshot.val();
    if (!data) return [];
    return Object.keys(data);
  }

  static async isFriend(userId: string, otherUserId: string): Promise<boolean> {
    const friendshipKey = createFriendshipKey(userId, otherUserId);
    const snapshot = await database().ref(`${getFriendshipsPath()}/${friendshipKey}`).once('value');
    return snapshot.exists();
  }
}
