import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { UserCircle, Tv, MoreVertical, UserMinus } from 'lucide-react-native';
import { TFriend } from '../../../domain/friends/types';
import { EBorderRadius, EColors, EFontSize, EFontWeight, ESpacing } from '../../tokens';

type TFriendsListProps = {
  friends: TFriend[];
  onRemoveFriend?: (friendId: string) => void;
};

type TFriendItemProps = {
  friend: TFriend;
  onJoinRoom?: () => void;
  onRemove?: () => void;
};

const StatusIndicator: React.FC<{ status: TFriend['status'] }> = ({ status }) => {
  const colors = {
    online: '#4ade80',
    watching: '#8b5cf6',
    offline: '#6b7280',
  };

  return (
    <View style={[styles.statusIndicator, { backgroundColor: colors[status] }]} />
  );
};

const FriendItem: React.FC<TFriendItemProps> = ({ friend, onJoinRoom, onRemove }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const handleRemove = () => {
    Alert.alert(
      'Remover amigo',
      `Deseja remover ${friend.name} da sua lista de amigos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: onRemove },
      ]
    );
    setShowMenu(false);
  };

  return (
    <View style={styles.friendItem}>
      <View style={styles.avatarContainer}>
        {friend.avatar ? (
          <Image source={{ uri: friend.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <UserCircle size={32} color={EColors.MUTED_FOREGROUND} />
          </View>
        )}
        <StatusIndicator status={friend.status} />
      </View>

      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{friend.name}</Text>
        <Text style={styles.friendStatus}>
          {friend.status === 'watching' ? 'Assistindo' : friend.status === 'online' ? 'Online' : 'Offline'}
        </Text>
      </View>

      {friend.status === 'watching' && friend.currentRoomId && (
        <TouchableOpacity style={styles.joinButton} onPress={onJoinRoom}>
          <Tv size={16} color={EColors.FOREGROUND} />
          <Text style={styles.joinButtonText}>Entrar</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.menuButton} onPress={() => setShowMenu(!showMenu)}>
        <MoreVertical size={18} color={EColors.MUTED_FOREGROUND} />
      </TouchableOpacity>

      {showMenu && (
        <View style={styles.menuDropdown}>
          <TouchableOpacity style={styles.menuItem} onPress={handleRemove}>
            <UserMinus size={16} color="#ef4444" />
            <Text style={styles.menuItemTextDanger}>Remover</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export const FriendsList: React.FC<TFriendsListProps> = ({
  friends,
  onRemoveFriend,
}) => {
  const router = useRouter();

  const handleJoinRoom = useCallback((roomId: string) => {
    router.push(`/room/${roomId}`);
  }, [router]);

  const renderFriend = useCallback(
    ({ item }: { item: TFriend }) => (
      <FriendItem
        friend={item}
        onJoinRoom={item.currentRoomId ? () => handleJoinRoom(item.currentRoomId!) : undefined}
        onRemove={onRemoveFriend ? () => onRemoveFriend(item.id) : undefined}
      />
    ),
    [handleJoinRoom, onRemoveFriend]
  );

  const keyExtractor = useCallback((item: TFriend) => item.id, []);

  if (friends.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <UserCircle size={48} color={EColors.MUTED_FOREGROUND} />
        <Text style={styles.emptyText}>Nenhum amigo ainda</Text>
        <Text style={styles.emptySubtext}>Adicione amigos para assistir juntos!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={friends}
      renderItem={renderFriend}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: ESpacing.MD,
    gap: ESpacing.SM,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: EColors.CARD,
    borderRadius: EBorderRadius.LG,
    padding: ESpacing.MD,
    borderWidth: 1,
    borderColor: EColors.BORDER,
    gap: ESpacing.MD,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: EColors.SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: EColors.CARD,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: EFontSize.BASE,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
  },
  friendStatus: {
    fontSize: EFontSize.XS,
    color: EColors.MUTED_FOREGROUND,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESpacing.XS,
    backgroundColor: EColors.PRIMARY,
    paddingHorizontal: ESpacing.MD,
    paddingVertical: ESpacing.SM,
    borderRadius: EBorderRadius.MD,
  },
  joinButtonText: {
    fontSize: EFontSize.SM,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.FOREGROUND,
  },
  menuButton: {
    padding: ESpacing.XS,
  },
  menuDropdown: {
    position: 'absolute',
    top: 50,
    right: ESpacing.MD,
    backgroundColor: EColors.CARD,
    borderRadius: EBorderRadius.MD,
    borderWidth: 1,
    borderColor: EColors.BORDER,
    padding: ESpacing.XS,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESpacing.SM,
    paddingVertical: ESpacing.SM,
    paddingHorizontal: ESpacing.MD,
  },
  menuItemTextDanger: {
    fontSize: EFontSize.SM,
    color: '#ef4444',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: ESpacing.XXXL,
    gap: ESpacing.SM,
  },
  emptyText: {
    fontSize: EFontSize.BASE,
    fontWeight: EFontWeight.SEMIBOLD,
    color: EColors.MUTED_FOREGROUND,
  },
  emptySubtext: {
    fontSize: EFontSize.SM,
    color: EColors.MUTED_FOREGROUND,
    textAlign: 'center',
  },
});
